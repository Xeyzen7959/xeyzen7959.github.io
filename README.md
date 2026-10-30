# Joshua / XEYZEN portfolio

A local, buildless HTML/CSS/JavaScript portfolio. No installation or external services are required.

Open `index.html` directly, or serve this directory:

```sh
python3 -m http.server 4206 --bind 127.0.0.1
```

Then visit http://127.0.0.1:4206/.

The project selector supports click/tap, arrow keys, Home and End. Brief selection and activation sounds are synthesized locally with Web Audio only after interaction. The header sound button mutes/unmutes them; no sound files are downloaded. Navigation arrows and decorative marks are inline SVG graphics. It respects the system reduced-motion preference. Project explanations, toolkit and contact links are static HTML and remain available without JavaScript.

The Sourcewell screenshot composition, Velosync illustrated chat window and ESPION illustrated handheld reuse the original portfolio markup, visual rules and supplied images, adapted to the blue art direction. Velosync is an interface study and ESPION is an illustrative device concept; their project sections preserve these distinctions.

Files: `index.html` for content; `style.css` for the new layout and motion; `visuals.css` for retained project illustration rules; `app.js` for selection; `project-data.js` retains factual source project descriptions. No public deployment has been performed.

Palette reference: [community-contributed Persona 3 Reload palette](https://www.color-hex.com/color-palette/1043675), adapted with muted steel-blue fields and restrained cyan accents. This is not an official Atlus palette.

The work CTA starts a translucent scroll-progress route along the page gutter. Its geometry updates on layout changes and it is disabled for reduced motion. Interface sounds use short low-frequency percussive cues with a rapid-input rate limit.
