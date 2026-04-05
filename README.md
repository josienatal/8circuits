# 8 Circuits

A self-development web app based on Timothy Leary's 8-circuit model of consciousness. Explore the circuits, assess where you're stuck, journal your reflections, and get personalized AI insights.

**Live demo:** [8circuits.netlify.app]

---

## What it does

- **Explore** — deep-dive into all 8 circuits with descriptions, stuck patterns, and activation practices
- **Assess** — 8-question self-assessment that builds your personal circuit profile
- **Results** — visual breakdown of your scores with a growth edge insight
- **Reflect** — daily journal prompts per circuit, with AI analysis powered by Claude

---

## Stack

- Vanilla HTML / CSS / JS — no framework, no build step
- Netlify for hosting + serverless functions
- Anthropic Claude API for AI reflection (server-side via Netlify function)

---

## File structure

```
circuits/
├── index.html
├── netlify.toml
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── data.js
└── netlify/
    └── functions/
        └── claude.js
```

---

## Deploy to Netlify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "init: 8 circuits"
git remote add origin https://github.com/josienatal/8circuits
git branch -M main
git push -u origin main
```

### 2. Connect to Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Select your repo
3. Build settings can be left blank (no build command needed)
4. Click **Deploy**

### 3. Add your API key

In Netlify: **Site configuration → Environment variables → Add variable**

```
Key:   ANTHROPIC_API_KEY
Value: sk-ant-your-key-here
```

Redeploy after adding the variable. The AI reflection feature won't work without it.

---

## Local development

Because the Netlify function handles the API call, you'll need the Netlify CLI to run locally:

```bash
npm install -g netlify-cli
netlify dev
```

This spins up a local server at `http://localhost:8888` with the function proxy active. Opening `index.html` directly as a `file://` URL will cause CORS errors on the AI reflection feature.

---

## The model

Leary's 8-circuit model maps neurological development across two tiers:

**Terrestrial (Circuits 1–4)** — survival, social functioning, basic consciousness. Most people operate primarily here.

| Circuit | Name | Domain |
|---------|------|--------|
| 1 | Survival | Safety, trust, fear |
| 2 | Power | Dominance, territory, agency |
| 3 | Intellect | Language, reasoning, mental maps |
| 4 | Social | Morality, belonging, identity |

**Cosmic (Circuits 5–8)** — expanded states, rarely activated without intentional practice.

| Circuit | Name | Domain |
|---------|------|--------|
| 5 | Body | Sensation, pleasure, somatic intelligence |
| 6 | Mind | Metaprogramming, self-observation |
| 7 | Ancestral | Collective consciousness, lineage |
| 8 | Quantum | Transcendence, dissolution of self |

> The model is speculative, not neuroscience. The value is in the questions it generates, not the framework itself.

---

## Credits

Built by [josienatal](https://github.com/josienatal)  
Model by Timothy Leary & Robert Anton Wilson — *Prometheus Rising* (1983)
