import sqlite3
import os

paths = [
    r"E:\Medsimplify\backend\medsimplify.db",
    r"E:\Medsimplify\medsimplify.db"
]

for path in paths:
    print(f"\nChecking SQLite DB file: {path}")
    print(f"Exists: {os.path.exists(path)} | Size: {os.path.getsize(path)} bytes")
    try:
        conn = sqlite3.connect(path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check;")
        res = cursor.fetchone()[0]
        print(f"Integrity check: {res}")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [r[0] for r in cursor.fetchall() if not r[0].startswith("sqlite_")]
        print(f"Tables ({len(tables)}): {tables}")
        for t in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {t};")
            print(f" - {t:<22}: {cursor.fetchone()[0]} rows")
        conn.close()
    except Exception as e:
        print(f"❌ SQLite Error for {path}: {e}")
