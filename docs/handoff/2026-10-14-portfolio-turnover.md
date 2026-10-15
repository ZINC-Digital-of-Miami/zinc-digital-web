# Portfolio and Services turnover — 14 October 2026, 9:15 PM CT

## Goal and stopping point

The owner requested **TURNOVER**. Implementation has stopped. Preserve the working tree and continue from the unresolved design corrections below. **The current design is not accepted, finished, or ready to merge.** The owner repeatedly rejected the latest Services treatments, then requested better universal devices and correction of the Home hero's rectangular background patch. Those last two corrections have not been implemented.

The broader task remains: reconcile every correction in this conversation across Home, Work, service lanes, Services and all client case studies. Fix pixelation, incorrect attribution, repeated artwork, weak case-study presentation and inconsistent heroes without losing approved scope.

## Workspace and live state

- Worktree: `/Volumes/Satechi Hub/zinc-digital-web-worktrees/uniform-case-devices`
- Branch: `codex/case-study-heroes`
- HEAD: `990385c475dcac5769fac031a4034f333fb397a8`
- Draft PR #32: <https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/32> — verified OPEN and draft at turnover.
- **All changes after this HEAD are uncommitted and unpushed.** The PR does not contain the latest work described here.
- Primary checkout `/Volumes/Satechi Hub/zinc-digital-web` contains unrelated work. Do not reset, clean, or replace it.
- Owner-visible dev preview: <http://127.0.0.1:4328/>; Node PID 58826, restarted during this session.
- Built preview: <http://127.0.0.1:4329/>; Python PID 52366 serving this worktree's `dist/client`.
- Latest successful production build: **9:10:05 PM CT**. No universal-hardware or Home patch fix was included; those remain open. Rebuild after implementing them.
- Node 24: `/opt/homebrew/opt/node@24/bin`.
- Scratch: `.scratch/`; browser artifacts: `.playwright-cli/`. Do not commit either.
- Carla concept source preview may still be running at4335, serving `/Volumes/Satechi Hub/Codex/carla-design-review-2026-10-14/site/dist`.

The historical `.planning/HANDOFF.json` contains obsolete review-bot instructions. Current owner AGENTS instructions govern: no Codex/Copilot review requests; use a fresh focused agent when review is required. No production deployment or merge was authorized in this turn.

## Latest owner corrections — highest priority

1. **“USE BETTER … DEVICES … MAKE IT UNIVERSAL.”** The owner rejected the homemade CSS laptop/phone/monitor quality. Establish one realistic, high-quality device family and shared screen-fitting implementation. Do not build more unrelated frame styles. Use authentic client screens; preserve source density and device proportions.
2. **Home has an obvious rectangular patch.** Owner screenshots:
   - `/Users/zincdigital/Downloads/Screenshot 2026-10-14 at 9.13.07 PM.png`
   - `/Users/zincdigital/Downloads/Screenshot 2026-10-14 at 9.12.57 PM.png`
   `home/ApprovedHero.astro` puts `BuildHeroArt` in `.zn-stage` within `.wrap`. `BuildHeroArt` paints its own `#101519` background and diagonal `.build-plane`, visibly bounded by the stage rectangle against the Home background. Remove this boundary and compose the layers continuously across the whole hero. The source inspection confirmed the cause; no fix was applied before turnover.
3. **Services must be designed mockups, not pasted rectangles or miniature whole-hero scenes.** The owner rejected both approaches during this turn. The current third attempt uses `ServiceLaneMockup.astro` with one CSS laptop/phone/monitor and flat gray planes. The device quality was then rejected; it is an intermediate implementation only.
4. **Watch repeated images and softness.** Work hero initially repeated Bear Claw on laptop and phone. It now shows Bear laptop, Andrew Neese tablet and U.S. Oil mobile upgrade. Three distinct clients is an improvement, but the homemade frames and remaining softness still need the universal-device pass.
5. **Do not interpret passing checks or reviewer comments as visual acceptance.** Reviewers repeatedly reported bounded layout checks passing while the owner still rejected the design. Judge the actual screenshot composition at the owner's viewport, especially1041×830, and at mobile390.

## Recommended continuation, in order

| Step | Concrete scope | Completion evidence |
|---|---|---|
| 1 | Select one realistic device family and implement its native screen coordinates in one shared component. Keep the current assets/screens and required content. | Whole hardware, sharp screen fit and plausible proportions at card and hero sizes; no new paid services. |
| 2 | Apply that component to Services first, then Work/lane/client/Home device presentations. Preserve the special canonical LVS composition and approved Fusion scene. | Inspect Services at1041×830 and390, and the hero/card variants before propagating further. |
| 3 | Remove the Home stage background seam; extend the visual planes through the parent hero. Check all three Home tabs and lower Home bands. | No rectangular edge at the stage top/right; layers look continuous in the actual4328 preview. |
| 4 | Finish the image/semantics sweep against the owner requirements below. | Correct clients, versions, status labels, no duplicate filler, real screenshots and no clipped hardware. |
| 5 | Rebuild, verify changed behavior and resolve required review. Update PR32 with the actual final change and honest source/performance gaps. | Fresh checks plus visual evidence; preserve draft status until remaining launch requirements are satisfied. |

Do not repeat broad redesigns of unrelated page structures. Carry the owner's direction forward and make bounded, inspectable corrections.

## Universal hardware sourcing started, not implemented

- Existing `src/assets/devices/level-device-frame.png` is a1536×1024 four-device composite. It is used by `DeviceComposition.astro`; it is not the new shared realistic single-device system. Its old white-device styling and precomposed arrangement may not satisfy the latest direction.
- A free800×489 MacBook frame was downloaded only to `.scratch/macbook-pro-frame.png` from Mobile FIRST. It is too small for a large DPR2 hero and **must not be enlarged into another pixelated solution**. No paid HD version was purchased.
- An alternative source was discovered: <https://github.com/jamesjingyi/mockup-device-frames>. README credits MacBook Pro, iPad Pro and iPhone16 frames to Apple Developer Resources. Native files have not been downloaded into production, licensed/usage conditions have not been fully evaluated, and no screen coordinate mapping has been implemented.
- API tree saved in `.scratch/device-tree.json`; README in `.scratch/device-readme.md`. Relevant paths:
  - `Exports/MacBook/MacBook Pro/16/MacBook Pro 16 - Space Black.png`
  - `Exports/MacBook/MacBook Pro/14/MacBook Pro 14 - Space Black.png`
  - `Exports/iOS/16 Pro/16 Pro - Black Titanium.png`
  - `Exports/iPadOS/iPad Pro/M4 & M5/11/iPad Pro 11 M4 & M5 - Portrait - Space Black.png`
- This is a lead, not an approved asset choice. Prefer the simplest sufficient authentic hardware source, adequate native density and consistent framing.

## Owner requirements that must survive

- Main Work: one entry per **client**, with website, app, campaign and SEO work grouped within that client. OUABC BI is part of OUABC. Service-lane pages may show relevant work and link to the same case study.
- All portfolio heroes: equal height at each breakpoint, copy left, substantial brand-appropriate art right as part of the background, bottom navigation rail. Current shared heights are680px desktop,720px tablet,760px mobile. A consistent system must not mean repeating the same image everywhere.
- Smooth, clean layered/diagonal backgrounds. Content surfaces white or flat neutral gray. No grain/material texture, beige effects, pasted image boxes, cheap AI-looking scenery, invented interfaces or glowing fake props.
- Client hero tone comes from real brand/content: brick for General Shale, equipment/yards/construction for Meade Tractor, medical for Ballad. Strong screens and photographs; plain white website mockups are unsuitable hero highlights.
- U.S. Oil: multiple website/app projects and some local SEO, not an SEO-only client. Existing site around3years old; second site/upgrade in development. Preserve three second-site page captures and app evidence.
- Carla: current client,2025 website, one-year upgrade and admin image uploader. Preserve original/current and concept distinctions.
- Lampstand: existing ZINC site around4years old, ongoing pro bono support and warm editorial upgrade in review.
- Ballad: past SEO technician engagement for2018 merger, thousands of pages, not a ZINC website build. Meade: past enterprise local SEO. General Shale: past national enterprise SEO.
- LVS final restaurant site: exactly the owner's supplied composition, not the earlier medical/HeartStart storefront. Remove redundant before/after boards; show distinct production details.
- Summit: later current waterfront site was not ZINC's build. Use correct original archive, brand/design/advertising assets. Do not invent a before/after pair.
- OUABC flower-vase “FROM PAGES TO PRODUCTS” site is historical. Never use it as rebuild highlight. Use the actual newer “BRINGING BOOKS TO LIFE” capture and group campaigns/BI under OUABC.
- Smoky Mountain: include supplied hiking, training, camping and About source images; retain the approved device presentation as appropriate.
- Bear: substantial distinct home/product/about/quote chapters. No repeated top/bottom collage as filler.
- Genuine before/after sliders wherever the source pair exists. Preserve controls, keyboard use and source qualifiers.

## Current implementation and important files

### Hero/device/layout code

- `src/components/BuildHeroArt.astro`: Bear laptop + Andrew original website tablet + UOS upgrade phone;2D rotations replaced3D perspective. Still homemade CSS frames; background patch remains on Home.
- `src/components/ServiceLaneMockup.astro` **untracked**: current third Services treatment; one large CSS laptop/phone/monitor on gray diagonal planes. Owner rejected the device quality after this implementation.
- `src/components/DesktopMockup.astro`: native screenshot ratio by default; optional ratio; size-fit variable; own-width spacer instead of parent-relative bottom padding. Homemade monitor/phone still needs replacement by shared hardware.
- `src/components/CaseHeroMockup.astro`: SEO/Andrew monitor now width70%, margin0. This last change fixed the Work-grid stand being cut off; it is newer than the built preview.
- `src/components/CaseStudyHero.astro`: consolidated CSS, shared heights, correct source mappings, real SEO photography, bounded approved Fusion scene; original Summit photo and canonical LVS final with supporting original flyer.
- `src/components/DemandHeroArt.astro`: current General Shale website plus original OUABC campaign art; rejected synthetic dock/search scene removed from this route.
- `src/components/IntelligenceHeroArt.astro` **untracked**: real OUABC demand calendar and seasonal outlook, with development qualifiers.
- `src/components/Page.astro`: Services card wiring; corrected service proof mappings; case body deduplication; correct status and attribution.
- `src/components/home/ApprovedHero.astro`: Home stage wrapper is relevant to the latest patch defect. Its slide alt metadata still mentions OUABC phone/Summit despite the replacement compositions; fix while touching this component.
- `src/components/home/HomeBands.astro`: lowerBuild wrapper width100%, laptop capped460px/top19% to avoid clipping; lowerDemand uses shared art. Recheck with final universal hardware.
- `src/styles/site-direction.css`, `src/styles/studio.css`: shared layout/gray surfaces. The generic Services image aspect rule was narrowed to direct CaseScene content so it no longer distorts nested devices.
- `src/components/ApprovedImage.astro`: larger responsive candidates without upscaling beyond native asset width.
- `DESIGN.md`: rewritten to reflect owner direction. It describes the current one-device Services concept, but hardware quality remains unaccepted and must be updated after final implementation.

### Semantics and redundancy repairs in working tree

- `src/data/site.ts`, `src/data/work-lanes.ts`: service/client mappings corrected; Carla/Felon included inBuild; OUABC BI names the client; UOS development badges and website/app scope.
- WorkOverview remains18 unique client entries. No separate OUABC BI client card.
- Removed duplicate OUABC homepage device blocks; retained hero, genuine comparison, campaigns and BI.
- Removed duplicate UOS bottom website section; existing three-pageCaseScreens wrapper has`id="website"`.
- LVS redundant final collage/legacy closing removed; canonical final retained in hero and comparison.
- Summit responsive original device board available in a details element; brandbook no longer repeated twice.
- Bear chapter surface beige→white; distinct screenshot chapters retained.
- Felon small source images constrained to native size instead of enlarged into soft large gallery panels.
- Andrew body original full-page website uses bounded keyboard-scroll presentation; caption corrected to “Original desktop capture.”
- Removed a generic lane-scene loop from case bodies that duplicated Fusion and reintroduced rejected synthetic Summit imagery.
- Lampstand comparison uses actual desktop region of original concept board: crop`{left:32,top:38,width:1034}`, maxWidth517 and aspect1440/1000. Full board remains linked in design review.
- Carla concept comparison now uses a real DPR2 capture from the original concept HTML.

## Sources recovered or replaced

New production files still untracked:

- `src/assets/work/carla/upgrade-heirloom-desktop.png` —2200×2658, original Heirloom HTML element captured atDPR2.
- `src/assets/work/case-material/andrew-original-website.jpg` —1262×6102, copied from `/Users/zincdigital/Desktop/Andrew Neese, REALTOR with Prestige Homes.jpg`.
- `src/assets/work/case-material/summit-original-hero.png` —2300×1000, actual original seawall photo with original wave overlay. Source: `/Users/zincdigital/Downloads/Organized_Projects/Other_Misc_Files/Folders/file-export-47698836-1737839056218-0/Summit Hero Sized Images wUpscaling.png`.
- `src/assets/work/seo-sites/ballad-health-scene.jpg` —1920×1920 official Nursing Students photo.
- `src/assets/work/seo-sites/meade-tractor-scene.jpg` —2560×2048 official tractor photo.

Updated originals:

- Carla desktop/tablet/mobile: freshDPR2 public site captures at2880×2000,1640×2200,780×1688.
- Ballad current screenshot:2880×2000 from <https://www.balladhealth.org/careers/nursing>, with cookie/apply/chat overlays dismissed through actual controls. Earlier plain primary-care capture with chat popup was explicitly rejected and has been replaced. Registry source URL updated.
- Meade and General Shale current website captures:2880×2000, cookie overlays dismissed. Shale real brick photography:1920×1080.
- `lvs-restaurant-header.png`: replaced768px derivative with original2000×1000 from DevKinsta uploads.
- `assets.site.json`: source metadata/dimensions updated.

Canonical LVS final remains byte-identical to `/Users/zincdigital/Downloads/all-devices-black-21.bak.png` at `src/assets/work/lvs-case/devices-restaurant.png`. Preserve that invariant.

## Genuine source constraints — keep required work active

- Summit authentic before/after pair unresolved. HubSpot archive has original CSS/files but is missing custom navigation/slider module assets; a diagnostic local reconstruction is not a valid source screenshot. Do not publish `.scratch/summit-archive/recovered-desktop.png` or substitute the later third-party website.
- Lampstand concept source is a1410×1116PNG, byte-identical to `/Volumes/Satechi Hub/The Lampstand/The Lampstand warm editorial redesign-1.png`. The live design review is an image viewer, not underlying HTML. Do not fake a higher-resolution recapture.
- Some existing originals have limited density: LVS final1800×760, original LVS before1160×551, Summit composite1930×815, OUABC1774×887/older1610×906; Felon sources425–720px. Fit at sensible sizes, use actual originals and pursue better source material without inventing detail.
- Porsche authentic project website source remains unresolved; current presentation is labeled illustrative. Preserve the project and investigate the actual source rather than silently dropping it.
- Earlier local Lighthouse evidence was LVS performance97/LCP2.6s; the approved1.2s launch gate was not met. This turn did not resolve or freshly rerun that gate. Keep the PR draft and do not claim launch readiness.

## Verification and its limits

Latest completed checks:

- Build succeeded9:10:05PM CT.
- `npm run check`:202files,0errors,0warnings,9hints.
- `node scripts/check-site.mjs`: all checks passed across86HTML files.
- `.scratch/verify-heroes-built.js`:36route/viewport checks,18cases at1440 and390. Checks verified one hero/heading, loaded images, working hero anchors, no horizontal overflow and no escaped ampersand in titles. **These are structural checks, not proof of design quality.**
- Prior visual sweeps covered18case heroes at1440/1041/390 plus Work/lane/service views. Focused reviews caught clipping and source errors. Some later bounded reviews reported no blocking layout findings, but the owner subsequently rejected device quality and the Home patch. **Owner feedback overrides those aesthetic pass statements.**
- `.scratch/review-corrections/final-*` and `.scratch/audit-design-*` hold screenshots. Most useful root evidence:
  - `.scratch/services-mockups-1041.png`: current CSS-device Services treatment subsequently rejected for device quality.
  - `.scratch/ballad-card-final.png`: updated nursing source before the final width70% stand correction.
  - `.scratch/work-final-1041.png`: distinct-client hero, still improvised devices.
- Browser screenshots must await font/image decode and reveal transitions; an immediate screenshot after scroll produced a misleading blank once.
- Dev4328 has shown stale scopedCSS during repeated edits. It was restarted asPID58826. Rebuild/restart if rendered output and source disagree, then inspect the actual owner-visible4328preview.

## Turnover discipline

Leave all source and assets intact. No cleanup/deletion, merge, deployment, purchase or new external message is authorized by this turnover. No new paid services. Do not revert another checkout or discard this uncommitted work. Read the newest owner requirements first, implement the universal-device and continuous-background corrections, and show a concrete visual result before claiming completion.
