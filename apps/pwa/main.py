import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

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
    if params.get("hub.verify_token") == FB_VERIFY_TOKEN:
        return int(params.get("hub.challenge"))
    return "Verification Failed"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)