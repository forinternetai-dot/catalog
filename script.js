'use strict';

/* ── DATA ─────────────────────────────────────────── */
const NAMES = ['Aurora','Bloom','Canvas','Drift','Eden','Frost','Grove','Haven','Iris','Jade',
               'Karma','Luna','Mist','Nova','Opal','Prism','Regal','Sage','Terra','Urban',
               'Vale','Weave','Xanthe','Yonder','Zephyr','Aura','Birch','Cloud','Dusk','Echo',
               'Fern','Glow','Haze','Idyll'];
const ROOMS  = ['Living Room','Bedroom','Kitchen','Bathroom','Office'];
const STYLES = ['Minimalist','Bohemian','Scandinavian','Industrial','Classic','Modern'];
const COLORS = ['Red','Blue','Green','Beige','Yellow','Pink','Black','White'];
const MOTIFS = ['Animals','Botanical','Abstract','Geometric','Floral','Textured'];
const COLS   = ['Nordic Dreams','Urban Jungle','Vintage Soul','Ocean Breeze','Golden Hour','Spring 2024'];

let wallpapers = NAMES.map((n, i) => ({
  id: i + 1,
  name: n + ' No.' + (i + 1),
  price: (Math.floor(Math.random() * 20) + 3) * 50000,
  room: ROOMS[i % ROOMS.length],
  style: STYLES[i % STYLES.length],
  color: COLORS[i % COLORS.length],
  motif: MOTIFS[i % MOTIFS.length],
  collection: COLS[i % COLS.length],
  isNew: i < 6,
  isHot: i >= 6 && i < 12,
  seed: 'p' + (i * 17 + 50)
}));

let slides = [
  { seed:'s10', room:'Yashash xonasi', sub:'Nordic Dreams kolleksiyasidan', colors:['Beige','Ivory','Sage'] },
  { seed:'s20', room:'Yotoqxona',       sub:'Ocean Breeze kolleksiyasidan',  colors:['Navy','White','Grey'] },
  { seed:'s30', room:'Ish xonasi',      sub:'Urban Jungle kolleksiyasidan',  colors:['Forest','Taupe','Gold'] },
  { seed:'s40', room:'Oshxona',         sub:'Golden Hour kolleksiyasidan',   colors:['Warm White','Oak','Brass'] },
  { seed:'s50', room:'Mehmonxona',      sub:'Vintage Soul kolleksiyasidan',  colors:['Dusty Rose','Cream','Walnut'] },
];

let cart = [];
let activeFilter = '';
let appliedCoupon = null;
const validCoupons = {
  'WALLI10': { type: 'percent', value: 10 },
  'WELCOME50': { type: 'fixed', value: 50000 }
};

// Wishlist
let wishlist = JSON.parse(localStorage.getItem('walli_wishlist') || '[]');

// Infinite scroll
let currentSearch = '';
let allFilteredProducts = [];
let displayedCount = 0;
const PRODUCTS_PER_PAGE = 12;
let isLoading = false;

/* ── CAROUSEL ─────────────────────────────────────── */
let cIdx = 0, cTimer;

function buildCarousel() {
  const track = document.getElementById('c-track');
  const dots  = document.getElementById('c-dots');
  track.innerHTML = '';
  dots.innerHTML  = '';

  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'c-slide';
    slide.innerHTML = `
      <img src="https://picsum.photos/seed/${s.seed}/1400/640" alt="${s.room}" loading="${i === 0 ? 'eager' : 'lazy'}">
      <div class="c-overlay">
        <div class="c-info">
          <div class="c-eyebrow">Featured Collection</div>
          <h2 class="c-title">${s.room}</h2>
          <p class="c-sub">${s.sub}</p>
          <div class="c-tags">${s.colors.map(c => `<span class="c-tag">${c}</span>`).join('')}</div>
        </div>
      </div>`;
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'c-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slayd ' + (i + 1));
    dot.addEventListener('click', () => goSlide(i));
    dots.appendChild(dot);
  });

  goSlide(0);
}

function goSlide(n) {
  cIdx = (n + slides.length) % slides.length;
  document.getElementById('c-track').style.transform = `translateX(-${cIdx * 100}%)`;
  document.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === cIdx));
  clearInterval(cTimer);
  cTimer = setInterval(() => goSlide(cIdx + 1), 3500);
}

document.getElementById('c-prev').addEventListener('click', () => goSlide(cIdx - 1));
document.getElementById('c-next').addEventListener('click', () => goSlide(cIdx + 1));

/* ── MARQUEE ──────────────────────────────────────── */
function buildMarquee() {
  const t1 = '✦ SELECTED WALLPAPER MOTIFS ✦  ';
  const t2 = '◈ MOST POPULAR DESIGNS 2024 ◈  ';
  ['m1','m2'].forEach((id, idx) => {
    const txt = idx === 0 ? t1 : t2;
    document.getElementById(id).innerHTML = Array(12).fill(`<span>${txt}</span>`).join('');
  });
}

/* ── FILTER BAR ───────────────────────────────────── */
function buildFilters() {
  const filters = ['Barchasi', ...STYLES.slice(0,4), ...ROOMS.slice(0,3), ...COLORS.slice(0,4)];
  document.getElementById('filter-bar').innerHTML = filters.map((f, i) =>
    `<button class="chip${i === 0 ? ' active' : ''}" onclick="setFilter('${f}',this)">${f}</button>`
  ).join('');
}

window.setFilter = function(f, el) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeFilter = (f === 'Barchasi') ? '' : f;
  filterAndReset(document.getElementById('search-input').value);
};

/* ── PRODUCTS + INFINITE SCROLL ───────────────────── */
function filterAndReset(search) {
  currentSearch = search;
  const term = search.toLowerCase();
  allFilteredProducts = wallpapers.filter(w => {
    const matchS = !term || [w.name, w.room, w.style, w.color, w.motif, w.collection].some(v => v.toLowerCase().includes(term));
    const matchF = !activeFilter || [w.room, w.style, w.color, w.motif].includes(activeFilter);
    return matchS && matchF;
  });
  displayedCount = 0;
  const grid = document.getElementById('products-grid');
  // no-results elementini saqlab qolish
  const noRes = document.getElementById('no-results');
  grid.innerHTML = '';
  if (noRes) grid.appendChild(noRes);
  document.getElementById('prod-count').textContent = allFilteredProducts.length + ' ta mahsulot';
  loadMore();
}

function loadMore() {
  if (isLoading) return;
  isLoading = true;
  const grid = document.getElementById('products-grid');
  const noRes = document.getElementById('no-results');
  const nextBatch = allFilteredProducts.slice(displayedCount, displayedCount + PRODUCTS_PER_PAGE);
  nextBatch.forEach(w => {
    const card = createProductCard(w);
    grid.appendChild(card);
  });
  displayedCount += nextBatch.length;
  isLoading = false;
  if (displayedCount === 0 && allFilteredProducts.length === 0) {
    if (noRes) noRes.style.display = 'block';
  } else {
    if (noRes) noRes.style.display = 'none';
  }
}

function createProductCard(w) {
  const card = document.createElement('div');
  card.className = 'p-card';
  const isWished = wishlist.includes(w.id);
  card.innerHTML = `
    <div class="p-img-wrap" onclick="quickView(${w.id})">
      <img src="https://picsum.photos/seed/${w.seed}/480/360" alt="${w.name}" loading="lazy">
      <div class="p-quick"><button class="p-quick-btn">Batafsil</button></div>
      <div class="p-badges">
        ${w.isNew ? '<span class="badge-tag badge-new">Yangi</span>' : ''}
        ${w.isHot ? '<span class="badge-tag badge-hot">🔥 Top</span>' : ''}
      </div>
    </div>
    <div class="p-body">
      <div class="p-collection">${w.collection}</div>
      <div class="p-name">${w.name}</div>
      <div class="p-metas">
        <span class="p-meta">${w.room}</span>
        <span class="p-meta">${w.color}</span>
        <span class="p-meta">${w.style}</span>
      </div>
      <div class="p-bottom">
        <div class="p-price">
          ${w.price.toLocaleString()} so'm
          <small>1 m² uchun</small>
        </div>
        <button class="p-add" onclick="addToCart(${w.id})">+</button>
        <button class="p-wish ${isWished ? 'active' : ''}" data-id="${w.id}" onclick="toggleWishlist(${w.id}, this)">${isWished ? '❤️' : '♡'}</button>
      </div>
    </div>`;
  return card;
}

window.quickView = function(id) {
  const w = wallpapers.find(x => x.id === id);
  if (!w) return;
  showToast(`👁 ${w.name} — ${w.room} · ${w.style}`);
};

// Scroll uchun event
window.addEventListener('scroll', () => {
  if (displayedCount >= allFilteredProducts.length) return;
  const scrollY = window.scrollY + window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  if (scrollY > docHeight - 300 && !isLoading) {
    loadMore();
  }
});

/* ── OUR WORKS ────────────────────────────────────── */
const worksData = [
  { seed:'w10', label:'Nordic Living' },
  { seed:'w20', label:'Botanical Bedroom' },
  { seed:'w30', label:'Coastal Office' },
  { seed:'w40', label:'Boho Kitchen' },
  { seed:'w50', label:'Geometric Bath' },
  { seed:'w60', label:'Moody Dining' },
];

function buildWorks() {
  const container = document.getElementById('works-grid');
  if (container) {
    container.innerHTML = worksData.map(w => `
      <div class="w-card">
        <img src="https://picsum.photos/seed/${w.seed}/800/600" alt="${w.label}" loading="lazy">
        <div class="w-card-overlay">
          <span class="w-label">${w.label}</span>
        </div>
      </div>`).join('');
  }
}

/* ── CART ─────────────────────────────────────────── */
window.addToCart = function(id) {
  const w = wallpapers.find(x => x.id === id);
  if (!w) return;
  const ex = cart.find(x => x.id === id);
  ex ? ex.qty++ : cart.push({ ...w, qty: 1 });
  updateBadge();
  showToast(`✓ "${w.name}" savatga qo'shildi`);
};

function updateBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = total;
    badge.classList.add('pop');
    setTimeout(() => badge.classList.remove('pop'), 350);
  }
  updateWishlistBadge();
}

function renderCart() {
  const body = document.getElementById('cart-body');
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Savat hali bo'sh</p></div>`;
    return;
  }
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  if (appliedCoupon) {
    const c = validCoupons[appliedCoupon];
    if (c) discount = c.type === 'percent' ? subtotal * c.value / 100 : Math.min(c.value, subtotal);
  }
  const total = subtotal - discount;
  body.innerHTML = `
    ${cart.map(it => `
      <div class="cart-item">
        <img src="https://picsum.photos/seed/${it.seed}/200/200" alt="${it.name}">
        <div class="ci-info">
          <div class="ci-name">${it.name}</div>
          <div class="ci-price">${(it.price * it.qty).toLocaleString()} so'm</div>
          <div class="ci-qty">
            <button class="qty-b" onclick="cQty(${it.id},-1)">−</button>
            <span class="qty-n">${it.qty}</span>
            <button class="qty-b" onclick="cQty(${it.id},1)">+</button>
          </div>
        </div>
        <button class="ci-del" onclick="cRemove(${it.id})">🗑</button>
      </div>`).join('')}
    <div class="cart-total-row"><span>Umumiy:</span><span>${subtotal.toLocaleString()} so'm</span></div>
    <div class="cart-coupon">
      <input type="text" id="coupon-code" placeholder="Kupon kodi (WALLI10 / WELCOME50)">
      <button id="apply-coupon" class="btn-outline" style="width:auto; padding:8px 16px;">Qo‘llash</button>
    </div>
    <div id="cart-discount" style="${discount ? 'display:block' : 'display:none'}">
      Chegirma: -<span id="discount-amount">${discount.toLocaleString()}</span> so'm
    </div>
    <div class="cart-total-row" style="border-top:2px solid var(--sand); margin-top:8px; padding-top:12px;">
      <span>Jami to‘lov:</span><span>${total.toLocaleString()} so'm</span>
    </div>
    <button class="btn-sand" style="margin-top:16px" onclick="openOrder()">Buyurtma berish →</button>`;
  const applyBtn = document.getElementById('apply-coupon');
  if (applyBtn) applyBtn.onclick = applyCoupon;
}

function applyCoupon() {
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  if (validCoupons[code]) {
    appliedCoupon = code;
    showToast(`✅ Kupon qo‘llandi: ${code}`);
    renderCart();
  } else {
    showToast('❌ Noto‘g‘ri kod');
  }
}

window.cQty = function(id, d) {
  const it = cart.find(x => x.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) cRemove(id);
  else { updateBadge(); renderCart(); }
};
window.cRemove = function(id) {
  cart = cart.filter(x => x.id !== id);
  updateBadge(); renderCart();
};

/* ── WISHLIST ─────────────────────────────────────── */
window.toggleWishlist = function(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    if (btn) { btn.innerHTML = '❤️'; btn.classList.add('active'); }
  } else {
    wishlist.splice(idx, 1);
    if (btn) { btn.innerHTML = '♡'; btn.classList.remove('active'); }
  }
  localStorage.setItem('walli_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  const wishModal = document.getElementById('mod-wishlist');
  if (wishModal && wishModal.classList.contains('open')) renderWishlist();
};

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.textContent = wishlist.length;
}

function renderWishlist() {
  const container = document.getElementById('wishlist-body');
  const items = wallpapers.filter(w => wishlist.includes(w.id));
  if (!items.length) {
    container.innerHTML = '<div class="cart-empty">❤️ Sevimlilar ro‘yxati bo‘sh</div>';
    return;
  }
  container.innerHTML = items.map(w => `
    <div class="cart-item">
      <img src="https://picsum.photos/seed/${w.seed}/200/200">
      <div class="ci-info">
        <div class="ci-name">${w.name}</div>
        <div class="ci-price">${w.price.toLocaleString()} so‘m</div>
      </div>
      <button class="ci-del" onclick="addToCart(${w.id}); showToast('✓ Savatga qo‘shildi');">🛒</button>
      <button class="ci-del" onclick="toggleWishlist(${w.id}, document.querySelector('.p-wish[data-id=\\'${w.id}\\']')); renderWishlist();">🗑</button>
    </div>
  `).join('');
}

/* ── ORDER & GUEST CHECKOUT ───────────────────────── */
window.openOrder = function() {
  closeModal('mod-cart');
  autoFillGuest();
  openModal('mod-order');
};

function autoFillGuest() {
  const saved = localStorage.getItem('guest_info');
  if (saved) {
    const info = JSON.parse(saved);
    const fname = document.getElementById('o-fname');
    const lname = document.getElementById('o-lname');
    const phone = document.getElementById('o-phone');
    const addr = document.getElementById('o-addr');
    if (fname) fname.value = info.fname || '';
    if (lname) lname.value = info.lname || '';
    if (phone) phone.value = info.phone || '';
    if (addr) addr.value = info.addr || '';
  }
}

window.placeOrder = function() {
  const fname = document.getElementById('o-fname')?.value.trim() || '';
  const lname = document.getElementById('o-lname')?.value.trim() || '';
  const phone = document.getElementById('o-phone')?.value.trim() || '';
  const addr = document.getElementById('o-addr')?.value.trim() || '';
  if (!fname || !lname || !phone || !addr) {
    showToast('❗ Barcha maydonlarni to‘ldiring');
    return;
  }
  localStorage.setItem('guest_info', JSON.stringify({ fname, lname, phone, addr }));
  cart = [];
  appliedCoupon = null;
  updateBadge();
  closeModal('mod-order');
  showToast('🎉 Buyurtma qabul qilindi! Tez orada aloqaga chiqamiz.');
};

/* ── MODALS ───────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (id === 'mod-cart') renderCart();
  if (id === 'mod-wishlist') renderWishlist();
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.addEventListener('click', e => { if (e.target === bd) closeModal(bd.id); });
});
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => closeModal(m.id));
  }
});

/* ── ACCOUNT ──────────────────────────────────────── */
document.getElementById('acc-btn')?.addEventListener('click', () => openModal('mod-acc'));
window.demoLogin = function() { closeModal('mod-acc'); showToast('👤 Demo hisob — xush kelibsiz!'); };
window.switchForm = function(to) {
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');
  const title = document.getElementById('mod-acc-title');
  if (loginForm) loginForm.style.display = to === 'login' ? '' : 'none';
  if (regForm) regForm.style.display = to === 'register' ? '' : 'none';
  if (title) title.textContent = to === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish';
};

/* ── BUTTONS ──────────────────────────────────────── */
document.getElementById('cart-btn')?.addEventListener('click', () => openModal('mod-cart'));
document.getElementById('wishlist-btn')?.addEventListener('click', () => openModal('mod-wishlist'));

/* ── DROPDOWN (nav2) – HOVER + CLICK ───────────────── */
let openDD = null;

function closeAllDD() {
  document.querySelectorAll('.dropdown.show').forEach(d => d.classList.remove('show'));
  document.querySelectorAll('.nav2-btn.open').forEach(b => b.classList.remove('open'));
  openDD = null;
}

let hoverTimeout;

function openDropdown(ddId, btn) {
  if (openDD === ddId) return;
  closeAllDD();
  const dd = document.getElementById(ddId);
  if (dd) {
    dd.classList.add('show');
    if (btn) btn.classList.add('open');
    openDD = ddId;
  }
}

function closeDropdownDelayed() {
  hoverTimeout = setTimeout(() => {
    closeAllDD();
  }, 300);
}

// HOVER uchun
document.querySelectorAll('.nav2-item').forEach(item => {
  const btn = item.querySelector('.nav2-btn');
  const ddId = btn?.dataset.dd;
  const dropdown = document.getElementById(ddId);

  if (!btn || !dropdown) return;

  item.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
    openDropdown(ddId, btn);
  });

  item.addEventListener('mouseleave', () => {
    closeDropdownDelayed();
  });

  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
  });
  dropdown.addEventListener('mouseleave', () => {
    closeDropdownDelayed();
  });
});

// CLICK uchun (mobil va bosish orqali)
document.querySelectorAll('.nav2-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const ddId = btn.dataset.dd;
    const dd = document.getElementById(ddId);
    if (!dd) return;
    if (dd.classList.contains('show')) {
      closeAllDD();
    } else {
      openDropdown(ddId, btn);
    }
  });
});

// Dropdown ichidagi linklar uchun (filter)
document.querySelectorAll('.dropdown a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const f = a.dataset.filter;
    if (f) {
      activeFilter = f;
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
      filterAndReset(document.getElementById('search-input').value);
    }
    closeAllDD();
  });
});

// Tashqariga bosganda yopish
document.addEventListener('click', closeAllDD);

/* ── MOBILE MENU ──────────────────────────────────── */
const ham = document.getElementById('hamburger');
const mmenu = document.getElementById('mobile-menu');
if (ham && mmenu) {
  ham.addEventListener('click', e => {
    e.stopPropagation();
    const open = mmenu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const f = a.dataset.filter;
      if (f) {
        activeFilter = f;
        filterAndReset(document.getElementById('search-input').value);
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      mmenu.classList.remove('open');
      ham.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── LANG ─────────────────────────────────────────── */
const langBtn = document.getElementById('lang-btn');
let lang = 'uz';
if (langBtn) {
  langBtn.addEventListener('click', () => {
    lang = lang === 'uz' ? 'ru' : 'uz';
    langBtn.textContent = lang.toUpperCase();
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = lang === 'uz' ? 'Nomi, rang, uslub, xona...' : 'Поиск: название, цвет, стиль...';
    const accLabel = document.getElementById('acc-label');
    if (accLabel) accLabel.textContent = lang === 'uz' ? 'Hisob' : 'Аккаунт';
    const cartLabel = document.getElementById('cart-label');
    if (cartLabel) cartLabel.textContent = lang === 'uz' ? 'Savat' : 'Корзина';
    const wishlistLabel = document.getElementById('wishlist-label');
    if (wishlistLabel) wishlistLabel.textContent = lang === 'uz' ? 'Sevimlilar' : 'Избранное';
    const logo = document.getElementById('logo');
    if (logo) logo.innerHTML = 'WALL<em>I</em>';
  });
}

/* ── DARK MODE ────────────────────────────────────── */
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  themeBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark');
    this.textContent = document.body.classList.contains('dark') ? '☀' : '🌙';
  });
}

/* ── SEARCH ───────────────────────────────────────── */
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    filterAndReset(this.value);
  });
}

/* ── CHAT ─────────────────────────────────────────── */
const chatWindow = document.getElementById('chat-window');
const chatFab = document.getElementById('chat-fab');
const chatX = document.getElementById('chat-x');
if (chatFab && chatWindow) {
  chatFab.addEventListener('click', () => chatWindow.classList.toggle('open'));
  if (chatX) chatX.addEventListener('click', () => chatWindow.classList.remove('open'));
}

const faqReplies = {
  'Yetkazib berish qancha?': 'Toshkent ichida 15 000 so\'m (1–2 kun). Viloyatlarga 25 000 so\'m (2–4 kun). 500 000 so\'mdan yuqori buyurtmalarda bepul! 🚚',
  'To\'lov usullari?': 'Naqd pul, Payme, Click, Uzum bank kartasi va 0% nasiya (3–12 oyga) orqali to\'lash mumkin. 💳',
  'Qaytarish shartlari?': 'Tovar olinganidan 14 kun ichida, original holda qaytarish mumkin. Ko\'proq ma\'lumot: +998 71 200 10 10 📞',
};

document.querySelectorAll('.faq-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const q = btn.dataset.q;
    addCM(q, 'usr');
    setTimeout(() => addCM(faqReplies[q] || 'Javob topilmadi.', 'bot'), 500);
  });
});

const chatSend = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');
if (chatSend && chatInput) {
  chatSend.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
}

function sendChat() {
  const inp = document.getElementById('chat-input');
  if (!inp) return;
  const msg = inp.value.trim();
  if (!msg) return;
  addCM(msg, 'usr');
  inp.value = '';
  const user = localStorage.getItem('_wu');
  setTimeout(() => {
    if (!user) {
      const name = prompt('Ismingiz:');
      const phone = prompt('Telefon yoki email:');
      if (name && phone) {
        localStorage.setItem('_wu', JSON.stringify({ name, phone }));
        addCM(`Rahmat, ${name}! Operatorlarimiz yaqin orada siz bilan bog'lanadi. 😊`, 'bot');
      } else {
        addCM('Yordam berish uchun ism va aloqa kerak. Iltimos qayta yozing.', 'bot');
      }
    } else {
      const u = JSON.parse(user);
      addCM(`Rahmat, ${u.name}! Operatorlarimiz tez orada siz bilan bog'lanadi. 😊`, 'bot');
    }
  }, 600);
}

function addCM(text, type) {
  const msgs = document.getElementById('chat-msgs');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'cm ' + type;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ── TOAST ────────────────────────────────────────── */
let tTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(tTimer);
  tTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── ADMIN (qo‘shimcha) ───────────────────────────── */
window.adminProduct = function() {
  const name = prompt('Mahsulot nomi:');
  if (!name) return;
  const price = parseInt(prompt('Narx (so‘m):')) || 150000;
  const room = prompt('Xona (Living Room / Bedroom / Kitchen / Office):') || 'Living Room';
  const color = prompt('Rang:') || 'White';
  const style = prompt('Stil:') || 'Modern';
  const nid = Date.now();
  wallpapers.unshift({
    id: nid, name, price, room, color, style,
    motif: 'Abstract', collection: 'Custom', isNew: true, isHot: false,
    seed: 'c' + (nid % 999)
  });
  closeModal('mod-admin');
  filterAndReset(document.getElementById('search-input').value);
  showToast(`✓ "${name}" qo'shildi`);
};
window.adminSlide = function() {
  const imgSeed = prompt('Rasm uchun seed (masalan s60):') || 's99';
  const room = prompt('Xona nomi:') || 'Yangi xona';
  const sub = prompt('Tavsif:') || 'Yangi kolleksiya';
  const clrs = prompt('Ranglar (vergul bilan):') || 'Beige, White';
  slides.push({ seed: imgSeed, room, sub, colors: clrs.split(',').map(c => c.trim()) });
  buildCarousel();
  closeModal('mod-admin');
  showToast('✓ Yangi slayd qo‘shildi');
};
document.getElementById('admin-btn')?.addEventListener('click', () => openModal('mod-admin'));

/* ── INIT ─────────────────────────────────────────── */
buildCarousel();
buildMarquee();
buildFilters();
filterAndReset('');
buildWorks();
updateWishlistBadge();