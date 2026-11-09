# ERA Tech Project Desk — brief

**What:** a small public site at the root of eratechgh.com. Students, makers and innovators in Ghana pick a
service and send one request form. A Netlify Function emails the ERA Tech team and sends the visitor a short
confirmation. The team handles everything else by email or phone.
**Live:** Wed 11 Nov 2026 (Fri 13 Nov at the latest). **Name on the site:** ERA Tech (never ERA AXIS).
**Source of content:** Ransford's mock (content and flow only, never its code) + this brief.

## Pages (stable URLs)
| URL | What |
| --- | --- |
| `/` | Home, sections below |
| `/request` | Request form; service picker shown first |
| `/request/sourcing`, `/request/assessment`, `/request/consultation` | Same form with that service already picked (shareable). Changing the picker updates the URL. |
| 404 | Short message + links to `/` and `/request` |
| Privacy | External link to the eraaxis.com privacy policy (URL to confirm) |

No Terms page unless ERA supplies the text. All pages prerendered to static HTML.

## Home sections (in order)
1. **Header:** wordmark "ERA Tech · Project Desk" (text, no logo). Nav: Services, Design, Our work*, How it works, FAQ. Button "Start a request" → `/request`.
2. **Hero:** headline + one paragraph. Buttons "Source components" → `/request/sourcing`, "Book a consultation" → `/request/consultation`. Line: "Built for students, makers and innovators in Ghana". Decorative request-card visual (no fake data).
3. **Services:** three cards, each with what you get, 3 steps, price, button to its request URL.
   - Component sourcing — **Free quote**. Parts and delivery paid only after you approve the itemised quote.
   - Project assessment (featured) — **GH₵50**. We review the idea, recommend parts and quote them. Fee does not cover parts or full design.
   - Expert consultation — **GH₵250**. Note: did an assessment and bought the parts through us? Ask for 70 % off → **GH₵75** (we check eligibility).
   - Struck-through "was" prices (GH₵150 / GH₵500) only if ERA Tech has proof they were real prices. Default: price alone.
4. **Design capabilities** (dark band `#200940`): four tiles — Electronics & PCB, 3D CAD & product design, IoT & connected systems, Automation & prototyping. Each tile captioned "Illustration — not a client project". Footer line: detailed design and fabrication are quoted separately.
5. **Our work\*:** real, approved photos only, from one data file. *Hidden (with its nav link) until at least 3 real photos exist.* No stock, no placeholders on the live site.
6. **How it works:** 1 Tell us what you're building → 2 We confirm the next step (quote, payment, time) → 3 Get your parts or your session.
7. **ERA Store — coming soon:** ERA Store logo (purple file on white). Will offer [confirm each]: electronic components and modules, Build Packs, ERA Dev Board, delivery across Ghana and pickup, Mobile Money and card. Line: "Want to know when it opens? Tick the box when you send a request."
8. **FAQ:** free quote? / what GH₵50 covers / how the 70 % works / is my consultation booked when I submit? (no — the team confirms time and payment) / does consultation include CAD, PCB or a prototype? (no — quoted separately) / is delivery included? (quoted with your parts) / how will you contact me? (email, phone or WhatsApp from the team).
9. **Closing band:** one line + two buttons (same as hero).
10. **Footer:** ERA Tech, nav links, Privacy, team email [to confirm], © year ERA Tech.

## Request form
Order: service picker → service fields → your details → extras → check → send.

**Your details (every service)**
| Field | Rules |
| --- | --- |
| Full name | 2–80 chars, letters/spaces/'-. only |
| Email | valid, ≤ 254 |
| Phone / WhatsApp | 9–20 chars, digits, spaces, + only |
| Town or city | 2–80 chars |

**Sourcing:** Components and quantities (textarea, 10–5,000) · Needed by (date, optional, today or later).
**Assessment:** Project title (3–120) · Project area (optional dropdown: IoT & embedded, Robotics & automation, Electronics, Energy & power, Other) · What should it do? (optional, ≤ 1,000). Info note: we send GH₵50 payment details first, then ask for your full abstract.
**Consultation:** Project title (3–120) · Project abstract (50–5,000) · What guidance do you need most? (10–1,500) · Preferred date (tomorrow or later) · Preferred time (dropdown: Morning 9–12, Afternoon 12–4, Evening 4–7) · Tick box "I did an ERA Tech assessment and bought the parts through ERA Tech — I'd like to ask for 70 % off". Price line shows GH₵250, or "GH₵75 if eligible" when ticked. Note: nothing is booked until the team confirms.

**Extras (every service):** "Tell me when ERA Store opens" (optional, unticked).
**Under the button:** "We use these details only to reply to your request. Privacy policy."
**Hidden:** honeypot field, form start time, Turnstile token. Whole request ≤ 20 KB; unknown fields rejected.
Validated in the browser and again in the function with the same shared rules.

## The function (`POST /api/request`)
Per-IP rate limit (Netlify config) → size check → honeypot empty → filled in ≥ 4 s → Turnstile verified
(success + hostname) → validate → email team → email visitor. Makes a reference like `PD-7K3QX2` for both emails.
Stores nothing. If the team email fails, the visitor sees an error. If only the confirmation fails, it still counts as sent (logged).

## Emails (plain text)
**To the team** — From "ERA Tech Project Desk" <sending mailbox>, To TEAM_INBOX, Reply-To the visitor.
Subject: `[Project Desk] Consultation — Ama Mensah — PD-7K3QX2`
Body: reference, service, shown price (and "70 % requested — check eligibility" if ticked), every field, ERA Store yes/no, time sent (GMT).

**To the visitor** — From the sending mailbox, Reply-To TEAM_INBOX.
Subject: `We got your request — ERA Tech (PD-7K3QX2)`
Body: Hi {first name}, thanks — we received your {service} request. What happens next (one line per service:
itemised quote / GH₵50 payment details, then your abstract / we confirm a time and payment — nothing is booked
yet). Reply to this email to add details or photos. — ERA Tech team.
**Never repeats the visitor's own text** (only first name and service), so the form can't be used to spam others.

## States
- **Sending:** button locks, thinking-orbs + "Sending…".
- **Sent:** form replaced by "Request sent", the reference, "We've emailed a copy to {email} — check spam if it's not there in a few minutes", button "Send another request". Focus moves to the heading.
- **Field errors:** under the field after leaving it or on send; first error focused and shakes once.
- **Check failed (Turnstile):** "Please complete the check and try again."
- **Too many tries (429):** "Too many requests from your connection. Wait a minute and try again."
- **Server or network error:** "We couldn't send your request. Your details are still here — try again, or email {team email}." Form keeps all values.

## Out of scope (launch)
Payments, booking calendar, accounts, dashboard, database or stored submissions, file uploads (visitors reply
to the email instead), WhatsApp share flow, EDOS or ERA Store integration, mailing list, analytics, dark theme,
CMS/blog, Terms page, chat widget, other languages.

## Open items (from ERA, before launch)
Team inbox address · sending mailbox + SMTP login · privacy policy URL (does it cover this site?) · proof for
"was" prices or drop them · ERA Store offer list confirmed · real photos (optional) · contact email for the footer.
