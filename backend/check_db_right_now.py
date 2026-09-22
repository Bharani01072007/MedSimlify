import sqlite3
import os

db_path = r"E:\Medsimplify\backend\medsimplify.db"
print(f"Checking file: {db_path}")
print(f"File exists: {os.path.exists(db_path)}")
print(f"File size: {os.path.getsize(db_path)} bytes")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [r[0] for r in cursor.fetchall() if not r[0].startswith("sqlite_")]

print(f"\nTables found in {db_path}:")
for t in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {t}")
    cnt = cursor.fetchone()[0]
    print(f" - {t:<20}: {cnt} rows")

print("\nContent of doctor_profiles:")
cursor.execute("SELECT * FROM doctor_profiles")
print(cursor.fetchall())

print("\nContent of patient_profiles:")
cursor.execute("SELECT * FROM patient_profiles")
print(cursor.fetchall())

print("\nContent of family_members:")
cursor.execute("SELECT * FROM family_members")
print(cursor.fetchall())

conn.close()
