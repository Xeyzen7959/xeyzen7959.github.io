# XEYZEN portfolio

A static Astro portfolio for `https://xeyzen7959.github.io`.

## Local preview

Use Node.js 22.23.4 or newer.

```sh
npm ci
npm run dev
```

`npm run build` writes the static website to `dist/`. `npm run preview` serves that build locally. The current build targets the root of the GitHub Pages user site.

## Update content

- Edit the Markdown files in `src/content/projects/`. The frontmatter controls order, filter group, title, status, optional image, and optional repository link. The body is the text shown on the project card. The hero gallery features the first four projects with images.
- Edit the intro and profile links in `src/pages/index.astro`.
- Site design tokens and motion live in `src/styles/site.css`.
- Optimized images, the background video and poster, fonts, and their licenses live in `public/`.

The video is decorative and starts muted when motion and data preferences allow. Reduced-motion visitors receive the poster and skip the gallery and project reveals. The navigation control lets other visitors pause or play the background.

Desktop mouse clicks on section links use an interruptible ease-out transition. Wheel, trackpad, touch, and keyboard scrolling keep browser behavior, and reduced motion disables smooth movement.
