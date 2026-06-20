# Thunder System Explorer

Thunder System Explorer is a modern Next.js 15 App Router starter for inspecting system metadata, environment variables, workspace files, audit activity, and local settings from a professional dark dashboard.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Included Routes

- `/dashboard`
- `/system`
- `/environment`
- `/files`
- `/audit-logs`
- `/settings`

## API Routes

- `GET /api/system`
- `GET /api/environment`
- `GET /api/files?path=`
- `GET /api/audit-logs`
- `POST /api/settings`
