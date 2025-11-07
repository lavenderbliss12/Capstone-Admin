PHP backend (inside components)

This folder contains a small PHP REST backend placed inside src/components/php-backend.

Files added:
- db.php - PDO helper (defaults to XAMPP MySQL: 127.0.0.1, root, no password). Override via env vars: DB_HOST, DB_NAME, DB_USER, DB_PASS.
- index.php - router for /users and /transactions endpoints.
- users.php - CRUD for user table (id, surname, name, email, date_created, password, points).
- transactions.php - CRUD for transaction table (reference_id, user_id, name, reward, points_used, date, status).
- create_tables.sql - SQL to create capstone DB and tables.

Quick setup using XAMPP:
1. Start the XAMPP Control Panel and start MySQL.
2. Import the SQL file (example using XAMPP mysql.exe):
   C:/xampp/mysql/bin/mysql.exe -u root -p < src/components/php-backend/create_tables.sql
3. Access endpoints (if your project is in C:/xampp/htdocs/A-INCENTIVES-CAPSTONE):
   http://localhost/A-INCENTIVES-CAPSTONE/src/components/php-backend/index.php/users

Quick dev server (PHP built-in):
1. From repo root run: php -S localhost:8000 -t src/components/php-backend
2. Then use: http://localhost:8000/users

Notes:
- Passwords are stored as plain text in this scaffold for simplicity — use password_hash() before storing in production.
- Debug logs for DB connection are written to src/components/php-backend/db_debug.log when enabled in db.php.
- The transaction table uses a column named `date` to match your spec. If you prefer `date_created`, update create_tables.sql and handlers.

If you want, I can add example fetch/axios code in React components to call these endpoints.
