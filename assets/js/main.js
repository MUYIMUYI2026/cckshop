/* ===== CCKShop Main JS ===== */

// Brand data
const brandsData = {
  bestsellers: [
    { name: 'L\'Oréal', icon: '💄', color: '#fce4ec' },
    { name: 'Maybelline', icon: '💋', color: '#f3e5f5' },
    { name: 'Neutrogena', icon: '🧴', color: '#e8f5e9' },
    { name: 'CeraVe', icon: '🌿', color: '#e0f2f1' },
    { name: 'Samsung', icon: '📱', color: '#e3f2fd' },
    { name: 'Philips', icon: '💡', color: '#fff8e1' },
  ],
  beauty: [
    { name: 'MAC', icon: '💄', color: '#fce4ec' },
    { name: 'NYX', icon: '✨', color: '#f3e5f5' },
    { name: 'Revlon', icon: '💅', color: '#fce4ec' },
    { name: 'e.l.f.', icon: '🌸', color: '#fce4ec' },
    { name: 'Urban Decay', icon: '🎨', color: '#ede7f6' },
    { name: 'NARS', icon: '💋', color: '#fce4ec' },
  ],
  skincare: [
    { name: 'CeraVe', icon: '🌿', color: '#e0f2f1' },
    { name: 'La Roche-Posay', icon: '🧪', color: '#e8f5e9' },
    { name: 'Neutrogena', icon: '🧴', color: '#e8f5e9' },
    { name: 'Olay', icon: '✨', color: '#fff8e1' },
    { name: 'Clinique', icon: '🌱', color: '#e8f5e9' },
    { name: 'Kiehl\'s', icon: '🍃', color: '#e8f5e9' },
  ],
  electronics: [
    { name: 'Samsung', icon: '📱', color: '#e3f2fd' },
    { name: 'Philips', icon: '💡', color: '#fff8e1' },
    { name: 'Sony', icon: '🎧', color: '#e3f2fd' },
    { name: 'Anker', icon: '🔋', color: '#e8eaf6' },
    { name: 'JBL', icon: '🔊', color: '#e3f2fd' },
    { name: 'Braun', icon: '⚡', color: '#e3f2fd' },
  ]
};

// Product data
const productsData = {
  trending: [
    { brand: 'L\'Oréal', name: 'Revitalift Serum 30ml', price: '$18.99', old: '$24.99', emoji: '🧴' },
    { brand: 'Samsung', name: 'Galaxy Buds Pro', price: '$89.99', old: '$129.99', emoji: '🎧' },
    { brand: 'CeraVe', name: 'Moisturizing Cream 250g', price: '$14.99', old: '$19.99', emoji: '🌿' },
    { brand: 'Maybelline', name: 'Fit Me Foundation', price: '$9.99', old: '$14.99', emoji: '💄' },
    { brand: 'Philips', name: 'Electric Toothbrush', price: '$39.99', old: '$59.99', emoji: '🪥' },
  ],
  beauty: [
    { brand: 'MAC', name: 'Studio Fix Powder', price: '$29.99', old: '$38.00', emoji: '✨' },
    { brand: 'NYX', name: 'Soft Matte Lip Cream', price: '$7.99', old: '$10.99', emoji: '💋' },
    { brand: 'Revlon', name: 'ColorStay Mascara', price: '$11.99', old: '$15.99', emoji: '👁️' },
    { brand: 'e.l.f.', name: 'Poreless Putty Primer', price: '$8.99', old: '$12.00', emoji: '🌸' },
    { brand: 'Urban Decay', name: 'All Nighter Setting Spray', price: '$19.99', old: '$33.00', emoji: '💦' },
  ],
  skincare: [
    { brand: 'CeraVe', name: 'Hydrating Cleanser 473ml', price: '$13.99', old: '$18.99', emoji: '🧼' },
    { brand: 'Neutrogena', name: 'Hydro Boost Water Gel', price: '$16.99', old: '$22.99', emoji: '💧' },
    { brand: 'La Roche-Posay', name: 'Cicaplast Baume B5', price: '$18.99', old: '$24.00', emoji: '🌱' },
    { brand: 'Olay', name: 'Regenerist Micro-Sculpting Cream', price: '$21.99', old: '$28.99', emoji: '✨' },
    { brand: 'Kiehl\'s', name: 'Ultra Facial Cream 50ml', price: '$24.99', old: '$34.00', emoji: '🍃' },
  ],
  electronics: [
    { brand: 'Samsung', name: 'Galaxy Watch 6', price: '$199.99', old: '$279.99', emoji: '⌚' },
    { brand: 'Anker', name: 'PowerCore 20000mAh', price: '$34.99', old: '$49.99', emoji: '🔋' },
    { brand: 'JBL', name: 'Clip 4 Bluetooth Speaker', price: '$44.99', old: '$59.99', emoji: '🔊' },
    { brand: 'Philips', name: 'Hue Smart Bulb 4-Pack', price: '$49.99', old: '$69.99', emoji: '💡' },
    { brand: 'Braun', name: 'Series 5 Electric Shaver', price: '$79.99', old: '$109.99', emoji: '⚡' },
  ],
  daily: [
    { brand: 'Dove', name: 'Deep Moisture Body Wash', price: '$6.99', old: '$9.99', emoji: '🚿' },
    { brand: 'Oral-B', name: 'Pro 1000 Toothbrush', price: '$29.99', old: '$49.99', emoji: '🦷' },
    { brand: 'Gillette', name: 'Fusion5 Razor Blades 8ct', price: '$19.99', old: '$27.99', emoji: '🪒' },
    { brand: 'Pantene', name: 'Pro-V Shampoo 750ml', price: '$8.99', old: '$12.99', emoji: '🧴' },
    { brand: 'Tide', name: 'Original Laundry Pods 42ct', price: '$14.99', old: '$19.99', emoji: '🧺' },
  ]
};

// Render brands
function renderBrands(tab) {
  const grid = document.getElementById('brandsGrid');
  if (!grid) return;
  const brands = brandsData[tab] || brandsData.bestsellers;
  grid.innerHTML = brands.map(b => `
    <div class="brand-card">
      <div class="brand-icon" style="background:${b.color}">${b.icon}</div>
      <span>${b.name}</span>
    </div>
  `).join('');
}

// Render products
function renderProducts(tab) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const products = productsData[tab] || productsData.trending;
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price} <span class="old-price">${p.old}</span></div>
        <button class="product-action">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Tab switching - brands
document.querySelectorAll('.brands-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.brands-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderBrands(this.dataset.tab);
  });
});

// Tab switching - products
document.querySelectorAll('.products-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.products-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderProducts(this.dataset.ptab);
  });
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const catNav = document.getElementById('catNav');
if (mobileMenuBtn && catNav) {
  mobileMenuBtn.addEventListener('click', () => {
    catNav.style.display = catNav.style.display === 'none' ? 'block' : 'none';
  });
}

// Sticky header shadow
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) {
    header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)';
  }
});

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      window.location.href = `shop.html?q=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });
}

// Initialize
renderBrands('bestsellers');
renderProducts('trending');
