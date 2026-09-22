# DBeaver Quick Start Guide

## Connect to Database

1. Open DBeaver
2. Click "New Database Connection"
3. Select "PostgreSQL"
4. Fill in:
   - Host: localhost
   - Port: 5432
   - Database: medsimplify
   - Username: medsimplify_user
   - Password: (from .env file)
5. Click "Test Connection" → "Finish"

## View Tables

- Expand: Databases → medsimplify → Schemas → public → Tables
- You'll see: users, patient_profiles, medical_reports, prescriptions, medicines, medicine_reminders, medicine_logs, appointments, symptoms, chats, messages, family_members, doctor_profiles

## View Data

- Right-click any table → "View/Edit Data" → "All Rows"

## Execute SQL

- Right-click database → "SQL Editor" → "Open SQL Editor"
- Type: `SELECT * FROM users;`
- Press Ctrl+Enter

## Useful Queries

```sql
-- Count users
SELECT COUNT(*) FROM users;

-- View all patients
SELECT * FROM patient_profiles;

-- View recent reports
SELECT * FROM medical_reports ORDER BY created_at DESC LIMIT 10;

-- View active medicine reminders
SELECT * FROM medicine_reminders WHERE is_active = true;

-- Join users with patient profiles
SELECT u.email, p.full_name, p.blood_group
FROM users u
JOIN patient_profiles p ON u.id = p.user_id;
```

## Export Data

- Right-click table → "Export Data" → Choose CSV/Excel/JSON

## Tips

- F5: Refresh
- Ctrl+Space: SQL autocomplete
- Ctrl+Shift+F: Format SQL
- Double-click cell: Edit
- Ctrl+S: Save edits
