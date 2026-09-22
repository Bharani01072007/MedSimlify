import sys
import os

# Ensure backend directory is in sys.path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.chdir(backend_dir)

from database_setup import create_and_seed_tables

if __name__ == "__main__":
    create_and_seed_tables()
