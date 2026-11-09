# Design direction v2 — ERA Tech (9 Nov 2026)

v1 works but looks plain. v2 goal: **captivating and premium, dark-led like eraaxis.com, but our own.**
Minimal never means plain. Take the _ideas_ below; don't copy eraaxis.com's code, text, stats or branding.

Still applies from DESIGN-SYSTEM.md: tokens, Inter, 16 px inputs, 44 px controls, corners 6/8/12, 4 px grid,
keyboard focus, AA contrast **measured**, reduced motion, lucide-react only, custom dropdowns.
Overridden here: hero, header, footer and closing band are **dark**; light sections in between.

## Dark palette (ERA brand family)

| Role                                                                                                    | Value                                                       | Notes                                                                                      |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Background dark                                                                                         | `#040108`                                                   | hero, footer                                                                               |
| Surface dark                                                                                            | `#090311`                                                   | glass base, drawer                                                                         |
| Deep                                                                                                    | `#200940`                                                   | design band, theme-color                                                                   |
| Primary / dark                                                                                          | `#3B1174` / `#2F0E5D`                                       |                                                                                            |
| Lilac accent                                                                                            | `#D0ADFF`                                                   | 10.96 on bg-dark, 9.45 on deep, 7.31 on primary. Highlights, active links, eyebrow on dark |
| Text on dark                                                                                            | `#FFFFFF`                                                   | headings                                                                                   |
| Muted on dark                                                                                           | `#EBE7F1`                                                   | body/small text on dark. Don't use translucent white for small text unless measured ≥ 4.5  |
| Header glass                                                                                            | `rgba(9,3,17,.80)` + `blur(14px)`, bottom border lilac 14 % | solid fallback without backdrop-filter                                                     |
| Add `pnpm check:contrast` (small Node script measuring every token pair used, fails < 4.5 text / 3 UI). |

## 1. Header

- Fixed. On `/` it is **transparent over the dark hero**, turns to glass after 24 px of scroll. On every other page it is glass from the top.
- Left: wordmark "ERA Tech" (semibold) + small "Project Desk" label. Text only, no drawn logo.
- Desktop links: white 82 % → white on hover, active = lilac. Right: "Start a request" — glass button over the hero, filled primary with a 1 px lilac border once glass.

## 2. Mobile menu (drawer)

- Right-side drawer, 86 % wide (max 384 px), over a dark blurred scrim. Rendered in a portal.
- Slides in 260 ms `cubic-bezier(.32,.72,0,1)`, out 200 ms; stays mounted while closing.
- Top: wordmark + round close button. Links as rows: icon tile (lucide) + label + chevron; active row lilac.
- Bottom: full-width "Start a request" + "© year ERA Tech".
- Focus goes to close button, Tab trapped, Esc and scrim click close, body scroll locked (position kept), focus returns to the menu button, closes on any navigation incl. browser back. Reduced motion: no slide.

## 3. Hero (dark, home)

- First screen on desktop (`min-h-[100dvh]`, header overlaps). Ground: `#040108` + soft primary radial glow behind the visual + a faint 26 px dot grid (breadboard) masked to fade out.
- Left: eyebrow pill (lilac 10 % fill, lilac 30 % border, `#EBE7F1` text) → headline (hero step) → one paragraph → two CTAs (white filled primary + glass secondary) → a row of 3 true facts from the brief (e.g. "Free sourcing quotes", "Assessments GH₵50", "Expert consultations"). No invented stats.
- Right: **our own living visual** (original SVG, not the eraaxis chip): a PCB with a microcontroller, sensor and LED linked by traces; light pulses run along some traces and light the LEDs; a glass card "Your parts list → Quote ready" (3 part rows) overlaps a corner. Pauses off-screen, static with reduced motion, `aria-hidden`.
- Phones: the visual sits behind the text at ~30 % opacity (or smaller under the CTAs) — no cramped first screen.
- Words fade up once on load (750 ms).

## 4. Light sections

- Alternate white / `#F7F5F9`; one section may use a soft glow (lilac 30 % radial top-left, primary 16 % radial bottom-right).
- Section heading: eyebrow (xs, uppercase, tracking, primary) + h2 + short lead.
- **Services:** 3 equal-height cards, CTA pinned to the bottom. Assessment card featured: 2 px primary border + "Good place to start" badge. Price large (700). Hover: border to primary + soft shadow (no lift).
- **Design capabilities:** dark band (`#200940` → `#040108`, faint grid). 4 glass tiles (white 6 % fill, white 12 % border), illustrations with a subtle trace-draw animation, captions kept ("Illustration — not a client project").
- **How it works:** 3 numbered nodes joined by a line (horizontal on desktop, vertical on phones).
- **ERA Store — coming soon:** split card: left = ERA Store logo, "Coming soon" badge, feature list with icons; right = the **real ERA Dev Board photo** (`design-system/assets/dev-board-*.webp`) on a soft lilac glow.
- **FAQ:** accordion, 250 ms height animation, plus/minus icon.
- **Closing band:** purple gradient (135°: `#200940` → `#3B1174` 55 % → `#2F0E5D`) with a soft lilac glow at top centre; centred heading + two on-dark buttons.

## 5. Footer (dark)

- `#040108`, top border white 7 %. Desktop 4 columns, tablet 2, phone 1.
- Brand (wordmark + one line about ERA Tech) · Services (3 links to `/request/<service>`) · Site (Services, Design, How it works, ERA Store, FAQ, Start a request) · Contact (team email if set; otherwise a link to the request form).
- Column headings: xs uppercase, lilac. Links `#EBE7F1`, hover lilac.
- Bottom bar: "© year ERA Tech. All rights reserved." · "Privacy policy" → https://eraaxis.com/privacy (new tab).

## 6. Request page

- Short dark page-header band (same ground as the hero): title + one line.
- Form card (white, 8 px) overlaps the band by ~48 px. Service picker = 3 selectable cards (icon, name, price), not tabs.
- Desktop: a sticky side card "What happens next" + price for the picked service. Phones: it sits above the send button, compact.

## 7. Consent (required)

- Checkbox above the button: "I agree to ERA Tech using these details to reply to my request, as described in the privacy policy." Link → https://eraaxis.com/privacy (new tab, `rel="noopener"`).
- Send button looks disabled until ticked, but uses `aria-disabled` (stays focusable). Hint under it: "Tick the privacy box to send." Pressing it unticked → focus the checkbox and show its error.
- The function also requires `consent: true` (shared rules); team email shows "Consent: yes".

## 8. Motion

Scroll reveals: fade + 12 px rise, 800 ms, `cubic-bezier(.22,1,.36,1)`, once (IntersectionObserver), 80 ms stagger in grids.
Plus hero entrance, drawer, accordion, hero pulses. Reduced motion: no movement. No GSAP.

## 9. Favicon and head

- `design-system/assets/favicon.ico` + `favicon.png` (the ERA "E") as fallbacks.
- New `favicon.svg` drawn from the E (units 536 × 662): rects (0,0,420,98) and (0,0,98,600) in primary; (98,300,290,86) in lilac; (0,562,430,100, rx 46) and (455,562,81,100) in primary 70 %. Dark-scheme variant swaps primary for white.
- 180 px apple-touch-icon: white E on `#3B1174`. theme-color `#200940`.

## Never

"ERA AXIS" anywhere · eraaxis.com stats or text · stock photos · drawn logos · fake proof.

## Quality bar

Check 360, 390, 768, 1024, 1280, 1440 px. No horizontal scroll, no cramped first screen, no text over busy art,
every dark pair measured. If something can't be done well, ship it simple and clean and log it in STATUS.md.
