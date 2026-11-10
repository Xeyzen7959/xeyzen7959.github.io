# XEYZEN portfolio

GitHub Pages serves the generated site from the root of `main`. The Astro source and editable project Markdown live in [site](site/README.md).

To update the site, edit the source, run `npm ci` and `npm run build` in `site/`, then replace the generated root assets with the contents of `site/dist/`. Keep `.nojekyll` at the repository root.
