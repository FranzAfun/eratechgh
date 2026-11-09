# Status

- **Updated:** 2026-11-09 (HTML emails and sharing)
- **Live:** [eratechgh.com](https://eratechgh.com).
- **Where we are:** HTML emails, local previews, share image and SEO basics are pushed on `feat/html-emails`, based on `main`, in [PR #14](https://github.com/FranzAfun/eratechgh/pull/14). The owner approved the previews and the six requested refinements are complete. Build, lint, all 84 tests and all 76 contrast pairs pass under Node 26.13.0 / pnpm 12.18.0. The PR is open for review; nothing merged by this work.

## Email delivery and Netlify contexts

Deployment details supplied by the owner: receiving at `projects@eratechgh.com`, forwarded via
ImprovMX to the team inbox; sending via Resend SMTP from `no-reply@eratechgh.com`, with the domain
verified. No forwarding destination or credentials are recorded here. Live SMTP delivery and Netlify
configuration have not been inspected as part of this local change.

Set these names separately in Netlify's environment settings for each context. Values stay there.

| Context                    | Build-time names          | Function names                                                                                        |
| -------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Production                 | `VITE_TURNSTILE_SITE_KEY` | `TURNSTILE_SECRET_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `TEAM_INBOX` |
| Deploy preview             | `VITE_TURNSTILE_SITE_KEY` | `TURNSTILE_SECRET_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `TEAM_INBOX` |
| Branch deploy (if enabled) | `VITE_TURNSTILE_SITE_KEY` | `TURNSTILE_SECRET_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `TEAM_INBOX` |

Production uses the verified site/mail setup. Non-production contexts use Turnstile test credentials
and isolated test inboxes when sending; otherwise missing SMTP configuration produces a dry run.
The `CONTEXT` name is supplied by Netlify. The same names may be configured in a git-ignored local
`.env` for Netlify CLI development. Never put variable values or real customer details in docs.

## Current work: HTML emails and sharing

- The visitor plain-text body is unchanged; the team plain-text body changes only "Your details" to
  "Visitor details". Both have HTML alternatives with an inline, 600 px table layout,
  token colours, hidden escaped preheaders, validated/encoded reply links, no remote assets.
- `pnpm preview:emails` writes fictional `.email-previews/team.html` and
  `.email-previews/visitor.html`; the whole preview directory is ignored.
- `pnpm og:image` manually creates `public/og.png` using pinned resvg, Fontsource Inter and a WOFF2
  decoder. The 1200 × 630 PNG is committed; normal builds never run the generator.
- Centralised route Open Graph/Twitter/canonical metadata, 404 noindex without canonical,
  `robots.txt` and the five-route sitemap. Build-output tests cover the prerendered pages.
- The owner approved the previews. Final refinements put the visitor reference chip in its dark
  header, remove duplicate reference/service table rows from the team HTML, use "Visitor details"
  in both team alternatives, and show the requested discount in a soft callout only when requested.
  Preview/screenshot files stay uncommitted; [PR #14](https://github.com/FranzAfun/eratechgh/pull/14)
  is open without merging.
- Self-review: 4 px spacing, 6/8 px corners, aligned content, token-only email colours, hidden
  preheaders, keyboard-accessible links and 48 px reply buttons. Browser review covers 360/390 px
  phones and desktop; dark-preference emulation keeps the explicit light card legible. No external
  assets or motion in emails. Actual mail-client rendering and live SMTP remain pending.
- Text compatibility: compared all three services and both consultation prices against the approved
  preview baseline; all four visitor bodies are unchanged and all four team bodies change only the
  details heading. Tests cover HTML escaping, header controls,
  validated/encoded mailto links, multipart output and actual prerendered metadata.
- Share image: 1200 × 630, 173,643 bytes; manually regenerated with the larger subtitle "Parts,
  project reviews and expert advice for students and makers in Ghana". Alt text matches the image.
  Normal build leaves the image unchanged. Local previews are in the ignored `.email-previews/`.
- Gate maintenance: fixed the Windows contrast CLI entry point and the pre-existing missing final
  newline in `vite.config.js`; replaced one old named email test fixture with a sample address.

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

Stages 1–10 and v2 polish are present in the `main` baseline for this work.

## Next

Review [PR #14](https://github.com/FranzAfun/eratechgh/pull/14); do not merge as part of this task.
Actual mail-client/inbox acceptance remains separate from the approved browser previews.

## Need from the owner

1. **Inbox acceptance of the HTML emails**, including dark mail apps and Outlook. The public inbox,
   verified sending domain and providers have been supplied; SMTP secrets stay in Netlify only.
2. **Per-context configuration acceptance.** Confirm the environment-name table above matches the
   intended Netlify contexts; no configuration or credentials have been read or changed here.
3. **Live Turnstile acceptance** for eratechgh.com; local tests do not prove the deployed widget.
4. **Test inbox for deploy previews.** Keep preview delivery isolated. Without SMTP, previews dry-run
   and write the emails (with visitor details) to the function log.
5. **Footer / fallback contact email:** `teamEmail` in `src/content/site.js` is still hidden; this
   email/SEO task does not change the footer.
6. **Privacy policy check.** The consent box now links to https://eraaxis.com/privacy. Please confirm that policy covers this site and these requests (it is written for ERA, not specifically for Project Desk).
7. **ERA Store offer list** — confirm each item (components and modules, Build Packs, ERA Dev Board, delivery + pickup, Mobile Money payments). Card payments are not mentioned anywhere until confirmed.
8. **Real, approved project photos** (optional). "Our work" stays hidden until there are 3+.
9. **Copy review.** Home and request copy were rewritten in stages 8–10 (hero, section titles, service summaries, FAQ, request page, consent wording from DESIGN-DIRECTION.md §7). The hero card's part names ("Microcontroller board", "Soil moisture sensor", "LEDs and resistors") are illustrative examples. Please read it once (also the new branding copy: hero eyebrow "ERA Tech · Project Desk — for makers in Ghana", footer line, design FAQ).
10. **Dev Board photo alt text** — "The ERA Dev Board: a blue board with a four-battery holder, power switch and two breadboard strips". Correct it if the description is off.

## Known issues

- Turnstile couldn't be reached from the build sandbox (network blocks Cloudflare); the widget was tested with a stub. Check the real widget on a Netlify preview with the test keys.
- The function was tested with Vitest and a local end-to-end run (dry run), not on Netlify itself: `rateLimit` and the generated `_headers` CSP need a check on the first preview deploy.
- Local checks pass with the pinned Node 26.13.0 and pnpm 12.18.0. Netlify's runtime configuration
  has not been inspected in this task.
- Screenshots were taken with headless Chromium only (360, 390, 768, 1024, 1280, 1440 px + open drawer); not checked in Safari/Firefox or on real phones. `backdrop-filter` has a solid fallback.
- Phones and tablets (< 1024 px): the living board sits faintly (25 %) behind the hero words and the glass quote card is hidden, so the first screen stays readable.
- The locked Send button (before consent) is shown at 50 % opacity; disabled controls are exempt from contrast rules, and the hint under it explains what to do.
- The FAQ accordion needs JavaScript to open answers (the answers are in the HTML for search engines).
- The `dev-board-front.webp` asset looks like a 3D render rather than a photo, so the site uses the `dev-board-main-*` photos only (the render is not shipped).
- Without `VITE_TURNSTILE_SITE_KEY` at build time the check is empty and sending says the check isn't set up.
- Deploy previews without SMTP log emails including visitor details to the function log (see Need from the owner #4).

## How to test

```bash
pnpm install
pnpm build && pnpm lint && pnpm test && pnpm check:contrast
```

Pages only: `pnpm preview`. Pages + function: create `.env` using the Turnstile test-key guidance in the README
(leave SMTP empty for a dry run) and run `npx netlify-cli dev`.

Email layout: `pnpm preview:emails`, then open both HTML files in `.email-previews/`.
Sharing image: open `public/og.png`; regenerate only by hand with `pnpm og:image`.

Click through:

- `/`, `/request/<service>` and any unknown URL — the header is transparent over the dark top band and turns glass after a short scroll; pulses run on the board and light the LEDs. Scroll: sections fade up, design tiles draw in. FAQ opens with Enter/Space.
- Below 1024 px, open ☰ — the drawer slides in, focus is on ✕, Tab stays inside, Esc closes and returns focus, and a link closes it and scrolls to the section.
- `/request` → pick a card (URL changes, typed values stay) → Send is greyed out: pressing it focuses the privacy box and shows its error → tick it → send empty (first error focused, shakes once) → fill in and send ("Sending…", then "Request sent" with a reference; dry-run emails in the terminal show "Consent: yes").
- Unknown URL → 404.
