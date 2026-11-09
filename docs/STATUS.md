# Status

- **Updated:** 2026-11-09 (stage 2)
- **Where we are:** Stages 1–2 done (scaffold, layout shell); stage 3 (home page) next.

## Done

| Stage          | Branch              | PR                                                                     | Summary                                                                      |
| -------------- | ------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1 Scaffold     | `chore/scaffold`    | [FranzAfun/eratechgh#1](https://github.com/FranzAfun/eratechgh/pull/1) | React Router 7 static app, routes + 404, tokens, Netlify config + CSP, docs  |
| 2 Layout shell | `feat/layout-shell` | [FranzAfun/eratechgh#2](https://github.com/FranzAfun/eratechgh/pull/2) | Header + mobile menu, footer, 404, base UI components, `src/content/site.js` |

## Next

Stage 3 — `feat/home`: all home sections from BRIEF.md.

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

- `/request` shows a component preview (placeholder) until stage 4 replaces it with the form.
- Footer privacy link and contact email are hidden while `privacyUrl` / `teamEmail` are `null`.

## How to test

```bash
pnpm install
pnpm build && pnpm preview
```

Open `/`, `/request`, `/request/sourcing`, `/request/assessment`, `/request/consultation` and any unknown URL.
