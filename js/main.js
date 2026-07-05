/* Solvly — shared site logic: header/footer, product cards, cart, toast. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => `$${n.toFixed(2)}`;
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const byId = (id) => SOLVLY_PRODUCTS.find((p) => p.slug === id);

/* ---------- header & footer ---------- */
function renderChrome() {
  const cats = SOLVLY_CATEGORIES.map(
    (c) => `<li><a href="shop.html?cat=${c.id}">${c.icon} ${c.name}</a></li>`
  ).join("");

  $("#site-header").innerHTML = `
    <div class="announce">
      <span>🚚 Free Shipping on Orders $50+</span><span>↩️ 30-Day Easy Returns</span><span>🛡️ 12-Month Warranty on Everything</span>
    </div>
    <div class="site-header">
      <div class="wrap nav-inner">
        <a class="logo" href="index.html">Solv<b>ly</b></a>
        <button class="burger" aria-label="Menu">☰</button>
        <ul class="nav-links">
          <li><a href="index.html" data-nav="home">Home</a></li>
          <li class="nav-drop"><a href="shop.html" data-nav="shop">Shop Solutions</a>
            <ul class="drop-menu">${cats}</ul>
          </li>
          <li><a href="shop.html?f=best" data-nav="best">Best Sellers</a></li>
          <li><a href="shop.html?f=new" data-nav="new">New Arrivals</a></li>
          <li><a href="about.html" data-nav="about">About Solvly</a></li>
          <li><a href="contact.html" data-nav="contact">Contact</a></li>
        </ul>
        <button class="cart-btn" aria-label="Cart">🛒<span class="cart-count" hidden>0</span></button>
      </div>
    </div>`;

  $("#site-footer").innerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <a class="logo" href="index.html">Solv<b style="color:#6d9bff">ly</b></a>
            <p>Helping people solve everyday problems with smart, practical products that make life easier.</p>
          </div>
          <div><h4>Shop</h4><ul>
            <li><a href="shop.html?f=best">Best Sellers</a></li>
            <li><a href="shop.html?f=new">New Arrivals</a></li>
            <li><a href="shop.html?f=under25">Under $25</a></li>
            <li><a href="shop.html">All Solutions</a></li>
          </ul></div>
          <div><h4>Solutions</h4><ul>
            <li><a href="shop.html?cat=home">Home</a></li>
            <li><a href="shop.html?cat=car">Car</a></li>
            <li><a href="shop.html?cat=travel">Travel</a></li>
            <li><a href="shop.html?cat=desk">Desk</a></li>
          </ul></div>
          <div><h4>Company</h4><ul>
            <li><a href="about.html">About Solvly</a></li>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="contact.html">Shipping & Returns</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Solvly. Smart Solutions for Everyday Problems.</span>
          <span>30-day returns · 12-month warranty · Photos via <a href="https://unsplash.com" rel="noopener" target="_blank" style="color:inherit;text-decoration:underline">Unsplash</a></span>
        </div>
      </div>
    </footer>

    <div class="cart-overlay"></div>
    <aside class="cart-drawer" aria-label="Shopping cart">
      <div class="cart-head"><h3>Your Cart</h3><button class="cart-close" aria-label="Close">✕</button></div>
      <div class="cart-items"></div>
      <div class="cart-foot">
        <div class="cart-subtotal"><span>Subtotal</span><span class="subtotal-val">$0.00</span></div>
        <div class="cart-note">Free shipping unlocked at $50 · 30-day returns · You approve before you pay</div>
        <button class="btn btn-primary btn-block checkout-btn">Checkout →</button>
      </div>
    </aside>

    <div class="toast"></div>`;

  // nav interactions
  $(".burger").addEventListener("click", () => $(".nav-links").classList.toggle("open"));
  $$(".nav-drop > a").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (window.innerWidth <= 860) { e.preventDefault(); a.parentElement.classList.toggle("open"); }
    })
  );
  $(".cart-btn").addEventListener("click", openCart);
  $(".cart-close").addEventListener("click", closeCart);
  $(".cart-overlay").addEventListener("click", closeCart);
  $(".checkout-btn").addEventListener("click", () => { location.href = "checkout.html"; });

  // highlight active nav link
  const page = location.pathname.split("/").pop() || "index.html";
  const f = new URLSearchParams(location.search).get("f");
  let key = { "index.html": "home", "shop.html": "shop", "about.html": "about", "contact.html": "contact" }[page];
  if (page === "shop.html" && f === "best") key = "best";
  if (page === "shop.html" && f === "new") key = "new";
  const active = $(`[data-nav="${key}"]`);
  if (active) active.classList.add("active");

  renderCart();
}

/* ---------- product art (photo with emoji fallback) ---------- */
const productArt = (p, cls = "p-img") =>
  p.img
    ? `<img class="${cls}" src="${p.img}" alt="${p.name}" loading="lazy" />`
    : `<div class="p-art">${p.emoji}</div>`;

/* ---------- product cards ---------- */
function productCard(p, { badge } = {}) {
  const save = Math.round((1 - p.price / p.compareAt) * 100);
  const badgeHtml = badge
    ? `<span class="p-badge ${badge === "🔥 Trending" ? "hot" : ""}">${badge}</span>`
    : p.tags.includes("trending")
    ? `<span class="p-badge hot">🔥 Trending</span>`
    : p.tags.includes("best")
    ? `<span class="p-badge">Best Seller</span>`
    : "";
  return `
  <div class="prod-card">
    ${badgeHtml}
    <a href="product.html?p=${p.slug}">
      ${productArt(p)}
      <div class="p-body">
        <div class="p-headline">${p.headline}</div>
        <div class="p-name">${p.name}</div>
        <div class="p-rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} (${p.reviews})</div>
        <div class="p-price-row">
          <span class="p-price">${money(p.price)}</span>
          <span class="p-compare">${money(p.compareAt)}</span>
          <span class="p-save">Save ${save}%</span>
        </div>
      </div>
    </a>
    <button class="p-add" data-add="${p.slug}">Add to Cart</button>
  </div>`;
}

function bindAddButtons(root = document) {
  $$("[data-add]", root).forEach((btn) => {
    btn.onclick = () => { addToCart(btn.dataset.add); };
  });
}

/* ---------- cart (localStorage) ---------- */
const CART_KEY = "solvly-cart";
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "{}");
const setCart = (c) => { localStorage.setItem(CART_KEY, JSON.stringify(c)); renderCart(); };

function addToCart(slug, qty = 1) {
  const cart = getCart();
  cart[slug] = (cart[slug] || 0) + qty;
  setCart(cart);
  toast(`Added to cart ✓`);
}

function changeQty(slug, delta) {
  const cart = getCart();
  cart[slug] = (cart[slug] || 0) + delta;
  if (cart[slug] <= 0) delete cart[slug];
  setCart(cart);
}

function cartEntries() {
  return Object.entries(getCart()).filter(([slug]) => byId(slug));
}

function cartSubtotal() {
  return cartEntries().reduce((s, [slug, q]) => s + byId(slug).price * q, 0);
}

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((s, [, q]) => s + q, 0);
  const countEl = $(".cart-count");
  if (countEl) {
    countEl.textContent = count;
    countEl.hidden = count === 0;
  }

  const box = $(".cart-items");
  if (!box) return;
  if (!entries.length) {
    box.innerHTML = `<div class="cart-empty"><div class="icon">🛒</div>Your cart is empty.<br>Every problem has a solution — go find yours.</div>`;
  } else {
    box.innerHTML = entries.map(([slug, q]) => {
      const p = byId(slug);
      const thumb = p.img
        ? `<img class="thumb" src="${p.img}" alt="${p.name}" />`
        : `<div class="thumb">${p.emoji}</div>`;
      return `
      <div class="cart-item">
        <a href="product.html?p=${p.slug}">${thumb}</a>
        <div>
          <h4>${p.name}</h4>
          <div class="unit">${money(p.price)} each</div>
          <div class="qty-row">
            <button class="qty-btn" data-dec="${slug}">−</button><span>${q}</span><button class="qty-btn" data-inc="${slug}">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div class="line-price">${money(p.price * q)}</div>
          <button class="remove" data-rm="${slug}">Remove</button>
        </div>
      </div>`;
    }).join("");
  }
  $(".subtotal-val").textContent = money(cartSubtotal());
  $$("[data-inc]").forEach((b) => (b.onclick = () => changeQty(b.dataset.inc, 1)));
  $$("[data-dec]").forEach((b) => (b.onclick = () => changeQty(b.dataset.dec, -1)));
  $$("[data-rm]").forEach((b) => (b.onclick = () => changeQty(b.dataset.rm, -999)));
}

function openCart() { document.body.classList.add("cart-open"); }
function closeCart() { document.body.classList.remove("cart-open"); }

let toastTimer;
function toast(msg) {
  const t = $(".toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- before/after slider ---------- */
function initBASlider(rootSel) {
  const root = $(rootSel);
  if (!root) return;
  const after = $(".ba-after", root);
  const handle = $(".ba-handle", root);
  const move = (clientX) => {
    const r = root.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = `${pct}%`;
  };
  let dragging = false;
  const start = () => (dragging = true);
  const end = () => (dragging = false);
  root.addEventListener("pointerdown", (e) => { start(); move(e.clientX); });
  window.addEventListener("pointermove", (e) => { if (dragging) move(e.clientX); });
  window.addEventListener("pointerup", end);
}

document.addEventListener("DOMContentLoaded", renderChrome);
