# Status

- **Updated:** 2026-11-09
- **State:** **Live** at [eratechgh.com](https://eratechgh.com). Launch scope complete, ahead of the
  Wed 11 Nov target. The full pipeline was tested in production: form → Turnstile → function →
  team email + visitor confirmation → team replies from `projects@eratechgh.com`.
- **Deploys:** Netlify auto-builds are **paused** on purpose. Merging to `main` does not deploy.
  To ship: Netlify → Deploys → enable builds (or "Trigger deploy"), then pause again if wanted.

## What's live

- Home (`/`): dark hero with the living PCB visual, services (sourcing free quote, assessment
  GH₵50, consultation GH₵250 / GH₵75 if eligible), design band, Our work (three real project
  stories), how it works, ERA Store coming soon, FAQ, closing band, footer with socials.
- Request form (`/request`, `/request/sourcing|assessment|consultation`): service picker, shared
  validation (browser + function), Turnstile (Managed), required consent, every send state.
- Function `POST /api/request`: per-IP rate limit, size limit, honeypot, minimum fill time,
  Turnstile siteverify, validation, team email (Reply-To visitor) + visitor confirmation. Nothing
  stored. Emails are HTML (logo, socials footer, full width on phones) with plain-text fallback.
- Branding: header shows the ERA Technologies logo only; "Project Desk" in the hero eyebrow,
  footer wordmark, page titles and emails. Favicons and share image (`og.png`) from the logo.
- SEO/sharing: per-page title/description, Open Graph + Twitter tags, canonical URLs,
  `robots.txt`, `sitemap.xml`, 404 page with `noindex`.
- Security headers: build-time CSP (hashes for inline scripts; Turnstile allowed), HSTS,
  X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP.

## Production setup (names only — values live in the services, never in this repo)

| Piece        | Where                                     | Notes                                                                                  |
| ------------ | ----------------------------------------- | -------------------------------------------------------------------------------------- |
| Hosting      | Netlify project `eratechgh`               | Builds from `main`; builds currently paused                                            |
| Domain + DNS | Namecheap (eratechgh.com)                 | A `@` → Netlify, CNAME `www` → `eratechgh.netlify.app`, HTTPS by Netlify               |
| Bot check    | Cloudflare Turnstile (Managed)            | Hostnames: eratechgh.com, www.eratechgh.com                                            |
| Receiving    | ImprovMX                                  | `projects@eratechgh.com` forwarded to the team inbox (MX + SPF at `@`)                 |
| Sending      | Resend (eu-west-1)                        | Domain verified (DKIM + `send`/`rsend` CNAMEs); site sends as `no-reply@eratechgh.com` |
| Team replies | Team inbox "Send mail as" via Resend SMTP | Replies go out as `projects@eratechgh.com` (separate API key)                          |
| DMARC        | `_dmarc` TXT                              | `p=none` for now                                                                       |

Netlify environment variables (per deploy context):

| Context                                  | Names                                                                                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production                               | `VITE_TURNSTILE_SITE_KEY` (build), `TURNSTILE_SECRET_KEY` (secret), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (secret), `MAIL_FROM`, `TEAM_INBOX` |
| Deploy previews / branch deploys / local | Turnstile **test** keys only; no SMTP → the function dry-runs and logs the emails                                                                          |

Local development: `.env` with the Turnstile test keys (see README), then
`npx -y netlify-cli dev --command "pnpm dev" --target-port 5173` and open http://localhost:8888.
Never put live keys in `.env`.

## History (all merged into `main`)

| PRs     | What                                                                                                                  |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| #1–#5   | Scaffold, layout shell, home, request form, request function                                                          |
| #6–#10  | v2 design: brand foundation, glass header + drawer + dark footer, dark hero, home sections, request page with consent |
| #11–#13 | Branding (ERA Tech · Project Desk), copy fixes, dark bands under the header, hero eyebrow, 404 redirect removed       |
| #14     | HTML emails, share image, Open Graph/Twitter tags, canonical, robots, sitemap                                         |
| #15     | Supplied logo + favicons, Our work stories, socials in footer and emails, email polish                                |

## Next (none blocks launch)

1. Link to eratechgh.com from eraaxis.com (trust and search).
2. Protect `main` on GitHub (changes only through PRs).
3. Cleanup PR: the `envFile` deprecation warning; review React Router v8 future flags.
4. More real project photos as they come (title, category, one honest line, permission).
5. After a few weeks of clean sending, consider DMARC `p=quarantine`.

## How to test

```bash
pnpm install
pnpm build && pnpm lint && pnpm test && pnpm check:contrast
pnpm preview:emails   # writes both emails to .email-previews/ (git-ignored)
```

Production smoke test (Chrome): send one request on https://eratechgh.com/request/sourcing →
"Request sent" with a `PD-` reference → team email in the team inbox → confirmation in the
visitor's inbox → reply from the team inbox shows `projects@eratechgh.com`.
