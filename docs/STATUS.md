# Status

- **Updated:** 2026-11-09 (stage 7)
- **Where we are:** Stages 1–5 merged. v2 visual upgrade in progress: stages 6–7 done (brand foundation, header and footer); stage 8 (dark hero) next.

## Done

| Stage               | Branch                  | PR                                                                     | Summary                                                                                               |
| ------------------- | ----------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1 Scaffold          | `chore/scaffold`        | [FranzAfun/eratechgh#1](https://github.com/FranzAfun/eratechgh/pull/1) | React Router 7 static app, routes + 404, tokens, Netlify config + CSP, docs                           |
| 2 Layout shell      | `feat/layout-shell`     | [FranzAfun/eratechgh#2](https://github.com/FranzAfun/eratechgh/pull/2) | Header + mobile menu, footer, 404, base UI components, `src/content/site.js`                          |
| 3 Home              | `feat/home`             | [FranzAfun/eratechgh#3](https://github.com/FranzAfun/eratechgh/pull/3) | All home sections from the brief, original illustrations, ERA Store coming soon                       |
| 4 Request form      | `feat/request-form`     | [FranzAfun/eratechgh#4](https://github.com/FranzAfun/eratechgh/pull/4) | Service picker, per-service fields, shared rules, Turnstile, every send state                         |
| 5 Request function  | `feat/request-function` | [FranzAfun/eratechgh#5](https://github.com/FranzAfun/eratechgh/pull/5) | `/api/request`: checks, Turnstile, validation, team + visitor emails, dry run, tests                  |
| 6 Brand foundation  | `feat/brand-foundation` | [FranzAfun/eratechgh#6](https://github.com/FranzAfun/eratechgh/pull/6) | Dark/glass tokens, on-dark buttons, Reveal, favicons, Dev Board photos, `check:contrast`, privacy URL |
| 7 Header and footer | `feat/header-footer`    | PR_7                                                                   | Fixed glass header, right-side drawer (portal, focus trap, scroll lock), dark 4-column footer         |

Stages 6–10 are stacked PRs into `main`: merge them in order (6 → 10).

## Next

Stage 8 — `feat/dark-hero`: dark hero with the living PCB visual, purple closing band.

## Need from Franz

1. **Team inbox address** (`TEAM_INBOX`). Recommendation: a shared Project Desk mailbox or alias, not one person's inbox.
2. **Sending mailbox + SMTP login** (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`). Recommendation: a dedicated no-reply mailbox on the ERA domain, port 587, with SPF, DKIM and DMARC set so confirmations don't land in spam.
3. **Turnstile keys** for eratechgh.com (Managed widget): site key → `VITE_TURNSTILE_SITE_KEY`, secret → `TURNSTILE_SECRET_KEY`, production context only. Previews: Cloudflare's test keys (README).
4. **Test inbox for deploy previews.** Recommendation: set `TEAM_INBOX` + SMTP for the deploy-preview context to a test mailbox. Without SMTP, previews dry-run and write the emails (with visitor details) to the function log.
5. **Footer / fallback contact email** (`teamEmail` in `src/content/site.js`). Until then it's hidden and the error message just says "try again".
6. **ERA Store offer list** — confirm each item (components and modules, Build Packs, ERA Dev Board, delivery + pickup, Mobile Money + card).
7. **Real, approved project photos** (optional). "Our work" stays hidden until there are 3+.
8. **Copy review.** Home and form copy is being rewritten in this run (stages 9–10). Please read it once.

## Known issues

- Turnstile couldn't be reached from the build sandbox (network blocks Cloudflare); the widget was tested with a stub. Check the real widget on a Netlify preview with the test keys.
- The function was tested with Vitest and a local end-to-end run (dry run), not on Netlify itself: `rateLimit` and the generated `_headers` CSP need a check on the first preview deploy.
- Netlify's support for Node 26.13.0 and pnpm 12.18.0 is assumed from the pins; if the first build fails on either, lower `NODE_VERSION`/`PNPM_VERSION` in `netlify.toml`.
- The decorative hero card is hidden on phones (< 768 px) to keep the first screen short.
- Without `VITE_TURNSTILE_SITE_KEY` at build time the check is empty and sending says the check isn't set up.
- Deploy previews without SMTP log emails including visitor details to the function log (see Need from Franz #4).

## How to test

```bash
pnpm install
pnpm build && pnpm lint && pnpm test
```

Pages only: `pnpm preview`. Pages + function: create `.env` with the Turnstile test keys from the README
(leave SMTP empty for a dry run) and run `npx netlify-cli dev`.

Click through: `/` (nav anchors, service buttons, FAQ) → `/request` (pick a service, URL changes, values
stay) → send empty (first error focused and shakes) → fill in and send (busy "Sending…", then "Request sent"
with a reference; the emails appear in the terminal in dry run). Unknown URL → 404.
