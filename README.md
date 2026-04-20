# Loupe — Vilnius Local Brands Directory

A desktop-first bulletin board for discovering and saving small local brands in Vilnius, Lithuania.

Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no dependencies.

---

## Features

- **Sidebar navigation** — Home, All Brands, Saved, and category filters
- **Grid & List views** — toggle between card grid and compact list
- **Search** — live search across name, category, and description
- **Sort** — A → Z, Z → A, or default order
- **Save brands** — heart any brand; saved state persists via `localStorage`
- **Brand modal** — click any card for a detail view with save + visit actions

---

## Getting Started

No installation required. Just open `index.html` in your browser:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/loupe.git
cd loupe

# Open directly
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

Or deploy instantly to **GitHub Pages**:

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://YOUR_USERNAME.github.io/loupe`

---

## Adding Brands

Edit the `BRANDS` array at the top of `app.js`:

```js
const BRANDS = [
  {
    name:     "Your Brand Name",
    category: "Food",          // must match an existing category string
    desc:     "Short description shown on the card.",
    logo:     "images/logo.png", // relative path or full URL; leave "" for letter fallback
    url:      "https://yourbrand.lt", // shown in modal Visit button; leave "" to disable
  },
  // ...
];
```

Categories are derived automatically from the data — just use any string and it will appear in the sidebar.

---

## Project Structure

```
loupe/
├── index.html   — markup & layout
├── style.css    — all styles (CSS variables, components, animations)
├── app.js       — brand data + all app logic
└── README.md
```

---

## Customisation

All colours are CSS custom properties in `style.css`:

```css
:root {
  --cream:       #F5F0E8;
  --maroon:      #6B1E2E;
  --maroon-light:#8a2a3e;
  --maroon-pale: #f0e0e4;
  --ink:         #1a1410;
  --muted:       #7a6f67;
  --border:      #ddd5c8;
}
```

Change these to rebrand the whole site instantly.

---

## License

MIT — use freely, credit appreciated.
