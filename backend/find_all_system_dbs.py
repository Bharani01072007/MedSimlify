import os
import sqlite3
import shutil
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def find_all_medsimplify_dbs():
    print("=" * 80)
    print("SEARCHING ENTIRE C: AND E: DRIVES FOR ALL medsimplify.db FILES")
    print("=" * 80)

    search_dirs = [
        r"E:\Medsimplify",
        r"C:\Users\Bharanidharan",
    ]

    found_dbs = []
    for s_dir in search_dirs:
        if os.path.exists(s_dir):
            for dirpath, dirnames, filenames in os.walk(s_dir):
                for f in filenames:
                    if f.lower() == "medsimplify.db":
                        p = os.path.join(dirpath, f)
                        found_dbs.append(p)

    print(f"\nFound {len(found_dbs)} 'medsimplify.db' files across drive system:")
    for path in found_dbs:
        size = os.path.getsize(path)
        print(f"\n📁 Path: {path} (Size: {size} bytes)")
        try:
            conn = sqlite3.connect(path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [r[0] for r in cursor.fetchall() if not r[0].startswith("sqlite_")]
            print(f"   Tables: {tables}")
            for t in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {t};")
                cnt = cursor.fetchone()[0]
                print(f"    - {t:<22}: {cnt} rows")
            conn.close()
        except Exception as e:
            print(f"   Error: {e}")

    # Copy fully-seeded database from E:\Medsimplify\backend\medsimplify.db to EVERY SINGLE found DB location!
    source_db = r"E:\Medsimplify\backend\medsimplify.db"
    if os.path.exists(source_db):
        print("\n" + "=" * 80)
        print("OVERWRITING / SYNCHRONIZING ALL LOCATED medsimplify.db FILES WITH SEEDED DATA")
        print("=" * 80)
        for path in found_dbs:
            try:
                shutil.copy2(source_db, path)
                print(f" ✅ Copied seeded DB -> {path}")
            except Exception as copy_err:
                print(f" ⚠️ Could not copy to {path}: {copy_err}")

if __name__ == "__main__":
    find_all_medsimplify_dbs()
