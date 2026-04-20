// ─── BRAND DATA ───────────────────────────────────────
// Add your brands here. Fields:
//   name     : string  — brand display name
//   category : string  — one of the categories below
//   desc     : string  — short description (1–2 sentences)
//   logo     : string  — path or URL to logo image (leave "" for initial fallback)
//   url      : string  — website or Instagram URL (leave "" to disable Visit button)

const BRANDS = [
  { name: "Užupio Keramika",    category: "Crafts",   desc: "Hand-thrown ceramics from Vilnius' artsy Užupis republic. Each piece is signed and one-of-a-kind.", logo: "", url: "" },
  { name: "Kibinų Krautuvė",   category: "Food",     desc: "Traditional Karaite kibinai baked fresh daily — the best in the Baltic.", logo: "", url: "" },
  { name: "Lino Namai",         category: "Homeware", desc: "Natural Lithuanian linen goods: sheets, tablecloths, and aprons with minimal, elegant design.", logo: "", url: "" },
  { name: "Vilniaus Žolinė",   category: "Wellness", desc: "Herbal teas and dried flower blends foraged from Lithuanian meadows by local herbalists.", logo: "", url: "" },
  { name: "Radvilų Knygynas",  category: "Books",    desc: "Independent bookshop specialising in Lithuanian literature and rare art prints.", logo: "", url: "" },
  { name: "Betonas Studio",     category: "Design",   desc: "Concrete homeware and jewellery cast in small batches. Bold, tactile, minimal.", logo: "", url: "" },
  { name: "Šaltibarščių Namas",category: "Food",     desc: "Cold beet soup kits and traditional Lithuanian pantry staples, delivered to your door.", logo: "", url: "" },
  { name: "Amber & Oak",        category: "Crafts",   desc: "Baltic amber jewellery fused with locally-sourced oak — modern heirlooms.", logo: "", url: "" },
  { name: "Paprastas",          category: "Clothing", desc: "Slow-fashion basics in natural fabrics, made in small runs in Vilnius.", logo: "", url: "" },
  { name: "Medžio Kalba",      category: "Homeware", desc: "Hand-carved wooden utensils, bowls, and toys crafted by Lithuanian woodworkers.", logo: "", url: "" },
  { name: "Gatvė Coffee",      category: "Food",     desc: "Specialty coffee roastery with single-origin beans sourced directly from farmers.", logo: "", url: "" },
  { name: "Kerpė Studio",      category: "Design",   desc: "Graphic design collective creating identity work for Vilnius' independent businesses.", logo: "", url: "" },
];

// ─── DERIVED STATE ────────────────────────────────────
const CATEGORIES = [...new Set(BRANDS.map(b => b.category))].sort();

let activeView     = 'home';
let activeCategory = null;
let searchQuery    = '';
let viewMode       = 'grid';
let saved          = JSON.parse(localStorage.getItem('loupe-saved') || '{}');
let modalBrand     = null;

// ─── INIT ─────────────────────────────────────────────
function init() {
  buildCatList();
  render();
}

// ─── SIDEBAR CATEGORY LIST ────────────────────────────
function buildCatList() {
  const el = document.getElementById('catList');
  el.innerHTML = CATEGORIES.map(cat => {
    const count = BRANDS.filter(b => b.category === cat).length;
    return `<div class="cat-item" id="cat-${cat}" onclick="filterCat('${cat}')">${cat}<span class="cat-count">${count}</span></div>`;
  }).join('');
}

// ─── NAVIGATION ───────────────────────────────────────
function navigate(view) {
  activeView     = view;
  activeCategory = null;
  searchQuery    = '';
  document.getElementById('searchInput').value = '';

  ['home', 'explore', 'saved'].forEach(v =>
    document.getElementById('nav-' + v).classList.toggle('active', v === view)
  );
  CATEGORIES.forEach(c => document.getElementById('cat-' + c)?.classList.remove('active'));
  render();
}

function filterCat(cat) {
  activeView     = 'explore';
  activeCategory = activeCategory === cat ? null : cat;

  ['home', 'explore', 'saved'].forEach(v => document.getElementById('nav-' + v).classList.remove('active'));
  document.getElementById('nav-explore').classList.add('active');
  CATEGORIES.forEach(c => document.getElementById('cat-' + c)?.classList.toggle('active', c === activeCategory));
  render();
}

// ─── SEARCH ───────────────────────────────────────────
function onSearch() {
  searchQuery = document.getElementById('searchInput').value.toLowerCase();
  if (searchQuery && activeView === 'home') {
    activeView = 'explore';
    ['home', 'explore', 'saved'].forEach(v => document.getElementById('nav-' + v).classList.remove('active'));
    document.getElementById('nav-explore').classList.add('active');
  }
  render();
}

// ─── SORT & FILTER ────────────────────────────────────
function getSorted(arr) {
  const sort = document.getElementById('sortSelect').value;
  if (sort === 'az') return [...arr].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'za') return [...arr].sort((a, b) => b.name.localeCompare(a.name));
  return arr;
}

function getFiltered(arr) {
  let r = arr;
  if (activeCategory) r = r.filter(b => b.category === activeCategory);
  if (searchQuery)    r = r.filter(b =>
    b.name.toLowerCase().includes(searchQuery) ||
    b.category.toLowerCase().includes(searchQuery) ||
    b.desc.toLowerCase().includes(searchQuery)
  );
  return getSorted(r);
}

// ─── VIEW MODE ────────────────────────────────────────
function setViewMode(mode) {
  viewMode = mode;
  document.getElementById('gridViewBtn').classList.toggle('active', mode === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', mode === 'list');
  render();
}

// ─── RENDER ROUTER ────────────────────────────────────
function render() {
  const ca    = document.getElementById('contentArea');
  const title = document.getElementById('topbarTitle');
  const meta  = document.getElementById('topbarMeta');

  if (activeView === 'home') {
    title.textContent = 'Welcome to Loupe';
    meta.textContent  = 'Your local brand directory for Vilnius';
    renderHome(ca);
  } else if (activeView === 'explore') {
    const brands = getFiltered(BRANDS);
    title.textContent = activeCategory || 'All Brands';
    meta.textContent  = `${brands.length} brand${brands.length !== 1 ? 's' : ''}${searchQuery ? ' matching "' + searchQuery + '"' : ''}`;
    renderBrandList(ca, brands);
  } else if (activeView === 'saved') {
    const brands = getFiltered(BRANDS.filter(b => saved[b.name]));
    title.textContent = 'Saved Brands';
    meta.textContent  = `${brands.length} brand${brands.length !== 1 ? 's' : ''} saved`;
    renderBrandList(ca, brands);
  }
}

// ─── HOME VIEW ────────────────────────────────────────
function renderHome(el) {
  const featured = BRANDS.slice(0, 6);
  el.innerHTML = `
    <div class="hero-strip">
      <div class="hero-card" onclick="navigate('explore')">
        <div class="hero-card-label">Directory</div>
        <div class="hero-card-num">${BRANDS.length}</div>
        <div class="hero-card-desc">local brands listed</div>
      </div>
      <div class="hero-card light" onclick="navigate('explore')">
        <div class="hero-card-label">Categories</div>
        <div class="hero-card-num">${CATEGORIES.length}</div>
        <div class="hero-card-desc">categories to explore</div>
      </div>
      <div class="hero-card light" onclick="navigate('saved')">
        <div class="hero-card-label">Your List</div>
        <div class="hero-card-num">${Object.keys(saved).length}</div>
        <div class="hero-card-desc">brands saved by you</div>
      </div>
    </div>
    <div class="section-header">
      <h2>Featured Brands</h2>
      <span class="see-all" onclick="navigate('explore')">See all →</span>
    </div>
    <div class="${viewMode === 'grid' ? 'brand-grid' : 'brand-list-view'}">
      ${featured.map((b, i) => viewMode === 'grid' ? cardHTML(b, i) : rowHTML(b, i)).join('')}
    </div>
  `;
}

// ─── BRAND LIST / EXPLORE / SAVED ────────────────────
function renderBrandList(el, brands) {
  if (brands.length === 0) {
    el.innerHTML = `<div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <p>${activeView === 'saved' ? 'Click ♡ on any brand to save it here.' : 'No brands found.'}</p>
    </div>`;
    return;
  }
  el.innerHTML = `<div class="${viewMode === 'grid' ? 'brand-grid' : 'brand-list-view'}">
    ${brands.map((b, i) => viewMode === 'grid' ? cardHTML(b, i) : rowHTML(b, i)).join('')}
  </div>`;
}

// ─── CARD TEMPLATES ───────────────────────────────────
function logoHTML(b, size) {
  const initial = b.name[0];
  const img     = b.logo ? `<img src="${b.logo}" alt="${b.name}" />` : initial;
  return `<div class="brand-logo" style="width:${size}px;height:${size}px">${img}</div>`;
}

function cardHTML(b, i) {
  const isSaved = !!saved[b.name];
  const safeId  = b.name.replace(/\s/g, '_');
  return `<div class="brand-card" style="animation-delay:${i * 40}ms" onclick="openModal('${escHtml(b.name)}')">
    <div class="brand-card-top">
      ${logoHTML(b, 52)}
      <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation();toggleSave('${escHtml(b.name)}')" id="save-${safeId}" title="${isSaved ? 'Remove' : 'Save'}">
        ${isSaved ? '♥' : '♡'}
      </button>
    </div>
    <div class="brand-name">${b.name}</div>
    <div class="brand-desc">${b.desc}</div>
    <div class="brand-footer">
      <span class="brand-tag">${b.category}</span>
      <span class="brand-link">Visit ↗</span>
    </div>
  </div>`;
}

function rowHTML(b, i) {
  const isSaved = !!saved[b.name];
  return `<div class="brand-row" style="animation-delay:${i * 30}ms" onclick="openModal('${escHtml(b.name)}')">
    ${logoHTML(b, 40)}
    <div class="brand-row-info">
      <div class="brand-name">${b.name}</div>
      <div class="brand-desc">${b.desc}</div>
    </div>
    <div class="brand-row-right">
      <span class="brand-tag">${b.category}</span>
      <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation();toggleSave('${escHtml(b.name)}')" title="${isSaved ? 'Remove' : 'Save'}">
        ${isSaved ? '♥' : '♡'}
      </button>
    </div>
  </div>`;
}

// ─── SAVE / UNSAVE ────────────────────────────────────
function toggleSave(name) {
  if (saved[name]) delete saved[name];
  else saved[name] = true;
  localStorage.setItem('loupe-saved', JSON.stringify(saved));

  const safeId = name.replace(/\s/g, '_');
  const btn    = document.getElementById('save-' + safeId);
  if (btn) {
    btn.textContent = saved[name] ? '♥' : '♡';
    btn.classList.toggle('saved', !!saved[name]);
  }
  if (activeView === 'saved') render();
}

function toggleSaveModal() {
  if (!modalBrand) return;
  toggleSave(modalBrand.name);
  const isSaved = !!saved[modalBrand.name];
  document.getElementById('modalSave').textContent = isSaved ? '♥ Saved' : '♡ Save brand';
}

// ─── MODAL ────────────────────────────────────────────
function openModal(name) {
  const b = BRANDS.find(x => x.name === name);
  if (!b) return;
  modalBrand = b;

  document.getElementById('modalLogo').innerHTML = b.logo
    ? `<img src="${b.logo}" alt="${b.name}" />`
    : b.name[0];
  document.getElementById('modalName').textContent = b.name;
  document.getElementById('modalTag').textContent  = b.category;
  document.getElementById('modalDesc').textContent = b.desc;

  const isSaved = !!saved[b.name];
  document.getElementById('modalSave').textContent = isSaved ? '♥ Saved' : '♡ Save brand';
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
    modalBrand = null;
  }
}

function visitModal() {
  if (!modalBrand) return;
  if (modalBrand.url) {
    window.open(modalBrand.url, '_blank', 'noopener');
  } else {
    alert(`No URL set for ${modalBrand.name}. Add one in the BRANDS array in app.js.`);
  }
}

// ─── KEYBOARD ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── HELPERS ──────────────────────────────────────────
function escHtml(str) {
  return str.replace(/'/g, "\\'");
}

// ─── BOOT ─────────────────────────────────────────────
init();
