import sys
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from seed_and_sync_all import force_seed_and_sync_all
from find_all_system_dbs import find_all_medsimplify_dbs

if __name__ == "__main__":
    print("Running force_seed_and_sync_all()...")
    force_seed_and_sync_all()
    print("\nRunning find_all_medsimplify_dbs()...")
    find_all_medsimplify_dbs()
