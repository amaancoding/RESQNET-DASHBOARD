# ResQNet Admin Dashboard Integration

This document describes the SIH prototype admin stack. The Android app and the Next.js dashboard remain separate projects.

## 1. Architecture

```text
Android SOS / BLE / MeshEngine / Room
        ↓  unauthenticated phone contract
Express  POST /api/emergency  →  MongoDB Emergency documents

Next.js Admin Dashboard  (this project)
        ↓  httpOnly session cookie + rewrite
Express  /api/admin/*  (authenticated)
        ↓
MongoDB  Emergency, AdminUser, AuditLog, optional Feedback
```

The dashboard never connects to MongoDB. Phone SOS routes stay unauthenticated.

## 2. Authentication flow

1. Operator signs in at `/login`.
2. The Next.js server action calls `POST /api/admin/login` on Express.
3. Express verifies `AdminUser`, updates `lastLogin`, writes an audit log, and sets an httpOnly JWT cookie (`resqnet_admin_session`).
4. Next.js copies that cookie onto the dashboard origin.
5. Browser data calls go to same-origin `/api/admin/*`. `next.config.ts` rewrites them to `NEXT_PUBLIC_API_BASE_URL`.
6. Protected layouts call Express `GET /api/admin/me`. Missing/expired sessions redirect to `/login`.
7. Logout calls `POST /api/admin/logout`, increments `sessionVersion` (invalidates the JWT), and clears the cookie.

Tokens are not stored in `localStorage`.

## 3. Admin roles

| Role | Capabilities |
|------|----------------|
| `viewer` | Read dashboard, emergencies, users, feedback, analytics, mesh/responder availability |
| `operator` | Everything viewer can do, plus emergency status updates |
| `admin` | Everything operator can do, plus audit logs |

## 4. API endpoints

Phone contract (unchanged, no admin auth):

- `POST /api/emergency`
- `GET /api/emergencies`
- `POST /api/location`
- `GET /api/locations`
- `POST /api/sync`
- `POST /api/first-aid`
- `GET /api/health`

Admin (cookie or `Authorization: Bearer`):

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/emergencies` — `page`, `limit` (max 100), `type`, `status`, `severity`, `from`, `to`, `q`, `sort`, `order`
- `GET /api/admin/emergencies/:id`
- `PATCH /api/admin/emergencies/:id` — `{ "status": "active|pending|acknowledged|resolved" }` (operator/admin)
- `GET /api/admin/users`
- `GET /api/admin/feedback`
- `GET /api/admin/analytics`
- `GET /api/admin/audit-logs` (admin)
- `GET /api/admin/mesh`
- `GET /api/admin/responders`
- `GET /api/admin/resq-ai`

Unavailable resources return `{ "available": false, "message": "...", "data": null }` instead of invented telemetry.

## 5. MongoDB models

Added:

- `AdminUser` — email, passwordHash, role, lastLogin, sessionVersion, timestamps
- `AuditLog` — adminId, action, resourceType, resourceId, timestamp, metadata, ip
- `Feedback` — reserved for future phone submissions; not written by Android today

Modified:

- `Emergency.status` also accepts `acknowledged`. Phone `POST /api/emergency` still defaults to `active`.

Unchanged: `Location` and the phone emergency write path.

## 6. Dashboard data sources

| Page | Source |
|------|--------|
| `/dashboard` | `GET /api/admin/dashboard` from Emergency aggregates |
| `/emergencies` | `GET /api/admin/emergencies` |
| `/emergencies/[id]` | `GET /api/admin/emergencies/:id` and optional PATCH |
| `/map` | Real emergency lat/lng only |
| `/users` | Distinct `sourceNodeId` values from emergencies |
| `/feedback` | Feedback collection; empty means not connected |
| `/analytics` | Emergency counts, types, statuses, severities |
| `/audit` | AuditLog documents |

## 7. Environment variables

Dashboard (`.env.example` / `.env.local`):

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Backend:

```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/resqnet
ADMIN_SESSION_SECRET=change-this-to-a-long-random-string
ADMIN_DASHBOARD_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

Never commit real secrets. MongoDB credentials stay on the backend only.

## 8. Local setup

Backend:

```bash
cd "C:\Users\Amaan\Downloads\super super final project\SIH ResQNet test\backend"
copy .env.example .env
npm install
npm run seed:admin
npm run dev
```

Dashboard:

```bash
cd "C:\Users\Amaan\Downloads\super super final project\ResQNet Admin Dashboard"
copy .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## 9. Seed admin

```bash
npm run seed:admin
```

Requires `ADMIN_EMAIL` and `ADMIN_PASSWORD` (minimum 10 characters). Production refuses to seed unless `ALLOW_ADMIN_SEED=true`. There is no silent default production admin.

## 10. Security considerations

- bcrypt password hashes; plaintext is never stored or returned
- httpOnly, path-scoped session cookie; Secure + SameSite=None in production
- JWT signed with `ADMIN_SESSION_SECRET`
- Logout increments `sessionVersion`
- Login rate limiting
- CORS credentials restricted to `ADMIN_DASHBOARD_ORIGIN` for `/api/admin/*`
- Phone routes keep open CORS and no admin auth
- Audit logs omit passwords and tokens
- Input validation and pagination caps
- Safe 401 messages (no email-vs-password distinction)

## 11. Real data sections

Dashboard, emergencies, emergency detail, map, analytics (emergency-derived metrics), users (observed devices), and audit logs.

## 12. Intentionally unavailable

- Mesh topology / hop traces / live nodes
- Responder roster, locations, response times
- ResQ AI query charts
- Feedback until Android posts it
- Registered user accounts (only observed `sourceNodeId` values)
- Average mesh hops, network reliability, AI accuracy, survival rate

## 13. Future mesh / responder telemetry

When Android persists node/route/responder documents, keep the existing `/api/admin/mesh` and `/api/admin/responders` paths. Change `available` to `true` and return the stored documents. Do not invent live values before that data exists.
