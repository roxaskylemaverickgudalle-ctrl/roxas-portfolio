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

## Portfolio chat service

The chat uses a small Vercel serverless function to call Hugging Face Inference Providers. It validates requests, adds portfolio context, and forwards them to the model. It does not host a model, use a database, or store chat history. Keep using GitHub Pages for the portfolio and deploy this repository to Vercel for the chat API only.

### Requirements

- A Hugging Face token with the **Inference Providers** permission.
- Access to `meta-llama/Llama-3.1-8B-Instruct`. Approval for the base `meta-llama/Llama-3.1-8B` model does not necessarily grant access to the Instruct model.
- Hugging Face Inference Providers billing/credits. Free Hugging Face accounts currently have no included Inference Providers credits; check Hugging Face billing before enabling the public chat.
- A Vercel account.

### Deploy to Vercel

Import this repository into Vercel and use the repository root as the project root. Vercel deploys the function at `/api/chat`; leave the build command empty because this Vercel project only hosts the API. Add these environment variables in **Vercel → Project → Settings → Environment Variables**:

- `HF_TOKEN`: your Hugging Face token with Inference Providers permission. Keep it server-side; never use a `VITE_` variable for this token.
- `CHAT_ALLOWED_ORIGIN`: `https://roxaskylemaverickgudalle-ctrl.github.io` (optional; this is the default production origin).
- `HF_MODEL`: `meta-llama/Llama-3.1-8B-Instruct` (optional; this is the default model).

Set the project root to the repository root and deploy. Your API URL will be `https://<your-vercel-project>.vercel.app/api/chat`. The API allows requests from the GitHub Pages origin and localhost during development. CORS only limits browser access; it is not authentication or abuse protection. Before sharing the public endpoint, configure a Vercel Firewall rate-limit rule if it is available for your plan, and monitor Hugging Face usage and billing.

### Connect the portfolio

Copy `src/.env.example` to `src/.env.local` and set `VITE_CHAT_API_URL` to your deployed Vercel `/api/chat` URL. `.env.local` is ignored by Git. Rebuild and deploy the GitHub Pages portfolio as usual from `src`:

```bash
npm run build
npm run deploy
```

For local development, set `VITE_CHAT_API_URL` to your deployed Vercel API in `src/.env.local`; localhost is allowed by the API CORS policy. To run the function locally, install the Vercel CLI and use `vercel dev` from the repository root, with `HF_TOKEN` in a local `.env.local` file (never commit it). Inference usage may incur charges according to your Hugging Face plan and selected provider.
