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
- `education` — schools, study periods, and academic honors
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

## Local portfolio AI chat

The portfolio chat runs a compact semantic-search model directly in the visitor's browser using Transformers.js and ONNX Runtime Web. The first chat request downloads the quantized model from Hugging Face (about 23 MB of model weights, plus runtime files); the browser caches it for later visits. Responses are formed from the closest matching portfolio facts, and chat messages are not sent to an AI API. No API key, model server, Vercel function, or paid inference account is needed.

The assistant policy is defined in [`components/localPortfolioAssistant.js`](./components/localPortfolioAssistant.js), and its portfolio knowledge is stored in [`data/portfolioAssistantData.json`](./data/portfolioAssistantData.json). Relevant facts are embedded and searched locally for every response. If no portfolio fact is a close match, the assistant says that the information is unavailable instead of answering from general knowledge. Keep the data file accurate when updating projects, skills, experience, education, certifications, or contact details.

### Run the demo

From the app directory:

```bash
cd src
npm install
npm run dev
```

Open the local Vite URL and use the chat button. On the first question, allow the browser to download the local model; subsequent use should load it from the browser cache. A working internet connection is needed for that first download. No environment variables or API secrets are required. The model and portfolio data are public, while visitor prompts stay in the browser.

### Model adapter

The model is configured in [`components/localPortfolioAssistant.js`](./components/localPortfolioAssistant.js). It currently uses `Xenova/all-MiniLM-L6-v2` with 8-bit quantized weights for local semantic search. It retrieves factual snippets rather than generating open-ended answers, which keeps this small demo grounded in the portfolio. To change models or later connect an API, replace the `generatePortfolioReply` adapter while keeping the chat component's messages input and string response contract.
