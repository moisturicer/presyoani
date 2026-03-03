import os
import json
import base64
import httpx
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

            # pasting of hash
            if "message" in messaging_event and "text" in messaging_event["message"]:
                text_input = messaging_event["message"]["text"].strip()

                try:
                    # unhash
                    decoded = base64.urlsafe_b64decode(text_input + "===").decode('utf-8')
                    if "|" in decoded:
                        parts = decoded.split("|")
                        crop, qty, grade = parts[0], parts[1], parts[2]

                        # query to supabase for price
                        res = supabase.table("dpi_prices").select("price").ilike("commodity", f"%{crop}%").order(
                            "date_updated", desc=True).limit(1).execute()

                        p = float(res.data[0]['price']) if res.data else 0.0
                        total = p * float(qty)

                        bisaya_crops = {"tomato": "kamatis", "chili": "sili", "sweet_potato": "kamote"}
                        crop_bisaya = bisaya_crops.get(crop.lower(), crop).capitalize()

                        msg_text = (
                            f"✅ CODE DECODED\n\n"
                            f"Tanom: {crop_bisaya}\n"
                            f"Grade: {grade}\n"
                            f"Timbang: {qty}kg\n\n"
                            f"Presyo: ₱{p:.2f}/kg\n"
                            f"Total: ₱{total:,.2f}\n\n"
                            f"Pinduta ang IBALIGYA sa ubos para ma-post kini sa palengke."
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
                                        "payload": json.dumps(
                                            {"action": "LIST", "c": crop, "g": grade, "q": qty, "p": p})
                                    }]
                                }
                            }
                        }
                        await send_fb_message(sender_id, buttons)
                        continue
                except:
                    await send_fb_message(sender_id, {
                        "text": "I-paste diri ang code gikan sa PresyoAni Scanner app para mabaligya nimo imong tanom."})

            # 2. button clocks handling
            elif "postback" in messaging_event:
                payload_raw = messaging_event["postback"].get("payload")
                try:
                    p_load = json.loads(payload_raw)
                    action = p_load.get("action")

                    if action == "LIST":
                        supabase.table("farmers").upsert(
                            {"farmer_psid": sender_id, "messenger_id": sender_id}).execute()
                        res = supabase.table("market_listings").insert({
                            "farmers_psid": sender_id,
                            "commodity": p_load['c'],
                            "grade": p_load['g'],
                            "weight": float(p_load['q']),
                            "price": float(p_load['p']),
                            "status": True
                        }).execute()

                        if res.data:
                            listing_id = res.data[0]['id']
                            success_msg = "✅ Napost na sa palengke! Makadawat ka og mensahe dinhi kung naay mupalit."
                            await send_fb_message(sender_id, {"text": success_msg})

                    elif action == "VIEW":
                        res = supabase.table("market_listings").select("*").eq("farmers_psid", sender_id).eq("status",
                                                                                                             True).execute()
                        list_msg = "IMONG BALIGYA:\n" + "\n".join([f"• {i['commodity']} ({i['weight']}kg)" for i in
                                                                   res.data]) if res.data else "Wala kay active listings."
                        await send_fb_message(sender_id, {"text": list_msg})

                except Exception as e:
                    print(f"Error: {e}")

    return PlainTextResponse("EVENT_RECEIVED", status_code=200)