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

@app.post("/notify-farmer")
async def notify_farmer(request: Request):
    try:
        data = await request.json()
        farmer_id = data.get("farmer_psid")
        crop = data.get("commodity", "tanom")
        qty = data.get("weight", "0")
        listing_id = data.get("listing_id")

        if listing_id:
            supabase.table("market_listings").update({"status": False}).eq("id", listing_id).execute()

        bisaya_crops = {"tomato": "kamatis", "chili": "sili", "sweet_potato": "kamote"}
        crop_bisaya = bisaya_crops.get(crop.lower(), crop)

        msg = f"🔔Naay nipalit sa imohang {qty}kg nga {crop_bisaya}. Kuhaon sa tig-deliver ig 5PM."
        await send_fb_message(farmer_id, {"text": msg})
        return JSONResponse({"status": "success"})
    except Exception as e:
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

            # Handle the Scan (Referral)
            ref_raw = None
            if "referral" in messaging_event:
                ref_raw = messaging_event["referral"].get("ref")
            elif "postback" in messaging_event and "referral" in messaging_event["postback"]:
                ref_raw = messaging_event["postback"]["referral"].get("ref")

            if ref_raw:
                try:
                    # Logic: Scanner sends "tomato_10_A" or Base64
                    # Let's assume simple underscore separation for 'Free Data' stability
                    parts = ref_raw.split("_") 
                    if len(parts) >= 3:
                        crop, qty, grade = parts[0], parts[1], parts[2]
                        
                        # FETCH PRICE FROM SUPABASE (Real-time)
                        res = supabase.table("dpi_prices").select("price").ilike("commodity", f"%{crop}%").order("date_updated", desc=True).limit(1).execute()
                        
                        if res.data:
                            p = float(res.data[0]['price'])
                            total = p * float(qty)
                            
                            # Translation
                            bisaya_crops = {"tomato": "kamatis", "chili": "sili", "sweet_potato": "kamote"}
                            crop_bisaya = bisaya_crops.get(crop.lower(), crop).capitalize()
                            
                            msg_text = (
                                f"Grade {grade} {crop_bisaya}\n"
                                f"Presyo: ₱{p:.2f}/kg\n"
                                f"Timbang: {qty}kg\n"
                                f"Total: ₱{total:,.2f}\n\n"
                                f"Ibaligya kini?"
                            )

                            # Send the Button Template
                            buttons = {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "button",
                                        "text": msg_text,
                                        "buttons": [{
                                            "type": "postback",
                                            "title": "IBALIGYA",
                                            "payload": json.dumps({"action": "LIST", "c": crop, "g": grade, "q": qty, "p": p})
                                        }]
                                    }
                                }
                            }
                            await send_fb_message(sender_id, buttons)
                except Exception as e:
                    print(f"Error processing scan: {e}")

    return PlainTextResponse("EVENT_RECEIVED", status_code=200)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)