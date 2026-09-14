# Your ML Portfolio — React version

## File structure

```
src/
  App.jsx                        <- entry point, renders <Portfolio />
  data/
    portfolioData.js              <- ⭐ EDIT THIS to add your real content
  components/
    Portfolio.jsx                 <- page layout/markup (rarely needs editing)
    Portfolio.css                 <- all styling + color variables
    NeuralBackground.jsx          <- the animated canvas background
```

## What to edit, in order of how often you'll touch it

### 1. `src/data/portfolioData.js` — your content (edit this first)
This is the only file most people need to touch. It exports plain
objects/arrays for:
- `profile` — your name, role/title, headline, and intro line
- `heroChart` — the two small labels next to the loss-curve graphic
- `skills` — name + percentage for each skill bar
- `toolbelt` — the flat list of tool "pill" tags
- `experience` — your work history timeline (add/remove entries freely)
- `certificates` — the dedicated certificates grid (year, status, title,
  issuer, credential ID)
- `contact` — heading, blurb, and your email/LinkedIn/GitHub links

Add or remove array entries and the page updates automatically — you
don't need to touch any markup for that.

### 2. `src/components/Portfolio.css` — colors, fonts, spacing
Everything at the top of this file under `:root { ... }` is a variable:
- `--bg` / `--bg-panel` — page and card backgrounds
- `--ink` / `--ink-soft` — text colors
- `--signal` — your main accent color (buttons, links, bars, timeline dots,
  and the animated background nodes)
- `--amber` — a secondary accent used sparingly
- `--display` / `--mono` / `--body` — the three fonts in use

Change `--signal` to re-theme the whole site to a different accent color.
If you do, also update the `SIGNAL` constant near the top of
`NeuralBackground.jsx` so the background dots match (noted in a comment
there).

### 3. `src/components/NeuralBackground.jsx` — the animation
You likely don't need to touch this, but the comment block at the top
lists the three knobs if you want to adjust it:
- `LINK_DIST` — how far apart two nodes can be and still draw a connecting
  line between them
- node count — search for `(W * H) / 15000` — lower that number for more
  nodes, raise it for fewer
- pulse frequency — search for `Math.random() < 0.02` — raise that number
  for more traveling light packets along the connections

### 4. `src/components/Portfolio.jsx` — page structure
Only edit this if you want to reorder sections, add a brand-new section
(e.g. a Projects section), or change what HTML each section renders.

## Running it

This assumes a Vite or Create-React-App project. If starting fresh with
Vite:

```bash
npm create vite@latest my-portfolio -- --template react
cd my-portfolio
# copy the files from this folder into src/, replacing the defaults
npm install
npm run dev
```

No extra libraries are required — everything here is plain React,
plain CSS, and the Canvas API.
