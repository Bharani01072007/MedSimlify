import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.db.database import get_db
from app.models.models import MedicalReport
from app.services.ai.vector_store import vector_store

def seed_vector_embeddings_in_supabase():
    print("🚀 Connecting to Supabase Database to populate vector_embeddings...")
    db = next(get_db())
    try:
        # Automatically ensure vector_embeddings column exists in database table
        try:
            db.execute(text("ALTER TABLE medical_reports ADD COLUMN IF NOT EXISTS vector_embeddings JSONB;"))
            db.commit()
            print("  ✓ Checked/Created 'vector_embeddings' column in Supabase database table.")
        except Exception as col_err:
            db.rollback()
            print(f"  Note on column check: {col_err}")

        reports = db.query(MedicalReport).all()
        print(f"Found {len(reports)} medical reports in database.")

        updated_count = 0
        for r in reports:
            print(f"Processing Report ID #{r.id} ({r.file_name or 'Report'})...")
            
            # Generate chunk vector embeddings
            vector_payloads = vector_store.process_report_for_vectors(
                raw_text=r.raw_text or "",
                extracted_data=r.extracted_data,
                simplified_summary=r.simplified_summary
            )

            r.vector_embeddings = vector_payloads
            updated_count += 1
            print(f"  ✓ Generated {len(vector_payloads)} vector chunks for Report #{r.id}")

        db.commit()
        print(f"\n🎉 Successfully saved vector embeddings for {updated_count} report(s) in Supabase!")
        print("Now open Supabase Table Editor → 'medical_reports' table → 'vector_embeddings' column to view vectors.")

    except Exception as e:
        db.rollback()
        print(f"❌ Error populating vector embeddings in Supabase: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_vector_embeddings_in_supabase()
