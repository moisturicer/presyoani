import os
import json
import base64
import httpx
import uvicorn
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

token = os.getenv("FB_PAGE_ACCESS_TOKEN")
verify_token = os.getenv("FB_VERIFY_TOKEN")
page_id = os.getenv("FB_PAGE_ID")
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

async def send_fb_message(recipient_id, message_payload):
    fb_url = f"https://graph.facebook.com/v19.0/me/messages?access_token={token}"
    async with httpx.AsyncClient() as client:
        await client.post(fb_url, json={"recipient": {"id": recipient_id}, "message": message_payload})

@app.get("/sw.js")
async def serve_sw():
    return FileResponse("static/sw.js", media_type="application/javascript")

# --- TRIGGERED BY WEBSITE WHEN ORDER IS PLACED ---
@app.post("/notify-farmer")
async def notify_farmer(request: Request):
    try:
        data = await request.json()
        farmer_id = data.get("farmer_psid")
        crop = data.get("commodity", "tanom")
        qty = data.get("weight", "0")
        listing_id = data.get("listing_id") 

        supabase.table("market_listings").update({"status": False}).eq("id", listing_id).execute()

        tagalog_crops = {"tomato": "kamatis", "chili": "sili", "sweet_potato": "kamote"}
        crop_tagalog = tagalog_crops.get(crop.lower(), crop)

        msg = f"🔔 May bumili sa iyong {qty}kg na {crop_tagalog}! Kukunin ng delivery ng alas-singko ng hapon. Hindi mo na ito mababawi."
        
        await send_fb_message(farmer_id, {"text": msg})
        return JSONResponse({"status": "success"})
    except Exception as e:
        print(f"Notify error: {e}")
        return JSONResponse({"status": "error"}, status_code=500)


@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "fb_page_id": page_id})

@app.get("/webhook")
async def verify(request: Request):
    params = request.query_params
    if params.get("hub.mode") == "subscribe" and params.get("hub.verify_token") == verify_token:
        return PlainTextResponse(content=str(params.get("hub.challenge")))
    return PlainTextResponse(content="failed", status_code=403)

@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()
    if not data.get("object") == "page":
        return PlainTextResponse("EVENT_RECEIVED", status_code=200)

    for entry in data.get("entry"):
        for messaging_event in entry.get("messaging"):
            sender_id = messaging_event["sender"]["id"]

            # --- 1. QR SCAN DETECTION (m.me referral link) ---
            ref_data = None
            if "referral" in messaging_event:
                ref_data = messaging_event["referral"].get("ref")
            elif "postback" in messaging_event and "referral" in messaging_event["postback"]:
                ref_data = messaging_event["postback"]["referral"].get("ref")

            if ref_data:
                try:
                    decoded = base64.urlsafe_b64decode(ref_data + "===").decode('utf-8')
                    parts = decoded.split("|")
                    if len(parts) >= 3:
                        crop, qty, grade = parts[0], parts[1], parts[2]
                        res = supabase.table("dpi_prices").select("price").ilike("commodity", f"%{crop}%").order(
                            "date_updated", desc=True).limit(1).execute()

                        if res.data:
                            p = float(res.data[0]['price'])
                            total = p * float(qty)
                            tagalog_crops = {"tomato": "kamatis", "chili": "sili", "sweet_potato": "kamote"}
                            crop_tagalog = tagalog_crops.get(crop.lower(), crop).capitalize()

                            today = datetime.now().strftime("%B %-d, %Y")
                            msg_text = (
                                f"Ang iyong grade {grade} na {crop_tagalog} ay nagkakahalaga ng ₱{p:.2f}/kg ngayon ({today})!\n\n"
                                f"Mayroon kang {qty}kg na {crop_tagalog}, matatanggap mo ang ₱{total:,.2f}. "
                                f"Pindutin ang 'IBENTA' sa ibaba kung nais mong i-post sa palengke.\n\n"
                                f"DETALYE NG SCAN\n"
                                f"Pananim: {crop_tagalog}\n"
                                f"Grado: {grade}\n"
                                f"Timbang: {qty}kg\n\n"
                                f"Presyo: ₱{p:.2f}/kg\n"
                                f"Kabuuan: ₱{total:,.2f}"
                            )
                            buttons = {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "button",
                                        "text": msg_text,
                                        "buttons": [{
                                            "type": "postback",
                                            "title": "IBENTA",
                                            "payload": json.dumps(
                                                {"action": "LIST", "c": crop, "g": grade, "q": qty, "p": p})
                                        }]
                                    }
                                }
                            }
                            await send_fb_message(sender_id, buttons)
                except Exception as e:
                    print(f"Scan error: {e}")

            # --- 2. TEXT MESSAGE HANDLER (offline fallback: farmer pastes hash code) ---
            elif "message" in messaging_event and "text" in messaging_event["message"]:
                text_input = messaging_event["message"]["text"].strip()

                try:
                    decoded = base64.urlsafe_b64decode(text_input + "===").decode('utf-8')
                    if "|" in decoded:
                        parts = decoded.split("|")
                        crop, qty, grade = parts[0], parts[1], parts[2]

                        res = supabase.table("dpi_prices").select("price").ilike("commodity", f"%{crop}%").order(
                            "date_updated", desc=True).limit(1).execute()

                        p = float(res.data[0]['price']) if res.data else 0.0
                        total = p * float(qty)
                        
                        tagalog_crops = {"tomato": "kamatis", "chili": "sili", "sweet_potato": "kamote"}
                        crop_tagalog = tagalog_crops.get(crop.lower(), crop).capitalize()

                        today = datetime.now().strftime("%B %-d, %Y")
                        msg_text = (
                            f"✅ DETALYE NG SCAN\n\n"
                            f"Pananim: {crop_tagalog}\n"
                            f"Grado: {grade}\n"
                            f"Timbang: {qty}kg\n\n"
                            f"Presyo: ₱{p:.2f}/kg ({today})\n"
                            f"Kabuuan: ₱{total:,.2f}\n\n"
                            f"Pindutin ang IBENTA sa ibaba para ma-post ito sa palengke."
                        )

                        buttons = {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "button",
                                    "text": msg_text,
                                    "buttons": [{
                                        "type": "postback",
                                        "title": "IBENTA",
                                        "payload": json.dumps(
                                            {"action": "LIST", "c": crop, "g": grade, "q": qty, "p": p})
                                    }]
                                }
                            }
                        }
                        await send_fb_message(sender_id, buttons)
                    else:
                        raise ValueError("Not a valid hash")
                except:
                    await send_fb_message(sender_id, {
                        "text": "I-paste dito ang code mula sa PresyoAni Scanner app para maibenta mo ang iyong pananim."
                    })

            # --- 3. BUTTON CLICKS ---
            elif "postback" in messaging_event:
                payload_raw = messaging_event["postback"].get("payload")
                try:
                    p_load = json.loads(payload_raw)
                    action = p_load.get("action")

                    if action == "LIST":
                        supabase.table("farmers").upsert({"farmer_psid": sender_id, "messenger_id": sender_id, "quality_rating": 5.0}).execute()
                        res = supabase.table("market_listings").insert({"farmers_psid": sender_id, "commodity": p_load['c'], "grade": p_load['g'], "weight": float(p_load['q']), "price": float(p_load['p']), "status": True}).execute()

                        if res.data:
                                listing_id = res.data[0]['id']
                                success_msg = "✅ Na-post na sa palengke! Makakatanggap ka ng mensahe dito kapag may bumili."
                                
                                await send_fb_message(sender_id, {
                                    "attachment": {
                                        "type": "template",
                                        "payload": {
                                            "template_type": "button",
                                            "text": success_msg,
                                            "buttons": [
                                                {"type": "postback", "title": "🚫 BAWIIN", "payload": json.dumps({"action": "CANCEL", "id": listing_id})},
                                                {"type": "postback", "title": "🔍 TINGNAN ANG IYONG MGA BENTA", "payload": json.dumps({"action": "VIEW"})},
                                                {"type": "web_url", "url": "https://presyoani.onrender.com", "title": "➕ DAGDAG OG ANI"}
                                            ]
                                        }
                                    }
                                })

                    elif action == "VIEW":
                        res = supabase.table("market_listings").select("*").eq("farmers_psid", sender_id).eq("status",
                                                                                                             True).execute()
                        if res.data:
                            for item in res.data:
                                crop_name = item['commodity'].capitalize()
                                weight = item['weight']
                                price = item['price']
                                total = weight * price
                                listing_id = item['id']

                                item_msg = (
                                    f"🌾 {crop_name} (Grado {item['grade']})\n"
                                    f"📋 Listing ID: {listing_id}\n"
                                    f"⚖️ Timbang: {weight}kg\n"
                                    f"💰 Presyo: ₱{price:.2f}/kg\n"
                                    f"💵 Kabuuan: ₱{total:,.2f}"
                                )
                                await send_fb_message(sender_id, {
                                    "attachment": {
                                        "type": "template",
                                        "payload": {
                                            "template_type": "button",
                                            "text": item_msg,
                                            "buttons": [
                                                {"type": "postback", "title": "🚫 BAWIIN",
                                                 "payload": json.dumps({"action": "CANCEL", "id": listing_id})}
                                            ]
                                        }
                                    }
                                })
                        else:
                            await send_fb_message(sender_id, {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "button",
                                        "text": "Wala kang aktibong benta sa ngayon.",
                                        "buttons": [{
                                            "type": "web_url",
                                            "url": "https://presyoani.onrender.com",
                                            "title": "➕ DAGDAG NA ANI"
                                        }]
                                    }
                                }
                            })

                    elif action == "CANCEL":
                        listing_id = p_load.get("id")
                        print(f">>> CANCEL attempted, listing_id: {listing_id}")

                        check = supabase.table("market_listings").select("status, commodity, weight").eq("id",
                                                                                                         listing_id).execute()
                        print(f">>> Supabase result: {check.data}")

                        if not check.data:
                            await send_fb_message(sender_id,
                                                  {"text": "⚠️ Hindi na makita ang listing. Baka nabawi na o naibenta na."})
                        elif check.data[0]['status'] == False:
                            await send_fb_message(sender_id, {"text": "⚠️ Hindi na mababawi. May bumili na nito."})
                        else:
                            listing = check.data[0]
                            crop_name = listing['commodity'].capitalize()
                            weight = listing['weight']
                            await send_fb_message(sender_id, {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "button",
                                        "text": f"⚠️ Sigurado ka bang nais mong bawiin ang iyong {weight}kg na {crop_name}?",
                                        "buttons": [
                                            {"type": "postback", "title": "✅ OO, BAWIIN",
                                             "payload": json.dumps({"action": "CONFIRM_CANCEL", "id": listing_id})},
                                            {"type": "postback", "title": "❌ HINDI, IBALIK",
                                             "payload": json.dumps({"action": "VIEW"})}
                                        ]
                                    }
                                }
                            })

                    elif action == "CONFIRM_CANCEL":
                        listing_id = p_load.get("id")

                        check = supabase.table("market_listings").select("status").eq("id", listing_id).execute()
                        if check.data and check.data[0]['status'] == False:
                            await send_fb_message(sender_id,
                                                  {"text": "⚠️ Hindi na mababawi. Nabili na ito ng isang mamimili."})
                        else:
                            supabase.table("market_listings").update({"status": False}).eq("id", listing_id).execute()
                            await send_fb_message(sender_id, {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "button",
                                        "text": "🚫 Inalis na ang iyong listing sa palengke.",
                                
                                        "buttons": [{"type": "postback", "title": "🔍 TINGNAN ANG IYONG MGA BENTA", "payload": json.dumps({"action": "VIEW"})}]
                                    }
                                }
                            })

                except Exception as e:
                    print(f"Postback error: {e}")

    return PlainTextResponse("EVENT_RECEIVED", status_code=200)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)