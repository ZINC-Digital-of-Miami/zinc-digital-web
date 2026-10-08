# AGENTS.md — zinc-digital-web

The new `www.zincdigital.co`: one Astro project on Vercel that replaces the WordPress/Elementor/Kinsta site. Public pages are prerendered, visitors send inquiries without accounts, and invited ZINC staff use a private admin backed by Supabase.

**Authority (owner, 4 Oct 2026):**
1. The newest direct owner instruction.
2. Claude Design (the "Zinc Digital redesign" project; packaged export admitted 4 Oct 2026, Astro archive SHA-256 `a624cfec…d42d0`) for visuals, copy, pages and interactions. Where the code differs from the Design, the code is the defect.
3. The invariants below.

**Execution plan:** `.kiro/specs/create-a-complete-implementation-spec/` (`requirements.md`, `design.md`, `tasks.md`), run with the Kiro flow.
- `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` and `.planning/` are historical. Rules they state that were superseded are marked inline.
- They remain the source only for non-visual decisions the Kiro spec reuses.

## Invariants

- **Identity:** ZINC Digital's own site only. The live WordPress site, the July 2026 "Website V2" prototype and the `Zinc_Digital_Agency` repo are sources of facts and assets, never of design, copy or configuration.
- **Copy:** the Design's copy and voice.
  - General site copy follows the Design, without cursing or sales devices.
  - Owner, 6 Oct 2026: first-person Kirk/ZINC articles use `kirk-voice`: deadpan openings, supplied proof, one controlled dry joke at most. Retired mess-versus-math contrast hooks stay retired. Client bylines use `zinc-author-voice`, with no Kirk sarcasm or profanity.
  - No invented numbers. Content waiting on the owner renders nothing; no placeholder markers in pages.
  - Never "GEO" for generative search.
- **Performance:** LCP ≤ 1.2 s, CLS 0, INP < 100 ms, and at most 15 KB gzip first-party JavaScript per page.
  - Owner, 6 Oct 2026: approximately 1.5-second mobile loading is accepted for the illustrated articles and archive. Preserve the approved image resolution and quality; do not reduce them to chase the 1.2-second target.
  - Owner, 8 Oct 2026: prioritize image resolution and visible clarity over roughly half a second of load-time savings. Inspect for pixelation; preserve approved mockup compositions and use higher-density source captures where available. Do not lower image quality solely to chase the timing target.
  - Lighthouse runs and reports, but a score below 100 never fails a check.
  - The Google tag loads asynchronously and is counted separately (owner, 4 Oct 2026).
  - Accessibility: WCAG 2.2 AA.
- **No paid services** beyond current subscriptions (Vercel Pro, Google Workspace). No Cloudflare and no Docker. Paid AI and search providers stay off until the owner sets their keys.
- **Git (Kiro flow):**
  - Work runs in the spec's Kiro worktree on its `spec/<spec-slug>` branch. Milestones are the task groups in `tasks.md`.
  - Each milestone reaches `main` by squash-merged PR, with one Codex GitHub review requested on the final head and at most two review rounds. The branch is then reset to `main`.
  - Milestone merges are automatic once the required checks pass and the review is answered (owner, 4 Oct 2026; decision recorded 5 Oct 2026).
  - Pushes always name the branch.
- **Code scanning and review:** CodeQL stays off in every ZINC Digital repo (owner, 5 Oct 2026). Do not add CodeQL workflows or turn on code scanning default setup or Code Quality. Codex is the only reviewer; do not request Copilot or any other automated review.
- **Irreversible or production actions** need the owner's explicit go for that exact action:
  - DNS cutover;
  - production secrets;
  - applying database migrations or Auth settings;
  - merging to `main` outside a milestone PR, and the HSTS merge;
  - closing PRs;
  - deleting anything.
- **Runtime:** Node 24. This Mac's default `node` is 26, so run commands with `/opt/homebrew/opt/node@24/bin` first on `PATH`.
- **Time:** everything shown to the owner is America/Chicago (CT).
- **Storage:** all work, scratch and worktrees stay under `/Volumes/Satechi Hub/`.

## Approved illustration direction — owner, 6 Oct 2026

Use the approved smooth studio mockup illustrations across articles and case studies where they help explain the work. Vary GSC, GA4, Shopping, storefront and workflow compositions by topic; case studies use the client's own branding and appropriate screens. Keep report values private, with placeholder bars or em dashes, and remove browser URLs and cursors.

Mugs are white. Mix the supplied ZINC wordmark, Fusion badge and unbranded mugs; keep branding restrained rather than putting an icon on every object. Notebooks are matte black with white geometric sans `code()` and the short vertical rule from the owner's notebook reference. Preserve the exact images the owner already approved.
