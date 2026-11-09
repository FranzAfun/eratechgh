# Rules for anyone (human or agent) working on this repo

Source of truth: `docs/BRIEF.md` (scope, content, form, emails, states — do not edit) and
`design-system/DESIGN-SYSTEM.md` (look and rules). Where they differ on look, the design system wins:
calm and dense, not big and bold.

- Normal sessions: plan first and wait for Franz's OK before building.
- Ask instead of guessing. Never invent prices, legal text, contact details, URLs or ERA Store features.
  Unknowns go in `docs/STATUS.md` under "Need from Franz"; in code they are `null` / hidden, never made up.
- The name on the site is "ERA Tech". Never "ERA AXIS".
- Hard limits: no database, accounts, dashboard, payments, file uploads, analytics, or EDOS/ERA Store
  integration. One Netlify Function only. Nothing stored beyond the emails.
- No secrets or real customer data in any file. Example people use fictional Ghanaian names.
  Cloudflare's public Turnstile test keys may appear in README and tests.
- Exact dependency versions only (no `^` or `~`; `save-exact=true`). Light theme only.
- Branches: `<type>/<short-kebab-name>` (`chore/`, `feat/`, `fix/`, `docs/`). Small Conventional Commits
  (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`), one logical change each.
- One branch and one PR per piece of work. PR title in Conventional Commit style; description = plan,
  what changed, how to test, screenshots if you have them, "Based on #<previous PR>" when stacked.
  Never merge, never push to `main`, never force-push `main`. If you can't open PRs, push the branch
  and list it in `docs/STATUS.md`.
- Before pushing: `pnpm build`, `pnpm lint` and `pnpm test` pass, and the work is self-reviewed against
  `DESIGN-SYSTEM.md` (16 px inputs, 44 px controls, corners 6/8/12, 4 px grid, measured AA contrast,
  visible labels, "(optional)" only on optional fields, no layout shift, keyboard only, reduced motion,
  no horizontal scroll).
- Keep `docs/STATUS.md` current at the end of every piece of work. Record decisions in `docs/DECISIONS.md`.
