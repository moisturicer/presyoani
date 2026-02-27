import os
import json
import base64
import httpx
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

# config
token = os.getenv("FB_PAGE_ACCESS_TOKEN")
verify_token = os.getenv("FB_VERIFY_TOKEN")
page_id = os.getenv("FB_PAGE_ID")
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# init supabase
supabase: Client = create_client(url, key)

# mount static and templates for the pwa scanner
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# send msg helper
async def send_fb_message(recipient_id, message_payload):
    fb_url = f"https://graph.facebook.com/v19.0/me/messages?access_token={token}"
    async with httpx.AsyncClient() as client:
        await client.post(fb_url, json={
            "recipient": {"id": recipient_id},
            "message": message_payload
        })


# root route (this loads your index.html scanner!)
@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "fb_page_id": page_id
    })


# fb verify
@app.get("/webhook")
async def verify(request: Request):
    params = request.query_params
    if params.get("hub.mode") == "subscribe" and params.get("hub.verify_token") == verify_token:
        return PlainTextResponse(content=str(params.get("hub.challenge")))
    return PlainTextResponse(content="failed", status_code=403)


# main webhook logic
@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()

    if data.get("object") == "page":
        for entry in data.get("entry"):
            for messaging_event in entry.get("messaging"):
                sender_id = messaging_event["sender"]["id"]

                # catch the scan from pwa
                ref_data = None
                if "referral" in messaging_event:
                    ref_data = messaging_event["referral"].get("ref")
                elif "postback" in messaging_event and "referral" in messaging_event["postback"]:
                    ref_data = messaging_event["postback"]["referral"].get("ref")

                if ref_data:
                    try:
                        # decode scan data
                        decoded = base64.urlsafe_b64decode(ref_data + "===").decode('utf-8')
                        parts = decoded.split("|")

                        if len(parts) >= 4:
                            crop = parts[1]
                            qty = parts[2]
                            grade = parts[3]

                            # get price from db
                            res = supabase.table("prices").select("price") \
                                .ilike("commodity", f"%{crop}%") \
                                .order("date_updated", desc=True).limit(1).execute()

                            if res.data:
                                p = float(res.data[0]['price'])
                                total = p * float(qty)

                                msg = (
                                    f"🍅 {crop.lower()} scan\n"
                                    f"grade: {grade}\n"
                                    f"weight: {qty}kg\n\n"
                                    f"price: p{p:.2f}/kg\n"
                                    f"total: p{total:,.2f}"
                                )

                                # reply with sell button
                                buttons = {
                                    "attachment": {
                                        "type": "template",
                                        "payload": {
                                            "template_type": "button",
                                            "text": msg,
                                            "buttons": [{
                                                "type": "postback",
                                                "title": "sell now",
                                                "payload": json.dumps(
                                                    {"action": "LIST", "c": crop, "g": grade, "q": qty, "p": p})
                                            }]
                                        }
                                    }
                                }
                                await send_fb_message(sender_id, buttons)
                            else:
                                await send_fb_message(sender_id, {"text": f"no price found for {crop}"})
                    except Exception as e:
                        print(f"error: {e}")

                # catch sell button click
                elif "postback" in messaging_event:
                    payload_raw = messaging_event["postback"].get("payload")
                    try:
                        p_load = json.loads(payload_raw)
                        if p_load.get("action") == "LIST":
                            # save to market table
                            supabase.table("market_listings").insert({
                                "farmer_psid": sender_id,
                                "commodity": p_load['c'],
                                "grade": p_load['g'],
                                "weight": p_load['q'],
                                "price": p_load['p'],
                                "status": "available"
                            }).execute()

                            await send_fb_message(sender_id, {"text": "listed on dashboard ✅"})
                    except:
                        pass

    return PlainTextResponse("EVENT_RECEIVED", status_code=200)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)