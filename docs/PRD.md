# Surat — Product Requirements Document (PRD)

**Version:** 2.0
**Last Updated:** June 2026
**Status:** Active

---

## 1. Product Vision

Surat replaces five separate event tools with one shareable link. No app download. Built for Southeast Asian events where digital angpao, photo sharing, and wallet passes are cultural essentials — not afterthoughts.

**One link. Every event need. Zero friction for guests.**

---

## 2. Problem Statement

Planning an event in Southeast Asia requires juggling:
- Google Forms for RSVP
- WhatsApp groups for coordination
- Bank transfers for angpao (no tracking)
- Separate photo sharing apps (Google Photos, Momento)
- Canva for digital invitations
- No easy way to share event to phone wallet

Each tool is disconnected. Hosts lose track. Guests get confused by multiple links. Nobody has a single view of everything.

**Surat solves this by putting everything behind one link that works instantly on any phone.**

---

## 3. Target Market

- **Primary:** Singapore & Indonesia
- **Event types:** Weddings (primary), birthdays, corporate gatherings, family events
- **Demographics:** 25-45 year olds planning life events
- **Scale:** 50-1,000 guests per event
- **Currency:** SGD (Singapore), IDR (Indonesia)

---

## 4. Actors

### 4.1 Guest (Unauthenticated)
The person who receives the event link. No account needed.

**Can do:**
- View event page
- Submit RSVP (name, email, status, plus-ones, dietary notes)
- Send digital angpao (with optional anonymity)
- Browse and purchase registry items
- View photo gallery thumbnails
- Download photos (20 free, then paid unlock)
- Add event to Apple/Google Wallet or calendar

**Cannot do:**
- Create events
- Access any dashboard
- See other guests' personal info

---

### 4.2 Host (Authenticated)
The person whose event it is. Pays per event.

**Can do:**
- Sign up with email/password or Google
- Create an event (one-time payment per event)
- Customize event page (cover image, description, feature toggles)
- View RSVP dashboard (counts, guest list, CSV export)
- View angpao received (total, list, mark as thanked)
- Manage gift registry (add/remove items)
- View photo stats (uploads, unlocks, revenue)
- Generate photographer upload link
- Share event link

**Cannot do:**
- Manage multiple events simultaneously on Free plan
- Access other hosts' events
- Manage platform settings

---

### 4.3 Event Organizer (Authenticated, Subscription)
Professional who runs events as a business. Wedding planners, corporate event managers.

**Can do:**
- Everything a Host can do
- Create unlimited events for different clients
- Manage all client events from one dashboard
- Invite team members (up to 5)
- Invite photographers with revenue share setup
- View cross-event analytics (total revenue, guest trends)
- White-label: custom domain, hide Surat branding, custom logo
- Transfer event ownership to client (Host)

**Business model:** Monthly subscription because they create events every month.

---

### 4.4 Photographer (Invited, Optional Account)
Invited by Host or Organizer to upload event photos.

**Can do:**
- Upload photos in bulk via special link (no account required)
- Create account to track earnings across multiple events
- View download stats per event
- View earnings from photo unlock revenue share (60%)
- Request payout

**Cannot do:**
- Create events
- Access guest list or angpao data
- Modify event settings

---

### 4.5 Platform Admin (Internal)
Surat team member managing the platform.

**Can do:**
- View all users, events, transactions
- Manage subscriptions and billing
- Moderate content (flag/remove inappropriate photos)
- Handle support tickets
- View platform-wide analytics
- Manage pricing and plan configurations
- Issue refunds

---

## 5. Pricing Model

### 5.1 Per-Event Pricing (Hosts)

| Plan | Price | Guests | Photos | Registry | Angpao Fee | Duration |
|------|-------|--------|--------|----------|-----------|----------|
| **Free** | SGD 0 | 50 max | 50 max | 10 items | 3% | 30 days active |
| **Standard** | SGD 19 (one-time) | 300 | 500 | Unlimited | 2% | 12 months |
| **Premium** | SGD 49 (one-time) | 1,000 | 2,000 | Unlimited | 1% | 12 months |

**Notes:**
- One-time payment per event. No recurring charge.
- "Duration" = how long the event page stays accessible after event date.
- After duration expires, host can download all data (CSV, photos) but page goes offline.
- Host can upgrade from Free → Standard mid-event (pays difference).

### 5.2 Organizer Subscription

| Plan | Price | Events | Team | Extra |
|------|-------|--------|------|-------|
| **Organizer** | SGD 79/month or SGD 699/year | Unlimited | 5 members | White-label, analytics, API |

### 5.3 Transaction-Based Revenue

| Revenue Stream | How It Works | Amount |
|---------------|--------------|--------|
| **Angpao commission** | % deducted from every angpao sent | 1-3% (plan-dependent) |
| **Photo unlock** | Guest pays to download all photos | SGD 5.99 / IDR 49,000 |
| **Photographer revenue share** | Platform keeps 40%, photographer gets 60% | Per unlock |

### 5.4 Revenue Projection (per wedding, 300 guests)

```
Event fee (Standard plan):                SGD 19
Angpao (200 guests × SGD 150 avg × 2%):  SGD 600
Photo unlocks (40 guests × SGD 5.99):    SGD 239.60
                                          ─────────
Platform revenue per wedding:             SGD 858.60
Photographer payout (60% of photos):     -SGD 143.76
                                          ─────────
Net revenue per wedding:                  SGD 714.84
```

---

## 6. Feature Specifications

### 6.1 Event Creation & Management

**Create Event Flow:**
1. Host signs up / logs in
2. Selects plan (Free / Standard / Premium) — payment for paid plans
3. Fills event details:
   - Title
   - Type (wedding / birthday / gathering / corporate / custom)
   - Date & time
   - Location + Google Maps link
   - Description
   - Cover image (upload to Supabase Storage)
   - Guest capacity
4. Toggles features on/off:
   - ☑ RSVP
   - ☑ Digital Angpao
   - ☑ Gift Registry
   - ☑ Photo Gallery
   - ☑ Wallet Pass
5. Gets shareable link: `surat.app/[slug]`

**Event Page (Public):**
- Hero section: cover image + title + type badge
- Event details: date, time, location (clickable map), description
- RSVP form
- Angpao section (if enabled)
- Registry section (if enabled)
- Photo gallery (if enabled)
- Add to Calendar / Wallet buttons

---

### 6.2 RSVP System

**Guest submits:**
- Full name
- Email
- Status: Attending / Maybe / Not Attending
- Plus-ones (add names dynamically)
- Dietary notes (allergies, vegetarian, halal, etc.)

**Host sees:**
- Count cards: attending, maybe, not attending, pending
- Full guest list table (sortable, searchable)
- CSV export
- Email notification when new RSVP arrives (Pro+)

**Rules:**
- Same email = update existing RSVP (upsert)
- Guest capacity enforced: once full, show "Event Full" message
- No auth required for guests

---

### 6.3 Digital Angpao

**Guest sends:**
- Amount (any positive number)
- Currency (SGD or IDR)
- Message (optional, max 500 chars)
- Anonymous toggle
- Sender name + email

**System:**
- Payment simulated (MVP) → real Stripe later
- Platform deducts commission (1-3% based on plan)
- Records transaction in database

**Host sees:**
- Total amount received
- List of angpao: amount, message, date
- Anonymous angpao: sees amount + message only (NEVER sees sender identity)
- "Thank" toggle per angpao

**Suggested amounts (helper text, not enforced):**
- Wedding: SGD 100-200 / IDR 500,000-1,000,000
- Birthday: no suggestion
- Corporate: SGD 50-100

---

### 6.4 Gift Registry

**Host adds items:**
- Item name
- Brand
- Price
- External product link (Shopee, Lazada, etc.)
- Image URL
- Priority (1-10)

**Guest sees:**
- Grid of items with image, name, brand, price
- Status badge: "Available" (green) / "Taken by Sarah" / "Taken" (anonymous)
- "I'll get this" button → form: name, email, anonymous toggle
- Activity feed: "Sarah is getting Dyson V15"

**Rules:**
- Item can only be purchased once (409 if taken)
- Guest buys it themselves externally — Surat just tracks who's getting what
- Anonymous purchase: host sees "Taken" but not by whom

---

### 6.5 Photo Gallery (Freemium)

**Upload:**
- Mobile-optimized upload page: `/[slug]/upload`
- Identify by name + email (no account)
- Select multiple photos, progress bar, success confirmation
- Max 10MB per photo, max 20 per batch
- Auto-generates 400px thumbnail via `sharp`
- Photographer gets special link with `?role=photographer` tag

**Gallery:**
- Uniform grid of thumbnails (public, no auth)
- Badge per photo: 📷 (photographer) or 👤 (guest)
- Lazy loading

**Downloads (Freemium):**
- First 20 downloads: FREE (tracked in localStorage)
- Counter shown: "5 of 20 free downloads used"
- After 20: paywall modal appears
- Unlock price: SGD 5.99 / IDR 49,000
- After payment: unlimited downloads + ZIP download button

**Revenue split:**
- Platform: 40%
- Photographer: 60%
- No photographer assigned: Platform gets 100%

**Technical:**
- Full-resolution URLs are signed (1-hour expiry), generated at request time
- Thumbnails are always public (CDN-served)
- ZIP generated client-side using JSZip

---

### 6.6 Wallet & Calendar Integration

**Calendar (.ics):**
- Download button on event page
- Valid .ics file: event name, date/time, location, description
- Works with Apple Calendar, Google Calendar, Outlook

**Apple Wallet:**
- Generated via `passkit-generator`
- Pass fields: event name, date, time, location, QR code (guest ID)
- Requires Apple Developer certificates (Pro+ plans only)
- Fallback: if generation fails, show calendar download instead

**Google Wallet:**
- JWT-signed pass object via Google Wallet API
- Save URL redirects to Google Wallet app
- Test mode for MVP
- Fallback: calendar download

---

### 6.7 Host Dashboard

**Tabs:**
1. **Guests** — RSVP counts, guest table, CSV export
2. **Angpao** — total received, list with thank toggle
3. **Registry** — add/manage items, view purchase status
4. **Photos** — upload stats, photographer link, unlock revenue

**Actions:**
- Copy event link
- View event page (preview)
- Export guest list CSV
- Generate photographer upload link

---

### 6.8 Organizer Dashboard (Future Phase)

- All client events in one view
- Create events on behalf of clients
- Assign photographers
- Cross-event analytics (total guests, total revenue)
- Team member management
- White-label settings

---

### 6.9 Admin Panel (Future Phase)

- User management (search, ban, delete)
- Event moderation (flag/remove)
- Transaction history
- Platform analytics (events created, revenue, growth)
- Plan/pricing configuration
- Support ticket queue

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load: < 2 seconds on 4G mobile
- API response: < 500ms (excluding simulated payment delays)
- Image thumbnails: lazy loaded, CDN-cached
- Support 1,000 concurrent guests viewing same event page

### 7.2 Security
- Auth via Supabase (JWT sessions, httpOnly cookies)
- All inputs validated with Zod (server-side)
- File uploads: type-checked (image/* only), size-limited (10MB)
- Signed URLs: 1-hour expiry, generated fresh per request
- Anonymous data: never exposed in API responses
- Rate limiting: 10 req/min on public POST endpoints
- HTTPS only

### 7.3 Privacy & Compliance
- PDPA (Singapore) compliant
- Guest data only stored in event context
- "Delete my data" option for hosts (removes all event data)
- No tracking cookies — localStorage only for download counter
- Anonymous angpao sender identity never exposed (even to host)

### 7.4 Availability
- Target: 99.9% uptime
- Deploy on Vercel (auto-scaling, edge network)
- Database on Supabase (managed PostgreSQL, daily backups)
- Storage on Supabase Storage (CDN-backed)

### 7.5 Mobile-First
- All pages responsive from 375px width
- Upload page optimized for phone camera roll
- Touch-friendly buttons (min 44px tap target)
- No hover-only interactions

---

## 8. User Flows

### 8.1 Host: Create Event & Share
```
Sign up → Choose plan → Pay (if Standard/Premium)
→ Fill event form → Toggle features → Submit
→ Get link: surat.app/jason-sarah-wedding-k3f8
→ Share via WhatsApp / email / QR code at venue
→ Monitor dashboard throughout event
→ After event: download CSV, download photos, view total angpao
```

### 8.2 Guest: Full Journey
```
Receive link → Open on phone → See event page
→ RSVP (name, email, attending, +1, dietary)
→ Add to Wallet / Calendar
→ Browse registry → "I'll get this" for Dyson V15
→ Send SGD 150 angpao with message "Congrats!"
→ At event: open surat.app/[slug]/upload → take photos → upload
→ After event: browse gallery → download 20 free
→ Want more → pay SGD 5.99 → download all as ZIP
```

### 8.3 Photographer: Upload & Earn
```
Receive upload link from host/organizer
→ Open on phone → enter name/email
→ Select 200 photos from camera roll → upload
→ Done (photos appear in guest gallery)
→ Guests pay to unlock → photographer earns 60% per unlock
→ (Optional) Create account to track earnings
```

---

## 9. Success Metrics

### Primary (North Star)
**Monthly Active Events** — events with ≥1 guest interaction in past 30 days

### Secondary
| Metric | Target (3 months) | Target (12 months) |
|--------|-------------------|---------------------|
| Events created | 200 | 2,000 |
| Paid events (Standard/Premium) | 50 | 500 |
| RSVPs submitted | 5,000 | 50,000 |
| Photo unlocks | 100 | 2,000 |
| Angpao processed (SGD) | 50,000 | 500,000 |
| Revenue (net) | SGD 10,000 | SGD 150,000 |

### Conversion Funnels
- Landing → Sign up: 15%
- Sign up → Create event: 60%
- Free → Paid upgrade: 30%
- Gallery viewer → Photo unlock: 8%
- Event page visitor → RSVP: 65%

---

## 10. Roadmap

### Phase 1 — MVP ✅ (Done)
- Event CRUD + RSVP
- Digital Angpao (simulated payment)
- Gift Registry
- Photo Gallery with freemium paywall
- Calendar + Wallet pass
- Host dashboard

### Phase 2 — Auth & Real Payments (Next)
- Login / signup pages
- Stripe integration: event plan purchase, angpao payout, photo unlock
- Per-event plan enforcement (limits on guests, photos)
- Email notifications via Resend (RSVP confirmation, angpao receipt)
- Password reset flow

### Phase 3 — Photographer & Revenue Share
- Photographer accounts
- Revenue share tracking and payout system
- Photographer earnings dashboard
- Host can assign photographer to event

### Phase 4 — Organizer & Teams
- Organizer subscription plan
- Multi-event dashboard
- Team workspace (invite members)
- Create events on behalf of clients
- White-label (custom domain, logo)

### Phase 5 — Growth & Optimization
- Landing page + SEO
- Referral program (host invites host)
- Multi-language (English, Bahasa Indonesia, Chinese)
- Event templates (pre-filled for wedding, birthday, etc.)
- AI: auto-generate event descriptions
- Mobile app for photographers (React Native)

### Phase 6 — Marketplace
- Vendor directory (photographers, florists, caterers)
- Sponsorship slots on event pages
- Premium themes/templates for event pages
- Dynamic photo pricing (based on event size)

---

## 11. Competitive Analysis

| Competitor | What They Do | Surat Advantage |
|-----------|-------------|-----------------|
| Google Forms | RSVP only | No gifts, no photos, no wallet, ugly |
| Zola / The Knot | Western wedding platform | No angpao, no IDR, not for SEA culture |
| Momento | Photo sharing | No RSVP, no registry, standalone |
| GrabGifts | Digital gifts | No event page, no RSVP, no photos |
| WhatsApp Groups | Everything informal | Unstructured, no tracking, chaos |
| Paperless Post | Digital invitations | Expensive, no angpao, no photo gallery |

**Surat's positioning:** All-in-one for SEA. One link replaces SGD 50-80/month worth of separate tools for SGD 19 one-time.

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low paid conversion | Revenue below target | Strong free tier creates habit, upgrade prompts at limits |
| Payment fraud (angpao) | Financial loss | Simulate first, add fraud detection with real payments |
| Photo storage costs | High infrastructure cost | Compress aggressively, delete after 12 months, charge per event |
| Competition from Zola entering SEA | Market share loss | Move fast, own angpao + IDR market, local partnerships |
| Cultural mismatch | Wrong pricing/features | Test in SG first, expand to ID with localization |

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **Angpao** | Red packet / monetary gift given at events (Chinese tradition common in SEA) |
| **Host** | The person whose event it is (the couple, birthday person) |
| **Slug** | URL-friendly event identifier (e.g., `jason-sarah-wedding-k3f8`) |
| **Unlock** | Guest pays to download full-resolution photos |
| **Wallet Pass** | Digital card saved to Apple Wallet or Google Wallet |
| **White-label** | Removing Surat branding, using client's own domain/logo |
