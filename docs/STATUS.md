# Status

- **Updated:** 2026-11-09 (stage 4)
- **Where we are:** Stages 1–4 done (scaffold, layout shell, home, request form); stage 5 (function) next.

## Done

| Stage          | Branch              | PR                                                                     | Summary                                                                         |
| -------------- | ------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1 Scaffold     | `chore/scaffold`    | [FranzAfun/eratechgh#1](https://github.com/FranzAfun/eratechgh/pull/1) | React Router 7 static app, routes + 404, tokens, Netlify config + CSP, docs     |
| 2 Layout shell | `feat/layout-shell` | [FranzAfun/eratechgh#2](https://github.com/FranzAfun/eratechgh/pull/2) | Header + mobile menu, footer, 404, base UI components, `src/content/site.js`    |
| 3 Home         | `feat/home`         | [FranzAfun/eratechgh#3](https://github.com/FranzAfun/eratechgh/pull/3) | All home sections from the brief, original illustrations, ERA Store coming soon |
| 4 Request form | `feat/request-form` | PR_4                                                                   | Service picker, per-service fields, shared rules, Turnstile, every send state   |

## Next

Stage 5 — `feat/request-function`: `netlify/functions/request.mjs`, emails, tests.

## Need from Franz

1. **Team inbox address** (`TEAM_INBOX`). Recommendation: a shared mailbox such as a Project Desk alias, not a person's inbox.
2. **Sending mailbox + SMTP login** (`SMTP_*`, `MAIL_FROM`). Recommendation: a dedicated no-reply mailbox on the ERA domain with SPF/DKIM set up.
3. **Privacy policy URL** on eraaxis.com, and confirmation it covers this site. Until then the privacy link is plain text.
4. **Footer contact email.** Until then it's hidden.
5. **Proof for "was" prices** (GH₵150 / GH₵500) or confirm we drop them. Recommendation: drop them (launch shows price alone).
6. **ERA Store offer list** — confirm each item in BRIEF §7.
7. **Real, approved project photos** (optional; "Our work" stays hidden until there are 3+).
8. **Turnstile keys** (production site + secret key for eratechgh.com).

## Known issues

- `/api/request` doesn't exist until stage 5, so sending from this branch's preview shows the "couldn't send" error.
- Turnstile couldn't be loaded from the build sandbox (network blocks Cloudflare); the widget was tested with a stub. Check it on the Netlify preview with the test keys.
- Without `VITE_TURNSTILE_SITE_KEY` at build time the check box is empty and sending says the check isn't set up.
- The decorative hero card is hidden on phones (< 768 px) to keep the first screen short.
- "Our work" is hidden (no approved photos yet).
- ERA Store offer list is shown as in the brief, pending ERA's confirmation.
- Footer privacy link and contact email are hidden while `privacyUrl` / `teamEmail` are `null`.

## How to test

```bash
pnpm install
pnpm build && pnpm preview
```

Open `/`, `/request`, `/request/sourcing`, `/request/assessment`, `/request/consultation` and any unknown URL.
