# ResQNet Admin Dashboard

Next.js operations console for the ResQNet SIH 2026 project. It talks only to the Express admin API. It does not connect to MongoDB and is not part of the Android app.

Full integration notes: [ADMIN_DASHBOARD_INTEGRATION.md](./ADMIN_DASHBOARD_INTEGRATION.md)

## Start locally

```bash
cd "C:\Users\Amaan\Downloads\super super final project\ResQNet Admin Dashboard"
copy .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The Express backend must already be running on `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:5000`). Sign in with the admin created by `npm run seed:admin` in the backend project.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (`tsc --noEmit`)
