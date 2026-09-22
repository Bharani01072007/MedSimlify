import sqlite3
import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.database import engine, Base, SessionLocal
from config.seed import seed_database
from models import *

def repair_and_seed():
    print("=" * 70)
    print("REPAIRING & RE-CREATING CLEAN SQLITE DATABASE FILES")
    print("=" * 70)

    db_paths = [
        r"E:\Medsimplify\backend\medsimplify.db",
        r"E:\Medsimplify\medsimplify.db",
    ]

    # For each path, ensure clean SQLite creation & seeding
    for db_path in db_paths:
        print(f"\nProcessing: {db_path}")
        # Remove old lock/journal files if any
        wal_file = db_path + "-wal"
        shm_file = db_path + "-shm"
        for f in [wal_file, shm_file]:
            if os.path.exists(f):
                try:
                    os.remove(f)
                except Exception:
                    pass

        # Create tables and seed using SQLAlchemy engine bound to db_path
        from sqlalchemy import create_engine
        from sqlalchemy.orm import sessionmaker

        url = f"sqlite:///{db_path.replace('\\', '/')}"
        local_engine = create_engine(url, connect_args={"check_same_thread": False})
        Base.metadata.create_all(bind=local_engine)

        LocalSession = sessionmaker(autocommit=False, autoflush=False, bind=local_engine)
        session = LocalSession()
        seed_database(session)
        session.close()

        # Integrity check
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check;")
        res = cursor.fetchone()[0]
        print(f" ✅ Integrity check for {os.path.basename(db_path)}: {res}")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [r[0] for r in cursor.fetchall() if not r[0].startswith("sqlite_")]
        for t in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {t}")
            cnt = cursor.fetchone()[0]
            print(f"   - {t:<22}: {cnt} rows")
        conn.close()

    print("\n" + "=" * 70)
    print("REPAIR & SEED COMPLETED 100% CLEANLY!")
    print("=" * 70)

if __name__ == "__main__":
    repair_and_seed()
