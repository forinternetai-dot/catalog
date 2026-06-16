'use strict';

/* ─── DATA ──────────────────────────────────────────────── */

// Mahsulot turlari (product types)
const PRODUCT_TYPES = [
  '3D', 'Nature', 'Mosque', 'Texture', 'New Classic',
  'Animals', 'Babies Room', 'Maps', 'Listya', 'Sky',
  'Floral', 'Geometric', 'Abstract', 'Industrial', 'Scandinavian',
  'Minimalist', 'Bohemian', 'Vintage', 'Modern', 'Classic'
];

// Har bir tur uchun default rasm seed
const TYPE_SEEDS = {
  '3D': 'p3d',
  'Nature': 'pnature',
  'Mosque': 'pmosque',
  'Texture': 'ptexture',
  'New Classic': 'pnewclassic',
  'Animals': 'panimals',
  'Babies Room': 'pbabies',
  'Maps': 'pmaps',
  'Listya': 'plistya',
  'Sky': 'psky',
  'Floral': 'pfloral',
  'Geometric': 'pgeometric',
  'Abstract': 'pabstract',
  'Industrial': 'pindustrial',
  'Scandinavian': 'pscandinavian',
  'Minimalist': 'pminimalist',
  'Bohemian': 'pbohemian',
  'Vintage': 'pvintage',
  'Modern': 'pmodern',
  'Classic': 'pclassic'
};

// Carousel slaydlari
let slides = [
  { seed: 's10', room: 'Yashash xonasi', sub: 'Nordic Dreams kolleksiyasidan', colors: ['Beige', 'Ivory', 'Sage'] },
  { seed: 's20', room: 'Yotoqxona', sub: 'Ocean Breeze kolleksiyasidan', colors: ['Navy', 'White', 'Grey'] },
  { seed: 's30', room: 'Ish xonasi', sub: 'Urban Jungle kolleksiyasidan', colors: ['Forest', 'Taupe', 'Gold'] },
  { seed: 's40', room: 'Oshxona', sub: 'Golden Hour kolleksiyasidan', colors: ['Warm White', 'Oak', 'Brass'] },
  { seed: 's50', room: 'Mehmonxona', sub: 'Vintage Soul kolleksiyasidan', colors: ['Dusty Rose', 'Cream', 'Walnut'] },
];

// Reviews
const REVIEWS = [
  { name: 'Dilnoza R.', role: 'Interyer dizayneri', text: 'WALLI devor qog\'ozlari bilan ishlash juda yoqimli. Sifat va ranglar ajoyib!', stars: 5 },
  { name: 'Jasur K.', role: 'Mijoz', text: 'Buyurtma berish va yetkazib berish juda tez. O\'rnatish xizmati ham zo\'r. Tavsiya qilaman!', stars: 5 },
  { name: 'Malika S.', role: 'Mijoz', text: 'Bolalar xonasiga devor qog\'ozi oldim, juda chiroyli va ekologik toza. Bolam juda xursand.', stars: 4 },
  { name: 'Shoxruh M.', role: 'Arxitektor', text: 'Professional jamoa, sifatli mahsulotlar. Har doim mijozga mos variantni taklif qiladilar.', stars: 5 },
  { name: 'Gulnoza A.', role: 'Mijoz', text: 'Narxlari maqbul, sifati yuqori. Ikkinchi marta buyurtma berdim, hammasi a\'lo!', stars: 5 },
  { name: 'Bobur T.', role: 'Mijoz', text: 'Kolleksiyalari juda keng, har xil uslubga mos variant topish mumkin. Tavsiya etaman.', stars: 4 },
];

// Cart & Wishlist
let cart = [];
let wishlist = JSON.parse(localStorage.getItem('walli_wishlist') || '[]');
let appliedCoupon = null;
const validCoupons = {
  'WALLI10': { type: 'percent', value: 10 },
  'WELCOME50': { type: 'fixed', value: 50000 }
};

// ─── LocalStorage: Products ──────────────────────────────

function getProducts() {
  try {
    const data = localStorage.getItem('walli_products');
    if (data) return JSON.parse(data);
  } catch (e) { /* ignore */ }
  // Default: har bir tur uchun 5–10 ta namuna mahsulot
  const prods = [];
  PRODUCT_TYPES.forEach((type, idx) => {
    const prods = [];
const MOTIF_LIST = ['Animals', 'Botanical', 'Abstract', 'Geometric', 'Floral', 'Textured'];
const STYLE_LIST = ['Minimalist', 'Bohemian', 'Scandinavian', 'Industrial', 'Classic', 'Modern'];
const COLOR_LIST = ['Red', 'Blue', 'Green', 'Beige', 'Yellow', 'Pink', 'Black', 'White'];
const ROOM_LIST = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office'];

PRODUCT_TYPES.forEach((type, idx) => {
  const count = 5 + (idx * 3) % 8;
  for (let i = 0; i < count; i++) {
    const seed = TYPE_SEEDS[type] || 'pdefault';
    prods.push({
      id: Date.now() + idx * 1000 + i,
      type: type,
      name: `${type} №${i+1}`,
      price: 120000 + Math.floor(Math.random() * 180000),
      seed: `${seed}_${i}`,
      desc: `${type} uslubidagi devor qog'ozi. Yuqori sifatli material.`,
      image: `https://picsum.photos/seed/${seed}_${i}/600/450`,
      motif: MOTIF_LIST[i % MOTIF_LIST.length],
      style: STYLE_LIST[i % STYLE_LIST.length],
      color: COLOR_LIST[i % COLOR_LIST.length],
      room: ROOM_LIST[i % ROOM_LIST.length]
    });
  }
});
  });
  localStorage.setItem('walli_products', JSON.stringify(prods));
  return prods;
}

function saveProducts(prods) {
  localStorage.setItem('walli_products', JSON.stringify(prods));
}

let wallpapers = getProducts();

// ─── Render Product Types ────────────────────────────────

function renderProductTypes() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const types = getTypesWithCount();

  types.forEach(type => {
    const products = wallpapers.filter(p => p.type === type);
    const count = products.length;
    const seed = TYPE_SEEDS[type] || 'pdefault';
    // Barcha atributlarni birlashtirib, qidiruv uchun string yaratamiz
    const searchStr = products.map(p => 
      [p.name, p.type, p.motif, p.style, p.color, p.room].join(' ').toLowerCase()
    ).join(' ');

    const card = document.createElement('div');
    card.className = 'p-card';
    card.dataset.type = type;
    card.dataset.search = searchStr; // qidiruv uchun

    card.innerHTML = `
      <div class="p-img-wrap">
        <img src="https://picsum.photos/seed/${seed}_type/400/300" alt="${type}" loading="lazy">
        <div class="p-quick">
          <button class="p-quick-btn" data-type="${type}">Batafsil</button>
        </div>
      </div>
      <div class="p-body">
        <div class="p-name">${type}</div>
        <div class="p-count">${count} ta mahsulot</div>
        <div class="p-bottom">
          <span style="font-size:12px;color:var(--text3);">${count > 0 ? '🖼 Ko‘rish' : '⏳ Tez orada'}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);

    // Batafsil tugmasi
    const btn = card.querySelector('.p-quick-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTypePopup(type);
      });
    }
    card.addEventListener('click', () => openTypePopup(type));
  });

  // Mobile menu typelar
  const mobList = document.getElementById('mob-type-list');
  if (mobList) {
    mobList.innerHTML = types.map(t =>
      `<a class="mob-link" href="#" data-type="${t}">${t}</a>`
    ).join('');
    mobList.querySelectorAll('.mob-link').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const type = a.dataset.type;
        openTypePopup(type);
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Nav2 dropdown typelar
  const ddType = document.getElementById('dd-type');
  if (ddType) {
    ddType.innerHTML = types.map(t =>
      `<a href="#" data-type="${t}">${t}</a>`
    ).join('');
    ddType.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const type = a.dataset.type;
        openTypePopup(type);
        closeAllDD();
      });
    });
  }
}

function getTypesWithCount() {
  const counts = {};
  wallpapers.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
  const existing = Object.keys(counts);
  const allTypes = PRODUCT_TYPES.filter(t => existing.includes(t));
  return allTypes.length ? allTypes : PRODUCT_TYPES;
}

// ─── Type Popup (mahsulotlar ro'yxati) ───────────────────

function openTypePopup(type) {
  const overlay = document.getElementById('product-popup');
  const content = document.getElementById('pp-content');
  if (!overlay || !content) return;

  const products = wallpapers.filter(p => p.type === type);
  if (!products.length) {
    showToast('Bu turda hozircha mahsulot yo‘q');
    return;
  }

  let html = `
    <div style="margin-bottom:16px;">
      <h2 style="font-family:var(--font-display);font-size:28px;font-weight:700;color:var(--text);">${type}</h2>
      <span style="font-size:14px;color:var(--text3);">${products.length} ta mahsulot</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;">
  `;

  products.forEach(p => {
    const isWished = wishlist.includes(p.id);
    html += `
      <div class="rem-item" data-id="${p.id}" style="background:var(--bg2);border-radius:var(--r);padding:10px;text-align:center;cursor:pointer;transition:all var(--t);border:1px solid transparent;">
        <img src="${p.image || 'https://picsum.photos/seed/'+p.seed+'/400/300'}" alt="${p.name}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:var(--r);margin-bottom:6px;">
        <div style="font-size:13px;font-weight:600;color:var(--text);">${p.name}</div>
        <div style="font-size:12px;color:var(--sand);font-weight:600;">${p.price.toLocaleString()} so'm</div>
        <div style="display:flex;gap:6px;justify-content:center;margin-top:6px;">
          <button class="p-add" style="width:32px;height:32px;font-size:16px;" onclick="event.stopPropagation();addToCart(${p.id});">+</button>
          <button class="p-wish ${isWished?'active':''}" style="width:32px;height:32px;font-size:16px;border-radius:99px;background:var(--bg2);border:1px solid var(--line);cursor:pointer;" onclick="event.stopPropagation();toggleWishlist(${p.id},this);">${isWished?'❤️':'♡'}</button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  content.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  content.querySelectorAll('.rem-item').forEach(el => {
    el.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      openProductDetail(id);
    });
  });
}

// ─── Product Detail Popup ────────────────────────────────

function openProductDetail(id) {
  const p = wallpapers.find(w => w.id === id);
  if (!p) return;

  const overlay = document.getElementById('product-popup');
  const content = document.getElementById('pp-content');
  if (!overlay || !content) return;

  const others = wallpapers.filter(w => w.type === p.type && w.id !== p.id);
  const isWished = wishlist.includes(p.id);

  let html = `
    <div class="pp-grid">
      <div class="pp-image">
        <img src="${p.image || 'https://picsum.photos/seed/'+p.seed+'/600/450'}" alt="${p.name}">
      </div>
      <div class="pp-info">
        <span class="pp-type">${p.type}</span>
        <h2>${p.name}</h2>
        <p>${p.desc || 'Yuqori sifatli devor qog\'ozi. Uzoq muddat foydalanish uchun mo\'ljallangan.'}</p>
        <div class="pp-price">${p.price.toLocaleString()} so'm / 1 m²</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn-sand" style="width:auto;padding:10px 28px;" onclick="addToCart(${p.id});showToast('✓ Savatga qo\'shildi');">🛒 Savatga</button>
          <button class="btn-outline" style="width:auto;padding:10px 28px;" onclick="toggleWishlist(${p.id},document.querySelector('.pp-wish'));">${isWished?'❤️ Sevimlilarda':'♡ Sevimlilarga'}</button>
        </div>
      </div>
    </div>
  `;

  if (others.length) {
    html += `
      <div class="pp-remaining">
        <h4>🔹 Shu turdagi boshqa mahsulotlar (${others.length})</h4>
        <div class="rem-grid">
    `;
    others.slice(0, 12).forEach(o => {
      html += `
        <div class="rem-item" data-id="${o.id}">
          <img src="${o.image || 'https://picsum.photos/seed/'+o.seed+'/200/200'}" alt="${o.name}">
          <div class="rem-name">${o.name}</div>
          <div style="font-size:11px;color:var(--sand);font-weight:600;">${o.price.toLocaleString()} so'm</div>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  content.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  content.querySelectorAll('.rem-item').forEach(el => {
    el.addEventListener('click', function() {
      const pid = parseInt(this.dataset.id);
      openProductDetail(pid);
    });
  });

  const wishBtn = content.querySelector('.pp-info .btn-outline');
  if (wishBtn) {
    wishBtn.addEventListener('click', function() {
      const isNow = wishlist.includes(p.id);
      this.textContent = isNow ? '♡ Sevimlilarga' : '❤️ Sevimlilarda';
      this.classList.toggle('btn-outline');
      this.classList.toggle('btn-sand');
    });
  }
}

// ─── Close product popup ─────────────────────────────────

document.getElementById('pp-close')?.addEventListener('click', () => {
  document.getElementById('product-popup').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('product-popup')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    document.getElementById('product-popup').classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ─── Carousel ─────────────────────────────────────────────

let cIdx = 0, cTimer;

function buildCarousel() {
  const track = document.getElementById('c-track');
  const dots = document.getElementById('c-dots');
  if (!track || !dots) return;
  track.innerHTML = '';
  dots.innerHTML = '';

  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'c-slide';
    slide.innerHTML = `
      <img src="https://picsum.photos/seed/${s.seed}/1400/640" alt="${s.room}" loading="${i===0?'eager':'lazy'}">
      <div class="c-overlay">
        <div class="c-info">
          <div class="c-eyebrow">Featured Collection</div>
          <h2 class="c-title">${s.room}</h2>
          <p class="c-sub">${s.sub}</p>
          <div class="c-tags">${s.colors.map(c=>`<span class="c-tag">${c}</span>`).join('')}</div>
        </div>
      </div>
    `;
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
  const track = document.getElementById('c-track');
  if (track) track.style.transform = `translateX(-${cIdx * 100}%)`;
  document.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === cIdx));
  clearInterval(cTimer);
  cTimer = setInterval(() => goSlide(cIdx + 1), 3500);
}
document.getElementById('c-prev')?.addEventListener('click', () => goSlide(cIdx - 1));
document.getElementById('c-next')?.addEventListener('click', () => goSlide(cIdx + 1));

// ─── Marquee ──────────────────────────────────────────────

function buildMarquee() {
  const t1 = '✦ SELECTED WALLPAPER MOTIFS ✦  ';
  const t2 = '◈ MOST POPULAR DESIGNS 2024 ◈  ';
  ['m1', 'm2'].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = Array(12).fill(`<span>${idx===0?t1:t2}</span>`).join('');
  });
}

// ─── Reviews ──────────────────────────────────────────────

function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  grid.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="rv-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
      <div class="rv-text">"${r.text}"</div>
      <div class="rv-author">${r.name}</div>
      <div class="rv-role">${r.role}</div>
    </div>
  `).join('');
}

// ─── Order Steps ──────────────────────────────────────────

let orderStep = 0;

function animateOrderSteps() {
  const steps = document.querySelectorAll('.order-step');
  steps.forEach((el, i) => {
    el.classList.toggle('active', i <= orderStep);
  });
  orderStep = (orderStep + 1) % 7;
  setTimeout(animateOrderSteps, 2500);
}

// ─── Video ────────────────────────────────────────────────

const videoWrapper = document.getElementById('video-wrapper');
const installVideo = document.getElementById('install-video');
const playOverlay = document.getElementById('play-overlay');

if (videoWrapper && installVideo) {
  videoWrapper.addEventListener('click', () => {
    openVideoPopup();
  });
  installVideo.muted = true;
  installVideo.play().catch(() => {});
}

function openVideoPopup() {
  const popup = document.getElementById('video-popup');
  const vpVideo = document.getElementById('vp-video');
  if (!popup || !vpVideo) return;
  const src = installVideo.querySelector('source')?.src || 'https://www.w3schools.com/html/mov_bbb.mp4';
  vpVideo.src = src;
  vpVideo.load();
  vpVideo.muted = false;
  vpVideo.play().catch(() => {});
  popup.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateVideoControls();
}

document.getElementById('vp-close')?.addEventListener('click', () => {
  const popup = document.getElementById('video-popup');
  const vpVideo = document.getElementById('vp-video');
  if (vpVideo) vpVideo.pause();
  if (popup) popup.classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('video-popup')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    const vpVideo = document.getElementById('vp-video');
    if (vpVideo) vpVideo.pause();
    document.getElementById('video-popup').classList.remove('open');
    document.body.style.overflow = '';
  }
});

function updateVideoControls() {
  const vpVideo = document.getElementById('vp-video');
  const vpPlay = document.getElementById('vp-play');
  const vpStop = document.getElementById('vp-stop');
  const vpTime = document.getElementById('vp-time');
  const vpProgress = document.getElementById('vp-progress');

  if (!vpVideo || !vpPlay || !vpStop || !vpTime || !vpProgress) return;

  vpPlay.textContent = '⏸ Pause';

  vpPlay.onclick = () => {
    if (vpVideo.paused) {
      vpVideo.play();
      vpPlay.textContent = '⏸ Pause';
    } else {
      vpVideo.pause();
      vpPlay.textContent = '▶ Play';
    }
  };

  vpStop.onclick = () => {
    vpVideo.pause();
    vpVideo.currentTime = 0;
    vpPlay.textContent = '▶ Play';
  };

  vpVideo.ontimeupdate = () => {
    const pct = vpVideo.currentTime / vpVideo.duration * 100;
    vpProgress.value = pct || 0;
    vpTime.textContent = formatTime(vpVideo.currentTime) + ' / ' + formatTime(vpVideo.duration);
  };

  vpProgress.oninput = () => {
    const pct = parseFloat(vpProgress.value) / 100;
    vpVideo.currentTime = pct * vpVideo.duration;
  };

  vpVideo.onloadedmetadata = () => {
    vpTime.textContent = '0:00 / ' + formatTime(vpVideo.duration);
  };
}

function formatTime(t) {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// ─── Cart ─────────────────────────────────────────────────

function addToCart(id) {
  const w = wallpapers.find(x => x.id === id);
  if (!w) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...w, qty: 1 });
  updateBadge();
  showToast(`✓ "${w.name}" savatga qo'shildi`);
}

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
  if (!body) return;
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
        <img src="${it.image || 'https://picsum.photos/seed/'+it.seed+'/200/200'}" alt="${it.name}">
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
      <button id="apply-coupon" class="btn-outline" style="width:auto;padding:8px 16px;">Qo‘llash</button>
    </div>
    <div id="cart-discount" style="${discount?'display:block':'display:none'}">
      Chegirma: -<span id="discount-amount">${discount.toLocaleString()}</span> so'm
    </div>
    <div class="cart-total-row" style="border-top:2px solid var(--sand);margin-top:8px;padding-top:12px;">
      <span>Jami to‘lov:</span><span>${total.toLocaleString()} so'm</span>
    </div>
    <button class="btn-sand" style="margin-top:16px" onclick="openOrder()">Buyurtma berish →</button>
  `;
  document.getElementById('apply-coupon')?.addEventListener('click', applyCoupon);
}

function applyCoupon() {
  const code = document.getElementById('coupon-code')?.value.trim().toUpperCase();
  if (code && validCoupons[code]) {
    appliedCoupon = code;
    showToast(`✅ Kupon qo‘llandi: ${code}`);
    renderCart();
  } else {
    showToast('❌ Noto‘g‘ri kod');
  }
}

function cQty(id, d) {
  const it = cart.find(x => x.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) cRemove(id);
  else { updateBadge(); renderCart(); }
}

function cRemove(id) {
  cart = cart.filter(x => x.id !== id);
  updateBadge(); renderCart();
}

// ─── Wishlist ─────────────────────────────────────────────

function toggleWishlist(id, btn) {
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
  const wm = document.getElementById('mod-wishlist');
  if (wm && wm.classList.contains('open')) renderWishlist();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.textContent = wishlist.length;
}

function renderWishlist() {
  const container = document.getElementById('wishlist-body');
  if (!container) return;
  const items = wallpapers.filter(w => wishlist.includes(w.id));
  if (!items.length) {
    container.innerHTML = '<div class="cart-empty">❤️ Sevimlilar ro‘yxati bo‘sh</div>';
    return;
  }
  container.innerHTML = items.map(w => `
    <div class="cart-item">
      <img src="${w.image || 'https://picsum.photos/seed/'+w.seed+'/200/200'}" alt="${w.name}">
      <div class="ci-info">
        <div class="ci-name">${w.name}</div>
        <div class="ci-price">${w.price.toLocaleString()} so‘m</div>
      </div>
      <button class="ci-del" onclick="addToCart(${w.id});showToast('✓ Savatga qo‘shildi');">🛒</button>
      <button class="ci-del" onclick="toggleWishlist(${w.id}, document.querySelector('.p-wish[data-id=\\'${w.id}\\']')); renderWishlist();">🗑</button>
    </div>
  `).join('');
}

// ─── Order ─────────────────────────────────────────────────

function openOrder() {
  closeModal('mod-cart');
  autoFillGuest();
  openModal('mod-order');
}

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

function placeOrder() {
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
}

// ─── Modals ───────────────────────────────────────────────

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
    document.getElementById('product-popup')?.classList.remove('open');
    document.getElementById('video-popup')?.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.getElementById('cart-btn')?.addEventListener('click', () => openModal('mod-cart'));
document.getElementById('wishlist-btn')?.addEventListener('click', () => openModal('mod-wishlist'));

// ─── Dropdown ─────────────────────────────────────────────

let openDD = null;
let hoverTimeout;

function closeAllDD() {
  document.querySelectorAll('.dropdown.show').forEach(d => d.classList.remove('show'));
  document.querySelectorAll('.nav2-btn.open').forEach(b => b.classList.remove('open'));
  openDD = null;
}

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

// Nav2 dagi barcha itemlarni topib, hover va click eventlarini biriktiramiz
document.querySelectorAll('.nav2-item').forEach(item => {
  const btn = item.querySelector('.nav2-btn');
  if (!btn) return;
  const ddId = btn.dataset.dd;
  const dropdown = document.getElementById(ddId);
  if (!dropdown) return;

  // Hover bilan ochish
  item.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
    openDropdown(ddId, btn);
  });
  item.addEventListener('mouseleave', () => {
    hoverTimeout = setTimeout(closeAllDD, 300);
  });

  // Dropdown ustida turgan vaqtda yopilmasligi uchun
  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
  });
  dropdown.addEventListener('mouseleave', () => {
    hoverTimeout = setTimeout(closeAllDD, 300);
  });

  // Click bilan ochish/yopish (mobil va bosish uchun)
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dropdown.classList.contains('show')) {
      closeAllDD();
    } else {
      openDropdown(ddId, btn);
    }
  });
});

// Sahifaning istalgan joyiga bosganda dropdownlarni yopish
document.addEventListener('click', closeAllDD);

// ─── Mobile Menu ──────────────────────────────────────────

const ham = document.getElementById('hamburger');
const mmenu = document.getElementById('mobile-menu');
if (ham && mmenu) {
  ham.addEventListener('click', e => {
    e.stopPropagation();
    const open = mmenu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

// ─── Theme ────────────────────────────────────────────────

document.getElementById('theme-btn')?.addEventListener('click', function() {
  document.body.classList.toggle('dark');
  this.textContent = document.body.classList.contains('dark') ? '☀' : '🌙';
});

// ─── Search ───────────────────────────────────────────────

document.getElementById('search-input')?.addEventListener('input', function() {
  const val = this.value.toLowerCase().trim();
  const cards = document.querySelectorAll('#products-grid .p-card');
  cards.forEach(card => {
    const name = card.querySelector('.p-name')?.textContent?.toLowerCase() || '';
    // Qo‘shimcha atributlar kartochkada ko‘rinmasa ham, ularni data atributiga yozib qo‘yamiz
    const type = card.dataset.type || '';
    const motif = card.dataset.motif || '';
    const style = card.dataset.style || '';
    const color = card.dataset.color || '';
    const room = card.dataset.room || '';
    const match = !val || name.includes(val) || type.includes(val) || motif.includes(val) || style.includes(val) || color.includes(val) || room.includes(val);
    card.style.display = match ? '' : 'none';
  });
});
// ─── Chat ─────────────────────────────────────────────────

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

document.getElementById('chat-send')?.addEventListener('click', sendChat);
document.getElementById('chat-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

function sendChat() {
  const inp = document.getElementById('chat-input');
  if (!inp) return;
  const msg = inp.value.trim();
  if (!msg) return;
  addCM(msg, 'usr');
  inp.value = '';
  setTimeout(() => {
    addCM('Rahmat! Operatorlarimiz tez orada siz bilan bog\'lanadi. 😊', 'bot');
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

// ─── Toast ─────────────────────────────────────────────────

let tTimer;

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(tTimer);
  tTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ─── Scroll Top ───────────────────────────────────────────

const scrollBtn = document.getElementById('scroll-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Admin ─────────────────────────────────────────────────

document.getElementById('admin-btn')?.addEventListener('click', () => openModal('mod-admin'));

// ─── Operator Popup ──────────────────────────────────────

(function() {
  const popup = document.getElementById('chat-welcome-popup');
  if (!popup) return;
  let timeout;
  const showPopup = () => {
    popup.style.display = 'block';
    timeout = setTimeout(() => { popup.style.display = 'none'; }, 6000);
  };
  const closePopup = () => {
    clearTimeout(timeout);
    popup.style.display = 'none';
  };
  popup.querySelector('.popup-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closePopup();
  });
  document.getElementById('chat-fab')?.addEventListener('click', () => {
    if (popup.style.display === 'block') closePopup();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPopup);
  } else {
    showPopup();
  }
})();

// ─── Init ──────────────────────────────────────────────────

buildCarousel();
buildMarquee();
renderProductTypes();
renderReviews();
updateWishlistBadge();
updateBadge();

setTimeout(animateOrderSteps, 1000);
setTimeout(updateVideoControls, 500);

// ─── Expose globals ───────────────────────────────────────

window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.cQty = cQty;
window.cRemove = cRemove;
window.placeOrder = placeOrder;
window.openOrder = openOrder;
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.openTypePopup = openTypePopup;
window.openProductDetail = openProductDetail;
window.applyCoupon = applyCoupon;
window.renderWishlist = renderWishlist;
window.renderCart = renderCart;
window.closeAllDD = closeAllDD;

console.log('✅ WALLI v3 — yuklandi!');
console.log(`📦 ${wallpapers.length} ta mahsulot, ${PRODUCT_TYPES.length} ta tur`);
// ===== ADMIN PANEL FUNCTIONS =====

function loadAdminProducts() {
  const products = getProducts();
  const tbody = document.getElementById('admin-table-body');
  const count = document.getElementById('admin-count');
  const noResults = document.getElementById('admin-no-results');
  if (!tbody) return;

  const searchVal = document.getElementById('admin-search')?.value.toLowerCase() || '';
  const typeFilter = document.getElementById('admin-type-filter')?.value || '';

  let filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchVal);
    const matchType = !typeFilter || p.type === typeFilter;
    return matchName && matchType;
  });

  if (count) count.textContent = filtered.length + ' ta mahsulot';

  if (!filtered.length) {
    tbody.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }
  if (noResults) noResults.style.display = 'none';

  tbody.innerHTML = filtered.map(p => `
    <tr style="border-bottom:1px solid var(--line);">
      <td style="padding:8px 12px;"><img src="${p.image || 'https://picsum.photos/seed/'+p.seed+'/80/60'}" alt="${p.name}" style="width:60px;height:45px;object-fit:cover;border-radius:8px;"></td>
      <td style="padding:8px 12px;font-weight:500;">${p.name}</td>
      <td style="padding:8px 12px;"><span style="background:var(--bg2);padding:2px 12px;border-radius:99px;font-size:12px;">${p.type}</span></td>
      <td style="padding:8px 12px;">${p.price.toLocaleString()} so‘m</td>
      <td style="padding:8px 12px;text-align:center;">
        <button onclick="openEditProduct(${p.id})" style="background:var(--bg2);border:1px solid var(--line);border-radius:6px;padding:4px 10px;margin-right:6px;color:var(--text);">✎</button>
        <button onclick="deleteProduct(${p.id})" style="background:transparent;border:none;color:#e74c3c;font-size:18px;">🗑</button>
      </td>
    </tr>
  `).join('');
}

function populateTypeSelect() {
  const select = document.getElementById('p-type');
  if (!select) return;
  const types = PRODUCT_TYPES;
  select.innerHTML = types.map(t => `<option value="${t}">${t}</option>`).join('');
}

function populateTypeFilter() {
  const select = document.getElementById('admin-type-filter');
  if (!select) return;
  const types = PRODUCT_TYPES;
  select.innerHTML = '<option value="">Barcha turlar</option>' + types.map(t => `<option value="${t}">${t}</option>`).join('');
}

function openAddProduct() {
  document.getElementById('edit-id').value = '';
  document.getElementById('product-modal-title').textContent = 'Yangi mahsulot';
  document.getElementById('p-name').value = '';
  document.getElementById('p-price').value = '';
  document.getElementById('p-desc').value = 'Yuqori sifatli devor qog\'ozi';
  document.getElementById('p-image').value = '';
  document.getElementById('p-motif').value = 'Animals';
  document.getElementById('p-style').value = 'Minimalist';
  document.getElementById('p-color').value = 'Beige';
  document.getElementById('p-room').value = 'Living Room';
  populateTypeSelect();
  openModal('mod-product');
}

function openEditProduct(id) {
  const products = getProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('edit-id').value = id;
  document.getElementById('product-modal-title').textContent = 'Mahsulotni tahrirlash';
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-desc').value = p.desc || '';
  document.getElementById('p-image').value = p.image || '';
  document.getElementById('p-motif').value = p.motif || 'Animals';
  document.getElementById('p-style').value = p.style || 'Minimalist';
  document.getElementById('p-color').value = p.color || 'Beige';
  document.getElementById('p-room').value = p.room || 'Living Room';
  populateTypeSelect();
  document.getElementById('p-type').value = p.type;
  openModal('mod-product');
}

function deleteProduct(id) {
  if (!confirm('Bu mahsulotni o‘chirishni xohlaysizmi?')) return;
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  wallpapers = products;
  loadAdminProducts();
  renderProductTypes();
  showToast('🗑 Mahsulot o‘chirildi');
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('p-name').value.trim();
  const type = document.getElementById('p-type').value;
  const price = parseInt(document.getElementById('p-price').value);
  const desc = document.getElementById('p-desc').value.trim();
  const image = document.getElementById('p-image').value.trim();
  const motif = document.getElementById('p-motif').value;
  const style = document.getElementById('p-style').value;
  const color = document.getElementById('p-color').value;
  const room = document.getElementById('p-room').value;

  if (!name || !type || !price) {
    showToast('❗ Barcha maydonlarni to‘ldiring');
    return;
  }

  let products = getProducts();

  if (id) {
    const idx = products.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, type, price, desc, image, motif, style, color, room };
    }
  } else {
    const newId = Date.now();
    const seed = 'p' + newId;
    products.push({
      id: newId,
      name,
      type,
      price,
      desc: desc || 'Yuqori sifatli devor qog\'ozi',
      image: image || `https://picsum.photos/seed/${seed}/600/450`,
      seed,
      motif,
      style,
      color,
      room
    });
  }

  saveProducts(products);
  wallpapers = products;
  closeModal('mod-product');
  loadAdminProducts();
  renderProductTypes();
  showToast('✅ Mahsulot saqlandi');
}

function initAdmin() {
  if (document.getElementById('admin-table-body')) {
    loadAdminProducts();
    populateTypeFilter();
    document.getElementById('admin-search')?.addEventListener('input', loadAdminProducts);
    document.getElementById('admin-type-filter')?.addEventListener('change', loadAdminProducts);
  }
}

// Admin sahifasida ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('admin-table-body')) {
    initAdmin();
  }
});
// ===== LOGO -> CAROUSEL =====
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('logo')?.addEventListener('click', function() {
    const carousel = document.getElementById('carousel');
    if (carousel) {
      carousel.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});