from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Any, Dict
import os
import shutil
from dotenv import load_dotenv

try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("medsimplify")

# Load environment variables
load_dotenv()

# Determine absolute path to backend and root DB files
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root_dir = os.path.dirname(backend_dir)

sqlite_backend_db = os.path.join(backend_dir, "medsimplify.db")
sqlite_root_db = os.path.join(root_dir, "medsimplify.db")

sqlite_backend_path = sqlite_backend_db.replace("\\", "/")
sqlite_fallback_url = f"sqlite:///{sqlite_backend_path}"

PRIMARY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    sqlite_fallback_url
)
if PRIMARY_DATABASE_URL and PRIMARY_DATABASE_URL.startswith("postgres://"):
    PRIMARY_DATABASE_URL = PRIMARY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

logger.info(f"Connecting to database at {PRIMARY_DATABASE_URL}...")

def init_engine(url: str):
    engine_kwargs: Dict[str, Any] = {"echo": False}
    if "sqlite" in url:
        engine_kwargs["connect_args"] = {"check_same_thread": False}
    else:
        engine_kwargs.update({
            "pool_size": 10,
            "max_overflow": 20,
            "pool_pre_ping": True,
            "connect_args": {"connect_timeout": 10}
        })
    eng = create_engine(url, **engine_kwargs)
    with eng.connect() as conn:
        pass
    return eng

try:
    engine = init_engine(PRIMARY_DATABASE_URL)
    DATABASE_URL = PRIMARY_DATABASE_URL
    logger.info(f"✅ Database connected: {DATABASE_URL}")
except Exception as err:
    logger.warning(f"Primary database connection failed ({err}). Seamlessly falling back to absolute SQLite database.")
    DATABASE_URL = sqlite_fallback_url
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def auto_init_database():
    """Ensure schema exists and initial seed data is populated."""
    try:
        from models import Base
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created/verified successfully.")

        # Seed data if user/doctor count is zero
        db = SessionLocal()
        from models import DoctorProfile
        doc_cnt = db.query(DoctorProfile).count()
        if doc_cnt == 0:
            logger.info("Seeding initial data into database...")
            from config.seed import seed_database
            seed_database(db)
            logger.info("✅ Seeding completed!")

        # Align PostgreSQL sequence counters with max(id) for all tables
        if "postgresql" in DATABASE_URL:
            from sqlalchemy import text
            try:
                db.execute(text("ALTER TABLE medical_reports ADD COLUMN IF NOT EXISTS vector_embeddings JSONB;"))
                db.commit()
            except Exception:
                db.rollback()

            tables = [
                "users", "patient_profiles", "doctor_profiles", "family_members",
                "chats", "messages", "medical_reports", "medicine_reminders",
                "medicine_logs", "appointments", "symptoms", "prescriptions", "medicines"
            ]
            for t in tables:
                try:
                    db.execute(text(f"SELECT setval(pg_get_serial_sequence('{t}', 'id'), COALESCE((SELECT MAX(id) FROM {t}), 1));"))
                except Exception:
                    pass
            db.commit()
            logger.info("✅ PostgreSQL primary key sequences aligned.")


        db.close()
    except Exception as err:
        logger.warning(f"Database auto-init note: {err}")

auto_init_database()

def sync_sqlite_db_files():
    """Ensure SQLite database files are safe without corrupting active GUI connection handles."""
    try:
        # Avoid forced copy2 while DBeaver or other applications hold active file handles
        if os.path.exists(sqlite_backend_db) and os.path.abspath(sqlite_backend_db) != os.path.abspath(sqlite_root_db):
            # Only copy if root DB does not exist or if not locked
            if not os.path.exists(sqlite_root_db):
                shutil.copy2(sqlite_backend_db, sqlite_root_db)
                logger.info("✅ Synchronized SQLite database for DBeaver!")
    except Exception as e:
        logger.warning(f"Sync DB file note: {e}")

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_connection():
    try:
        connection = engine.connect()
        logger.info("✅ Database connection successful!")
        connection.close()
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection()
