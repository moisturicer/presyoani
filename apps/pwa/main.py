import os
import json
import httpx
import uvicorn
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

# ENV VARIABLES
token = os.getenv("FB_PAGE_ACCESS_TOKEN")
verify_token = os.getenv("FB_VERIFY_TOKEN")
page_id = os.getenv("FB_PAGE_ID")
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Reusable HTTP Client
http_client = httpx.AsyncClient(timeout=10)

async def send_fb_message(recipient_id, message_payload):
    try:
        fb_url = f"https://graph.facebook.com/v19.0/me/messages?access_token={token}"
        await http_client.post(
            fb_url,
            json={
                "recipient": {"id": recipient_id},
                "message": message_payload
            }
        )
    except Exception as e:
        print(f"Error sending FB message: {e}")

@app.get("/sw.js")
async def serve_sw():
    return FileResponse("static/sw.js", media_type="application/javascript")

@app.post("/notify-farmer")
async def notify_farmer(request: Request):
    try:
        data = await request.json()
        farmer_id = data.get("farmer_psid")
        crop = data.get("commodity", "tanom")
        qty = data.get("weight", "0")
        listing_id = data.get("listing_id")

        if listing_id:
            supabase.table("market_listings") \
                .update({"status": False}) \
                .eq("id", listing_id) \
                .execute()

        bisaya_crops = {
            "tomato": "kamatis",
            "chili": "sili",
            "sweet_potato": "kamote"
        }

        crop_bisaya = bisaya_crops.get(crop.lower(), crop)

        msg = f"🔔 Naay nipalit sa imohang {qty}kg nga {crop_bisaya}. Kuhaon sa tig-deliver ig 5PM."

        if farmer_id:
            await send_fb_message(farmer_id, {"text": msg})

        return JSONResponse({"status": "success"})

    except Exception as e:
        print(f"Notify farmer error: {e}")
        return JSONResponse({"status": "error"}, status_code=500)

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "fb_page_id": page_id}
    )

@app.get("/webhook")
async def verify(request: Request):
    params = request.query_params
    if (
        params.get("hub.mode") == "subscribe"
        and params.get("hub.verify_token") == verify_token
    ):
        return PlainTextResponse(content=str(params.get("hub.challenge")))
    return PlainTextResponse(content="failed", status_code=403)

@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()

    if data.get("object") != "page":
        return PlainTextResponse("EVENT_RECEIVED", status_code=200)

    for entry in data.get("entry", []):
        for messaging_event in entry.get("messaging", []):

            sender = messaging_event.get("sender", {})
            sender_id = sender.get("id")

            if not sender_id:
                continue

            ref_raw = None

            # Handle Referral
            if "referral" in messaging_event:
                ref_raw = messaging_event["referral"].get("ref")

            elif (
                "postback" in messaging_event
                and "referral" in messaging_event["postback"]
            ):
                ref_raw = messaging_event["postback"]["referral"].get("ref")

            if not ref_raw:
                continue

            try:
                parts = ref_raw.split("_")

                if len(parts) < 3:
                    await send_fb_message(sender_id, {
                        "text": "❌ Invalid scan format."
                    })
                    continue

                crop, qty, grade = parts[0], parts[1], parts[2]

                # Fetch latest price
                res = (
                    supabase.table("dpi_prices")
                    .select("price")
                    .ilike("commodity", f"%{crop}%")
                    .order("date_updated", desc=True)
                    .limit(1)
                    .execute()
                )

                if not res.data:
                    await send_fb_message(sender_id, {
                        "text": f"⚠️ Walay presyo makita para sa {crop} karon."
                    })
                    continue

                p = float(res.data[0]["price"])

                try:
                    qty_val = float(qty)
                except ValueError:
                    qty_val = 0

                total = p * qty_val

                bisaya_crops = {
                    "tomato": "kamatis",
                    "chili": "sili",
                    "sweet_potato": "kamote"
                }

                crop_bisaya = bisaya_crops.get(crop.lower(), crop).capitalize()

                msg_text = (
                    f"Grade {grade} {crop_bisaya}\n"
                    f"Presyo: ₱{p:.2f}/kg\n"
                    f"Timbang: {qty_val}kg\n"
                    f"Total: ₱{total:,.2f}\n\n"
                    f"Ibaligya kini?"
                )

                buttons = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": msg_text,
                            "buttons": [{
                                "type": "postback",
                                "title": "IBALIGYA",
                                "payload": json.dumps({
                                    "action": "LIST",
                                    "c": crop,
                                    "g": grade,
                                    "q": qty_val,
                                    "p": p
                                })
                            }]
                        }
                    }
                }

                await send_fb_message(sender_id, buttons)

            except Exception as e:
                print(f"Error processing scan: {e}")
                await send_fb_message(sender_id, {
                    "text": "⚠️ Naay error sa pag-process sa scan."
                })

    return PlainTextResponse("EVENT_RECEIVED", status_code=200)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)