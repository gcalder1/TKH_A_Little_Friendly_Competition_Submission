## TidyBloom Backend — Express + Prisma + Supabase

JavaScript backend using:
- **Express** for HTTP routes
- **Prisma** ORM targeting **Supabase Postgres**
- **Supabase Auth**: frontend logs in; backend **verifies JWT** via Supabase Admin

## Quick Start

### 1) Environment (Production/Hosting)
Set these **environment variables** in your hosting provider (Render/Railway/etc.):

- `SUPABASE_URL` — e.g., `https://YOUR_PROJECT.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only secret**
- `DATABASE_URL` — Postgres URL (pooling OK)
- `SHADOW_DATABASE_URL` — Direct Postgres URL (for Prisma migrations)
- `PORT` — (Render provides, but we support override)

### 2) Build & Run (Render setup)
- Build: `npm install && npm run prisma:gen`
- Start: `npx prisma migrate deploy && node src/server.js`
- Health: `GET /health` → `200`

### 3) Local Development (optional)
Set env vars in your shell, then:
```bash
npm install
npm run prisma:gen
npm run prisma:migrate -- --name init
node prisma/seed.js
npm run dev
