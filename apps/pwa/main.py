import os
import json
import httpx
import uvicorn
import random
import string
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

async def send_fb_message(recipient_id, message_payload):
    fb_url = f"https://graph.facebook.com/v19.0/me/messages?access_token={token}"
    async with httpx.AsyncClient() as client:
        await client.post(fb_url, json={"recipient": {"id": recipient_id}, "message": message_payload})

# --- NEW: REGISTER SCAN DATA ---
@app.post("/register-scan")
async def register_scan(request: Request):
    try:
        data = await request.json()
        # Generate a short 6-digit alphanumeric code (The Hashkey)
        scan_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
        # Save results to Supabase temporarily
        supabase.table("pending_scans").insert({
            "code": scan_code,
            "crop": data.get("crop"),
            "weight": data.get("weight"),
            "grade": data.get("grade")
        }).execute()
        
        return JSONResponse({"scan_code": scan_code})
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)

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
    if data.get("object") != "page": return PlainTextResponse("EVENT_RECEIVED")

    for entry in data.get("entry", []):
        for messaging_event in entry.get("messaging", []):
            sender_id = messaging_event.get("sender", {}).get("id")
            if not sender_id: continue

            # --- HANDLE TEXT MESSAGES (PASTED CODE) ---
            if "message" in messaging_event and "text" in messaging_event["message"]:
                user_text = messaging_event["message"]["text"].strip().upper()
                
                # Check if the text matches a pending Hashkey
                res = supabase.table("pending_scans").select("*").eq("code", user_text).execute()
                
                if res.data:
                    scan = res.data[0]
                    crop, qty, grade = scan['crop'], scan['weight'], scan['grade']
                    
                    # Fetch current price from DPI table
                    p_res = supabase.table("dpi_prices").select("price").ilike("commodity", f"%{crop}%").order("date_updated", desc=True).limit(1).execute()
                    p = float(p_res.data[0]['price']) if p_res.data else 0.0
                    total = p * float(qty)

                    bisaya_crops = {"tomato": "kamatis", "chili": "sili", "sweet_potato": "kamote"}
                    crop_bisaya = bisaya_crops.get(crop.lower(), crop).capitalize()

                    msg_text = (
                        f"Imong grade {grade} na {crop_bisaya} kay tag ₱{p:.2f}/kg karong adlawa!\n\n"
                        f"Naa kay {qty}kg na {crop_bisaya}, imong madawat kay ₱{total:,.2f}.\n"
                        f"Pinduta ang 'IBALIGYA' kung ganahan nimo i-post sa palengke."
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
                                    "payload": json.dumps({"action": "LIST", "c": crop, "g": grade, "q": qty, "p": p})
                                }]
                            }
                        }
                    }
                    await send_fb_message(sender_id, buttons)
                    # Cleanup: Delete the code after use
                    supabase.table("pending_scans").delete().eq("code", user_text).execute()

            # --- HANDLE POSTBACKS (LIST, VIEW, CANCEL) ---
            elif "postback" in messaging_event:
                payload_raw = messaging_event["postback"].get("payload")
                try:
                    p_load = json.loads(payload_raw)
                    if p_load.get("action") == "LIST":
                        supabase.table("farmers").upsert({"farmer_psid": sender_id, "messenger_id": sender_id}).execute()
                        supabase.table("market_listings").insert({
                            "farmers_psid": sender_id, "commodity": p_load['c'], "grade": p_load['g'], 
                            "weight": float(p_load['q']), "price": float(p_load['p']), "status": True
                        }).execute()
                        await send_fb_message(sender_id, {"text": "✅ Napost na sa palengke!"})
                except Exception as e: print(f"Postback error: {e}")

    return PlainTextResponse("EVENT_RECEIVED")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))