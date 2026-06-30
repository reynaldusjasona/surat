# Surat — Team Briefing

## What is Surat?

Surat is an all-in-one event platform for Southeast Asia. From a single shareable link (no app download), guests can RSVP, send digital angpao, browse a photo gallery, and save event passes to Apple/Google Wallet.

**Repo:** https://github.com/reynaldusjasona/surat
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + Storage), Prisma ORM, Zod validation

---

## What's Already Built

### 1. Event & RSVP Module
- Host creates event → gets unique shareable link (e.g. `surat.app/jason-sarah-wedding-a3f8k2`)
- Guests open the link → see event details → submit RSVP (name, email, status, plus ones, dietary notes)
- No account needed for guests
- After RSVP: "Add to Calendar" (.ics download) + Apple/Google Wallet pass buttons
- Host dashboard: RSVP count cards, guest list table, CSV export

### 2. Digital Angpao Module
- Guests send monetary gifts (SGD or IDR) with optional message
- Anonymous option: host sees amount + message but NOT who sent it
- Payment is **simulated** (1 second delay, always succeeds) — no real Stripe yet
- Host dashboard: total received, list with "Thank" toggle button
- Suggested amounts for weddings (SGD 100-200 / IDR 500K-1M) shown as helper text

### 3. Gift Registry Module
- Host adds items to wishlist (name, brand, price, link, image, priority)
- Guests see the grid and click "I'll get this" → marks as taken
- Once purchased, no one else can claim it (409 conflict)
- Anonymous purchase option
- Activity feed: "Sarah is getting Dyson V15"

### 4. Photo Gallery Module (Freemium)
- Guests & photographer upload photos via `/[slug]/upload` (mobile-optimized)
- Photos auto-generate 400px thumbnails via `sharp`
- Gallery shows thumbnails publicly — no auth needed
- **Free tier:** 20 photo downloads per guest (tracked in localStorage)
- **Paywall:** After 20 downloads → modal asking SGD 5.99 / IDR 49,000
- After payment: unlock all photos + ZIP download button (client-side JSZip)
- Host dashboard: upload stats, photographer upload link with QR code

---

## How The System Works

### Database (8 tables in Supabase PostgreSQL)
```
users          → hosts, photographers, admins
events         → event details, slug, features_enabled (JSONB toggles)
guests         → RSVP records (upsert on email per event)
angpao         → monetary gifts with anonymous flag
registry_items → gift wishlist with purchase tracking
photos         → uploaded photos with thumbnail URLs
photo_unlocks  → who paid for full gallery access
wallet_passes  → Apple/Google wallet pass records
```

### API Routes (18 endpoints)
```
POST   /api/events                          → create event
GET    /api/events/[slug]                   → fetch event (public)
PATCH  /api/events/[slug]                   → update event (host only)

POST   /api/events/[slug]/rsvp             → submit RSVP (public)
GET    /api/events/[slug]/rsvp             → fetch all RSVPs (host only)

GET    /api/events/[slug]/calendar         → download .ics file
POST   /api/events/[slug]/wallet           → generate wallet pass

POST   /api/events/[slug]/angpao           → send angpao (public)
GET    /api/events/[slug]/angpao           → fetch angpao list (host only)
PATCH  /api/events/[slug]/angpao/[id]/thank → mark as thanked

POST   /api/events/[slug]/registry         → add registry item (host only)
GET    /api/events/[slug]/registry         → list items (public)
POST   /api/events/[slug]/registry/[id]/purchase → purchase item

POST   /api/events/[slug]/photos/upload      → upload photos
GET    /api/events/[slug]/photos             → get thumbnails (public)
POST   /api/events/[slug]/photos/unlock      → pay for full access
GET    /api/events/[slug]/photos/download    → get signed URLs
POST   /api/events/[slug]/photos/upload-link → generate photographer link
```

### Pages
```
/create              → Event creation form (host, auth required)
/[slug]              → Public event page (RSVP + angpao + registry + photos)
/[slug]/upload       → Mobile photo upload page
/dashboard/[slug]    → Host dashboard (tabs: Guests | Angpao | Registry | Photos)
```

### Auth Flow
- **Hosts:** Need Supabase Auth account to create events and access dashboard
- **Guests:** No account needed — just name + email for RSVP/angpao/purchases

---

## How To Run Locally

```bash
# 1. Clone
git clone https://github.com/reynaldusjasona/surat.git
cd surat

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Fill in Supabase credentials (ask Jason for the values)

# 4. Generate Prisma client
npm run db:generate

# 5. Run dev server
npm run dev
# Open http://localhost:3000
```

### Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=https://aifnfncjedebbuqwzaf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ask Jason>
SUPABASE_SERVICE_ROLE_KEY=<ask Jason>
DATABASE_URL=<ask Jason>
DIRECT_URL=<ask Jason>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Surat
```

---

## Key Design Decisions

1. **No real payments** — All payments (angpao, photo unlock) are simulated. Just a 1-second delay then success. We'll add Stripe later.
2. **Anonymous = stored but hidden** — Anonymous senders' identity is in the DB, but the API never returns it to the host.
3. **Photo URLs are signed** — Full-res photos use Supabase signed URLs that expire after 1 hour. Never stored permanently.
4. **Features are toggleable** — Each event has a `features_enabled` JSON field: `{ angpao: true, registry: true, photos: true }`. Sections show/hide based on this.
5. **Mobile-first** — Every page works at 375px width. Upload page is specifically designed for phone camera roll.
6. **Wallet pass fallback** — If Apple/Google pass generation fails (needs real certs), we silently fall back to .ics calendar download.

---

## What's NOT Built Yet

- [ ] Auth pages (login/signup) — currently no UI for auth, just the API middleware
- [ ] Real payment integration (Stripe/payment gateway)
- [ ] Email notifications (Resend is set up but not wired)
- [ ] Photo watermarking
- [ ] Real Apple/Google Wallet certificates
- [ ] Admin panel
- [ ] Deploy to Vercel

---

## Folder Structure
```
src/
├── app/                    → Pages & API routes
├── components/
│   ├── ui/                 → Reusable primitives (Button, Input, Card, etc.)
│   ├── events/             → Event page components
│   └── dashboard/          → Dashboard components
├── lib/
│   ├── auth/               → Supabase clients
│   ├── db/                 → Prisma client
│   ├── calendar/           → .ics generator
│   ├── wallet/             → Apple/Google pass generators
│   └── utils/              → Helpers (cn, formatCurrency, generateSlug)
└── types/                  → Zod schemas + TypeScript types

prisma/
├── schema.prisma           → Database schema (DO NOT MODIFY)
└── migrations/             → Migration history
```
