# Osama Zuraid — portfolio

A static portfolio for Osama's engineering and software projects.

## Run locally

Requires Node.js 20 or newer. The current build uses Node's standard library and
has no npm dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Changes under `src/` rebuild the site; refresh the
browser after editing. Override the address with `HOST` or `PORT` when needed.

```sh
npm run build    # Recreate dist/ from src/
npm run preview  # Build and serve without watching
npm run check    # Build; check headings, local links, anchors and assets
```

## Project structure

```text
src/
  pages/
    index.mjs          Route registry and page metadata
    home.mjs           Homepage markup
    work.mjs           Project gallery
    about.mjs          About page
    cnn.mjs            CNN case study
    cortex.mjs         Planned Cortex-M4 case study
    not-found.mjs      404 page
    project.mjs        Template for the five additional project pages
  components/
    site.mjs           Shared layout, navigation, cards and SVG helpers
    illustrations.mjs  Reusable circuit and neural-network illustrations
  content/
    site.mjs           Shared profile data
    projects.mjs       Seven projects: titles, summaries, status and details
  styles/
    main.css           Website styles
  scripts/
    main.js            Browser interactions
  assets/              Fonts, licenses, icons and final website imagery
scripts/
  build.mjs            Build the published website
  serve.mjs            Local preview and development watcher
  check.mjs            Existing website checks
docs/
  projects/            Technical project write-ups and implementation plans
.github/workflows/     GitHub Pages deployment
dist/                  Generated website; ignored by Git
output/                Local review screenshots/artifacts; ignored by Git
```

Only `src/` supplies website content. The build copies static assets into
`dist/assets/` and emits the page routes from `src/pages/index.mjs`.
It recreates `dist/` to remove stale output, so never edit that directory directly.

The site presents five projects alongside the CNN case study and planned
Cortex-M4 experiment.

## Where to make changes

- Homepage layout: `src/pages/home.mjs`.
- Shared header, footer and project cards: `src/components/site.mjs`.
- Profile and common links: `src/content/site.mjs`.
- Project content and status: `src/content/projects.mjs`.
- Styling and motion: `src/styles/main.css` and `src/scripts/main.js`.
- Final artwork: `src/assets/`; keep concepts and review captures in `output/`.
- New pages: add a page module and register it in `src/pages/index.mjs`.
  Checks and sitemap generation use that same registry.

## Project documentation

| Project | Status | Documentation |
| --- | --- | --- |
| CNN from scratch | v0.1.0 released | [Overview](docs/projects/cnn-from-scratch.md) · [Source](https://github.com/osama-z/cnn-from-scratch) |
| Int8 CNN on emulated Cortex-M4 | Planned | [Brief](docs/projects/cortex-m4-int8/README.md) · [Implementation plan](docs/projects/cortex-m4-int8/PLAN.md) |

Keep measured results, simulations and future targets clearly identified.
Keep personal application documents, credentials and private notes outside this
repository.

## Deployment

The existing GitHub Actions workflow runs `npm run check` and publishes only
`dist/` to GitHub Pages on pushes to `main` or manual dispatch.
Documentation is excluded from the published site.

[MIT license](LICENSE)
