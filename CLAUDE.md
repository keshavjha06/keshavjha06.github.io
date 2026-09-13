# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (v4) for keshavjha06.github.io — a Gatsby 5 / React 18 static site styled with styled-components v6, deployed to GitHub Pages. Content (jobs, projects, featured work) lives as Markdown in `content/` and is pulled into components via GraphQL, not hardcoded.

## Commands

```sh
npm start              # gatsby develop — dev server at localhost:8000 (GraphiQL at /___graphql)
npm run build          # gatsby build — static production build into public/
npm run serve          # serve the production build locally
npm run clean          # gatsby clean — clears .cache/ and public/; do this after changing gatsby-*.js or content schema
npm run deploy         # gatsby build && gh-pages -d public (publishes to GitHub Pages)
npm run format         # prettier --write across js/jsx/json/md
npx eslint src         # lint (no npm script; @upstatement/eslint-config/react)
```

There are no tests in this repo.

`yarn.lock` is tracked and `package-lock.json` is gitignored, so yarn is this repo's intended package manager — but npm works too (npm 12 keeps `yarn.lock` in sync). Under npm 12 install scripts are blocked by default; `sharp` needs its script to run or the build fails with `Cannot find module '../build/Release/sharp-darwin-arm64v8.node'`. It is pre-approved via the `allowScripts` field in `package.json`.

Husky + lint-staged are configured in `package.json` (prettier on js/css/json/md, `eslint --fix` on js), but `.husky/` currently has no hooks installed — run `npm run prepare` if git hooks are expected.

## Architecture

### Content-driven sections

All page content comes from Markdown, sourced by `gatsby-source-filesystem` and transformed by `gatsby-transformer-remark`. Sections query it by `fileAbsolutePath` regex:

- `content/jobs/<Company>/index.md` → `sections/jobs.js` (tabbed experience list). Frontmatter: `date, title, company, range, url`.
- `content/featured/<Project>/index.md` → `sections/featured.js` (large project cards). Frontmatter: `date` (used as sort order), `title, cover, github, external, tech[]`.
- `content/projects/*.md` → `sections/projects.js` (grid) and `pages/archive.js` (full table). Frontmatter: `date, title, github, external, tech[], company, showInProjects` — `showInProjects: true` surfaces it on the homepage grid; everything appears in `/archive`.

Adding a new optional frontmatter field that isn't present in _any_ file will break builds — declare it in `createSchemaCustomization` in `gatsby-node.mjs` (where `location` and `cta` already are).

### Path aliases

`gatsby-node.mjs` defines webpack aliases: `@components`, `@config`, `@fonts`, `@hooks`, `@images`, `@pages`, `@styles`, `@utils`. Always import through these (`import { Layout, Hero } from '@components'`) — `src/components/index.js`, `src/styles/index.js`, `src/hooks/index.js` are barrel files, so new components/hooks must be re-exported there.

### Styling

styled-components throughout; each component defines its `Styled*` components at the top of its own file. Design tokens are CSS custom properties in `src/styles/variables.js` (colors, `--font-sans`/`--font-mono`, `--fz-*` sizes, nav heights), injected via `GlobalStyle.js`. Reusable style blocks (buttons, links, section headings) are in `src/styles/mixins.js`. `src/config.js` holds non-visual config (email, social links, nav links, the three colors needed by `gatsby-config.mjs`, and `srConfig` for scroll reveal).

### Animation / SSR constraints

`scrollreveal`, `animejs`, and `miniraf` reference `window` and are nulled out during `build-html`/`develop-html` in `gatsby-node.mjs`. Use them only inside `useEffect`, via `src/utils/sr.js` (which guards on `typeof window`). Every animated section must also check `usePrefersReducedMotion()` and skip the animation when reduced motion is requested — follow the existing pattern in the section components.

### Layout

`src/components/layout.js` wraps every page: it renders the `Loader` (home page only), `Nav`, `Social`, `Email`, `Footer`, applies the styled-components `ThemeProvider`, forces `target="_blank" rel="noopener noreferrer"` on external links, and handles scrolling to `location.hash` after load. Pages receive `location` from Gatsby and must pass it to `Layout`.

## Config files are ESM

`gatsby-node.mjs` and `gatsby-config.mjs` use `import`/`export default`, not `require`/`module.exports` — Gatsby 5 compiles `.mjs` config files natively. Note ESM has no `__dirname`, so both files derive it:

```js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

It is load-bearing in both: the webpack path aliases in `gatsby-node.mjs`, and the three `gatsby-source-filesystem` paths in `gatsby-config.mjs`. There is no `gatsby-browser`/`gatsby-ssr` file; neither was used, so both were removed. Recreate either at the repo root if you need its hooks — Gatsby picks it up by filename with no config entry.

## Upgrade constraints

These pins are deliberate — raising them breaks the site:

- **React must stay on 18.** React 19 removes `ReactDOM.findDOMNode`, which `react-transition-group` v4 calls internally. All 17 `CSSTransition` usages across 6 components would throw `findDOMNode is not a function` and blank the page. Moving to 19 requires threading `nodeRef` through every transition, including ref arrays for the ones inside `.map()` loops in `hero.js`, `nav.js`, `projects.js`, and `jobs.js`.
- **`@babel/core` must stay on 7.** Gatsby 5 depends on `^7.20.12` and `babel-plugin-styled-components` peers `^7.0.0`; there is no Babel 8-compatible release.
- **ESLint must stay on 8** (with `eslint-config-prettier` 9) — `@upstatement/eslint-config` v3 peers `eslint ^8.x.x`.
- **animejs is v4**, which has no default export. `loader.js` uses `createTimeline` and `svg.createDrawable(...)` + `draw`, not the v3 `anime.timeline()` / `anime.setDashoffset` API.

## Known non-fatal issues

- The 404 page logs React hydration errors #418/#423. `usePrefersReducedMotion` returns `true` during SSR but reads `window.matchMedia` on the client's first render, so the server and client trees differ. React recovers with a client render and the page displays correctly. Pre-existing; React 18 surfaces it where 17 patched it silently.
- GraphQL queries still use Gatsby 4 sort syntax (`sort: { fields: [...], order: DESC }`) and log a deprecation warning. Gatsby 5 wants `sort: { frontmatter: { date: DESC } }`.
- The build prints a bare `ERROR UNKNOWN` line but exits 0; it is not fatal.

## Notes

- This site is a fork of brittanychiang.com; the README asks that credit be preserved.
- Resume PDF and `og.png` live in `static/` and are served at the site root.
