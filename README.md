# ERA Tech · Project Desk

The public site at the root of **eratechgh.com**. Students, makers and innovators in Ghana pick a
service — component sourcing, a project assessment or an expert consultation — and send one request
form. A single Netlify Function emails the ERA Tech team and sends the visitor a short confirmation.
Nothing is stored.

Scope and content: [`docs/BRIEF.md`](docs/BRIEF.md). Look: [`docs/DESIGN-DIRECTION.md`](docs/DESIGN-DIRECTION.md) (v2, wins where it differs) and [`design-system/DESIGN-SYSTEM.md`](design-system/DESIGN-SYSTEM.md).
Rules: [`AGENTS.md`](AGENTS.md). Decisions: [`docs/DECISIONS.md`](docs/DECISIONS.md). Progress: [`docs/STATUS.md`](docs/STATUS.md).

## Stack

JavaScript (no TypeScript) · React 19 · React Router 7 (framework mode, `ssr: false`, every page
prerendered to static HTML) · Vite · Tailwind CSS 4 · lucide-react · Inter (self-hosted via
@fontsource-variable) · thinking-orbs (busy buttons) · nodemailer (in the function) · Vitest ·
ESLint + Prettier. Hosted on Netlify (static files in `build/client` + one function in
`netlify/functions`).

Versions are exact (`.npmrc` has `save-exact=true`). Node is pinned in `.nvmrc` and `netlify.toml`;
pnpm is pinned in `package.json` (`packageManager`).

## Commands

```bash
pnpm install       # install exact versions from the lockfile
pnpm dev           # local dev server (pages only)
pnpm build         # prerender every page to build/client and write the CSP to build/client/_headers
pnpm preview       # serve build/client
pnpm preview:emails  # write fictional team + visitor HTML previews locally; sends nothing
pnpm og:image      # manually regenerate the committed public/og.png (never runs during build)
pnpm lint          # ESLint + Prettier check
pnpm format        # Prettier write
pnpm test          # Vitest, including SEO checks against build/client; run pnpm build first
pnpm check:contrast  # measure every colour pair the site uses; fails below WCAG AA
```

To run the pages **and** the function together locally, use the Netlify CLI (not a repo dependency):
`npx netlify-cli dev`.

## Environment variables

Names only — see `.env.example`. Real values live in Netlify's environment settings, never in git.

| Name                                               | Used by              | What                                                      |
| -------------------------------------------------- | -------------------- | --------------------------------------------------------- |
| `VITE_TURNSTILE_SITE_KEY`                          | browser (build time) | Cloudflare Turnstile site key (Managed widget)            |
| `TURNSTILE_SECRET_KEY`                             | function             | Turnstile secret for siteverify                           |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | function             | ERA sending mailbox                                       |
| `MAIL_FROM`                                        | function             | sending address, e.g. the no-reply mailbox                |
| `TEAM_INBOX`                                       | function             | where requests go; Reply-To on the visitor's confirmation |

### Local development with Turnstile test keys

Use Cloudflare's published Turnstile test keys in a local `.env` (git-ignored):
`VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Get the values from
[Cloudflare's testing documentation](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
With test keys the function skips the hostname check (Cloudflare reports a dummy hostname for them).
Only variable names are documented here; never copy real values into the repo.

The form posts JSON to `/api/request` (`netlify/functions/request.mjs`, logic in `netlify/lib/`). The
validation rules are shared with the form: `src/lib/request-rules.js`.

If the `SMTP_*` variables are missing and the Netlify context is not `production`, the function does a
**dry run**: it logs both emails instead of sending them. In production, missing config returns a 500
and logs a clear line.

## Emails

Each valid request sends two messages through nodemailer as `multipart/alternative`: the existing
plain-text body and an HTML version with inline styles, a table layout and one mobile media query.
The logo and social icons are PNGs hosted under `https://eratechgh.com/email/`; there are no external
fonts or tracking. The team receives every field in form order, the reference, shown price, consent and GMT
time, with the visitor as Reply-To. The visitor receives their first name, service, reference and next
steps only; their submitted project text is never echoed. Both include a hidden inbox preheader and
one reply button. HTML values are escaped and email links use shared validation and URI encoding.
Both alternatives include the five public social URLs. The HTML footer also includes the relevant
recipient note, visitor privacy link and copyright; the sign-off is retained.

Receiving: `projects@eratechgh.com`, forwarded via ImprovMX to the team inbox. Sending: Resend SMTP
from `no-reply@eratechgh.com`; the domain is verified (deployment details supplied by the owner).
Neither the forwarding destination nor SMTP credentials belong in the repo.

Run `pnpm preview:emails`, then open `.email-previews/team.html` and `.email-previews/visitor.html`
directly in a browser. These use obvious fictional placeholders, read no environment variables and
send nothing. Preview image sources resolve to `../public/email/` so the logo/icons work locally;
sent messages always use the absolute production HTTPS image URLs. At 600 px and below, the HTML
card is edge-to-edge. The directory is git-ignored; do not commit previews or screenshots. Browser previews
are useful for layout review; actual mail-client dark-mode/Outlook rendering still needs inbox checks.

The shared link-preview image is `public/og.png`. Run `pnpm og:image` by hand only when changing it,
then review and commit the PNG. The generator uses pinned `@resvg/resvg-js`, the installed Fontsource
Inter font and `wawoff2` to decode that font locally. No browser dependency is used. Normal builds
copy the committed PNG and never regenerate it. Route metadata is centralised in `src/lib/meta.js`,
with the production base URL in `src/content/site.js`.

## Brand and work assets

The owner supplied the three logo colours, six work images and five social icons. Source folders
`logos/`, `work/` and `social/` are read-only. Preparation requires Python 3 + Pillow; run only when
assets change (validated with Pillow 12.1.1). Outputs are committed and never generated by `pnpm build`.

```powershell
py -3 scripts/prepare-assets.py --source "<incoming-folder>"
pnpm og:image
```

The script removes source metadata and verifies source-file checksums remain unchanged. Trimmed
logo masters in all three colours live in `design-system/assets/logo/`. Site WebP/PNG variants are
in `public/images/brand/`, with fixed 1x/2x sizes for 40 px header, 36 px drawer and 48 px footer logos.
The top bar displays the logo alone; the hero eyebrow says "Project Desk". The drawer/footer retain
the logo, lilac dot and Project Desk text. Favicons use only the ERA letters from the supplied logo,
white on a rounded purple square; the previous E-based SVG is removed. The share image embeds the
trimmed white logo and keeps its text and original PCB motif.

Work images live in `public/images/work/`, each at 640 px and its own source width (1029, 1080 or
1280 px), at most 400 KB each. No upscaling or cropping. Three stories and exact captions/alts are
defined in `src/content/site.js`; CAD, PCB layout and render images are labelled explicitly. The
section and nav require at least three actual photographs. Frames use a soft 4:3 surface and contain
the whole image. Below-the-fold images load lazily with responsive source sets.

The five public social URLs are content constants in `src/content/site.js`, shared by the footer and
emails. Site icons use `public/images/social/`; PNG email assets are in `public/email/`. No tracking
parameters or credentials are stored with them. Recheck asset dimensions, logo legibility, keyboard
links, reduced motion and all contrast pairs after changing assets.

## Deploy (Netlify)

- Build command `pnpm build`, publish `build/client`, functions `netlify/functions` — all in
  `netlify.toml`, together with the Node version and security headers.
- The Content-Security-Policy is generated at build time into `build/client/_headers` (it holds hashes of
  React Router's inline scripts, which change per build).
- Unknown URLs serve the prerendered `404.html` with a 404 status.
- **Production** uses the real Turnstile keys, the ERA sending mailbox and the real team inbox.
- **Deploy previews** (one per PR) must use the Turnstile **test** keys and a **test inbox** for
  `TEAM_INBOX`, set per deploy context in Netlify's environment settings, so previews never email the team.
