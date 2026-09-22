import os
import sqlite3
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def inspect_all_dbs():
    root_dir = r"E:\Medsimplify"
    print(f"Scanning for all SQLite .db files under {root_dir}...")
    
    db_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for f in filenames:
            if f.endswith(".db"):
                full_path = os.path.join(dirpath, f)
                db_files.append(full_path)

    print(f"\nFound {len(db_files)} database files:")
    for path in db_files:
        size = os.path.getsize(path)
        print(f"\n📁 DB Path: {path} (Size: {size} bytes)")
        try:
            conn = sqlite3.connect(path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [r[0] for r in cursor.fetchall() if not r[0].startswith("sqlite_")]
            print(f"   Tables ({len(tables)}): {tables}")
            for t in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {t};")
                cnt = cursor.fetchone()[0]
                print(f"    - {t:<20}: {cnt} rows")
            conn.close()
        except Exception as e:
            print(f"   Error reading DB: {e}")

if __name__ == "__main__":
    inspect_all_dbs()
