# AGENTS.md — zinc-digital-web

The new `www.zincdigital.co`: a custom Astro site on Vercel that replaces the WordPress/Elementor/Kinsta site.

**Authority:** `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` is the approved design. `.planning/` (GSD) governs execution. The newest direct owner correction wins.

## Invariants

- **Identity:** ZINC Digital's own site only. The live WordPress site, the July 2026 "Website V2" prototype, and the `Zinc_Digital_Agency` repo are sources of facts and assets, never of design, copy, or configuration.
- **Copy:** fresh site voice per spec section 7. No `kirk-voice` phrasing, no legacy lines, no cursing, no sales devices, no invented numbers (`[RECEIPT: …]` until the owner confirms). Never "GEO" for generative search.
- **Performance is launch-blocking:** spec section 10 gates on every template.
- **No paid services** beyond current subscriptions (Vercel Pro, Google Workspace).
- **Git:** `main` is the product. One work branch per task, in its own worktree, merged to `main` by PR, then deleted. Codex reviews each PR in GitHub. Open or mark the PR ready to trigger the review, or comment `@codex review`; resolve review findings before landing. Codex is the GitHub review provider; Copilot is not a review gate. Keep configured GSD code review, verification and UI review steps.
- **Irreversible actions** (DNS cutover, production env secrets, deleting anything) need the owner's explicit go for that exact action.
- **Runtime:** Node 24.
- **Time:** everything shown to the owner is America/Chicago (CT).
- **Storage:** all work, scratch and worktrees stay under `/Volumes/Satechi Hub/`.
