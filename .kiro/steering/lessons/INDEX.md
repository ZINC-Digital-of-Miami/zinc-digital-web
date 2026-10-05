# Lessons ledger

Kiro steering: lessons from earlier milestones, one line each. Before working in an area, check the lines whose area **and** kind of work match. Record a new lesson, with its index line, in the same commit as the fix that taught it.

| Lesson | Touches | Kind of work | Hook |
|---|---|---|---|
| [astro-route-imports-bundle-css](astro-route-imports-bundle-css.md) | `src/pages/`, `src/styles/` | page templates | A route file ships the CSS of every component it imports, rendered or not |
| [visible-copy-from-rendered-design](visible-copy-from-rendered-design.md) | `src/data/site.ts`, footer | porting Design copy | Take visible text from the Design's rendered page, not its JSON-LD or data |
| [nth-child-of-selector-for-filtered-lists](nth-child-of-selector-for-filtered-lists.md) | `site.css` grids, `page.ts` filters | CSS layout | `:nth-child()` counts hidden items; use `:nth-child(An+B of S)` |
| [auto-margin-items-need-a-width](auto-margin-items-need-a-width.md) | `home.css` grid/flex items | CSS layout | An item with only max-width and an auto margin shrinks to its content |
| [js-gated-rules-must-win-specificity](js-gated-rules-must-win-specificity.md) | `.rv` reveals, scroll scenes | progressive enhancement | The JS "finished" rule must out-rank the hidden starting rule |
| [centre-field-before-reportvalidity](centre-field-before-reportvalidity.md) | `page.ts` contact form | forms | Native validation bubbles ignore the sticky header |
| [trailing-slash-on-endpoints](trailing-slash-on-endpoints.md) | `/api/*`, form actions | routing | With `trailingSlash: 'always'`, call endpoints with the slash |
| [vercel-redirects-before-slash-308](vercel-redirects-before-slash-308.md) | `astro.config.mjs`, `.vercel/output/config.json` | redirects, deploy | The adapter's trailing-slash 308 swallows alias redirects |
| [prove-the-check-before-the-site](prove-the-check-before-the-site.md) | `scripts/verify-site.mjs`, `check-site.mjs` | writing checks | A failing new check is suspect until shown against a known-good page |
| [capture-bypass-csp-and-remeasure](capture-bypass-csp-and-remeasure.md) | `scripts/capture.mjs` | visual review | Injected capture styles need CSP bypass; re-measure height each frame |
| [reviewer-agents-narrate-findings](reviewer-agents-narrate-findings.md) | visual review rounds (task 5.2) | review orchestration | Background reviewers die with the session and cannot write files |
| [node-test-needs-a-glob-for-ts](node-test-needs-a-glob-for-ts.md) | `package.json`, `tests/` | testing | `node --test tests/` finds no `.ts` files; pass a quoted glob |
| [chrome-needs-no-sandbox-locally](chrome-needs-no-sandbox-locally.md) | browser scripts on this Mac | tooling | Headless Chrome tabs crash locally unless `CHROME_NO_SANDBOX=1` |
| [branch-reset-after-squash-without-force-push](branch-reset-after-squash-without-force-push.md) | Kiro spec branch, milestone PRs | release flow | Force push is blocked; rebuild on `main` and merge the old head so the push fast-forwards |
| [keep-destructive-steps-out-of-chains](keep-destructive-steps-out-of-chains.md) | shell commands | tooling | One blocked step (rm -rf, amend+push) denies the whole chained command |
| [picture-contents-hides-sources](picture-contents-hides-sources.md) | `site.css` picture rule, `Img.astro` | CSS layout | `picture{display:contents}` makes its `<source>` elements layout items; hide them |
| [cover-images-need-height-sizes](cover-images-need-height-sizes.md) | `Img.astro` cover prop, case images | images | Cover images in tall boxes need `sizes` from their height, not `100vw` |
