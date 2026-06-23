# Dr. Goraw Goshu — Premium Portfolio

An ultra-premium personal portfolio for **Dr. Goraw Goshu** — Director of the Blue Nile Water Institute, ecohydrologist, water resources expert, and environmental research leader.

Built with **HTML5, CSS3, Vanilla JavaScript, Three.js, GSAP, AOS, and Chart.js** (no framework, no build step).

## Theme

> Water · Earth · Science · Sustainability

Design language inspired by Apple, National Geographic, MIT Media Lab, NASA Earth Observatory, and the UN Environment Programme.

## Current Features

- Cinematic hero with Lake Tana photo background, refined layout, and animated headline/stat reveals
- Advanced loading screen (water-ripple motif + lightweight particle canvas + progress indicator)
- Floating glass navigation with scroll spy, mobile menu, and **More ▾** dropdown for all sections
- About timeline (1997 → 2026) with animated progress path
- Research impact dashboard (interactive cards + Chart.js visualizations)
- Executive leadership section with role cards and animated achievement counters
- Flagship project case studies with premium modals and real project imagery
- Searchable / filterable publication database with DOI links
- Interactive **Three.js global impact globe** (optimized rendering and offscreen pause behavior)
- New premium profile modules:
  - Further Education & Training (interactive expandable timeline)
  - Teaching & Capacity Building (impact stats + expandable course cards)
  - Personal Skills & Competences (executive scorecards + language proficiency bars + radar)
  - Skills & Competencies (animated expertise meters)
  - Specialized Software & Technical Tools (interactive proficiency rings)
- Publication statistics, about, and contact sections enhanced with reusable parallax photo-band backgrounds
- Masonry media gallery + lightbox with real field imagery
- Contact section with map embed, LinkedIn, and **CV buttons**
- CV links open in a **new tab** (`assets/cv.pdf`)
- Native OS cursor restored (custom cursor removed)
- Fully responsive, SEO-oriented metadata, reduced-motion aware

## Sections Included

1. Hero  
2. About / Journey Timeline  
3. Research Impact  
4. Leadership  
5. Featured Projects  
6. Publications  
7. Global Impact  
8. Education  
9. Further Education & Training  
10. Teaching & Capacity Building  
11. Personal Skills & Competences  
12. Skills & Competencies  
13. Specialized Software & Technical Tools  
14. Publication Statistics  
15. Media Gallery  
16. Contact

## File Structure

```text
index.html
css/
  style.css         # design system, layout, sections, responsive rules
  animations.css    # loader, reveal effects, motion helpers
js/
  main.js           # nav, loader, section renderers, modals, charts, form
  three-scene.js    # interactive global-impact globe (Three.js)
  animations.js     # GSAP triggers, counters, magnetic effects, timeline behavior
  publications.js   # all structured content/data + publication filter logic
assets/
  images/           # project/gallery/parallax imagery (svg + png)
  icons/            # favicon
  cv.pdf            # downloadable CV used by hero/contact buttons
```

## Running Locally

- Open `index.html` directly, or
- Serve locally:

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000`.

> Third-party libraries and fonts are loaded from CDNs; internet is required on first load.

## Content Updates

- Most editable content is centralized in `js/publications.js` under `window.PORTFOLIO_DATA`.
- Update typography, colors, spacing, and visual style tokens in `css/style.css`.
- Add/replace imagery in `assets/images/` and update paths in `js/publications.js`.
- Keep the CV file at `assets/cv.pdf` so all download/open buttons work automatically.
