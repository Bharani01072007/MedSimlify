import sys
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
print(f"Testing DATABASE_URL: {db_url}")

try:
    import psycopg2
    print("psycopg2 is installed!")
except ImportError:
    print("psycopg2 is NOT installed. Installing psycopg2-binary...")
    os.system(f"{sys.executable} -m pip install psycopg2-binary")

from sqlalchemy import create_engine, text

try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        res = conn.execute(text("SELECT version();")).fetchone()
        print(f"✅ SUCCESS! Connected to Supabase PostgreSQL: {res[0]}")
except Exception as e:
    print(f"❌ Connection error: {e}")
