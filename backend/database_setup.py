import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.database import engine, Base, test_connection
from seed_and_sync_all import force_seed_and_sync_all
from find_all_system_dbs import find_all_medsimplify_dbs
from models import *

try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("medsimplify")

def create_and_seed_tables():
    """Create all database tables and seed initial mock data."""
    logger.info("Creating & seeding database tables...")
    try:
        test_connection()
        Base.metadata.create_all(bind=engine)
        force_seed_and_sync_all()
        find_all_medsimplify_dbs()
        logger.info("✅ All database tables created & populated successfully!")
        return True
    except Exception as e:
        logger.error(f"Failed to create/seed tables: {str(e)}")
        return False

if __name__ == "__main__":
    create_and_seed_tables()
