# Technology Stack

**Analysis Date:** 2026-09-25

## Languages

**Primary:**
- Astro component templates with TypeScript frontmatter: `src/pages/design-preview/a.astro`, `src/layouts/PreviewLayout.astro`, `src/components/MockupBands.astro`, and `src/components/bands/Hero.astro` constitute the authored page/component implementation.
- TypeScript 6.0.3 is pinned in `package.json` and resolved in `package-lock.json`; props use local `interface Props` declarations in `src/layouts/PreviewLayout.astro` and `src/components/bands/Hero.astro`.

**Secondary:**
- CSS implements tokens, typography, theme mappings, and responsive layout in `src/styles/tokens.css`, `src/styles/themes.css`, `src/styles/base.css`, and `src/styles/pairings.css`; components also contain scoped `<style>` blocks.
- JavaScript ES modules configure Astro in `astro.config.mjs`; `package.json` declares `"type": "module"`.
- JSON configures TypeScript, deployment headers, and dependencies in `tsconfig.json`, `vercel.json`, and `package.json`.

## Runtime

**Environment:**
- Node 24.x is the project requirement in `package.json` and `AGENTS.md`. The current shell and hosted Node versions were not measured.
- Static generation is explicitly selected with `output: 'static'` in `astro.config.mjs`. No authored server endpoints, browser scripts, or hydrated framework components occur in the current `src/` implementation.

**Package Manager:**
- npm lockfile: `package-lock.json`, lockfile format 3. `package.json` does not pin a package-manager version.
- Lockfile: present and tracked. Direct dependency versions in its root package match `package.json`; local `node_modules` contents were excluded from inspection, so locked versions are not a claim about the installed tree.

## Frameworks

**Core:**
- Astro 7.3.5 — static page generation, file-based routing, scoped component styles, and font assets; pinned in `package.json` and `package-lock.json`, configured by `astro.config.mjs`.
- No React, Vue, Svelte, Tailwind, or component-library integration is declared in `package.json` or used by `src/`.

**Testing:**
- `@astrojs/check` 0.9.10 — Astro/TypeScript checking via `npm run check`; `package.json`, `tsconfig.json`.
- `@axe-core/cli` 4.13.0 — declared accessibility audit tooling; `package.json`, `package-lock.json`. No authored audit script/configuration is present.
- `@lhci/cli` 0.15.1 — declared Lighthouse CI tooling; `package.json`, `package-lock.json`. No authored Lighthouse CI configuration is present.
- No unit/integration/E2E test runner or test script is declared in `package.json`; no authored test files are present in the tracked source inventory. These tools were not run during mapping.

**Build/Dev:**
- Vite 8.3.1 is resolved transitively in `package-lock.json`; no separate Vite config is authored.
- Available commands from `package.json`: `npm run dev` (`astro dev`), `npm run build` (`astro build`), `npm run check` (`astro check`), and `npm run astro` (`astro`).
- `tsconfig.json` extends `astro/tsconfigs/strict`, includes `.astro/types.d.ts` and `**/*`, and excludes `dist`.

## Key Dependencies

**Critical:**
- `astro` 7.3.5 supplies the page/compiler/build framework and the `astro:assets` `Font` component used in `src/layouts/PreviewLayout.astro`; `package.json`, `package-lock.json`.
- `@astrojs/vercel` 11.0.11 supplies the configured hosting adapter through `adapter: vercel()` in `astro.config.mjs`; `package.json`, `package-lock.json`.
- `typescript` 6.0.3 supplies type tooling for Astro frontmatter and strict checking; `package.json`, `tsconfig.json`.

**Infrastructure:**
- Built-in Astro font providers are configured in `astro.config.mjs`: Fontsource for Big Shoulders Display 800, Google for Inter 400 and JetBrains Mono 400, all normal style and Latin subset.
- `src/layouts/PreviewLayout.astro` consumes those fonts through `Font`; only the display font has `preload`. `src/styles/pairings.css` maps their generated CSS variables into the active `data-pairing="a"` tokens.
- Sharp 0.35.4 is resolved transitively in `package-lock.json`. No image-processing implementation is authored in `src/`; do not describe the dependency as a working site image pipeline.

## Configuration

**Environment:**
- No environment-variable reads are present in authored `src/` or `astro.config.mjs`. The current preview does not implement an environment-dependent application integration.
- `.gitignore` excludes `.env` and `.env.*` with an `.env.example` exception; `.vercelignore` excludes `.env` and `.env.*` from deployment upload. Environment contents and hosted settings were not inspected.
- `AGENTS.md` requires Node 24, external-drive work storage, ZINC-only identity, no additional paid services, and an owner gate for production secrets/DNS/deletion. These are constraints, not evidence of provider configuration.
- No project `.agents/skills/` or `.codex/skills/` directory is present; `.planning/config.json` has an empty `agent_skills` mapping.

**Build:**
- `astro.config.mjs`: static output, Vercel adapter, `/` redirect to `/design-preview/a/`, and three font definitions.
- `vercel.json`: global `X-Robots-Tag: noindex, nofollow` response header.
- `src/layouts/PreviewLayout.astro`: matching robots meta tag, draft description, page title, and `/favicon.png` reference. No tracked `public/favicon.png` is present.
- `.vercelignore`: omits planning, documentation, scratch, environment, dependency, and generated build directories from uploads.
- `.gitignore`: omits dependency/build/platform output and scratch files from Git; tracked planning/doc files still occur in the repository inventory.

## Platform Requirements

**Development:**
- Use Node 24.x and the dependency set in `package-lock.json`; invoke the existing Astro scripts in `package.json`.
- Build configuration references external font providers in `astro.config.mjs`; network/cache behavior and offline build capability were not exercised.
- Preserve the CSS token system: raw palette values in `src/styles/tokens.css`, explicit `data-theme` mapping in `src/styles/themes.css`, and explicit font pairing in `src/styles/pairings.css`.

**Production:**
- Vercel is the configured target in `astro.config.mjs` and `vercel.json`; current project settings, domain assignment, deployment SHA, and deployed behavior are unmeasured.
- The implemented route is `src/pages/design-preview/a.astro`. It renders `src/components/MockupBands.astro`, which currently renders only `src/components/bands/Hero.astro`; the complete homepage is not implemented by this source tree.
- Noindex is configured in both `vercel.json` and `src/layouts/PreviewLayout.astro`; do not assume this source is configured for search-indexable launch.

---

*Stack analysis: 2026-09-25*
