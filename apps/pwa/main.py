import os
import json
import base64
import httpx
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

# config
FB_PAGE_ACCESS_TOKEN = os.getenv("FB_PAGE_ACCESS_TOKEN")
FB_VERIFY_TOKEN = os.getenv("FB_VERIFY_TOKEN")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# initialize supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# helper functions
async def send_fb_message(recipient_id, message_payload):
    """Sends a message or template to a user via Facebook Graph API"""
    url = f"https://graph.facebook.com/v19.0/me/messages?access_token={FB_PAGE_ACCESS_TOKEN}"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={
            "recipient": {"id": recipient_id},
            "message": message_payload
        })


def decode_farmer_data(hashed_string):
    """
    Decodes the string from the PWA.
    Assumes the PWA sends a Base64 encoded JSON string.
    Example JSON: {"crop": "Corn (Yellow)", "grade": "A", "weight": 10}
    """
    try:
        decoded_bytes = base64.b64decode(hashed_string)
        return json.loads(decoded_bytes.decode('utf-8'))
    except:
        return None


# routes
@app.get("/webhook")
async def verify(request: Request):
    """Handles Facebook Webhook Verification"""
    params = request.query_params
    if params.get("hub.mode") == "subscribe" and params.get("hub.verify_token") == FB_VERIFY_TOKEN:
        return PlainTextResponse(content=str(params.get("hub.challenge")))
    return PlainTextResponse(content="Verification Failed", status_code=403)


@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()

    if data.get("object") == "page":
        for entry in data.get("entry"):
            for messaging_event in entry.get("messaging"):
                sender_id = messaging_event["sender"]["id"]

                ref_data = None

                if "postback" in messaging_event and "referral" in messaging_event["postback"]:
                    ref_data = messaging_event["postback"]["referral"].get("ref")

                elif "referral" in messaging_event:
                    ref_data = messaging_event["referral"].get("ref")

                if ref_data:
                    try:
                        decoded = base64.urlsafe_b64decode(ref_data + "===").decode('utf-8')
                        crop, qty, grade = decoded.split("|")

                        response = supabase.table("prices") \
                            .select("price") \
                            .ilike("commodity", f"%{crop}%") \
                            .order("date_updated", desc=True) \
                            .limit(1).execute()

                        if response.data:
                            market_price = float(response.data[0]['price'])
                            total_value = market_price * float(qty)

                            reply = f"✅ AI Scan Successful!\n\nCrop: {crop}\nGrade: {grade}\nWeight: {qty}kg\n\nMarket Price: P{market_price}/kg\nTotal: P{total_value:,.2f}"

                            # Send message with button
                            await send_fb_message(sender_id, {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "button",
                                        "text": reply,
                                        "buttons": [{
                                            "type": "postback",
                                            "title": "Sell This Produce",
                                            "payload": json.dumps(
                                                {"action": "LIST", "c": crop, "g": grade, "q": qty, "p": market_price})
                                        }]
                                    }
                                }
                            })
                    except Exception as e:
                        print(f"Error decoding ref: {e}")

    return PlainTextResponse("EVENT_RECEIVED", status_code=200)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

