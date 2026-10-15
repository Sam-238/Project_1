# NOVA® — Independent Creative Studio

An original, responsive one-page concept for an independent creative studio. Built with semantic HTML, CSS and vanilla JavaScript. The visual language combines editorial typography, art-directed project concepts, a custom canvas orb and restrained motion.

## Run locally

No build step or package installation is required.

1. Open this folder in a terminal.
2. Start a local static server:

   ```powershell
   python -m http.server 8000
   ```

3. Visit [http://localhost:8000](http://localhost:8000).

You can also open `index.html` directly, though a local server is recommended for a browser-like production environment.

## Before publishing

- The three portfolio entries are explicitly presented as **concept worlds**, not client case studies.
- The contact email uses the reserved `.example` domain. Replace `hello@novastudio.example` in `index.html` with an address you control before publishing. The link opens the visitor's email application; there is no form backend.
- Footer social links currently point to the platform homepages. Replace them with the studio's actual profiles when available.
- The Manrope and DM Mono typefaces load from Google Fonts. If you need a fully self-hosted/offline deployment, replace these font imports with licensed local font files.

## Deploy with GitHub Pages

1. Create a GitHub repository and add the contents of this folder to its root.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the `main` branch and the `/ (root)` folder, then save.
4. Wait for the Pages deployment to finish; GitHub will show the published URL in the Pages settings.

## Deploy with Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Leave the framework preset as **Other** and leave the build and output directory fields empty.
4. Deploy. Vercel serves `index.html` from the project root as a static site.

## Accessibility and motion

The page uses semantic landmarks, a skip link, visible keyboard focus, labelled navigation and a reduced-motion mode. The decorative canvas is hidden from assistive technology, pauses while out of view or in a hidden browser tab, and uses no external rendering library.
