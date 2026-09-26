> **CORRECTION (2026-09-25 8:09 PM CT), owner, verbatim:** "I never said to remove B." The "Pairing A only, Pairings B and C are dropped" statement below was the orchestrator's misstatement, not an owner decision. It is withdrawn. Font selection stays open; Pairing B is kept. The owner asked for a mockup of A and B together. The BLOCKER built on that premise is void.

# Ingest Synthesis — zinc-digital-web

**Mode:** merge · **Run date:** 2026-09-25 (CT) · **Classifications consumed:** 3 (from `.planning/intel/classifications/`)

This file is the entry point for `gsd-roadmapper`. Read this first, then the per-type files, then `INGEST-CONFLICTS.md` for anything that gates or needs a choice.

## Doc counts by type

| Type | Count | Sources |
|---|---|---|
| ADR | 0 | — |
| SPEC | 1 | `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` |
| PRD | 0 | — |
| DOC | 2 | `docs/handoff/2026-09-25-turnover.md`, `docs/handoff/2026-09-25-turnover-complete.md` |
| UNKNOWN (low confidence) | 0 | — |

Cross-ref graph: no cycles detected (spec has no cross-refs; both DOCs reference the spec and internal `.planning`/`src` paths, never each other or back into a loop). No max-depth issue. All 3 classified docs were synthesized; none were excluded.

## Decisions locked

0 ADR-type decisions extracted (no ADR-classified sources in this ingest). See `decisions.md` for the explicit absence record and pointers to where decision-shaped content actually lives (SPEC → `constraints.md`; DOC decision register → `context.md`).

## Requirements extracted

0 PRD-type requirements extracted (no PRD-classified sources in this ingest). See `requirements.md` for the explicit absence record. Note: a full 57-requirement register (DSGN/MOTN/LOOP/HOME/SERV/WORK/ABOU/CONT/BLOG/COPY/SEO/MIGR/QUAL/LNCH, v1 + v2 + out-of-scope + traceability) exists verbatim inside the DOC-classified `docs/handoff/2026-09-25-turnover-complete.md` and is filed in `context.md` per type-routing rules — it is a stale snapshot of an earlier `DSGN-01` wording than the project's current, existing `.planning/REQUIREMENTS.md`.

## Constraints

22 constraint entries extracted from the one SPEC source, in `constraints.md`:
- type `nfr`: 17 (objective/audience/positioning, services taxonomy, homepage bands, service/case-study/about/contact/blog templates, voice, visual system, motion system, performance gates, SEO, proof/content inputs, hosting/budget, delivery process, out of scope, resolved decisions)
- type `schema`: 2 (site map/URL structure, content-collections schema)
- type `protocol`: 3 (content migration & redirects, form-delivery SMTP flow, launch/cutover)

## Context topics

2 source documents, 15 topic entries total in `context.md`, plus one dedicated "Owner corrections postdating every ingested doc" topic (5 corrections, individually cross-checked against every other source) and one "existing GSD project state" cross-reference topic (read-only, not modified).

## Conflicts

**1 blocker, 1 warning, 5 auto-resolved (info).** Full detail in `../INGEST-CONFLICTS.md`.

- BLOCKER: the font pairing pick. An out-of-band owner correction (Pairing A only, chosen ~5:30 PM CT) contradicts a *locked* decision in the existing `.planning/phases/01-design-system-font-pick/01-CONTEXT.md`, the existing `.planning/REQUIREMENTS.md` DSGN-01 wording, and the existing `.planning/STATE.md`'s in-flight execution of "01-03 complete-site font comparisons." This is not auto-resolved — GSD's own rule against picking a winner between two locked decisions applies. Needs explicit owner/operator confirmation before any further Phase 1 work proceeds, because work may currently be in flight on now-superseded pairings B/C.
- WARNING: the owner has forbidden the section-sign character (U+00A7) project-wide; it is pervasive in the existing `.planning/PROJECT.md` and `.planning/REQUIREMENTS.md` as well as every ingested source. This synthesis avoids it throughout, but the existing files were not edited by this agent and still need a heading-name remap.
- INFO ×5: font-pick precedence over non-locked SPEC/DOC prose; GitHub Actions workflow resolved (confirmed independently by `STATE.md`); Vercel Git connection now made; SPF now fixed; "5-7 days" timeline tempered by "design needs a lot of work first."

## Files in this synthesis

- `decisions.md` — ADR extraction (empty; explicit absence record)
- `requirements.md` — PRD extraction (empty; explicit absence record + pointers)
- `constraints.md` — 22 SPEC-derived constraints
- `context.md` — DOC-derived topics + owner corrections + existing-state cross-reference
- `../INGEST-CONFLICTS.md` — full conflict report (1 blocker / 1 warning / 5 info)

## Status for routing

**STATUS: BLOCKED** — one BLOCKER exists (font-pairing LOCKED-vs-LOCKED contradiction). Per the doc-conflict-engine safety gate, do not write any destination file (`PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`) until the blocker is resolved with the owner, regardless of the WARNING/INFO counts.
