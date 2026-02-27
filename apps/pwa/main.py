import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import PlainTextResponse

load_dotenv()

app = FastAPI()

FB_PAGE_ID = os.getenv("FB_PAGE_ID")
FB_VERIFY_TOKEN = os.getenv("FB_VERIFY_TOKEN")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "fb_page_id": FB_PAGE_ID
    })


@app.get("/webhook")
async def verify(request: Request):
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    print(f"--- WEBHOOK ATTEMPT ---")
    print(f"Expected Token: '{FB_VERIFY_TOKEN}'")
    print(f"Received Token: '{token}'")
    print(f"Mode: {mode}")

    if mode == "subscribe" and token == FB_VERIFY_TOKEN:
        print("VERIFICATION SUCCESS")
        return PlainTextResponse(content=str(challenge))

    print("VERIFICATION FAILED")
    return PlainTextResponse(content="Verification Failed", status_code=403)


@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()
    print("Received data from Facebook:", data)

    return PlainTextResponse(content="EVENT_RECEIVED", status_code=200)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)