# Surat

**All-in-one event platform for Southeast Asia.**

One shareable link replaces five separate event tools — RSVPs, digital angpao, gift registry, photo gallery, and wallet passes. No app download required for guests.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS 3 (custom design system) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Supabase Auth (email/password, cookie-based sessions) |
| File Storage | Supabase Storage |
| Image Processing | Sharp |
| Validation | Zod |
| Email | Resend |
| Deploy | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (for auth, database, and storage)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/reynaldusjasona/surat.git
   cd surat
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and other required values in `.env`.

4. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (dashboard)/        # Authenticated dashboard (host, organizer, etc.)
│   ├── [slug]/             # Public event microsite
│   ├── api/                # API routes
│   ├── login/              # Auth pages
│   ├── signup/
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   ├── events/             # Event page components
│   ├── layout/             # Sidebar, topbar
│   ├── landing/            # Landing page components (hero, etc.)
│   └── ui/                 # Shared UI primitives
├── lib/
│   ├── auth/               # Supabase auth helpers
│   ├── calendar/           # ICS file generation
│   ├── db/                 # Prisma client
│   ├── utils/              # Shared utilities
│   └── wallet/             # Apple/Google wallet pass generation
├── middleware.ts           # Auth session refresh middleware
└── types/                  # TypeScript type definitions
```

## Features (Current State — MVP)

- [x] Event microsite (`/[slug]`) — full guest experience
- [x] RSVP system (submit + host dashboard)
- [x] Digital angpao (send, view, thank)
- [x] Gift registry (add items, claim, activity feed)
- [x] Photo gallery (upload, thumbnails, paywall, ZIP download)
- [x] Calendar .ics download
- [x] Wallet pass generation (Apple + Google)
- [x] Auth: login + signup
- [x] Role-based dashboards (host, organizer, photographer, admin)
- [x] Custom Tailwind design system
- [x] Animated landing page
- [x] Mobile-responsive layout

## Environment Variables

See `.env.example` for the full list. Key variables:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `DATABASE_URL` — PostgreSQL connection string (pooling)
- `DIRECT_URL` — PostgreSQL direct connection
- `RESEND_API_KEY` — Resend email API key
- `NEXT_PUBLIC_APP_URL` — App base URL (http://localhost:3000 for dev)

## License

Private — all rights reserved.
