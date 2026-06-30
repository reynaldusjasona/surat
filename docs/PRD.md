# Surat — Product Requirements Document (PRD)

**Version:** 3.0
**Last Updated:** June 2026
**Status:** Active
**Platform:** Web application (mobile-responsive microsite)

---

## 1. Product Vision

Surat replaces five separate event tools with one shareable link. No app download. Built as a **mobile-responsive web application (microsite)** using Next.js and Tailwind CSS, optimized for Southeast Asian events where digital angpao, photo sharing, and wallet passes are cultural essentials.

**One link. Every event need. Zero friction for guests.**

---

## 2. Platform Definition

### What Surat IS:
- A **web application** (not a native mobile app)
- A **microsite generator** — each event gets its own shareable URL that works as a self-contained mini-website
- **Mobile-responsive** — designed mobile-first with Tailwind CSS, works perfectly on any phone browser
- Deployed on **Vercel** as a single Next.js application
- The event page (`surat.app/[slug]`) is the core product — a complete microsite guests interact with

### What Surat is NOT:
- Not a native iOS/Android app (no App Store download)
- Not a desktop-first application
- Not a page builder (events follow a consistent, polished template)

### Technical Platform:
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS 3 (custom design system, mobile-first) |
| UI | Custom components (card, badge, button, input) — styled with Surat brand |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Supabase Auth (email/password) |
| File Storage | Supabase Storage (photos, covers) |
| Image Processing | Sharp (server-side thumbnails) |
| Validation | Zod (all inputs, always) |
| Deploy | Vercel (edge network, auto-scaling) |
| Domain | surat.app (or custom domain per organizer) |

### Design System:
- **Brand colors:** Surat Red (#DC2626), Beige (#FAF7F2), Off-white (#FAFAF8)
- **Typography:** Playfair Display (serif, headings), Inter (sans, body)
- **Components:** Cards with subtle shadows, badges, rounded inputs, warm neutral palette
- **Mobile-first:** Every component starts at 375px viewport, scales up
- **Touch-friendly:** Minimum 44px tap targets, large CTAs
- **No horizontal scroll** on any page at any breakpoint

---

## 3. Problem Statement

Planning an event in Southeast Asia requires juggling:
- Google Forms for RSVP
- WhatsApp groups for coordination
- Bank transfers for angpao (no tracking)
- Separate photo sharing apps
- Canva for digital invitations
- No easy way to save event to phone wallet

Each tool is disconnected. Hosts lose track. Guests get confused by multiple links.

**Surat solves this with a single shareable URL that works instantly on any phone browser — no download, no signup for guests.**

---

## 4. Target Market

- **Primary:** Singapore & Indonesia
- **Event types:** Weddings (primary), birthdays, corporate gatherings, family events
- **Demographics:** 25-45 year olds planning life events
- **Scale:** 50-1,000 guests per event
- **Currency:** SGD (Singapore), IDR (Indonesia)
- **Device:** 80% mobile (guests receive link via WhatsApp), 20% desktop (hosts manage dashboard)

---

## 5. Actors

### 5.1 Guest (Unauthenticated)
The person who receives the event link. No account needed. Interacts entirely via the event microsite.

**Can do:**
- View event microsite (`/[slug]`)
- Submit RSVP (name, email, status, plus-ones, dietary notes)
- Send digital angpao (amount, currency, message, anonymous toggle)
- Browse and claim registry items
- View photo gallery thumbnails
- Download photos (20 free, then paid unlock)
- Upload photos (`/[slug]/upload`)
- Add event to Apple/Google Wallet or calendar

**Cannot do:**
- Create events
- Access any dashboard
- See other guests' personal info

---

### 5.2 Host (Authenticated)
The person whose event it is. Signs up, pays per event, manages via dashboard.

**Dashboard:** `/host` (role-based, behind auth)

**Can do:**
- Sign up / login (email + password)
- Create event (one-time payment per event)
- Customize event microsite (cover, description, feature toggles)
- View & manage RSVP list (counts, table, CSV export)
- View angpao received (total, list, mark as thanked)
- Manage gift registry (add/remove items)
- View photo stats (uploads, unlocks, revenue)
- Generate & share photographer upload link
- Copy & share event link

**Dashboard sections:**
- My Events (list of all events, upcoming/past)
- Event Detail → tabs: Guests | Angpao | Registry | Photos

---

### 5.3 Event Organizer (Authenticated, Subscription)
Professional who manages events as a business (wedding planner, corporate event manager).

**Dashboard:** `/organizer` (role-based, behind auth)

**Can do:**
- Everything a Host can do
- Create unlimited events for different clients
- Manage all client events from one dashboard
- Invite team members (up to 5)
- Assign photographers to events with revenue share
- View cross-event analytics (total guests, revenue, trends)
- White-label: hide Surat branding, use custom logo
- Transfer event ownership to client (Host)

---

### 5.4 Photographer (Invited or Authenticated)
Uploads event photos. Can be invited (link only) or have own account.

**Dashboard:** `/photographer` (role-based, behind auth — optional)

**Can do:**
- Upload photos in bulk via special link (no account required)
- (If account) Track earnings across multiple events
- View download stats per event
- View revenue share from photo unlock fees (60%)

---

### 5.5 Platform Admin (Internal)
Surat team member managing the platform.

**Dashboard:** `/admin` (role-based, behind auth)

**Can do:**
- View all users, events, transactions
- Moderate content (flag/remove photos, events)
- Handle support cases
- View platform-wide analytics
- Manage pricing/plan configurations
- Issue refunds

---

## 6. Pricing Model

### 6.1 Per-Event Pricing (Hosts)

| Plan | Price | Guests | Photos | Registry | Angpao Fee | Duration |
|------|-------|--------|--------|----------|-----------|----------|
| **Free** | SGD 0 | 50 max | 50 max | 10 items | 3% | 30 days after event |
| **Standard** | SGD 19 (one-time) | 300 | 500 | Unlimited | 2% | 12 months |
| **Premium** | SGD 49 (one-time) | 1,000 | 2,000 | Unlimited | 1% | 12 months |

**Key points:**
- One-time payment per event. NOT a subscription.
- "Duration" = how long data stays accessible after event date.
- After expiry: host can export data, page goes offline.
- Can upgrade mid-event (pay difference).

### 6.2 Organizer Subscription (Monthly)

| Plan | Price | Events | Team | Extra |
|------|-------|--------|------|-------|
| **Organizer** | SGD 79/month or SGD 699/year | Unlimited | 5 members | White-label, analytics, API |

This is the ONLY recurring subscription — for professionals who create events every month.

### 6.3 Transaction Revenue

| Stream | How It Works | Amount |
|--------|--------------|--------|
| **Angpao commission** | % deducted from every angpao | 1-3% (by plan) |
| **Photo unlock** | Guest pays to download all photos | SGD 5.99 / IDR 49,000 |
| **Photographer share** | Platform keeps 40%, photographer 60% | Per unlock |

### 6.4 Revenue per Wedding (300 guests)
```
Event fee (Standard):                      SGD   19
Angpao (200 guests × SGD 150 avg × 2%):   SGD  600
Photo unlocks (40 guests × SGD 5.99):     SGD  240
                                           ─────────
Gross revenue:                             SGD  859
Photographer payout (60% of photos):      -SGD  144
                                           ─────────
Net revenue per wedding:                   SGD  715
```

---

## 7. Feature Specifications

### 7.1 Event Microsite (`/[slug]`)

The core product. A single-page microsite generated per event. Mobile-first, loads fast, works without JavaScript for initial render (SSR).

**Layout (top to bottom):**
1. **Hero** — Full-width cover image with title overlay, type badge, host name
2. **Details card** — Date, time, location (clickable maps link), description
3. **RSVP section** — Form: name, email, status selector, plus-ones, dietary notes
4. **Post-RSVP actions** — Add to Calendar, Add to Wallet buttons (shown after RSVP)
5. **Angpao section** (if enabled) — Amount, currency, sender info, anonymous toggle, message
6. **Registry section** (if enabled) — Item grid, "I'll get this" buttons, activity feed
7. **Photo gallery** (if enabled) — Thumbnail grid, download counter, paywall, upload button

**Responsive breakpoints:**
- 375px (mobile, primary)
- 640px (large phone / small tablet)
- 1024px (desktop, max-width container)

---

### 7.2 Upload Page (`/[slug]/upload`)

Dedicated mobile-optimized page for photo uploads. Designed specifically for the "at the event, phone in hand" use case.

**Flow:**
1. Identify: name + email form
2. Select: tap to open camera roll (multi-select)
3. Preview: grid of selected photos
4. Upload: progress bar, count
5. Done: success message, "Upload more" or "Done" buttons

**Tech:** multipart/form-data, max 10MB/file, max 20/batch, sharp for thumbnails.

---

### 7.3 Host Dashboard (`/host`)

Role-gated area for event management. Responsive but optimized for both mobile and desktop.

**Pages:**
- `/host` — Event list (upcoming/past, create button)
- `/host/events/new` — Create event form
- `/host/events/[slug]` — Event detail with tabs: Guests | Angpao | Registry | Photos

**Components:**
- Sidebar (desktop) / bottom nav or hamburger (mobile)
- Topbar with user info
- Stats cards, data tables, forms

---

### 7.4 Auth Flow

**Pages:**
- `/login` — Email + password, link to signup
- `/signup` — Email, password, full name, role selection

**After signup:**
- Profile created in `profiles` table
- Redirected to role-appropriate dashboard (`/host`, `/organizer`, `/photographer`, `/admin`)

**Session:**
- Supabase Auth with `@supabase/ssr` (cookie-based sessions)
- Middleware refreshes session on every request
- Unauthenticated access to `/[slug]` (event page) always allowed

---

## 8. Page Map (All Routes)

### Public (no auth):
```
/                          → Landing page
/login                     → Login form
/signup                    → Signup form
/[slug]                    → Event microsite (core product)
/[slug]/upload             → Photo upload page (mobile-optimized)
```

### Authenticated (role-based):
```
/host                      → Host event list
/host/events/new           → Create event form
/host/events/[slug]        → Event management (tabs)

/organizer                 → Organizer dashboard (multi-event)
/photographer              → Photographer earnings & stats
/admin                     → Platform admin panel
```

### API:
```
POST   /api/auth/signup               → Create account + profile
POST   /api/auth/login                → (handled by Supabase client)
POST   /api/auth/logout               → Sign out

POST   /api/events                    → Create event
GET    /api/events/[slug]             → Get event (public)
PATCH  /api/events/[slug]             → Update event (host only)

POST   /api/events/[slug]/rsvp        → Submit RSVP
GET    /api/events/[slug]/rsvp        → Get RSVPs (host only)

GET    /api/events/[slug]/calendar    → Download .ics

POST   /api/events/[slug]/angpao      → Send angpao
GET    /api/events/[slug]/angpao      → Get angpao list (host only)
PATCH  /api/events/[slug]/angpao/[id]/thank → Mark thanked

POST   /api/events/[slug]/registry           → Add item (host)
GET    /api/events/[slug]/registry           → List items (public)
POST   /api/events/[slug]/registry/[id]/claim → Claim item (guest)
DELETE /api/events/[slug]/registry/[id]       → Delete item (host)

POST   /api/events/[slug]/photos/upload      → Upload photos
GET    /api/events/[slug]/photos             → Get thumbnails
POST   /api/events/[slug]/photos/unlock      → Pay for full access
GET    /api/events/[slug]/photos/download    → Get signed URLs
POST   /api/events/[slug]/photos/upload-link → Get photographer link

POST   /api/events/[slug]/wallet      → Generate wallet pass
```

---

## 9. Non-Functional Requirements

### Performance
- First Contentful Paint: < 1.5s on 4G
- Event microsite fully interactive: < 3s on 3G
- API response: < 500ms
- Images: lazy loaded, WebP where supported, CDN-cached

### Mobile-First Design Rules
- All layouts start at 375px width
- No horizontal scroll on any page
- Touch targets: minimum 44×44px
- Form inputs: minimum 16px font size (prevents iOS zoom)
- Buttons: full-width on mobile, inline on desktop
- Tables: horizontal scroll wrapper or card layout on mobile
- Images: responsive with aspect-ratio preservation

### Security
- Auth: Supabase JWT sessions (httpOnly cookies)
- Validation: Zod on every input (server-side)
- File uploads: image/* only, ≤10MB, validated server-side
- Signed URLs: 1-hour expiry, generated per request
- Anonymous angpao: sender identity NEVER in API response
- Rate limiting: 10 req/min on public POST endpoints
- HTTPS only (enforced by Vercel)

### Privacy (PDPA Singapore)
- Guest data stored only in event context
- "Delete my data" option for hosts
- No tracking cookies
- localStorage only for download counter (no PII)

---

## 10. Design System Details

### Color Palette
```
Primary:     Surat Red     #DC2626 (CTAs, brand, accent)
Background:  Off-white     #FAFAF8 (page background)
Surface:     White         #FFFFFF (cards)
Warm BG:     Beige-50      #FDFCFA (auth pages)
Text:        Neutral-900   #171717 (headings)
Body:        Neutral-600   #525252 (body text)
Muted:       Neutral-400   #A3A3A3 (helper text)
Border:      Neutral-200   #E5E5E5 (card borders)
Success:     Green         #16A34A
Warning:     Yellow        #CA8A04
Error:       Red           #DC2626
```

### Typography
```
Headings:  Playfair Display (serif) — 2xl page titles, lg card titles
Body:      Inter (sans-serif) — sm-base for all body copy
Mono:      System monospace — code snippets only
```

### Component Patterns
```
.card       → white bg, rounded-xl, border neutral-200, shadow-card
.card-hover → card + hover:shadow-card-hover transition
.btn-primary → surat-red-500 bg, white text, rounded-lg, h-10/h-12
.btn-secondary → white bg, neutral border, neutral text
.btn-ghost  → transparent bg, neutral text, hover:bg
.badge      → rounded-full, px-2.5 py-0.5, text-xs font-medium
.input      → rounded-lg, border neutral-200, h-10, focus:ring-red
.label      → text-sm font-medium neutral-700
```

### Responsive Strategy
```
Mobile (375px):   Single column, full-width cards, stacked layout
Tablet (640px):   2-column grids, side padding increases
Desktop (1024px): Max-width container (1200px), sidebar layout for dashboard
```

---

## 11. User Flows

### Guest: Receive Link → Complete Interaction (2 minutes)
```
1. Get WhatsApp message with surat.app/[slug] link
2. Tap → event microsite loads (< 2s)
3. See cover image, event title, date/location
4. Scroll to RSVP → fill name, email, "Attending", +1 → submit
5. See confirmation + "Add to Wallet" / "Add to Calendar"
6. Scroll down → see angpao section → send SGD 150
7. See registry → "I'll get this" on Dyson V15
8. Done in under 2 minutes, zero account creation
```

### Host: Create Event → Share (5 minutes)
```
1. Go to surat.app → "Create Event" → signup (if new)
2. Choose plan: Standard (SGD 19) → pay
3. Fill: title, type (wedding), date, location, maps link, description
4. Upload cover image
5. Toggle features: ☑ RSVP ☑ Angpao ☑ Registry ☑ Photos
6. Submit → get link: surat.app/jason-sarah-wedding-k3f8
7. Share via WhatsApp / email / print QR code
8. Monitor dashboard: /host/events/jason-sarah-wedding-k3f8
```

---

## 12. Roadmap

### Phase 1 — MVP ✅ (Current State)
- [x] Event microsite (`/[slug]`) — full functionality
- [x] RSVP system (submit + host dashboard)
- [x] Digital Angpao (send, view, thank)
- [x] Gift Registry (add items, claim, activity feed)
- [x] Photo Gallery (upload, thumbnails, paywall, ZIP download)
- [x] Calendar .ics download
- [x] Wallet pass generation (Apple + Google, with fallback)
- [x] Auth: login + signup pages
- [x] Role-based dashboards (host, organizer, photographer, admin)
- [x] Custom Tailwind design system (Surat brand)
- [x] Mobile-responsive layout throughout

### Phase 2 — Polish & Real Payments (Next)
- [ ] Stripe integration (event plan purchase, angpao payout, photo unlock)
- [ ] Per-event plan enforcement (guest/photo limits)
- [ ] Email notifications via Resend (RSVP confirmation, angpao receipt)
- [ ] Landing page (surat.app/) with feature showcase
- [ ] Password reset flow
- [ ] Image optimization (WebP conversion, progressive loading)
- [ ] SEO: meta tags, Open Graph for event pages

### Phase 3 — Organizer & Photographer Monetization
- [ ] Organizer workspace (multi-event dashboard)
- [ ] Photographer earnings tracking + payout
- [ ] Revenue share logic
- [ ] Team invitations
- [ ] White-label (custom logo, remove Surat branding)

### Phase 4 — Growth
- [ ] Referral program
- [ ] Multi-language (EN, Bahasa Indonesia, Chinese)
- [ ] Event templates (pre-filled for wedding, birthday, etc.)
- [ ] Custom domains for organizers
- [ ] Analytics dashboard (cross-event trends)

---

## 13. Success Metrics

### North Star
**Monthly Active Events** — events with ≥1 guest interaction in past 30 days

### Key Metrics (3-month targets)
| Metric | Target |
|--------|--------|
| Events created | 200 |
| Paid events | 50 |
| RSVPs submitted | 5,000 |
| Photo unlocks | 100 |
| Angpao processed | SGD 50,000 |
| Net revenue | SGD 10,000 |

### Conversion Targets
- Event page visitor → RSVP: 65%
- Gallery viewer → Photo unlock: 8%
- Free → Paid upgrade: 30%
- Signup → Create event: 60%

---

## 14. Competitive Positioning

**Surat = All-in-one event microsite for SEA**

One shareable link replaces:
- Google Forms (RSVP) — SGD 0
- Canva Pro (invitations) — SGD 13/mo
- Momento (photos) — SGD 8/event
- GrabGifts (angpao) — 3-5% fee
- RSVPify (guest management) — USD 19/mo

**Surat Standard at SGD 19 one-time replaces SGD 50+/month of separate tools.**

---

## 15. Glossary

| Term | Definition |
|------|-----------|
| **Microsite** | A small, self-contained website for a specific event — accessed via a single URL |
| **Angpao** | Red packet / monetary gift (Chinese tradition, common in SEA) |
| **Host** | Person whose event it is (couple, birthday person) |
| **Slug** | URL-friendly identifier (e.g., `jason-sarah-wedding-k3f8`) |
| **Unlock** | Guest pays to access full-resolution photos |
| **Wallet Pass** | Digital card saved to Apple Wallet or Google Wallet |
| **White-label** | Removing Surat branding, using client's own identity |
| **Claim** | Guest marks a registry item as "I'll get this" |
