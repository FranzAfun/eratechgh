# Decisions

## 2026-11-09 — HTML email alternatives, local previews and sharing

- Preserve both current plain-text bodies and add nodemailer's `html` field, yielding
  `multipart/alternative`. Use inline styles, tables, a 600 px maximum, existing colour tokens and no
  external images/fonts/tracking. Explicit light surfaces and text colours keep the design legible
  in clients that honour them; inbox testing is still needed for client-specific dark-mode changes.
- Escape every dynamic HTML value, including hidden preheaders. Shared email validation must pass
  before any visitor address becomes a link; URI-encode the address and reply subject. Double-quoted
  addresses remain invalid under the existing shared rules. Both subjects strip control characters.
- Local previews contain only fictional placeholders, send nothing and live in the ignored
  `.email-previews/` directory. Receiving is forwarded via ImprovMX to the team inbox; the forwarding
  destination is never documented. SMTP credentials and all environment values stay out of the repo.
- The approved share image is an original SVG design rendered by pinned `@resvg/resvg-js` with
  Fontsource Inter; pinned `wawoff2` decodes its WOFF2 to a temporary TTF. `pnpm og:image` is manual,
  never a build hook. Commit `public/og.png`; do not commit preview HTML or screenshots.
- `siteBaseUrl` is the production origin; `pageMeta` owns all shared metadata. Canonicals and Open
  Graph URLs omit trailing slashes, queries and fragments. Both prerendered 404 files have noindex
  and no canonical. The sitemap lists exactly the five public routes.
- SEO integration tests read actual `build/client` HTML, so run `pnpm build` before `pnpm test`.
- Repair the contrast script's Windows entry-point check so `pnpm check:contrast` actually measures
  and reports every pair on this platform.
- Keep this branch local until the owner has reviewed the email HTML files and committed share
  image; push and open the single PR afterwards. No merge is authorised.

Newest last. Each entry: date — decision — why/notes.

## 2026-11-09 — Rendering

React Router 7 in framework mode with `ssr: false`; every page is prerendered to static HTML and served
by Netlify, plus one Netlify Function for the form. JavaScript, no TypeScript.

## 2026-11-09 — Email

SMTP via nodemailer from one ERA sending mailbox; credentials live in Netlify environment variables only.
Fallback if SMTP is a problem: Resend.

## 2026-11-09 — Bot protection

Cloudflare Turnstile (Managed) verified in the function + honeypot field + minimum fill time (soft) +
field size limits + Netlify per-IP `rateLimit`. The visitor's confirmation never repeats their own text.

## 2026-11-09 — Domain and name

The site lives at the root of eratechgh.com. The name on the site is "ERA Tech" only. URLs are stable
(`/request/<service>`). Privacy links to the eraaxis.com policy (URL pending). No Terms page unless ERA
supplies the text.

## 2026-11-09 — Inboxes

The team address comes from `TEAM_INBOX`. The visitor's confirmation comes from the no-reply sender with
Reply-To set to the team. Deploy previews send to a test inbox.

## 2026-11-09 — Prices

Struck-through "was" prices only with proof; launch shows the price alone.

## 2026-11-09 — ERA Store

A "coming soon" section on the home page, plus an unticked opt-in box on the form whose answer goes in
the same team email.

## 2026-11-09 — Our work

The section and its nav link stay hidden until 3 or more real, approved photos exist.

## 2026-11-09 — Repo

Private `FranzAfun/eratechgh`, pnpm, `main` protected, short PRs, Netlify preview builds per PR.

## 2026-11-09 — Implementation notes (scaffold)

- **React Router 7, not 8.** npm's `latest` for react-router is 8.x at install time; the brief asks for
  React Router 7, so the latest 7.x (7.18.5) is pinned. Upgrading to 8 is a separate decision.
- **Node 26.13.0** (newest LTS line, "Lithium") in `.nvmrc` and `netlify.toml`; **pnpm 12.18.0** in
  `packageManager` and `PNPM_VERSION`.
- **App directory is `src/`** (`appDirectory: "src"`), so routes, components, content and shared rules all
  live under `src/`.
- **CSP lives in a generated `_headers` file**, not `netlify.toml`: React Router's prerendered pages carry
  inline hydration scripts whose hashes change per build. `scripts/finalize-build.js` hashes them and
  writes the policy, so `script-src` never needs `'unsafe-inline'`. `style-src` allows `'unsafe-inline'`
  (React and Turnstile set inline styles; styles can't run code). The other security headers stay in
  `netlify.toml`.
- **404:** `/404` is prerendered and copied to `404.html`; `netlify.toml` serves it for unknown URLs with
  status 404.
- **Tailwind without its default theme:** only tokens in `src/styles/tokens.css` create theme utilities, so
  off-system colours and sizes can't creep in. Spacing uses `--spacing: 4px` (`p-4` = 16 px), which keeps
  everything on the 4 px grid.
- **eslint-plugin-react** needs `settings.react.version` set explicitly with ESLint 10 (auto-detect crashes).

## 2026-11-09 — Implementation notes (form and function)

- **Fill time is measured in the browser.** The form keeps its start time and sends `fillMs` (time since
  the form appeared). Comparing a browser timestamp with the server clock would break for visitors whose
  clock is off. The check is soft: a person who sends in under 4 s just sees "Sending…" a little longer;
  the function rejects requests under 4 s with `too_fast`.
- **Honeypot hits get a fake success** (a reference, no email), so bots learn nothing.
- **Unknown fields include other services' fields:** a sourcing request carrying `abstract` is rejected.
- **Turnstile hostname** must equal the host the request came in on (works for production and previews).
  Cloudflare's test secrets skip the hostname check.
- **Missing config:** production → 500 + a log line naming the missing variables. Elsewhere, missing SMTP
  → dry run (emails logged, not sent); missing Turnstile secret → check skipped with a warning.
- **Helpers live outside `netlify/functions/`** (`netlify/lib`, `netlify/tests`) because Netlify treats
  every file in the functions folder as a function. There is still exactly one function.
- **`/request` is a parent route** with the form; the three service URLs are child routes that only set
  the page title. Switching service changes the URL without losing what the visitor typed.

## 2026-11-09 — Design direction v2 overrides parts of DESIGN-SYSTEM.md

`docs/DESIGN-DIRECTION.md` (v2) wins where it differs: dark hero, glass header, right-side drawer, dark
footer and purple closing band, plus our own living PCB visual (original SVG, not eraaxis.com's). Light
sections in between. Everything else in DESIGN-SYSTEM.md still applies. New dark tokens live in
`src/styles/tokens.css`; every pair used is measured by `pnpm check:contrast`, which fails below AA.

## 2026-11-09 — Consent required, aria-disabled send

The form has a required consent checkbox above Send. Send uses `aria-disabled` (looks disabled, stays
focusable) until it's ticked; pressing it unticked focuses the checkbox and shows its error. The shared
rules and the function require `consent: true`; the team email shows "Consent: yes".

## 2026-11-09 — Privacy policy: https://eraaxis.com/privacy

`site.privacyUrl` is set. It opens in a new tab (`rel="noopener noreferrer"`).

## 2026-11-09 — ERA E favicon and real Dev Board photos reused from eraaxis.com assets

`favicon.ico` / `favicon.png` and the Dev Board photos come from `design-system/assets/` (ERA's own
assets). `favicon.svg` is redrawn from the E proportions in DESIGN-DIRECTION.md §9 (white in dark
scheme); `apple-touch-icon.png` (180 px) is a white E on `#3B1174`.

## 2026-11-09 — Naming: ERA Tech · Project Desk

- **Wordmark:** "ERA Tech · Project Desk", both names the same size and weight, lilac mid-dot. Text only,
  in one component (`src/components/layout/Wordmark.jsx`) so the real logo can replace it later.
- **"ERA Tech"** is the everyday brand: wordmark, headings, body copy ("the ERA Tech team").
- **"ERA Technologies"** is for formal spots only: footer "© year ERA Technologies. All rights
  reserved.", the sign-off on both emails ("— ERA Technologies, Project Desk") and the consent line
  ("I agree to ERA Technologies using these details…").
- **"Project Desk"** is the product: page titles ("<Page> · ERA Tech · Project Desk", home "ERA Tech ·
  Project Desk"), meta descriptions, the 404 text, the hero eyebrow. Email sender name:
  "ERA Tech · Project Desk".
- All three names live in one place: `brandName`, `productName`, `legalName` in `src/content/site.js`.
- **Later move:** when the full ERA Tech site launches, `/` becomes the ERA Tech home and Project Desk
  moves to its own page (e.g. `/project-desk`, with a 301 from old anchors where needed).
  `/request` and `/request/<service>` never change.

## 2026-11-09 — No personal names in the code

No individual's name in `src/`, `public/`, `netlify/` or the build output (copy, test data, comments).
Test data uses placeholders; people are referred to by role ("the owner", "the ERA Tech team").

## 2026-11-09 — Dark top band under the header on every page

`/`, `/request`, `/request/<service>` and the 404 page all open with a dark band that runs under the
fixed header (content padded by the header height). The header is transparent there and turns glass
after 24 px of scroll, so no page starts with grey glass over white.
