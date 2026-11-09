# Status

- **Updated:** 2026-11-09 (v2 polish)
- **Where we are:** Stages 1–10 merged. v2 polish (branding, dark top bands, nav, copy fixes) is in one PR on `fix/v2-polish`; nothing merged. Stopped — waiting for the owner.

## Done

| Stage               | Branch                  | PR                                                                       | Summary                                                                                                                                                                                                                                                |
| ------------------- | ----------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Scaffold          | `chore/scaffold`        | [FranzAfun/eratechgh#1](https://github.com/FranzAfun/eratechgh/pull/1)   | React Router 7 static app, routes + 404, tokens, Netlify config + CSP, docs                                                                                                                                                                            |
| 2 Layout shell      | `feat/layout-shell`     | [FranzAfun/eratechgh#2](https://github.com/FranzAfun/eratechgh/pull/2)   | Header + mobile menu, footer, 404, base UI components, `src/content/site.js`                                                                                                                                                                           |
| 3 Home              | `feat/home`             | [FranzAfun/eratechgh#3](https://github.com/FranzAfun/eratechgh/pull/3)   | All home sections from the brief, original illustrations, ERA Store coming soon                                                                                                                                                                        |
| 4 Request form      | `feat/request-form`     | [FranzAfun/eratechgh#4](https://github.com/FranzAfun/eratechgh/pull/4)   | Service picker, per-service fields, shared rules, Turnstile, every send state                                                                                                                                                                          |
| 5 Request function  | `feat/request-function` | [FranzAfun/eratechgh#5](https://github.com/FranzAfun/eratechgh/pull/5)   | `/api/request`: checks, Turnstile, validation, team + visitor emails, dry run, tests                                                                                                                                                                   |
| 6 Brand foundation  | `feat/brand-foundation` | [FranzAfun/eratechgh#6](https://github.com/FranzAfun/eratechgh/pull/6)   | Dark/glass tokens, on-dark buttons, Reveal, favicons, Dev Board photos, `check:contrast`, privacy URL                                                                                                                                                  |
| 7 Header and footer | `feat/header-footer`    | [FranzAfun/eratechgh#7](https://github.com/FranzAfun/eratechgh/pull/7)   | Fixed glass header, right-side drawer (portal, focus trap, scroll lock), dark 4-column footer                                                                                                                                                          |
| 8 Dark hero         | `feat/dark-hero`        | [FranzAfun/eratechgh#8](https://github.com/FranzAfun/eratechgh/pull/8)   | Dark hero with our own living PCB and glass quote card, purple closing band                                                                                                                                                                            |
| 9 Home sections     | `feat/home-sections`    | [FranzAfun/eratechgh#9](https://github.com/FranzAfun/eratechgh/pull/9)   | Services cards, glass design band with trace-draw, connected steps, ERA Store split card with Dev Board photo, FAQ accordion, reveals, sharper copy                                                                                                    |
| 10 Request page     | `feat/request-page`     | [FranzAfun/eratechgh#10](https://github.com/FranzAfun/eratechgh/pull/10) | Dark page band, overlapping form card, picker cards, sticky "What happens next", required consent (form, rules, function, email)                                                                                                                       |
| v2 polish           | `fix/v2-polish`         | [FranzAfun/eratechgh#11](https://github.com/FranzAfun/eratechgh/pull/11) | Wordmark \"ERA Tech · Project Desk\", names in one place, ERA Technologies in formal spots, dark top band + transparent header on request and 404 pages, ERA Store in nav, paid design FAQ, sourcing delivery wording, hero centred, no personal names |

Stages 1–10 are merged. The v2 polish PR is based on `main`.

## Next

Stopped — waiting for the owner.

## Need from the owner

1. **Team inbox address** (`TEAM_INBOX`). Recommendation: a shared Project Desk mailbox or alias, not one person's inbox.
2. **Sending mailbox + SMTP login** (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`). Recommendation: a dedicated no-reply mailbox on the ERA domain, port 587, with SPF, DKIM and DMARC set so confirmations don't land in spam.
3. **Turnstile keys** for eratechgh.com (Managed widget): site key → `VITE_TURNSTILE_SITE_KEY`, secret → `TURNSTILE_SECRET_KEY`, production context only. Previews: Cloudflare's test keys (README).
4. **Test inbox for deploy previews.** Recommendation: set `TEAM_INBOX` + SMTP for the deploy-preview context to a test mailbox. Without SMTP, previews dry-run and write the emails (with visitor details) to the function log.
5. **Footer / fallback contact email** (`teamEmail` in `src/content/site.js`). Until then the footer links to the request form and the error message just says "try again".
6. **Privacy policy check.** The consent box now links to https://eraaxis.com/privacy. Please confirm that policy covers this site and these requests (it is written for ERA, not specifically for Project Desk).
7. **ERA Store offer list** — confirm each item (components and modules, Build Packs, ERA Dev Board, delivery + pickup, Mobile Money payments). Card payments are not mentioned anywhere until confirmed.
8. **Real, approved project photos** (optional). "Our work" stays hidden until there are 3+.
9. **Copy review.** Home and request copy were rewritten in stages 8–10 (hero, section titles, service summaries, FAQ, request page, consent wording from DESIGN-DIRECTION.md §7). The hero card's part names ("Microcontroller board", "Soil moisture sensor", "LEDs and resistors") are illustrative examples. Please read it once (also the new branding copy: hero eyebrow "ERA Tech · Project Desk — for makers in Ghana", footer line, design FAQ).
10. **Dev Board photo alt text** — "The ERA Dev Board: a blue board with a four-battery holder, power switch and two breadboard strips". Correct it if the description is off.

## Known issues

- Turnstile couldn't be reached from the build sandbox (network blocks Cloudflare); the widget was tested with a stub. Check the real widget on a Netlify preview with the test keys.
- The function was tested with Vitest and a local end-to-end run (dry run), not on Netlify itself: `rateLimit` and the generated `_headers` CSP need a check on the first preview deploy.
- Netlify's support for Node 26.13.0 and pnpm 12.18.0 is assumed from the pins; if the first build fails on either, lower `NODE_VERSION`/`PNPM_VERSION` in `netlify.toml`.
- Screenshots were taken with headless Chromium only (360, 390, 768, 1024, 1280, 1440 px + open drawer); not checked in Safari/Firefox or on real phones. `backdrop-filter` has a solid fallback.
- Phones and tablets (< 1024 px): the living board sits faintly (25 %) behind the hero words and the glass quote card is hidden, so the first screen stays readable.
- The locked Send button (before consent) is shown at 50 % opacity; disabled controls are exempt from contrast rules, and the hint under it explains what to do.
- The FAQ accordion needs JavaScript to open answers (the answers are in the HTML for search engines).
- The `dev-board-front.webp` asset looks like a 3D render rather than a photo, so the site uses the `dev-board-main-*` photos only (the render is not shipped).
- Without `VITE_TURNSTILE_SITE_KEY` at build time the check is empty and sending says the check isn't set up.
- Deploy previews without SMTP log emails including visitor details to the function log (see Need from Franz #4).

## How to test

```bash
pnpm install
pnpm build && pnpm lint && pnpm test && pnpm check:contrast
```

Pages only: `pnpm preview`. Pages + function: create `.env` with the Turnstile test keys from the README
(leave SMTP empty for a dry run) and run `npx netlify-cli dev`.

Click through:

- `/`, `/request/<service>` and any unknown URL — the header is transparent over the dark top band and turns glass after a short scroll; pulses run on the board and light the LEDs. Scroll: sections fade up, design tiles draw in. FAQ opens with Enter/Space.
- Below 1024 px, open ☰ — the drawer slides in, focus is on ✕, Tab stays inside, Esc closes and returns focus, and a link closes it and scrolls to the section.
- `/request` → pick a card (URL changes, typed values stay) → Send is greyed out: pressing it focuses the privacy box and shows its error → tick it → send empty (first error focused, shakes once) → fill in and send ("Sending…", then "Request sent" with a reference; dry-run emails in the terminal show "Consent: yes").
- Unknown URL → 404.
