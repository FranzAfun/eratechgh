# ERA Project Desk — design system (from ERA Store)

Same look and feel as ERA Store. `era-store-tokens.reference.css` is the full ERA Store token file for
reference: copy only what this site uses into the repo's own `src/styles/tokens.css`. Light theme only for
launch (no theme toggle) — keeps the deadline; add dark later if wanted.

## Colour (light)
| Role | Value | Notes |
| --- | --- | --- |
| Primary (buttons, fills) | `#3B1174` | white on it 13.83 |
| Primary hover fill | `#2F0E5D` | white on it 15.65 |
| Primary deep (dark bands, like the prototype's "Engineering" section) | `#200940` | lilac on it 9.45 |
| Accent lilac | `#D0ADFF` | on primary 7.31 — for highlights on purple, never as text on white |
| Primary as text (links, prices) | `#3B1174` | 11.35+ |
| Page / card | `#FFFFFF` | |
| Soft section | `#F7F5F9` | |
| Strong surface (chips, selected) | `#F1EEF5` | |
| Hover surface | `#EBE7F1` | |
| Text primary | `#111111` | 15.50 |
| Text secondary | `#4B5563` | 6.20 |
| Text muted (labels, hints) | `#606877` | 4.60 — the lowest allowed |
| Control border (inputs) | `#76589E` | 4.71 — inputs need 3:1 |
| Decorative border | `#E5E7EB` | never for inputs |
| Focus ring colour | `#3B1174` | |
| Error text | `#B91C1C` | 5.31 |
| Success text | `#047857` | 4.50 |

Every new colour pair gets measured before use (AA: 4.5 words, 3 for UI and large text).

## Type
Inter, self-hosted. Fixed steps (phone → tablet → laptop):
| Step | Size | Use |
| --- | --- | --- |
| hero | 36 → 48 → 64 px, line 1.1, -0.022em | the one hero headline only |
| h1 | 28 → 32 → 40 | |
| h2 | 22 → 24 → 28 | section titles |
| h3 | 18 → 20 → 20 | card titles |
| base | 16 | body and **all inputs** (never below 16: iOS zooms) |
| sm | 14 | labels, card text |
| xs | 12 | captions only, never key info |
Weights: 400 body, 500 labels (never bold labels), 600 titles and buttons, 700 only for big numbers/prices.
**Calm and dense, not big and bold**: card titles are h3, not hero-sized.

## Shape and spacing
Corners: controls 6 px, cards 8 px, dialogs 12 px, chips/badges pill. 4 px spacing grid; field-to-field 16 px,
label-to-input 8 px, card padding 24 px (16 on phones). Content max width ~1200 px, 16 px side gutters on phones.
Layout in `dvh`, never `vh`.

## Components (rules carried over from ERA Store)
- **Buttons**: primary (filled purple), secondary (outlined), ghost, link. 44 px tall (tap target), full width on
  phones for main actions. **Filled hover**: a soft 3 px halo `rgb(124 77 204 / 25%)` appears at once, then the
  fill darkens to `#2F0E5D` after 100 ms over 150 ms `ease`; on press the halo drops. Hover only on devices
  that hover (`@media (hover: hover)`). Buttons don't lift or get shadows.
- **Busy button**: locks after one press, shows a small thinking-orbs loader + "Sending…" until the result.
- **Fields**: label always visible above (14 px, medium). **No mark on required fields**; only optional ones say
  "(optional)". Leading icon for identity fields (mail, user, phone). 44 px high, 16 px text.
  **Active state**: border turns `#3B1174` + a 3 px halo of the same colour at 20 %; error = red border + red halo.
  No outline gap on fields. Errors show under the field after leaving it or on submit; the first error gets focus
  and the field shakes once.
- **Dropdowns**: custom (never native `<select>`); opening a list never focuses its search box.
- **Keyboard focus** on buttons/links: 2 px ring, 3 px offset, keyboard only (`:focus-visible`).
- **Words**: plain, sentence case, never system names or codes. Long explanations behind an ⓘ or "Read more".
- **Empty/loading/error**: every state designed; skeletons, not spinners, for content.

## Motion
150 ms hover/press, 250 ms open, 400 ms panels, 800 ms scroll reveals; ease `cubic-bezier(0.22, 1, 0.36, 1)`.
Soft and purposeful. `prefers-reduced-motion`: no movement, fades only. GSAP only for the hero, loaded lazily.

## Images and icons
lucide-react only (one icon set). Images WebP/AVIF with fixed width/height (no layout shift), ≤ 400 KB.
Never use stock photos as ERA Tech work (the prototype's "reserved" slots stay until real photos arrive).

## Logos
- **ERA Tech** (the site's own name): no logo files yet — use a clean text wordmark "ERA Tech · Project Desk"
  (Inter, semibold) until a designer delivers one. Don't draw a logo.
- **ERA Store** (for the "coming soon" section): files in `era-store-logo/`, used unchanged.
  On white use the purple files; on purple use the white files. Two-line "wide" logo only at 80 px tall or more;
  "compact" for 24–79 px; symbol alone ≥ 16 px. Accessible name "ERA Store".
