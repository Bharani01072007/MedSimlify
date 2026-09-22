# Database Setup Checklist

## PostgreSQL Setup
- [ ] PostgreSQL installed
- [ ] PostgreSQL service running
- [ ] Database 'medsimplify' created
- [ ] User 'medsimplify_user' created
- [ ] Password set and saved in .env

## DBeaver Setup
- [ ] DBeaver downloaded from [https://dbeaver.io/download/](https://dbeaver.io/download/)
- [ ] DBeaver installed
- [ ] New PostgreSQL connection created
- [ ] Connection tested successfully
- [ ] Can view tables in left panel

## Backend Setup
- [ ] .env file created with DATABASE_URL
- [ ] Database models created in backend/models/
- [ ] database_setup.py created
- [ ] Tables created (run: python database_setup.py)
- [ ] Test script passed (run: python test_db.py)

## Verification
- [ ] Can connect to database via DBeaver
- [ ] Can see all 13 tables in DBeaver
- [ ] Can view test user in 'users' table
- [ ] Can view test patient in 'patient_profiles' table
- [ ] FastAPI starts without database errors
- [ ] /health endpoint shows "database": "connected"

## Next Steps
- [ ] Implement authentication endpoints
- [ ] Implement report upload endpoint
- [ ] Test full workflow with DBeaver monitoring
- [ ] Set up daily database backups
