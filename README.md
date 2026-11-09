# ERA Tech · Project Desk

The public site at the root of **eratechgh.com**. Students, makers and innovators in Ghana pick a
service — component sourcing, a project assessment or an expert consultation — and send one request
form. A single Netlify Function emails the ERA Tech team and sends the visitor a short confirmation.
Nothing is stored.

Scope and content: [`docs/BRIEF.md`](docs/BRIEF.md). Look: [`design-system/DESIGN-SYSTEM.md`](design-system/DESIGN-SYSTEM.md).
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
pnpm lint          # ESLint + Prettier check
pnpm format        # Prettier write
pnpm test          # Vitest
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

Cloudflare publishes public test keys that need no account. Put these in a local `.env` (git-ignored):

```bash
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA       # always passes
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA  # always passes
```

Other test keys: site key `2x00000000000000000000AB` (always blocks), secret
`2x0000000000000000000000000000000AA` (always fails). With test keys the function skips the hostname
check (Cloudflare reports a dummy hostname for them).

The form posts JSON to `/api/request` (`netlify/functions/request.mjs`, logic in `netlify/lib/`). The
validation rules are shared with the form: `src/lib/request-rules.js`.

If the `SMTP_*` variables are missing and the Netlify context is not `production`, the function does a
**dry run**: it logs both emails instead of sending them. In production, missing config returns a 500
and logs a clear line.

## Deploy (Netlify)

- Build command `pnpm build`, publish `build/client`, functions `netlify/functions` — all in
  `netlify.toml`, together with the Node version and security headers.
- The Content-Security-Policy is generated at build time into `build/client/_headers` (it holds hashes of
  React Router's inline scripts, which change per build).
- Unknown URLs serve the prerendered `404.html` with a 404 status.
- **Production** uses the real Turnstile keys, the ERA sending mailbox and the real team inbox.
- **Deploy previews** (one per PR) must use the Turnstile **test** keys and a **test inbox** for
  `TEAM_INBOX`, set per deploy context in Netlify's environment settings, so previews never email the team.
