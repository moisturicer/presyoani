# DPI Scraper

Scrapes the latest Daily Price Index (DPI) PDF from the Department of Agriculture website, extracts commodity price data, saves it as a CSV, and writes it to a Supabase database.

---

## Setup

Navigate to the scraper directory:

```bash
cd presyoani/services/dpi_scraper
```

Create and activate a virtual environment:

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file in the `dpi_scraper` directory with the following:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Running the Scraper

```bash
python scraper.py
```

### What it does

1. Fetches the DA price monitoring page
2. Finds the latest DPI PDF
3. Downloads and extracts commodity price tables
4. Saves the data to `output/latest_dpi.csv`
5. Inserts the records into the `dpi_prices` Supabase table
6. Deletes the downloaded PDF after processing

### Expected output

```
Fetching page...
Finding latest PDF...
Latest DPI: February 27, 2026
Parsed date: 2026-02-27
Downloading PDF...
Extracting tables...
Structuring data...
Saving CSV...
Writing to Supabase...
Status: 201
Inserted 156 rows into Supabase
Done. CSV + Supabase updated. output\latest_dpi.csv
Number of rows extracted: 156
```

---

## Output

| File | Description |
|------|-------------|
| `output/latest_dpi.csv` | Latest extracted prices with commodity, specification, price, and date |
| Supabase `dpi_prices` table | Same data written to the database |

---

## Database Schema

```sql
create table dpi_prices (
  id serial primary key,
  commodity text not null,
  specification text,
  price numeric not null,
  date_updated date not null
);
```

---

## Notes

- Re-running the scraper on the same date will not insert duplicate rows — the unique constraint on `(commodity, specification, price, date_updated)` prevents it.
- `n/a` prices in the PDF are skipped and not inserted.
- The scraper handles inconsistent column layouts in the PDF automatically.