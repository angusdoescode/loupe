// ── Data ──

const CATEGORIES = [
  { name: "Fashion", icon: "👗" },
  { name: "Accessories", icon: "👜" },
  { name: "Activities", icon: "📅" },
  { name: "Home", icon: "🏺" },
  { name: "Beauty", icon: "💄" },
  { name: "Sport", icon: "🏋️" },
  { name: "Food", icon: "☕" },
  { name: "See all", icon: "⊞" },
];

const BRANDS = [
  { name: "ONCE MORE", category: "Fashion", description: "Upcycled clothing — one-of-a-kind redesigned shirts. A sustainable mother-and-daughter project.", logo: "https://placehold.co/100x100/1a6b3c/fff?text=Once+More" },
  { name: "bullishlabel", category: "Fashion", description: "Unique repurposed jackets.", logo: "https://placehold.co/100x100/333/fff?text=BL" },
  { name: "4starlings_lt", category: "Beauty", description: "Four Starlings — cosmetics that must be experienced.", logo: "https://placehold.co/100x100/444/fff?text=4S" },
  { name: "Pastel Hoodie", category: "Fashion", description: "Cozy streetwear hoodies in pastel tones, designed and printed in Vilnius.", logo: "https://placehold.co/100x100/4a6fa5/fff?text=PH", price: "€85" },
  { name: "Skanūs Puodai", category: "Food", description: "Handmade ceramic bowls and mugs for your kitchen. Crafted with love in Užupis.", logo: "https://placehold.co/100x100/9b8ec4/fff?text=SP" },
  { name: "Viktė Matcha House", category: "Food", description: "Premium matcha drinks and desserts. Vilnius' first dedicated matcha café.", logo: "https://placehold.co/100x100/5a8a3c/fff?text=VM" },
  { name: "EkoraCandles", category: "Home", description: "Hand-poured soy candles with Lithuanian herb scents. Zero waste packaging.", logo: "https://placehold.co/100x100/d4a0a0/fff?text=EC" },
  { name: "Cherry Market", category: "Food", description: "Weekly pop-up market featuring Vilnius small food producers and artisans.", logo: "https://placehold.co/100x100/c0392b/fff?text=CM" },
  { name: "Lino Drabužiai", category: "Fashion", description: "Sustainable linen clothing for everyday wear. Lithuanian-grown flax.", logo: "https://placehold.co/100x100/8B7D6B/fff?text=LD" },
  { name: "Žalia Kava", category: "Food", description: "Specialty coffee roasters. Ethical beans roasted fresh weekly in Naujamiestis.", logo: "https://placehold.co/100x100/2c1810/fff?text=ZK" },
  { name: "Bitė Naturali", category: "Beauty", description: "All-natural skincare with Lithuanian beeswax, honey, and wild herbs.", logo: "https://placehold.co/100x100/f0c040/333?text=BN" },
  { name: "Medžio Forma", category: "Home", description: "Minimalist wooden furniture and objects. CNC-cut from sustainably sourced Baltic birch.", logo: "https://placehold.co/100x100/a08060/fff?text=MF" },
  { name: "Vilkė Apparel", category: "Fashion", description: "Streetwear blending Baltic folklore motifs with modern cuts. Limited drops.", logo: "https://placehold.co/100x100/2d2d2d/fff?text=VA", price: "€120" },
  { name: "Šviesa Press", category: "Activities", description: "Risograph print studio and gallery. Open workshops every Saturday.", logo: "https://placehold.co/100x100/e67e22/fff?text=SP" },
  { name: "Sport Flow", category: "Sport", description: "Local athletic wear made from recycled materials. Yoga, running, and outdoor gear.", logo: "https://placehold.co/100x100/2980b9/fff?text=SF" },
  { name: "Gėlių Pieva", category: "Accessories", description: "Dried flower arrangements and botanical accessories handmade in Antakalnis.", logo: "https://placehold.co/100x100/c0a0d0/fff?text=GP" },
];

// ── State ──

let currentView = "home";
let activeCategory = null;
let savedBrands = {};

// Initialize saved state from localStorage
try {
  const stored = localStorage.getItem("loupe_saved");
  if (stored) savedBrands = JSON.parse(stored);
} catch (e) {}

// ── DOM References ──

const content = document.getElementById("content");
const headerRight = document.getElementById("headerRight");
const searchInput = document.getElementById("searchInput");

// ── Search ──

searchInput.addEventListener("input", () => {
  renderView();
});

function getSearchQuery() {
  return searchInput.value.toLowerCase().trim();
}

function filterBrands(list) {
  const q = getSearchQuery();
  if (!q) return list;
  return list.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.description.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q)
  );
}

// ── Save / Unsave ──

function toggleSave(name) {
  savedBrands[name] = !savedBrands[name];
  try { localStorage.setItem("loupe_saved", JSON.stringify(savedBrands)); } catch (e) {}
  renderView();
}

function heartSVG(filled) {
  const fill = filled ? "var(--maroon)" : "none";
  const stroke = filled ? "var(--maroon)" : "#ccc";
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
}

// ── Helpers ──

function hamburgerHTML() {
  return `<div class="hamburger"><span></span><span></span><span></span></div>`;
}

function brandCardHTML(brand, delay) {
  const priceRow = brand.price
    ? `<div class="brand-price-row">
         <span class="price-tag">${brand.price}</span>
         <button class="cart-btn">🛒</button>
       </div>`
    : "";

  return `
    <div class="brand-card animate-in" style="animation-delay:${delay}ms">
      <div class="brand-logo">
        <img src="${brand.logo}" alt="${brand.name}" onerror="this.style.display='none'" />
      </div>
      <div class="brand-info">
        <div class="brand-top">
          <div class="brand-name">${brand.name}</div>
          <button class="heart-btn" onclick="event.stopPropagation(); toggleSave('${brand.name.replace(/'/g, "\\'")}')">
            ${heartSVG(!!savedBrands[brand.name])}
          </button>
        </div>
        <div class="brand-desc">${brand.description}</div>
        ${priceRow}
      </div>
    </div>
  `;
}

// ── Navigation ──

function navigate(view) {
  // Update nav buttons
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.nav === view);
  });

  if (view === "home") {
    currentView = "home";
    activeCategory = null;
    searchInput.value = "";
  } else if (view === "explore") {
    currentView = "explore";
    activeCategory = null;
  } else if (view === "saved") {
    currentView = "saved";
  } else if (view === "nearbuy" || view === "profile") {
    currentView = view;
  }

  renderView();
}

function goCategory(cat) {
  if (cat === "See all") {
    currentView = "explore";
    activeCategory = null;
  } else {
    currentView = "category";
    activeCategory = cat;
  }

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.nav === "explore");
  });

  renderView();
}

// ── Render ──

function renderView() {
  switch (currentView) {
    case "home": renderHome(); break;
    case "category": renderCategory(); break;
    case "explore": renderExplore(); break;
    case "saved": renderSaved(); break;
    case "nearbuy": renderPlaceholder("Near buy", "Map coming soon — discover brands near you."); break;
    case "profile": renderPlaceholder("Profile", "Your profile page coming soon."); break;
  }
  updateHeaderRight();
}

function updateHeaderRight() {
  if (currentView === "category" && activeCategory) {
    headerRight.innerHTML = `<div class="header-category-label">${activeCategory}</div>`;
  } else if (currentView === "home") {
    headerRight.innerHTML = `
      <div class="notification-bell">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </div>`;
  } else {
    headerRight.innerHTML = "";
  }
}

// ── Home View ──

function renderHome() {
  const recommended = BRANDS.slice(0, 3);
  const recent = BRANDS.slice(-4);

  content.innerHTML = `
    <div style="background:#fff">
      <!-- Categories -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Category</h2>
          ${hamburgerHTML()}
        </div>
        <div class="category-grid">
          ${CATEGORIES.map(cat => `
            <div class="category-item" onclick="goCategory('${cat.name}')">
              <div class="category-circle">${cat.icon}</div>
              <span class="category-label">${cat.name}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Recommend -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Recommend</h2>
          ${hamburgerHTML()}
        </div>
        <div class="recommend-row">
          ${recommended.map(b => `
            <div class="recommend-card" onclick="goCategory('${b.category}')">
              <img src="${b.logo}" alt="${b.name}" />
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Recently added -->
      <div class="section" style="padding-bottom:24px">
        <div class="section-header">
          <h2 class="section-title">Recently added</h2>
        </div>
        <div class="recent-grid">
          ${recent.map(b => `
            <div class="recent-card" onclick="goCategory('${b.category}')">
              <div class="recent-card-img">
                <img src="${b.logo}" alt="${b.name}" />
              </div>
              <div class="recent-card-info">
                <div class="name">${b.name}</div>
                <div class="cat">${b.category}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

// ── Category View ──

function renderCategory() {
  const brands = filterBrands(BRANDS.filter(b => b.category === activeCategory));

  content.innerHTML = `
    <div class="brand-list">
      <button class="back-btn" onclick="navigate('home')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      ${brands.length === 0
        ? '<div class="empty-state">No brands found.</div>'
        : brands.map((b, i) => brandCardHTML(b, i * 50)).join("")
      }
    </div>
  `;
}

// ── Explore View ──

function renderExplore() {
  const list = activeCategory
    ? BRANDS.filter(b => b.category === activeCategory)
    : BRANDS;
  const brands = filterBrands(list);

  const allCats = CATEGORIES.filter(c => c.name !== "See all");

  content.innerHTML = `
    <div class="brand-list">
      <div class="filter-pills">
        <button class="filter-pill ${!activeCategory ? 'active' : ''}" onclick="activeCategory=null; renderView();">All</button>
        ${allCats.map(c => `
          <button class="filter-pill ${activeCategory === c.name ? 'active' : ''}"
            onclick="activeCategory = activeCategory === '${c.name}' ? null : '${c.name}'; renderView();">
            ${c.name}
          </button>
        `).join("")}
      </div>
      ${brands.length === 0
        ? '<div class="empty-state">No brands found.</div>'
        : brands.map((b, i) => brandCardHTML(b, i * 40)).join("")
      }
    </div>
  `;
}

// ── Saved View ──

function renderSaved() {
  const brands = BRANDS.filter(b => savedBrands[b.name]);

  content.innerHTML = `
    <div class="brand-list">
      <h2 class="section-title" style="margin:6px 0 12px">Saved brands</h2>
      ${brands.length === 0
        ? '<div class="empty-state">Tap ♡ on any brand to save it here.</div>'
        : brands.map((b, i) => brandCardHTML(b, i * 50)).join("")
      }
    </div>
  `;
}

// ── Placeholder Views ──

function renderPlaceholder(title, message) {
  content.innerHTML = `
    <div class="brand-list">
      <h2 class="section-title" style="margin:6px 0 12px">${title}</h2>
      <div class="empty-state">${message}</div>
    </div>
  `;
}

// ── Init ──

renderView();
