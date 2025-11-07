## Repo snapshot for AI assistants

This repository contains two primary backends and a React admin frontend:

- Frontend: Create React App at the repository root (sources in `src/`).
- Node/Nest backend: `mybackend/` — a NestJS app (controllers in `mybackend/src/`).
- PHP helper endpoints for XAMPP/local testing: `php-backend/` and `src/components/php-backend/` (e.g. `db.php`).

Keep instructions short, actionable and reference the files below when making changes.

## Key files & conventions (quoteable examples)
- Start the React app: `npm start` (root `package.json`). Relevant code: `src/App.js` uses `fetch('http://localhost:5000/api/hello')` to call the backend. Note: NestJS in `mybackend` currently exposes `/` and `/health` (see `mybackend/src/app.controller.ts`).
- NestJS app entry: `mybackend/src/main.ts` — CORS is enabled and the default port is read from `PORT` (defaults to 5000 in code).
- Nest modules: `mybackend/src/app.module.ts` imports `UserManagementModule` and `DatabaseModule` — follow the module/DTO/controller pattern already used under `mybackend/src/user_management/`.
- Prisma schema: `mybackend/prisma/schema.prisma` — datasource currently points to MySQL `mysql://root:@localhost:3306/capstone`. Migrations are under `mybackend/prisma/migrations/`.
- PHP helper: `src/components/php-backend/db.php` — simple PDO helper intended for XAMPP local usage. It writes debug logs to `src/components/php-backend/db_debug.log` when `$DEBUG = true`.

## Running & debugging (practical commands / examples)
- Frontend (dev):
  - From repo root: `npm install` then `npm start`. The CRA dev server runs on port 3000 by default.
- Nest backend (dev):
  - From `mybackend/`: `npm install` then `npm run start:dev` to start with watch mode. In PowerShell set a custom port with `$env:PORT='3000'; npm run start:dev`.
  - Health check: `http://localhost:5000/health` responds with `{ status: 'ok', dbConnected: boolean }`.
- Prisma / DB:
  - The project uses MySQL. Local DB defaults: `root` user, empty password, DB name `capstone` (see `mybackend/prisma/schema.prisma`).
  - Migrations are committed in `mybackend/prisma/migrations/` — inspect SQL there before running `prisma migrate` locally.
- PHP/XAMPP:
  - If using XAMPP, `src/components/php-backend/db.php` contains DB defaults and a `$DEBUG` flag that writes `db_debug.log` in the same folder.

## Project-specific patterns an AI should follow
- Nest modules follow the typical folder layout: `module/`, `module.controller.ts`, `module.service.ts`, `dto/` — add new features following the same structure.
- Database access in Nest is provided by the `DatabaseModule`/`DatabaseService` (see `mybackend/src/database/`). Prefer using the project's database abstraction rather than directly importing Prisma client everywhere.
- Frontend UI components (e.g., `src/components/Admin.jsx`) use local image imports and internal state for navigation (no React Router). When adding new views, follow the `navItems` pattern and the `active` state-driven renderer.
- Cross-stack interactions:
  - Frontend -> NestJS: direct fetch to `http://localhost:5000` (CORS enabled in `main.ts`). Verify URL paths — the front-end example uses `/api/hello` though backend exposes `/` and `/health` (double-check route prefixes before changing code).
  - PHP helpers: used for simple XAMPP setups; they are independent of the NestJS app and live alongside frontend components.

## Safety notes & small gotchas
- Secrets: Prisma `schema.prisma` currently contains a connection string pointing at `root:@localhost`. Avoid committing sensitive credentials. Prefer `env("DATABASE_URL")` for deployments.
- Ports: frontend expects 3000, Nest default is 5000. Port mismatches are the most common local-dev cause of "connection refused" issues.
- Logs: PHP helper writes to `src/components/php-backend/db_debug.log` when `$DEBUG = true`. Nest writes a console line on startup with the port.

## Where to look for examples when implementing features
- API routes and health check: `mybackend/src/app.controller.ts`
- Module patterns and DTOs: `mybackend/src/user_management/` (controller/service/dto)
- Prisma models: `mybackend/prisma/schema.prisma` and SQL under `mybackend/prisma/migrations/`
- Frontend components and layout pattern: `src/components/Admin.jsx` and child pages (`Admin_Dashboard.jsx`, `Admin_UserManagement.jsx`, etc.)

If anything here is unclear, tell me which area (backend, prisma, frontend, or PHP) you want expanded and I will refine the instructions. 
