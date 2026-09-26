# Quick task 260926-6g7 — "team" sub-task review

Staff photos: fix Jaymie's selfie-arm pose, make all seven team-band photos
look like one consistent set (same 4:5 frame, same output size, same face
scale/position, uniform background, matched grayscale). Worktree:
`/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260926-6g7-team`,
branch `gsd/quick-260926-6g7-team`, base `65f60b0`.

## What changed

- New reproducible pipeline: `scripts/prepare-team-photos.swift` (Apple
  Vision face-landmark + person-segmentation helper, run via `swift`) and
  `scripts/prepare-team-photos.mjs` (orchestrator — sharp + the Swift
  helper). Regenerates all seven `public/mockup/*.webp` team photos from
  their highest-quality originals on every run.
- `assets/team/manifest.json` — per-image face box, crop/placement, output
  size, and the *achieved* (re-measured, not assumed) face position for
  every photo.
- `src/data/assets.preview.json` — updated all 5 existing team entries
  (new dimensions/hashes from the regenerated pipeline) and added
  `jaymie-wilhoit` and `wendy-funnell`.
- `src/data/mockup.ts` — `jaymie-wilhoit` and `wendy-funnell` now have
  `photo` ids instead of `null`; widened `TeamMember.photo` to `string|null`
  (see TypeScript note below).
- `src/components/TeamBand.astro` — removed the two now-dead `initials`
  entries (Jaymie/Wendy no longer render the `[PHOTO PENDING]` branch); the
  branch itself is kept for any future hire without a photo.

## Highest-quality originals actually used

Per "work from the highest-quality original available," I did not
regenerate from the already-`webp`'d `public/mockup/*.webp` files (lossy,
already-cropped) or from `assets/team/originals/*` for the five existing
staff. I pulled the raw pre-compression uploads out of the same source zip
`prepare-mockup.mjs` already reads
(`/Volumes/Satechi Hub/ZINC Digital Agency/ZINC Digital Agency Website
V2.zip`), per `docs/team-photos-status.md` (a status note left inside that
zip by the earlier session, confirmed by reading it directly):

| Person | Source used | Note |
|---|---|---|
| Kirk Musick | `uploads/kirkmusick.png` (2046x2048) | Same photo as `assets/kirk-musick.png` (600x600, the prior "reference, grade untouched"), just uncompressed and 3.4x higher resolution — confirmed by side-by-side comparison. |
| Bethany McKinzie | `uploads/priya 2.png` (1856x2304) | Misnamed upload; confirmed as Bethany's real source — matches the exact `[348,100,1160,1450]` crop the status doc records for her, and the face is Bethany's, not Priya's. |
| Priya Nahar | `uploads/Priya-ac3b8f75.png` (2048x2050) | |
| Martin Stewart | `uploads/MartinStaff.png` (2048x2066) | Only existing source: a profile performance candid (cap, glasses, mic, raised hand), not a studio headshot — flagged as a known gap in the status doc itself. |
| Dr. Basset | `uploads/DrBasset.png` (2048x2050) | Status doc flagged "small sparkle/upscaler artifact, NOT yet removed" — resolved by the grayscale+normalise pass (see below). |
| Jaymie Wilhoit | `assets/team/originals/jaymie-wilhoit-original.webp` (1600x900, supplied by owner) | |
| Wendy Funnell | `assets/team/originals/wendy-funnell-original.webp` (1600x900, supplied by owner) | |

## How consistency was achieved (measured, not eyeballed)

1. Vision (`VNDetectFaceLandmarksRequest`) detects each source's face
   bounding box + eye landmarks at native resolution.
2. The whole source image is scaled so the **face bounding-box width**
   hits exactly 40% of the 800x800→800x1000 output frame width. Face-box
   width (not interocular distance) was chosen deliberately: it's pose
   robust. Martin's profile candid foreshortens his apparent eye separation
   (measured interocular/face-width ratio 4.73 vs 2.80-2.87 for the six
   forward-facing subjects) — an IOD-based scale would have made him look
   disproportionately close. Face-box width does not have that failure mode.
3. The scaled image is composited onto a fixed 800x1000 solid `#F5F6F7`
   (snow — the page's own ground color) canvas, positioned so the eye line
   lands at 40% of frame height and the face is horizontally centered.
   Anything outside that fixed canvas — including Jaymie's outstretched
   arms — is simply not drawn. This is what removes the selfie-arm look:
   no special-case crop, just the same consistency rule applied to everyone.
4. Vision (`VNGeneratePersonSegmentationRequest`, `.accurate`) cuts the
   person out of the fixed background before compositing, feathered 1.5px
   for a soft edge (no hard-cutout halo).
5. Grayscale + `sharp().normalise()` (auto contrast-stretch) + `median(3)`
   (denoise/deblock only — no face retouching), applied identically to all
   seven.
6. Vision re-runs on the *finished* output to record what was actually
   achieved, not just the target — written into `assets/team/manifest.json`.

### Measured before/after (face-box width as a fraction of frame)

Target: 0.400 face-width-fraction, 0.400 eye-line-fraction, for all seven.

| Person | Before (raw source, uncropped) | After faceWidthFraction | After eyeLineFraction | Mask holes filled (px) |
|---|---|---|---|---|
| Kirk Musick | 0.490 | 0.412 | 0.400 | 19 |
| Jaymie Wilhoit | 0.166 | 0.411 | 0.401 | 9 |
| Wendy Funnell | 0.269 | 0.402 | 0.399 | 877 |
| Bethany McKinzie | 0.298 | 0.400 | 0.401 | 151,313 |
| Priya Nahar | 0.465 | 0.401 | 0.401 | 25 |
| Martin Stewart | 0.205 | 0.392 | 0.399 | 22,931 |
| Dr. Basset | 0.497 | 0.410 | 0.400 | 0 |

Before ranged 0.166-0.497 (a ~3x spread — the raw sources were never
consistently framed); after, every one of the seven lands in
0.392-0.412 (faceWidthFraction) and 0.399-0.401 (eyeLineFraction).

### Bugs found and fixed while building the pipeline

- **sharp does not reliably apply `.grayscale()`/`.normalise()`/`.median()`
  chained directly after `.composite()` on the same pipeline object.**
  Measured directly: a synthetic colored overlay composited onto a gray
  canvas, then `.grayscale()`, still measured `avgSat > 0.5` in the output
  — grayscale silently had no effect. First full run of all seven showed
  the same signature: three of seven (whichever needed `.extract()` inside
  `placeOnCanvas`) kept `avgSat` 0.12-0.18 instead of ~0. Fix: resolve the
  composite to a buffer, then start a **new** `sharp()` pipeline for the
  pixel-level operations. Re-measured all seven at `avgSat ≤ 0.0001` after
  the fix.
- **`VNGeneratePersonSegmentationRequest` punched holes into two photos.**
  Martin's mask excluded a ~23k-pixel pocket right at his mic/hand (a held
  object confused the segmenter); Bethany's mask excluded ~151k px across
  her patterned blouse. Both showed as bite-shaped gray gaps in the
  composite. Fixed with a flood fill from the mask's border: any
  background-valued pixel *not reachable from the image edge* is an
  enclosed pocket, not real background, so it's reclassified as person.
  This never invents pixels — it only exposes real source pixels the
  Vision model mis-classified — and it can't touch the true outer
  silhouette, since genuine background is always reachable from the
  border. Verified by re-inspecting both crops after the fix (clean shirt
  fabric, clean mic/hand area, no holes).
- **`npm run check` regression (real, not pipeline-related):** with every
  team member now holding a non-null `photo`, TypeScript correctly
  determined `TeamBand.astro`'s `[PHOTO PENDING]` else-branch was
  unreachable (`person` narrowed to `never` in that branch) and errored on
  `person.id`. Fixed by declaring `TeamMember.photo: string|null` explicitly
  in `mockup.ts` instead of inferring it via `as const`, so the branch
  stays valid dead code for a future hire without a photo yet, rather than
  deleting the branch.

## What could not be made fully consistent (and why)

**Martin Stewart** — the only available source is a profile performance
candid (cap, sunglasses/glasses, microphone, casual t-shirt, raised hand),
not a forward studio headshot. Face-box-width scaling keeps his apparent
head size identical to the other six (faceWidthFraction 0.392 vs
0.392-0.412 for everyone else), and the same background/grayscale
treatment applies — but pose, attire, and camera angle are inherently
different, and no amount of cropping fixes that without a new photograph.
This exact gap was already flagged, independently, in the source zip's own
`docs/team-photos-status.md` ("Consider a forward studio shot for full
consistency") — not something I'm newly discovering, just confirming it's
still true and that a crop-only fix has a hard ceiling.

**Dr. Basset's sparkle/upscaler artifact** — the status doc flagged a
small colored artifact in the lower right, not yet removed. Measured: the
raw upload's average saturation was ~0.03 (vs ~0.0001 for Kirk, the fully
neutral reference) with isolated maxSat 1.0 pixels — consistent with a
small stray-color speck. The mandatory grayscale + normalise + median(3)
pass (applied identically to all seven, not special-cased for him)
neutralizes any stray color and softens isolated pixels. The visible
five-pointed sparkle **glyph** itself is not an artifact — it appears in
the exact same position/shape in Kirk's "reference, grade untouched" photo
too, so it's an intentional branding mark baked into that studio session,
not something to remove.

## Gate

Run from the worktree, each command's own exit code:

```
npm run check              EXIT=0
npm run build               EXIT=0
node scripts/check-site.mjs EXIT=1  (see below — not a regression I can fix in scope)
```

Logs: `/private/tmp/claude-501/-Volumes-Satechi-Hub-zinc-digital-web/4d63e2c8-f06b-433f-b6af-2afc7f083cb8/scratchpad/team-check2.log`,
`team-build.log`, `team-checksite.log`.

**`check-site.mjs` failure is expected and out of my edit scope.**
`scripts/check-site.mjs:286` asserts
`check(html.includes('[PHOTO PENDING]'), ...)` against the built homepage —
written when Jaymie and Wendy had no photo. Now that both have real photos
(the actual goal of this sub-task), that marker legitimately does not
appear anywhere in the built site anymore; this is not a bug I introduced,
it's a stale assertion the check-site owner needs to relax (e.g. drop the
assertion, since draft-honesty markers elsewhere — `[OWNER CONFIRM]`,
`[RECEIPT:`, `[LOGO FILES PENDING` — still pass unchanged). I did not edit
`scripts/check-site.mjs` because it is not in my granted edit scope for
this sub-task (only `public/mockup/*`, `assets/team/**`,
`src/data/mockup.ts` team fields, `src/data/assets.preview.json` team
entries, `src/components/TeamBand.astro`, and `scripts/prepare-team-photos.*`
were granted) — flagging for the orchestrator instead of touching a file
another wave may own.

## Screenshot evidence

Served `dist/` locally (`python3 -m http.server`, stopped after capture),
drove it with `puppeteer-core` + the system Chrome, screenshotted
`.team-band` on `/` and `/about/` at 1440 and 375 CSS px, and read every
image. All four renders show seven consistent grayscale headshots, correct
names/roles, no `[PHOTO PENDING]` markers, no visible halos or holes at
render size.

Contact sheet (all seven at rendered size, 176x220 CSS px, measured via
`getBoundingClientRect()` on `.team-band-photo` at 1440 width — actual
measured box was 175.53x219.41):
`.planning/quick/260926-6g7-restyle-every-page-to-the-owner-picked-a/evidence/team-contact-sheet.png`

Output size: 800x1000 (4:5), ~4.56x the largest measured rendered box
(175.53x219.41 CSS px @1440) — comfortably over the "at least 2x" floor,
with margin for retina displays.

## Face measurements (raw numbers)

Full per-image detected face box, eye landmarks, scale, placement, and
achieved measurements: `assets/team/manifest.json`.
