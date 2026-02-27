from dotenv import load_dotenv
import os
import requests
import pdfplumber
import pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from supabase import Client, create_client
from datetime import datetime
import os

load_dotenv()
SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BASE_URL = "https://www.da.gov.ph/price-monitoring/"
PDF_DIR = "pdfs"
OUTPUT_DIR = "output"
CSV_PATH = os.path.join(OUTPUT_DIR, "latest_dpi.csv")

os.makedirs(PDF_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def parse_title_to_date(title):
    # title is like "February 27, 2026"
    return datetime.strptime(title.strip(), "%B %d, %Y").date().isoformat()

def write_prices_to_db(clean_records):
    if not clean_records:
        print("No records to insert into Supabase. Skipping...")
        return

    import httpx, json, math

    clean_records_out = []
    for row in clean_records:
        clean_row = {}
        for k, v in row.items():
            if isinstance(v, float) and math.isnan(v):
                clean_row[k] = None
            else:
                clean_row[k] = v
        clean_records_out.append(clean_row)

    try:
        body = json.dumps(clean_records_out, allow_nan=False)
    except ValueError as e:
        print("Still has invalid values:", e)
        return

    url = f"{SUPABASE_URL}/rest/v1/dpi_prices"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates,return=minimal"  # Skip duplicates
    }

    r = httpx.post(url, headers=headers, content=body)
    print("Status:", r.status_code)
    if r.status_code >= 400:
        print("Error:", r.text)
    else:
        print(f"Inserted {len(clean_records_out)} rows into Supabase")

# Fetch HTML
def fetch_price_monitoring_page():
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(BASE_URL, headers=headers)
    response.raise_for_status()
    return response.text


# Extract latest pdf
def find_latest_dpi_pdf(html):
    soup = BeautifulSoup(html, "lxml")

    # Target the exact table
    table = soup.find("table", id="tablepress-231")

    if not table:
        raise Exception("DPI table not found.")

    tbody = table.find("tbody")
    if not tbody:
        raise Exception("DPI table body not found.")

    # First row = latest
    first_row = tbody.find("tr")
    if not first_row:
        raise Exception("No rows found in DPI table.")

    link_tag = first_row.find("a", href=True)
    if not link_tag:
        raise Exception("No PDF link found in latest row.")

    pdf_url = link_tag["href"]
    title = link_tag.get_text(strip=True)

    return title, pdf_url


# Download latest pdf
def download_pdf(pdf_url, title):
    safe_filename = title.replace(" ", "_").replace("/", "-")
    pdf_path = os.path.join(PDF_DIR, safe_filename + ".pdf")

    response = requests.get(pdf_url)
    response.raise_for_status()

    with open(pdf_path, "wb") as f:
        f.write(response.content)

    return pdf_path


def extract_tables_from_pdf(pdf_path):
    all_rows = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                for row in table:
                    if any(cell is not None for cell in row):
                        all_rows.append(row)

    if not all_rows:
        raise Exception("No tables found in PDF.")

    return all_rows


# Converts tables to csv
def convert_to_dataframe(rows, date_updated):
    clean_data = []
    current_category = "Imported Commercial Rice"

    # This is to separate imported and local rice
    rice_mode = True  

    for row in rows:
        row = [cell.strip() if isinstance(cell, str) else cell for cell in row]

        if not any(row):
            continue

        first_cell = row[0]

        if first_cell == "LOCAL COMMERCIAL RICE":
            current_category = "Local Commercial Rice"
            continue

        if first_cell == "CORN PRODUCTS":
            rice_mode = False
            current_category = None
            continue

        if first_cell in ["COMMODITY", "PREVAILING", "RETAIL PRICE PER", "UNIT (P/UNIT)"]:
            continue

        price = None
        for cell in reversed(row):
            if isinstance(cell, str):
                try:
                    price = float(cell.replace(",", ""))
                    break
                except:
                    continue

        if not first_cell or price is None:
            continue

        full_commodity = f"{current_category} - {first_cell}" if rice_mode and current_category else first_cell

        specification = None
        if len(row) > 1 and row[1] and str(row[1]).strip():
            specification = str(row[1]).strip()

        clean_data.append({
            "commodity": full_commodity,
            "specification": specification,
            "price": price,
            "date_updated": date_updated  # Add date column
        })

    df = pd.DataFrame(clean_data)
    return df.reset_index(drop=True)

# Main pipeline
def get_latest_dpi():
    print("Fetching page...")
    html = fetch_price_monitoring_page()

    print("Finding latest PDF...")
    title, pdf_url = find_latest_dpi_pdf(html)
    print("Latest DPI:", title)

    date_updated = parse_title_to_date(title)  # Parse date from title
    print("Parsed date:", date_updated)

    print("Downloading PDF...")
    pdf_path = download_pdf(pdf_url, title)

    print("Extracting tables...")
    rows = extract_tables_from_pdf(pdf_path)

    print("Structuring data...")
    df = convert_to_dataframe(rows, date_updated)

    print("Saving CSV...")
    df.to_csv(CSV_PATH, index=False)

    print("Writing to Supabase...")
    records = df.to_dict(orient="records")
    write_prices_to_db(records)

    # Delete PDF after processing
    os.remove(pdf_path)
    
    print("Done. CSV + Supabase updated.", CSV_PATH)
    print("Number of rows extracted:", len(df))

    return df

def get_latest_dpi_records():
    df = get_latest_dpi()  
    return df.to_dict(orient="records")

if __name__ == "__main__":
    get_latest_dpi()