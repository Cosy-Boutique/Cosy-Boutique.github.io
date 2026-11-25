/* ============================================================
   COSY - UNIVERS + MENU + PROMO + PARTAGE (FICHIER COMPLET)
   À charger APRÈS le script principal et AVANT wedding.js :
   <script src="univers.js?v=5"></script>
   ============================================================ */
(function () {
    'use strict';

    // Sécurité : on attend que PRODUCTS et les fonctions de base existent
    if (typeof PRODUCTS === 'undefined' || typeof getImageUrl === 'undefined') {
        console.error('univers.js : PRODUCTS ou getImageUrl introuvable. Vérifie l\'ordre des scripts.');
        return;
    }

    // ============================================================
    // 1. CONFIGURATION
    // ============================================================
    const UNIVERS = {
        femme: {
            label: 'Femme',
            tileTitle: 'Pour Elle',
            tagline: 'Des bijoux en perles, délicats ou audacieux, pour chaque humeur.',
            tileImage: { src: 'WhatsApp_Image_2026-01-26_at_08.16.18_4_z6tfdm.jpg', local: false },
            categories: [
                { key: 'collier-femme', label: 'Colliers' },
                { key: 'bracelet',      label: 'Bracelets' },
                { key: 'parure',        label: 'Parures' },
                { key: 'baya',          label: 'Baya' },
                { key: 'chevillere',    label: 'Chevillères' },
                { key: 'autres',        label: 'Accessoires' }
            ]
        },
        homme: {
            label: 'Homme',
            tileTitle: 'Pour Lui',
            tagline: 'Du quotidien aux grandes occasions, trouve les accessoires qui te ressemblent.',
            tileImage: { src: 'cross/cross-04.jpg', local: true },
            categories: [
                { key: 'collier-homme', label: 'Colliers' },
                { key: 'bracelet',      label: 'Bracelets' },
                { key: 'autres',        label: 'Autres accessoires' }
            ]
        }
    };

    const STYLES = {
        minimaliste: {
            label: 'Minimaliste',
            desc: {
                femme: 'Fin, discret, intemporel. Le bijou qui se fait oublier tout en sublimant.',
                homme: 'Sobre et épuré. Une touche subtile qui va avec tout.'
            },
            image: {
                femme: { src: 'WhatsApp_Image_2026-01-26_at_08.34.45_tcfhsj.jpg', local: false },
                homme: { src: 'PHOTO-2026-03-09-16-50-31_14_phr06y.jpg', local: false }
            }
        },
        stylish: {
            label: 'Stylish',
            desc: {
                femme: 'Le bon équilibre : de la personnalité sans en faire trop.',
                homme: 'Affirmé mais maîtrisé. Des pièces qui se remarquent avec élégance.'
            },
            image: {
                femme: { src: 'WhatsApp_Image_2026-01-26_at_08.16.18_4_z6tfdm.jpg', local: false },
                homme: { src: 'PHOTO-2026-03-09-16-50-31_16_ysh56z.jpg', local: false }
            }
        },
        maximaliste: {
            label: 'Maximaliste',
            desc: {
                femme: 'Perles, volumes, couleurs : plus c\u2019est riche, plus c\u2019est toi.',
                homme: 'Gros caractère, pièces fortes. Ici, on assume tout.'
            },
            image: {
                femme: { src: 'ef84b59a-d20a-46dc-9357-9482bc95b238_tcwjju.jpg', local: false },
                homme: { src: 'PHOTO-2026-03-09-16-50-31_22_c6dxd7.jpg', local: false }
            }
        }
    };

    const ESSENTIAL_IDS = [];

    const MIXED_IDS = [
        'br-042','br-043','br-002','br-003',
        'br-nouv-005','br-nouv-006','br-nouv-007','ap-006'
    ];

    const STYLE_LISTS = {
        minimaliste: ['ch-001','ch-002','ch-003','ch-012','br-042','br-043','cf-006','cf-007','cf-008','cf-022','cf-023','cf-024','cf-028','ba-014','ba-015','ba-016','chv-008','chv-012'],
        stylish: ['ch-004','ch-006','ch-008','ch-011','br-nouv-006','br-002','br-003','cf-002','cf-010','cf-020','cf-021','cf-025','pr-001','pr-003','pr-005','chv-006','chv-002'],
        maximaliste: ['ch-005','ch-007','ch-009','ch-010','br-nouv-005','br-nouv-007','cf-029','pr-002','pr-007','pr-008','ba-001','ba-012','chv-009','chv-010']
    };
    const STYLE_BY_ID = {};
    Object.keys(STYLE_LISTS).forEach(function (s) {
        STYLE_LISTS[s].forEach(function (id) { STYLE_BY_ID[id] = s; });
    });

    // ============================================================
    // 2. LOGIQUE DONNÉES
    // ============================================================
    function catsOf(p) { return Array.isArray(p.category) ? p.category : [p.category]; }

    function getUnivers(p) {
        if (p.univers) return Array.isArray(p.univers) ? p.univers : [p.univers];
        if (p.collection === 'cross') return ['femme', 'homme'];
        if (catsOf(p).indexOf('collier-homme') !== -1) return ['homme'];
        if (MIXED_IDS.indexOf(p.id) !== -1) return ['femme', 'homme'];
        return ['femme'];
    }

    function getStyle(p) {
        if (p.style) return Array.isArray(p.style) ? p.style : [p.style];
        if (STYLE_BY_ID[p.id]) return [STYLE_BY_ID[p.id]];
        if (p.collection === 'cross') return ['stylish'];
        return [];
    }

    function img(ref) { return getImageUrl(ref.src, ref.local); }
    function esc(s) { return String(s).replace(/"/g, '&quot;'); }
    function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    // ============================================================
    // 3. CSS
    // ============================================================
    const css = `
    .univers-tiles-section { max-width: 1200px; margin: 0 auto; padding: 36px 20px 12px; }
    .univers-tiles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .univers-tile { position: relative; min-height: 500px; border-radius: 28px; overflow: hidden; cursor: pointer; background: linear-gradient(135deg, #f5e9e6, #e8e0d5); box-shadow: var(--shadow-md); transition: transform .45s var(--ease-soft), box-shadow .45s var(--ease-soft); }
    .univers-tile:hover { transform: translateY(-6px); box-shadow: var(--shadow-glow); }
    .univers-tile > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .7s ease; }
    .univers-tile:hover > img { transform: scale(1.05); }
    .univers-tile-body { position: absolute; left: 0; right: 0; bottom: 0; color: #fff; padding: 90px 24px 24px; background: linear-gradient(0deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.35) 60%, transparent 100%); }
    .univers-tile-eyebrow { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-bead-soft); font-weight: 600; }
    .univers-tile-title { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 34px; margin: 4px 0 16px; }
    .univers-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .univers-chip { background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.55); color: #fff; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); padding: 8px 16px; border-radius: 40px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .2s; }
    .univers-chip:hover { background: #fff; color: var(--text-dark); transform: translateY(-2px); }
    .univers-page-head { text-align: center; margin-bottom: 36px; position: relative; }
    .univers-back { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; background: var(--white-soft); border: 1px solid var(--border-light); border-radius: var(--radius-btn); padding: 9px 18px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .2s; }
    .univers-back:hover { border-color: var(--pink-soft); color: var(--pink-dark); }
    .univers-page-head h2 { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 500; letter-spacing: -.02em; }
    .univers-page-head p.tagline { margin-top: 12px; color: var(--text-light); }
    .essentials-block { margin-bottom: 56px; }
    .badge-essential { position: absolute; top: 12px; left: 12px; z-index: 2; background: var(--gold-bead); color: #fff; font-size: 10px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; box-shadow: 0 4px 10px rgba(201,162,74,.4); }
    .essentials-block .new-card-img .badge-out-of-stock { top: auto; bottom: 12px; right: 12px; }
    .essentials-more { cursor: pointer; }
    .essentials-more:hover { background: #fff; }
    .style-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 48px; }
    .style-card { position: relative; min-height: 320px; border-radius: var(--radius-card); overflow: hidden; cursor: pointer; background: linear-gradient(135deg, #f5f0e8, #e8e0d5); border: 2px solid transparent; transition: transform .4s var(--ease-soft), box-shadow .4s var(--ease-soft), border-color .2s; }
    .style-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-glow); }
    .style-card.active { border-color: var(--gold-bead); box-shadow: var(--shadow-glow); }
    .style-card > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
    .style-card:hover > img { transform: scale(1.05); }
    .style-card-body { position: absolute; left: 0; right: 0; bottom: 0; padding: 70px 20px 20px; color: #fff; background: linear-gradient(0deg, rgba(0,0,0,.75) 0%, transparent 100%); }
    .style-card-body h3 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 24px; }
    .style-card-body p { font-size: 13px; color: rgba(255,255,255,.88); margin: 6px 0 14px; }
    .style-card-btn { background: #fff; color: var(--text-dark); border: none; border-radius: 40px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s; }
    .style-card-btn:hover { background: var(--pink-soft); color: #fff; }
    .style-card.active .style-card-btn { background: var(--gold-bead); color: #fff; }
    .univers-filter-label { text-align: center; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--text-light); font-weight: 600; margin: 0 0 10px; }
    .univers-filters { margin-bottom: 22px !important; }
    #universGridAnchor, #essentialsBlock { scroll-margin-top: 90px; }
    .univers-empty { grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-light); background: var(--white-soft); border-radius: var(--radius-card); }
    .univers-empty i { font-size: 30px; color: var(--pink-soft); display: block; margin-bottom: 12px; }
    .cat-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 18px; margin-bottom: 56px; }
    .cat-card { position: relative; aspect-ratio: 4 / 5; border-radius: var(--radius-card); overflow: hidden; cursor: pointer; background: linear-gradient(135deg, #f5f0e8, #e8e0d5); transition: transform .4s var(--ease-soft), box-shadow .4s var(--ease-soft); }
    .cat-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-glow); }
    .cat-card > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
    .cat-card:hover > img { transform: scale(1.06); }
    .cat-card-body { position: absolute; left: 0; right: 0; bottom: 0; padding: 70px 16px 16px; color: #fff; background: linear-gradient(0deg, rgba(0,0,0,.72), transparent); }
    .cat-card-body h3 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 21px; }
    .cat-card-body p { font-size: 12px; opacity: .85; margin-top: 2px; }
    .cat-card-empty { cursor: default; display: flex; align-items: center; justify-content: center; text-align: center; border: 1.5px dashed var(--pink-soft); background: var(--pink-pale); }
    .cat-card-empty:hover { transform: none; box-shadow: none; }
    .cat-card-empty .cat-card-body { position: static; background: none; color: var(--text-dark); padding: 16px; }
    .cat-card-empty .cat-card-body p { color: var(--text-light); }
    .style-hero { position: relative; border-radius: 28px; overflow: hidden; min-height: 290px; margin-bottom: 28px; display: flex; align-items: flex-end; background: linear-gradient(135deg, #f5f0e8, #e8e0d5); }
    .style-hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .style-hero-body { position: relative; z-index: 1; width: 100%; padding: 100px 28px 28px; color: #fff; background: linear-gradient(0deg, rgba(0,0,0,.78) 0%, transparent 100%); }
    .style-hero-body h2 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 40px; margin: 4px 0 8px; }
    .style-hero-body p { max-width: 520px; font-size: 14px; color: rgba(255,255,255,.9); }
    .style-section { margin-bottom: 52px; scroll-margin-top: 90px; }
    .style-section-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--border-light); }
    .style-section-head h3 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 26px; }
    .style-section-head span { color: var(--text-light); font-size: 13px; }
    @media (max-width: 700px) { .cat-cards { grid-template-columns: repeat(2, 1fr); gap: 12px; } .style-hero { min-height: 240px; border-radius: 20px; } .style-hero-body h2 { font-size: 30px; } .style-hero-body { padding: 80px 20px 22px; } }
    @media (max-width: 700px) { .univers-tiles-grid { grid-template-columns: 1fr; gap: 16px; } .univers-tile { min-height: 420px; } .univers-tile-title { font-size: 28px; } .univers-page-head h2 { font-size: 28px; } .style-card { min-height: 260px; } }
    @media (max-width: 480px) { .univers-filters { justify-content: flex-start; } }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ============================================================
    // 4. TUILES D'ACCUEIL
    // ============================================================
    function buildTiles() {
        const gallery = document.getElementById('section-collections-gallery');
        if (!gallery) return;
        const sec = document.createElement('section');
        sec.id = 'section-univers-tiles';
        sec.className = 'univers-tiles-section';
        sec.innerHTML = `
            <div class="section-title">
                <p class="hero-eyebrow" style="justify-content:center;"><span class="dot"></span>Choisissez votre univers<span class="dot"></span></p>
                <h2>Pour qui ?</h2>
                <div class="bead-divider"><span></span><span></span><span></span></div>
            </div>
            <div class="univers-tiles-grid">
                ${['femme', 'homme'].map(function (u) {
                    const c = UNIVERS[u];
                    return `
                    <div class="univers-tile" data-univers="${u}">
                        <img src="${img(c.tileImage)}" alt="${c.tileTitle}">
                        <div class="univers-tile-body">
                            <div class="univers-tile-eyebrow">Univers ${c.label}</div>
                            <h3 class="univers-tile-title">${c.tileTitle}</h3>
                            <div class="univers-chips">
                                ${c.categories.map(function (cat) {
                                    return `<button class="univers-chip" data-univers="${u}" data-cat="${cat.key}">${cat.label}</button>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        gallery.parentNode.insertBefore(sec, gallery);

        sec.addEventListener('click', function (e) {
            const chip = e.target.closest('.univers-chip');
            if (chip) { e.stopPropagation(); openUnivers(chip.dataset.univers, chip.dataset.cat); return; }
            const tile = e.target.closest('.univers-tile');
            if (tile) openUnivers(tile.dataset.univers);
        });
    }

    // ============================================================
    // 5. PAGES D'UNIVERS
    // ============================================================
    const state = { u: 'femme', cat: 'all', style: 'all' };
    let keepState = false;
    let essTimer = null;

    function productsFor(u, catKey) {
        return PRODUCTS.filter(function (p) {
            return getUnivers(p).indexOf(u) !== -1 && (!catKey || catsOf(p).indexOf(catKey) !== -1);
        });
    }
    function plural(n) { return n + ' pièce' + (n > 1 ? 's' : ''); }
    function toTop() { window.scrollTo({ top: 0, behavior: 'auto' }); }
    function emptyHtml(msg) { return '<div class="univers-empty"><i class="fas fa-gem"></i>' + msg + '</div>'; }

    function buildUniversContainer() {
        const boutique = document.getElementById('section-boutique');
        if (!boutique) return;
        const div = document.createElement('div');
        div.id = 'section-univers';
        div.style.display = 'none';
        boutique.parentNode.insertBefore(div, boutique);

        div.addEventListener('click', function (e) {
            const t = e.target;
            if (t.closest('[data-u-back]')) { showSection('accueil'); toTop(); return; }
            if (t.closest('[data-u-home]')) { state.cat = 'all'; state.style = 'all'; renderUniversPage(); toTop(); return; }
            const catBtn = t.closest('[data-u-cat]');
            if (catBtn) { state.cat = catBtn.dataset.uCat; state.style = 'all'; renderUniversPage(); toTop(); return; }
            const styleBtn = t.closest('[data-u-style]');
            if (styleBtn) { state.style = styleBtn.dataset.uStyle; state.cat = 'all'; renderUniversPage(); toTop(); return; }
            const jump = t.closest('[data-u-jump]');
            if (jump) { const el = document.getElementById(jump.dataset.uJump); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
            if (t.closest('[data-u-more]')) { const el = document.getElementById('universCats'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    }

    function cardHtml(p) {
        const priceUSD = (p.price * USD_RATE).toFixed(2);
        const isOut = p.outOfStock === true;
        const catForCart = catsOf(p)[0];
        let badge = '';
        if (isOut) badge = '<span class="badge-out-of-stock">Rupture de stock</span>';
        else if (p.isNew) badge = '<span class="badge-new" style="position:absolute; top:12px; right:12px; left:auto;">Nouveau</span>';
        const btn = isOut
            ? '<button class="btn-add disabled" disabled><i class="fas fa-ban"></i> Rupture de stock</button>'
            : `<button class="btn-add" data-add-id="${p.id}" data-add-name="${esc(p.name)}" data-add-price="${p.price}" data-add-category="${catForCart}"><i class="fas fa-plus"></i> Ajouter au panier</button>`;
        return `
            <div class="product-card${isOut ? ' out-of-stock' : ''}">
                <div class="product-img"><img src="${getImageUrl(p.image, p.localImage)}" alt="${esc(p.name)}" loading="lazy">${badge}</div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    ${p.subtitle ? `<div class="product-subtitle">${p.subtitle}</div>` : ''}
                    <div class="product-price">${p.price.toFixed(2)} TND <small>(${priceUSD} USD)</small></div>
                    ${btn}
                </div>
            </div>`;
    }

    function essentialsHtml() {
        const EXCLUSIVE_ESSENTIALS = [
            { 
                id: "collier-tailles", 
                name: " Link - Argenté ",
                subtitle: "Trois tailles disponible ,En acier inoxydable",  
                price: 12.00,
                localImage: true, 
                image: "https://i.imgur.com/v47RT5G.jpg",
                sizes: [
                    { label: "50 cm", image: "https://i.imgur.com/v47RT5G.jpg", price: 11.00 },
                    { label: "60 cm", image: "https://i.imgur.com/Wt2wUlo.jpg", price: 12.00 },
                    { label: "70 cm", image: "https://i.imgur.com/k7ChgLb.jpg", price: 14.00 }
                ],
                sizeGuide: "https://i.imgur.com/9qLhlcN.jpg"
                
            },
            
            { 
                id: "collier-tailles ", 
                name: " Link - Doré ",
                subtitle: "Trois tailles disponible ,En acier inoxydable",  
                price: 12.00,
                localImage: true, 
                image: "https://i.imgur.com/LxKUf4K.jpg",
                sizes: [
                    { label: "50 cm", image: "https://i.imgur.com/YRVS4Va.jpg", price: 11.00 },
                    { label: "60 cm", image: "https://i.imgur.com/LxKUf4K.jpg", price: 12.00 },
                    { label: "70 cm", image: "https://i.imgur.com/CnzBRd5.jpg", price: 14.00 }
                ],
                sizeGuide: "https://i.imgur.com/9qLhlcN.jpg"
                
            },
            { 
                id: "br-049", 
                name: "link - bracelet",
                subtitle: "En acier inoxydable",  
                price: 6.00,
                localImage: true, 
                image: "https://i.imgur.com/gtEKP7W.jpg",
                colors: [
                    { label: "Doré",    hex: "#c9a24a", image: "https://i.imgur.com/gtEKP7W.jpg" },
                    { label: "Argenté", hex: "#c0c0c0", image: "https://i.imgur.com/qESjZhJ.jpg" }
                ]
            },
            
            { 
                id: "br-045", 
                name: "Twist ",
                subtitle: "En acier inoxydable",  
                price: 10.00,
                localImage: true, 
                image: "https://i.imgur.com/LOP3eEE.jpg",
                images: [
                    "https://i.imgur.com/LOP3eEE.jpg",   // ← principale en premier
                    "https://i.imgur.com/sQ0iD3B.jpg"
                ]
            },
            { 
                id: "br-046", 
                name: "Bar Link",
                subtitle: "En acier inoxydable",  
                price: 10.00,
                localImage: true, 
                image: "https://i.imgur.com/JCPcOxr.jpg"
            },
            { 
              id: "br-047",
              name: "Classic",
              subtitle: "En acier inoxydable",
              price: 10.00,
              localImage: true,
              image: "https://i.imgur.com/uvuwTZs.jpg",
              images: [
                  "https://i.imgur.com/uvuwTZs.jpg",   // ← principale en premier
                  "https://i.imgur.com/rRFPKC1.jpg"
              ]
            },
            { 
                id: "br-048", 
                name: "Infity",
                subtitle: "En acier inoxydable",  
                price: 10.00,
                localImage: true, 
                image:"https://i.imgur.com/3n72kIM.jpg",
                images: [
                    "https://i.imgur.com/3n72kIM.jpg",   // ← principale en premier
                    "https://i.imgur.com/lKPJREj.jpg"
                ]
            },
        ];

        const normalItems = ESSENTIAL_IDS.map(function (id) { return PRODUCTS.find(function (p) { return p.id === id; }); }).filter(Boolean);
        const items = normalItems.concat(EXCLUSIVE_ESSENTIALS);
        window.__essAll = items;
        
        if (!items.length) return '';
        return `
        <section class="essentials-block" id="essentialsBlock">
            <div class="new-arrivals-header">
                <div>
                    <h2> Les Essentiels </h2>
                    <p>Une sélection de pièces incontournables pour compléter votre style </p>
                </div>
            </div>
            <div class="new-arrivals-scroll">
                ${items.map(function (p) {
                    const isOut = p.outOfStock === true;
                    const btn = isOut
                        ? '<button class="btn-add disabled" disabled>Rupture de stock</button>'
                        : `<button class="btn-add btn-ess-add" data-add-id="${p.id}" data-add-name="${esc(p.name)}" data-add-price="${p.price}" data-add-category="${catsOf(p)[0]}"><i class="fas fa-plus"></i> Ajouter</button>`;
                        const colorsHtml = p.colors ? `
                        <div style="display:flex;gap:8px;justify-content:center;align-items:center;margin:8px 0 2px;">
                            ${p.colors.map((c, i) => `<button class="ess-color" data-ci="${i}" title="${c.label}" aria-label="${c.label}" style="width:22px;height:22px;border-radius:50%;background:${c.hex};border:2px solid ${i === 0 ? 'var(--text-dark)' : 'transparent'};box-shadow:inset 0 0 0 1px rgba(0,0,0,.15);cursor:pointer;"></button>`).join('')}
                        </div>
                        <div class="ess-color-label" style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:6px;">Couleur : <strong>${p.colors[0].label}</strong></div>
                    ` : '';
                    const sizesHtml = p.sizes ? `
                        <div style="display:flex; gap:6px; justify-content:center; margin: 8px 0;">
                            ${p.sizes.map(s => `<button class="btn-size" data-size-img="${s.image}" data-size-price="${s.price || p.price}" style="padding:4px 8px; font-size:11px; border:1px solid var(--border-light); background:#fff; border-radius:6px; cursor:pointer;">${s.label}</button>`).join('')}
                        </div>
                        <button class="btn-size-guide" data-guide="${p.sizeGuide}" style="background:none; border:none; text-decoration:underline; font-size:11px; color:var(--text-light); cursor:pointer; margin-bottom:8px; width:100%;">Guide des tailles</button>
                    ` : '';

                    return `
                    <div class="new-card${isOut ? ' out-of-stock' : ''}" data-product-id="${p.id}">
                        <div class="new-card-img">
                            <img src="${getImageUrl(p.image, p.localImage)}" alt="${esc(p.name)}" class="main-ess-img" loading="lazy" style="transition: opacity 0.3s ease;">
                            <span class="badge-essential">Essentiel</span>
                              ${(p.colors || p.images) && (p.colors || p.images).length > 1 ? `
                                <span class="ess-count" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);z-index:3;background:rgba(0,0,0,.55);color:#fff;font-size:11px;padding:2px 8px;border-radius:20px;pointer-events:none;">1/${(p.colors || p.images).length}</span>
                             ` : ''}
                            ${isOut ? '<span class="badge-out-of-stock">Rupture</span>' : ''}
                        </div>
                        <div class="new-card-info">
                            <div class="new-card-name">${p.name}</div>
                            ${p.subtitle ? `<div class="product-subtitle" style="margin-top:-4px; margin-bottom:6px;">${p.subtitle}</div>` : ''}
                            <div class="new-card-price ess-price-display">${p.price.toFixed(2)} TND <small style="font-size: 11px; color: var(--text-light); font-weight: normal;">(${(p.price * USD_RATE).toFixed(2)} USD)</small></div>
                            ${colorsHtml}
                            ${sizesHtml}
                            ${btn}
                        </div>
                    </div>`;
                }).join('')}
                <div class="coming-soon-card essentials-more" data-u-more>
                    <div class="icon"><i class="fas fa-arrow-down"></i></div>
                    <h4>Explorer par catégorie</h4>
                    <p>Voir toutes les pièces</p>
                </div>
            </div>
        </section>`;
    }

    function startEssentialsAutoplay() {
        clearInterval(essTimer);
        const sc = document.querySelector('.essentials-block .new-arrivals-scroll');
        if (!sc) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let paused = false;
        let resumeTimer = null;
        function pause() { paused = true; clearTimeout(resumeTimer); }
        function resume() { clearTimeout(resumeTimer); resumeTimer = setTimeout(function () { paused = false; }, 2000); }
        ['mouseenter', 'touchstart', 'pointerdown', 'focusin'].forEach(function (ev) { sc.addEventListener(ev, pause, { passive: true }); });
        ['mouseleave', 'touchend', 'touchcancel', 'focusout'].forEach(function (ev) { sc.addEventListener(ev, resume, { passive: true }); });
        essTimer = setInterval(function () {
            if (paused || !sc.offsetParent) return;
            const card = sc.querySelector('.new-card');
            if (!card) return;
            const step = card.offsetWidth + 20;
            const max = sc.scrollWidth - sc.clientWidth;
            if (sc.scrollLeft >= max - 6) sc.scrollTo({ left: 0, behavior: 'smooth' });
            else sc.scrollBy({ left: step, behavior: 'smooth' });
        }, 4000);
    }

    function homeHtml() {
        const c = UNIVERS[state.u];
        const catCards = c.categories.map(function (cat) {
            const items = productsFor(state.u, cat.key);
            if (!items.length) {
                return `<div class="cat-card cat-card-empty"><div class="cat-card-body"><h3>${cat.label}</h3><p>Bientôt disponible</p></div></div>`;
            }
            const cover = items.find(function (p) { return !p.outOfStock; }) || items[0];
            return `
                <div class="cat-card" data-u-cat="${cat.key}">
                    <img src="${getImageUrl(cover.image, cover.localImage)}" alt="${cat.label}" loading="lazy">
                    <div class="cat-card-body"><h3>${cat.label}</h3><p>${plural(items.length)}</p></div>
                </div>`;
        }).join('');
        return `
            <div class="univers-page-head">
                <button class="univers-back" data-u-back><i class="fas fa-arrow-left"></i> Retour à l\u2019accueil</button>
                <p class="hero-eyebrow" style="justify-content:center;"><span class="dot"></span>Univers ${c.label}<span class="dot"></span></p>
                <h2>${c.tileTitle}</h2>
                <div class="bead-divider"><span></span><span></span><span></span></div>
                <p class="tagline">${c.tagline}</p>
            </div>
            ${state.u === 'homme' ? essentialsHtml() : ''}
            <div class="section-title" style="margin-bottom:28px;">
                <h2 style="font-size:26px;">Explorez par style</h2>
                <div class="underline"></div>
            </div>
            <div class="style-cards">
                ${Object.keys(STYLES).map(function (key) {
                    const s = STYLES[key];
                    return `
                    <div class="style-card" data-u-style="${key}">
                        <img src="${img(s.image[state.u])}" alt="${s.label}">
                        <div class="style-card-body">
                            <h3>${s.label}</h3>
                            <p>${s.desc[state.u]}</p>
                            <button class="style-card-btn" type="button">Explorer ce style</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <div id="universCats" class="section-title" style="margin-bottom:28px;">
                <h2 style="font-size:26px;">Explorez par catégorie</h2>
                <div class="underline"></div>
            </div>
            <div class="cat-cards">${catCards}</div>`;
    }

    function categoryPageHtml() {
        const c = UNIVERS[state.u];
        const cat = c.categories.find(function (k) { return k.key === state.cat; });
        const items = productsFor(state.u, state.cat);
        return `
            <div class="univers-page-head">
                <button class="univers-back" data-u-home><i class="fas fa-arrow-left"></i> Univers ${c.label}</button>
                <p class="hero-eyebrow" style="justify-content:center;"><span class="dot"></span>Univers ${c.label}<span class="dot"></span></p>
                <h2>${cat.label}</h2>
                <div class="bead-divider"><span></span><span></span><span></span></div>
                <p class="tagline">${items.length ? plural(items.length) : 'Bientôt disponible'}</p>
            </div>
            <div class="filters univers-filters">
                ${c.categories.map(function (k) {
                    return `<button class="filter-btn${k.key === state.cat ? ' active' : ''}" data-u-cat="${k.key}">${k.label}</button>`;
                }).join('')}
            </div>
            <div class="products-grid">
                ${items.length ? items.map(cardHtml).join('') : emptyHtml('Cette catégorie arrive bientôt. Revenez vite !')}
            </div>`;
    }

    function stylePageHtml() {
        const c = UNIVERS[state.u];
        const s = STYLES[state.style];
        const sections = c.categories.map(function (cat) {
            return { cat: cat, items: productsFor(state.u, cat.key).filter(function (p) { return getStyle(p).indexOf(state.style) !== -1; }) };
        }).filter(function (x) { return x.items.length; });

        return `
            <div class="univers-page-head" style="margin-bottom:20px;">
                <button class="univers-back" data-u-home style="margin-bottom:0;"><i class="fas fa-arrow-left"></i> Univers ${c.label}</button>
            </div>
            <div class="style-hero">
                <img src="${img(s.image[state.u])}" alt="${s.label}">
                <div class="style-hero-body">
                    <div class="univers-tile-eyebrow">Style · Univers ${c.label}</div>
                    <h2>${s.label}</h2>
                    <p>${s.desc[state.u]}</p>
                </div>
            </div>
            <p class="univers-filter-label">Autres styles</p>
            <div class="filters univers-filters">
                ${Object.keys(STYLES).map(function (key) {
                    return `<button class="filter-btn${key === state.style ? ' active' : ''}" data-u-style="${key}">${STYLES[key].label}</button>`;
                }).join('')}
            </div>
            ${sections.length > 1 ? `
                <p class="univers-filter-label">Aller à</p>
                <div class="filters univers-filters">
                    ${sections.map(function (x) {
                        return `<button class="filter-btn" data-u-jump="style-sec-${x.cat.key}">${x.cat.label} (${x.items.length})</button>`;
                    }).join('')}
                </div>` : ''}
            ${sections.length ? sections.map(function (x) {
                return `
                <section class="style-section" id="style-sec-${x.cat.key}">
                    <div class="style-section-head"><h3>${x.cat.label}</h3><span>${plural(x.items.length)}</span></div>
                    <div class="products-grid">${x.items.map(cardHtml).join('')}</div>
                </section>`;
            }).join('') : emptyHtml('Les pièces de ce style arrivent bientôt.')}`;
    }

    function renderUniversPage() {
        clearInterval(essTimer);
        const c = UNIVERS[state.u];
        if (state.cat !== 'all' && !c.categories.some(function (k) { return k.key === state.cat; })) state.cat = 'all';
        if (state.style !== 'all' && !STYLES[state.style]) state.style = 'all';
        const root = document.getElementById('section-univers');
        if (state.cat !== 'all') root.innerHTML = categoryPageHtml();
        else if (state.style !== 'all') root.innerHTML = stylePageHtml();
        else { root.innerHTML = homeHtml(); startEssentialsAutoplay(); }
    }

    function openUnivers(u, cat, style, anchor) {
        state.u = u;
        state.cat = cat || 'all';
        state.style = cat ? 'all' : (style || 'all');
        keepState = true;
        showSection(u);
        keepState = false;
        if (anchor === 'essentials') {
            setTimeout(function () {
                const el = document.getElementById('essentialsBlock');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }

    // ============================================================
    // 6. BRANCHEMENT NAVIGATION
    // ============================================================
    function hook() {
        const tiles = document.getElementById('section-univers-tiles');
        const univ = document.getElementById('section-univers');

        const origShow = showSection;
        showSection = function (id) {
            if (id === 'femme' || id === 'homme') {
                origShow('accueil');
                ['section-accueil', 'section-collections-gallery'].forEach(function (sid) {
                    const el = document.getElementById(sid);
                    if (el) el.style.display = 'none';
                });
                if (tiles) tiles.style.display = 'none';
                state.u = id;
                if (!keepState) { state.cat = 'all'; state.style = 'all'; }
                renderUniversPage();
                univ.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'auto' });
                return;
            }
            origShow(id);
            if (tiles) tiles.style.display = (id === 'accueil') ? 'block' : 'none';
            univ.style.display = 'none';
        };

        const origOpenCollection = openCollectionUniverse;
        openCollectionUniverse = function (slug) {
            origOpenCollection(slug);
            if (tiles) tiles.style.display = 'none';
            univ.style.display = 'none';
        };
    }

    function injectNavLinks() {
        function add(container, cls, closeAfter) {
            if (!container) return;
            const before = container.querySelector('[data-section="boutique"]');
            ['femme', 'homme'].forEach(function (id) {
                const a = document.createElement('a');
                a.href = '#';
                a.className = cls;
                a.dataset.section = id;
                a.textContent = UNIVERS[id].label;
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    showSection(id);
                    if (closeAfter && typeof closeMobileMenu === 'function') closeMobileMenu();
                });
                container.insertBefore(a, before);
            });
        }
        add(document.querySelector('.nav-links'), 'nav-link', false);
    }

    // ============================================================
    // 7. INITIALISATION
    // ============================================================
    buildTiles();
    buildUniversContainer();
    hook();
    injectNavLinks();

    window.universState = state;
    window.openUnivers = openUnivers;
// --- Galerie + couleurs des Essentiels
function essProduct(card) {
    return (window.__essAll || []).find(x => x.id === card.dataset.productId);
}

function essSync(card) {
    const prod = essProduct(card);
    const addBtn = card.querySelector('.btn-ess-add');
    if (!prod || !addBtn) return;
    const color = prod.colors ? prod.colors[parseInt(card.dataset.colorIdx || '0', 10)] : null;
    const size = (prod.sizes && card.dataset.sizeIdx !== undefined) ? prod.sizes[parseInt(card.dataset.sizeIdx, 10)] : null;
    let id = prod.id, name = prod.name.trim(), price = prod.price;
    if (size)  { id += '-' + size.label.replace(/\s/g, ''); name += ' - Taille ' + size.label; price = size.price || prod.price; }
    if (color) { id += '-' + color.label.toLowerCase();     name += ' - ' + color.label; }
    addBtn.dataset.addId = id;
    addBtn.dataset.addName = name;
    addBtn.dataset.addPrice = price;
}

function essShow(card, idx) {
    const prod = essProduct(card);
    if (!prod) return;
    const list = prod.colors ? prod.colors.map(c => c.image) : prod.images;
    if (!list || list.length < 2) return;
    const n = list.length;
    idx = ((idx % n) + n) % n;
    card.dataset.imgIdx = idx;

    const img = card.querySelector('.main-ess-img');
    const url = getImageUrl(list[idx], prod.localImage);
    img.style.opacity = '0.4';
    const pre = new Image();
    pre.onload = pre.onerror = function () { img.src = url; img.style.opacity = '1'; };
    pre.src = url;

    const cnt = card.querySelector('.ess-count');
    if (cnt) cnt.textContent = (idx + 1) + '/' + n;

    if (prod.colors) {
        card.dataset.colorIdx = idx;
        card.querySelectorAll('.ess-color').forEach((d, i) => {
            d.style.borderColor = i === idx ? 'var(--text-dark)' : 'transparent';
        });
        const lab = card.querySelector('.ess-color-label');
        if (lab) lab.innerHTML = 'Couleur : <strong>' + prod.colors[idx].label + '</strong>';
        essSync(card);
    }
}

document.addEventListener('click', function (e) {
    const dot = e.target.closest('.ess-color');
    if (dot) { essShow(dot.closest('.new-card'), parseInt(dot.dataset.ci, 10)); return; }
    const box = e.target.closest('.essentials-block .new-card-img');
    if (box) {
        const card = box.closest('.new-card');
        if (card.querySelector('.ess-count')) essShow(card, parseInt(card.dataset.imgIdx || '0', 10) + 1);
    }
});

let essSx = null;
document.addEventListener('touchstart', function (e) {
    essSx = e.target.closest('.essentials-block .new-card-img') ? e.touches[0].clientX : null;
}, { passive: true });
document.addEventListener('touchend', function (e) {
    if (essSx == null) return;
    const dx = e.changedTouches[0].clientX - essSx;
    essSx = null;
    if (Math.abs(dx) < 30) return;
    const card = e.target.closest('.new-card');
    if (card && card.querySelector('.ess-count')) {
        e.preventDefault();
        essShow(card, parseInt(card.dataset.imgIdx || '0', 10) + (dx < 0 ? 1 : -1));
    }
});
    // --- Système des tailles
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-size')) {
            const btn = e.target;
            const card = btn.closest('.new-card');
            const img = card.querySelector('.main-ess-img');
            
            card.querySelectorAll('.btn-size').forEach(b => {
                b.style.background = '#fff';
                b.style.borderColor = 'var(--border-light)';
                b.style.color = 'var(--text-dark)';
                b.style.fontWeight = 'normal';
            });
            btn.style.background = 'var(--text-dark)';
            btn.style.borderColor = 'var(--text-dark)';
            btn.style.color = '#fff';
            btn.style.fontWeight = 'bold';

            const newImg = btn.dataset.sizeImg;
            if (newImg && !card.querySelector('.ess-color') && img.src !== newImg) {
                img.style.opacity = '0.3';
                setTimeout(() => {
                    img.src = newImg;
                    img.style.opacity = '1';
                }, 150);
            }

            const newPrice = parseFloat(btn.dataset.sizePrice);
            const priceDisplay = card.querySelector('.ess-price-display');
            if (priceDisplay && !isNaN(newPrice)) {
                priceDisplay.innerHTML = newPrice.toFixed(2) + ' TND <small style="font-size: 11px; color: var(--text-light); font-weight: normal;">(' + (newPrice * USD_RATE).toFixed(2) + ' USD)</small>';
            }

            card.dataset.sizeIdx = [...card.querySelectorAll('.btn-size')].indexOf(btn);
                essSync(card);
        }

        if (e.target.classList.contains('btn-size-guide')) {
            const guideImg = e.target.dataset.guide;
            let modal = document.getElementById('sizeGuideModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'sizeGuideModal';
                modal.className = 'custom-modal';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width:600px; text-align:center; padding: 0; overflow:hidden;">
                        <button class="close-modal" style="position:absolute; right:15px; top:15px; z-index:10; font-size:30px; color:#fff; text-shadow:0 2px 4px rgba(0,0,0,0.5);">&times;</button>
                        <img src="${guideImg}" alt="Guide des tailles" style="width:100%; height:auto; display:block;">
                    </div>
                `;
                document.body.appendChild(modal);
                modal.addEventListener('click', function(ev) {
                    if (ev.target === modal || ev.target.classList.contains('close-modal')) modal.classList.remove('active');
                });
            } else {
                modal.querySelector('img').src = guideImg;
            }
            modal.classList.add('active');
        }
    });

    // ============================================================
    // 8. MENU HAMBURGER + PROMO + PARTAGE
    // ============================================================
    const cssPM = `
    #mobileMenu, #overlay { display: none !important; }
    .burger { display: inline-flex; flex-direction: column; gap: 5px; width: 24px; padding: 4px 0; }
    .burger i { display: block; height: 2px; background: currentColor; border-radius: 2px; transition: width .25s var(--ease-soft); }
    .burger i:nth-child(2) { width: 65%; align-self: flex-end; }
    .menu-btn:hover .burger i:nth-child(2) { width: 100%; }
    .cosy-menu { position: fixed; inset: 0; z-index: 3000; background: #1A1A1A; color: #fff; display: flex; flex-direction: column; overflow-y: auto; visibility: hidden; opacity: 0; transform: translateY(-14px); transition: opacity .35s ease, transform .5s var(--ease-soft), visibility 0s linear .5s; }
    .cosy-menu.open { visibility: visible; opacity: 1; transform: none; transition-delay: 0s; }
    .cm-top { display: flex; align-items: center; justify-content: space-between; padding: calc(env(safe-area-inset-top, 0px) + 18px) 24px 10px; }
    .cm-logo { font-family: 'Playfair Display', serif; font-size: 24px; letter-spacing: -.02em; color: #fff; }
    .cm-logo span { color: var(--pink-soft); }
    .cm-close { position: relative; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.35); background: transparent; cursor: pointer; color: #fff; transition: all .25s var(--ease-soft); }
    .cm-close:hover { background: #fff; transform: rotate(90deg); }
    .cm-close::before, .cm-close::after { content: ''; position: absolute; left: 12px; right: 12px; top: 50%; height: 2px; background: currentColor; }
    .cm-close::before { transform: rotate(45deg); }
    .cm-close::after { transform: rotate(-45deg); }
    .cm-close:hover::before, .cm-close:hover::after { background: #1A1A1A; }
    .cm-nav { flex: 1; padding: 18px 24px 10px; display: flex; flex-direction: column; }
    .cm-item { opacity: 0; }
    .cosy-menu.open .cm-item { animation: cmIn .6s var(--ease-soft) both; animation-delay: calc(var(--i, 0) * 60ms + 120ms); }
    @keyframes cmIn { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
    .cm-link { display: flex; align-items: center; justify-content: space-between; width: 100%; background: none; border: none; border-bottom: 1px solid rgba(255,255,255,.1); padding: 16px 0; color: #fff; text-align: left; cursor: pointer; text-decoration: none; font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 500; letter-spacing: -.01em; transition: color .2s, padding-left .3s var(--ease-soft); }
    .cm-link:hover { color: var(--gold-bead-soft); padding-left: 8px; }
    .cm-link small { font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.45); margin-left: 10px; }
    .cm-link i { font-size: 15px; color: var(--pink-soft); transition: transform .3s var(--ease-soft); }
    .cm-group.open > .cm-link i { transform: rotate(180deg); }
    .cm-sub { max-height: 0; overflow: hidden; transition: max-height .5s var(--ease-soft); }
    .cm-group.open > .cm-sub { max-height: 560px; }
    .cm-sub-inner { padding: 16px 0 8px; }
    .cm-sub-label { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.45); margin: 4px 0 10px; }
    .cm-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .cm-pill { padding: 9px 16px; border-radius: 40px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid rgba(255,255,255,.3); background: transparent; color: #fff; font-family: 'Inter', sans-serif; transition: all .2s; }
    .cm-pill:hover { background: #fff; color: #1A1A1A; }
    .cm-pill.gold { border-color: var(--gold-bead); color: var(--gold-bead-soft); }
    .cm-pill.gold:hover { background: var(--gold-bead); color: #fff; }
    .cm-footer { padding: 18px 24px calc(env(safe-area-inset-bottom, 0px) + 26px); display: flex; flex-direction: column; gap: 10px; }
    .cm-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border-radius: 40px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; border: none; font-family: 'Inter', sans-serif; }
    .cm-btn.cart { background: var(--pink-soft); color: #fff; }
    .cm-btn.wa { background: transparent; border: 1px solid rgba(255,255,255,.35); color: #fff; }
    .cm-btn.wa:hover { background: var(--green-soft); border-color: var(--green-soft); }
    .cm-tagline { text-align: center; font-size: 12px; color: rgba(255,255,255,.4); margin-top: 6px; font-style: italic; }
    @media (min-width: 769px) { .cosy-menu { display: none; } }
    .cosy-mega { position: fixed; left: 0; right: 0; z-index: 999; background: rgba(255,255,255,.97); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--border-light); box-shadow: 0 28px 44px rgba(0,0,0,.08); opacity: 0; visibility: hidden; transform: translateY(-8px); transition: opacity .25s ease, transform .35s var(--ease-soft), visibility 0s linear .35s; }
    .cosy-mega.open { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
    .mega-inner { max-width: 1100px; margin: 0 auto; padding: 30px 24px 34px; display: grid; grid-template-columns: 1fr 1fr 1fr 1.3fr; gap: 36px; }
    .mega-col h5 { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-light); font-weight: 600; margin-bottom: 12px; }
    .mega-col a { display: block; padding: 7px 0; font-size: 15px; color: var(--text-dark); cursor: pointer; transition: color .2s, transform .25s var(--ease-soft); }
    .mega-col a:hover { color: var(--pink-soft); transform: translateX(5px); }
    .mega-col a.gold { color: var(--gold-bead); font-weight: 600; }
    .mega-feature { position: relative; border-radius: 18px; overflow: hidden; min-height: 210px; cursor: pointer; background: linear-gradient(135deg, #f5e9e6, #e8e0d5); }
    .mega-feature img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
    .mega-feature:hover img { transform: scale(1.06); }
    .mega-feature div { position: absolute; left: 0; right: 0; bottom: 0; padding: 40px 18px 16px; color: #fff; background: linear-gradient(0deg, rgba(0,0,0,.7), transparent); }
    .mega-feature strong { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 500; display: block; }
    .mega-feature span { font-size: 12px; opacity: .85; }
    @media (max-width: 768px) { .cosy-mega { display: none; } }
    .cart-footer { max-height: 64vh; overflow-y: auto; }
    .promo-box { margin-bottom: 14px; }
    .promo-row { display: flex; gap: 8px; }
    .promo-row input { flex: 1; min-width: 0; padding: 11px 14px; border: 1px solid var(--border-light); border-radius: 12px; font-family: inherit; font-size: 14px; text-transform: uppercase; letter-spacing: .04em; }
    .promo-row button { background: var(--text-dark); color: #fff; border: none; border-radius: 12px; padding: 0 18px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s; }
    .promo-row button:hover { background: var(--pink-soft); }
    .promo-row button:disabled { opacity: .6; cursor: wait; }
    .promo-msg { font-size: 12px; margin-top: 6px; color: #e74c3c; }
    .promo-msg.info { color: var(--text-light); }
    .promo-applied { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #eef5ec; color: #4f7a45; border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 500; }
    .promo-applied button { background: none; border: none; color: #4f7a45; text-decoration: underline; cursor: pointer; font-size: 12px; font-family: inherit; }
    .cart-discount-line { color: #4f7a45; font-weight: 500; font-size: 13px; margin-bottom: 4px; }
    .btn-share-cart { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin-bottom: 10px; background: transparent; border: 1px solid var(--pink-soft); color: var(--pink-dark); padding: 12px; border-radius: var(--radius-btn); font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; transition: all .2s; }
    .btn-share-cart:hover { background: var(--pink-soft); color: #fff; }
    .share-intro { font-size: 14px; color: var(--text-light); margin-bottom: 16px; text-align: center; }
    .share-link-row { display: flex; gap: 8px; margin-bottom: 18px; }
    .share-link-row input { flex: 1; min-width: 0; padding: 12px; border: 1px solid var(--border-light); border-radius: 12px; font-size: 13px; background: var(--white-soft); font-family: inherit; }
    .share-link-row button { background: var(--text-dark); color: #fff; border: none; border-radius: 12px; padding: 0 18px; font-weight: 600; cursor: pointer; font-family: inherit; }
    .share-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
    .share-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 10px; border-radius: 14px; border: 1px solid var(--border-light); background: var(--white-soft); font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; transition: all .2s; }
    .share-btn:hover { border-color: var(--pink-soft); transform: translateY(-2px); }
    .share-btn.wa { background: #25D366; border-color: #25D366; color: #fff; }
    .shared-list { margin: 6px 0 18px; }
    .shared-list .row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border-light); font-size: 14px; }
    .shared-list .row span:last-child { color: var(--text-light); white-space: nowrap; }
    .shared-total { text-align: right; font-weight: 600; margin-bottom: 16px; }
    .shared-secondary { display: block; width: 100%; margin-top: 10px; background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 13px; font-family: inherit; }
    `;
    const styleElPM = document.createElement('style');
    styleElPM.textContent = cssPM;
    document.head.appendChild(styleElPM);

    const oldBtn = document.getElementById('menuBtn');
    let burger = oldBtn;
    if (oldBtn) {
        burger = oldBtn.cloneNode(false);
        burger.id = 'menuBtn';
        burger.setAttribute('aria-label', 'Ouvrir le menu');
        burger.innerHTML = '<span class="burger"><i></i><i></i><i></i></span>';
        oldBtn.replaceWith(burger);
    }

    const menu = document.createElement('div');
    menu.className = 'cosy-menu';
    menu.id = 'cosyMenu';
    menu.setAttribute('aria-hidden', 'true');

    function pillsFor(u) {
        const c = UNIVERS[u];
        const essential = u === 'homme' ? '<button class="cm-pill gold" data-u="homme" data-anchor="essentials">\u2726 Les Essentiels</button>' : '';
        return `
            <div class="cm-sub"><div class="cm-sub-inner">
                <div class="cm-sub-label">Catégories</div>
                <div class="cm-pills">
                    ${essential}
                    ${c.categories.map(function (cat) { return `<button class="cm-pill" data-u="${u}" data-cat="${cat.key}">${cat.label}</button>`; }).join('')}
                </div>
                <div class="cm-sub-label">Par style</div>
                <div class="cm-pills">
                    ${Object.keys(STYLES).map(function (k) { return `<button class="cm-pill" data-u="${u}" data-style="${k}">${STYLES[k].label}</button>`; }).join('')}
                </div>
                <div class="cm-pills"><button class="cm-pill" data-u="${u}">Voir l\u2019univers</button></div>
            </div></div>`;
    }

    menu.innerHTML = `
        <div class="cm-top">
            <span class="cm-logo">COSY<span>.</span></span>
            <button class="cm-close" id="cmClose" aria-label="Fermer le menu"></button>
        </div>
        <nav class="cm-nav">
            <a class="cm-link cm-item" style="--i:0" data-go="accueil">Accueil</a>
            <div class="cm-group cm-item" style="--i:1">
                <button class="cm-link cm-toggle">Femme <i class="fas fa-chevron-down"></i></button>
                ${pillsFor('femme')}
            </div>
            <div class="cm-group cm-item" style="--i:2">
                <button class="cm-link cm-toggle">Homme <i class="fas fa-chevron-down"></i></button>
                ${pillsFor('homme')}
            </div>
            <a class="cm-link cm-item" style="--i:3" data-go="boutique">Toute la boutique</a>
            <a class="cm-link cm-item" style="--i:4" data-go="personnalisation">Personnalisation <small>sur mesure</small></a>
            <a class="cm-link cm-item" style="--i:5" data-collection="cross">The Cross Collection <small>nouveau</small></a>
        </nav>
        <div class="cm-footer cm-item" style="--i:6">
            <button class="cm-btn cart" id="cmCart"><i class="fas fa-bag-shopping"></i> Voir mon panier <span id="cmCartCount"></span></button>
            <a class="cm-btn wa" target="_blank" rel="noopener" href="https://wa.me/${typeof WHATSAPP_TUNISIA !== 'undefined' ? WHATSAPP_TUNISIA : ''}"><i class="fab fa-whatsapp"></i> WhatsApp Tunisie · Destiny</a>
            <a class="cm-btn wa" target="_blank" rel="noopener" href="https://wa.me/${typeof WHATSAPP_KINSHASA !== 'undefined' ? WHATSAPP_KINSHASA : ''}"><i class="fab fa-whatsapp"></i> WhatsApp Kinshasa · Coco</a>
            <p class="cm-tagline">Be Cosy, Be Creative</p>
        </div>`;
    document.body.appendChild(menu);

    function openMenu() {
        const n = document.querySelector('.cart-count');
        document.getElementById('cmCartCount').textContent = n && n.textContent !== '0' ? '(' + n.textContent + ')' : '';
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    if (burger) burger.addEventListener('click', openMenu);
    document.getElementById('cmClose').addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeMega(); } });

    menu.addEventListener('click', function (e) {
        const toggle = e.target.closest('.cm-toggle');
        if (toggle) {
            const group = toggle.parentElement;
            const wasOpen = group.classList.contains('open');
            menu.querySelectorAll('.cm-group').forEach(function (g) { g.classList.remove('open'); });
            if (!wasOpen) group.classList.add('open');
            return;
        }
        const pill = e.target.closest('.cm-pill');
        if (pill) { closeMenu(); openUnivers(pill.dataset.u, pill.dataset.cat, pill.dataset.style, pill.dataset.anchor); return; }
        const go = e.target.closest('[data-go]');
        if (go) { closeMenu(); showSection(go.dataset.go); return; }
        const col = e.target.closest('[data-collection]');
        if (col) { closeMenu(); openCollectionUniverse(col.dataset.collection); return; }
        if (e.target.closest('#cmCart')) { closeMenu(); document.getElementById('cartModal').classList.add('open'); }
    });

    const mega = document.createElement('div');
    mega.className = 'cosy-mega';
    mega.id = 'cosyMega';
    document.body.appendChild(mega);

    const header = document.querySelector('.header');
    let megaTimer = null;
    let megaFor = null;

    function megaHtml(u) {
        const c = UNIVERS[u];
        const tile = c.tileImage;
        const imgUrl = getImageUrl(tile.src, tile.local);
        const extra = u === 'homme' ? '<a class="gold" data-m-u="homme" data-m-anchor="essentials">\u2726 Les Essentiels</a>' : '';
        return `
        <div class="mega-inner">
            <div class="mega-col">
                <h5>Catégories</h5>
                ${c.categories.map(function (cat) { return `<a data-m-u="${u}" data-m-cat="${cat.key}">${cat.label}</a>`; }).join('')}
            </div>
            <div class="mega-col">
                <h5>Par style</h5>
                ${Object.keys(STYLES).map(function (k) { return `<a data-m-u="${u}" data-m-style="${k}">${STYLES[k].label}</a>`; }).join('')}
            </div>
            <div class="mega-col">
                <h5>À découvrir</h5>
                ${extra}
                <a data-m-collection="cross">The Cross Collection</a>
                <a data-m-go="personnalisation">Bracelets personnalisés</a>
                <a data-m-u="${u}">Tout l\u2019univers ${c.label}</a>
            </div>
            <div class="mega-feature" data-m-u="${u}">
                <img src="${imgUrl}" alt="${c.tileTitle}">
                <div><strong>${c.tileTitle}</strong><span>Explorer l\u2019univers ${c.label}</span></div>
            </div>
        </div>`;
    }

    function openMega(u) {
        clearTimeout(megaTimer);
        if (megaFor !== u) { mega.innerHTML = megaHtml(u); megaFor = u; }
        mega.style.top = header.getBoundingClientRect().bottom + 'px';
        mega.classList.add('open');
    }
    function closeMega() {
        clearTimeout(megaTimer);
        mega.classList.remove('open');
    }
    function scheduleCloseMega() {
        clearTimeout(megaTimer);
        megaTimer = setTimeout(closeMega, 180);
    }

    document.querySelectorAll('.nav-links a[data-section="femme"], .nav-links a[data-section="homme"]').forEach(function (a) {
        a.addEventListener('mouseenter', function () { openMega(a.dataset.section); });
        a.addEventListener('mouseleave', scheduleCloseMega);
    });
    document.querySelectorAll('.nav-links a:not([data-section="femme"]):not([data-section="homme"])').forEach(function (a) {
        a.addEventListener('mouseenter', closeMega);
    });
    mega.addEventListener('mouseenter', function () { clearTimeout(megaTimer); });
    mega.addEventListener('mouseleave', scheduleCloseMega);
    window.addEventListener('scroll', closeMega, { passive: true });

    mega.addEventListener('click', function (e) {
        const t = e.target.closest('[data-m-u],[data-m-collection],[data-m-go]');
        if (!t) return;
        closeMega();
        if (t.dataset.mCollection) { openCollectionUniverse(t.dataset.mCollection); return; }
        if (t.dataset.mGo) { showSection(t.dataset.mGo); return; }
        openUnivers(t.dataset.mU, t.dataset.mCat, t.dataset.mStyle, t.dataset.mAnchor);
    });

    const prevShow = showSection;
    showSection = function (id) {
        prevShow(id);
        closeMega();
        document.querySelectorAll('.nav-links a').forEach(function (a) {
            a.classList.toggle('current', a.dataset.section === id);
        });
    };
    document.querySelectorAll('.nav-links a').forEach(function (a) {
        a.classList.toggle('current', a.dataset.section === 'accueil');
    });

    // ============================================================
    // 9. CODES PROMO
    // ============================================================
    let promo = null;
    let promoMsg = '';
    let promoBusy = false;

    function subtotalTND() {
        return cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
    }
    function currentDiscountTND() {
        if (!promo) return 0;
        const sub = subtotalTND();
        if (sub <= 0 || sub < promo.min) return 0;
        const d = promo.type === 'percent' ? sub * promo.value / 100 : Math.min(promo.value, sub);
        return Math.round(d * 100) / 100;
    }

    async function validateCode(raw) {
        const code = (raw || '').trim();
        if (!code) return { err: 'empty' };
        try {
            const res = await supabaseClient.rpc('validate_promo', { p_code: code });
            if (res.error) return { err: 'unavailable' };
            const row = Array.isArray(res.data) ? res.data[0] : res.data;
            if (!row) return { err: 'invalid' };
            return { row: row };
        } catch (e) {
            return { err: 'unavailable' };
        }
    }

    async function applyPromo(raw, silent) {
        promoBusy = true; promoMsg = ''; renderPromoBox();
        const r = await validateCode(raw);
        promoBusy = false;
        if (r.err) {
            promoMsg = r.err === 'empty' ? 'Entrez un code promo'
                : r.err === 'invalid' ? 'Code invalide ou expiré'
                : 'Codes promo momentanément indisponibles';
            if (silent) promoMsg = '';
            localStorage.removeItem('cosyPromoCode');
            promo = null;
        } else {
            promo = {
                code: String(r.row.code).toUpperCase(),
                type: r.row.discount_type,
                value: Number(r.row.discount_value),
                influencer: r.row.influencer || null,
                min: Number(r.row.min_subtotal) || 0
            };
            localStorage.setItem('cosyPromoCode', promo.code);
            if (!silent) showToast('Code ' + promo.code + ' appliqué !');
        }
        renderPromoBox();
        updateTotals();
    }

    function removePromo() {
        promo = null; promoMsg = '';
        localStorage.removeItem('cosyPromoCode');
        renderPromoBox();
        updateTotals();
    }

    const promoBox = document.createElement('div');
    promoBox.className = 'promo-box';
    promoBox.id = 'promoBox';

    function renderPromoBox() {
        if (promo) {
            const label = promo.type === 'percent' ? '\u2212' + promo.value + '%' : '\u2212' + promo.value + ' TND';
            let note = '';
            if (subtotalTND() > 0 && subtotalTND() < promo.min) {
                note = '<div class="promo-msg info">Valable dès ' + promo.min.toFixed(2) + ' TND d\u2019achats</div>';
            }
            promoBox.innerHTML = '<div class="promo-applied"><span><i class="fas fa-tag"></i> Code ' + escHtml(promo.code) + ' (' + label + ')</span><button type="button" data-promo-remove>Retirer</button></div>' + note;
        } else {
            promoBox.innerHTML =
                '<div class="promo-row"><input type="text" id="promoInput" placeholder="Code promo" autocomplete="off" maxlength="30">' +
                '<button type="button" id="promoApplyBtn"' + (promoBusy ? ' disabled' : '') + '>' + (promoBusy ? '…' : 'Appliquer') + '</button></div>' +
                (promoMsg ? '<div class="promo-msg">' + escHtml(promoMsg) + '</div>' : '');
        }
    }
    promoBox.addEventListener('click', function (e) {
        if (e.target.closest('#promoApplyBtn')) applyPromo(document.getElementById('promoInput').value);
        else if (e.target.closest('[data-promo-remove]')) removePromo();
    });
    promoBox.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.id === 'promoInput') { e.preventDefault(); applyPromo(e.target.value); }
    });

    const origUpdateTotals = updateTotals;
    updateTotals = function () {
        origUpdateTotals();
        const d = currentDiscountTND();
        if (!d) return;
        const afterTND = subtotalTND() - d;
        const line = '<div class="cart-discount-line">Code ' + escHtml(promo.code) + ' : \u2212' + d.toFixed(2) + ' TND</div>';
        let html;
        if (selectedCountry === 'tunisia') {
            const t = afterTND + SHIPPING_TUNISIA_TND;
            html = line + 'Total: ' + t.toFixed(2) + ' TND (' + (t * USD_RATE).toFixed(2) + ' USD)';
        } else if (selectedCountry === 'kinshasa') {
            html = line + 'Total: ' + (afterTND * USD_RATE).toFixed(2) + ' USD + frais de livraison';
        } else {
            html = line + 'Total: ' + afterTND.toFixed(2) + ' TND (' + (afterTND * USD_RATE).toFixed(2) + ' USD)';
        }
        document.getElementById('cartTotalDisplay').innerHTML = html;
    };
    const origUpdateCartUI = updateCartUI;
    updateCartUI = function () { origUpdateCartUI(); if (promo) renderPromoBox(); };

    const origRpc = supabaseClient.rpc.bind(supabaseClient);
    supabaseClient.rpc = function (name, params, opts) {
        if (name === 'submit_order' && promo) {
            const dTND = currentDiscountTND();
            if (dTND > 0) {
                const inCurrency = params.p_currency === 'USD' ? dTND * USD_RATE : dTND;
                const tag = '[CODE PROMO ' + promo.code + (promo.influencer ? ' / ' + promo.influencer : '') +
                    ' : -' + inCurrency.toFixed(2) + ' ' + params.p_currency + ']';
                params = Object.assign({}, params, {
                    p_subtotal: Math.max(0, params.p_subtotal - inCurrency),
                    p_customer_notes: [params.p_customer_notes, tag].filter(Boolean).join(' ')
                });
            }
            return Promise.resolve(origRpc(name, params, opts)).then(function (res) {
                if (!res.error) removePromo();
                return res;
            });
        }
        return origRpc(name, params, opts);
    };

    // ============================================================
    // 10. PARTAGE DU PANIER
    // ============================================================
    function b64enc(obj) {
        return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    function b64dec(s) {
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        return JSON.parse(decodeURIComponent(escape(atob(s))));
    }

    function buildShareUrl() {
        const data = { i: [], c: [] };
        cart.forEach(function (item) {
            if (PRODUCTS.some(function (p) { return p.id === item.id; })) data.i.push([item.id, item.quantity]);
            else data.c.push([item.name, item.price, item.quantity]);
        });
        return location.origin + location.pathname + '?cart=' + b64enc(data);
    }

    function shareMessage(url) {
        const lines = cart.map(function (i) { return '\u2022 ' + i.name + ' \u00d7' + i.quantity; }).join('\n');
        return 'Regarde mon panier COSY \ud83d\udc8e\n' + lines + '\nSous-total : ' + subtotalTND().toFixed(2) + ' TND\n\nOuvre-le ici : ' + url;
    }

    const footer = document.querySelector('.cart-footer');
    const checkoutBtn = document.getElementById('checkoutWhatsAppBtn');
    const totalBox = document.getElementById('cartTotalDisplay');
    if (footer && totalBox) footer.insertBefore(promoBox, totalBox);
    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn-share-cart';
    shareBtn.type = 'button';
    shareBtn.innerHTML = '<i class="fas fa-share-nodes"></i> Partager mon panier';
    if (footer && checkoutBtn) footer.insertBefore(shareBtn, checkoutBtn);
    renderPromoBox();

    const shareModal = document.createElement('div');
    shareModal.className = 'custom-modal';
    shareModal.id = 'shareModal';
    shareModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-share-nodes"></i> Partager mon panier</h3>
                <button class="close-modal" id="shareClose" type="button">&times;</button>
            </div>
            <div class="modal-body">
                <p class="share-intro">Envoie ton panier à une amie ou garde-le pour plus tard.</p>
                <div class="share-link-row">
                    <input type="text" id="shareLinkInput" readonly>
                    <button type="button" id="shareCopyBtn">Copier</button>
                </div>
                <div class="share-actions">
                    <button type="button" class="share-btn wa" id="shareWa"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                    <button type="button" class="share-btn" id="shareMail"><i class="fas fa-envelope"></i> E-mail</button>
                    <button type="button" class="share-btn" id="shareNative"><i class="fas fa-share-nodes"></i> Autres apps</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(shareModal);

    let currentShareUrl = '';
    function openShare() {
        if (!cart.length) { showToast('Votre panier est vide'); return; }
        currentShareUrl = buildShareUrl();
        document.getElementById('shareLinkInput').value = currentShareUrl;
        document.getElementById('shareCopyBtn').textContent = 'Copier';
        document.getElementById('shareNative').style.display = navigator.share ? '' : 'none';
        shareModal.classList.add('active');
    }
    shareBtn.addEventListener('click', openShare);
    document.getElementById('shareClose').addEventListener('click', function () { shareModal.classList.remove('active'); });
    shareModal.addEventListener('click', function (e) { if (e.target === shareModal) shareModal.classList.remove('active'); });

    document.getElementById('shareCopyBtn').addEventListener('click', function () {
        const btn = this;
        const input = document.getElementById('shareLinkInput');
        function done() { btn.textContent = 'Copié \u2713'; showToast('Lien copié !'); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(currentShareUrl).then(done, function () { input.select(); document.execCommand('copy'); done(); });
        } else { input.select(); document.execCommand('copy'); done(); }
    });
    document.getElementById('shareWa').addEventListener('click', function () {
        window.open('https://wa.me/?text=' + encodeURIComponent(shareMessage(currentShareUrl)), '_blank', 'noopener');
    });
    document.getElementById('shareMail').addEventListener('click', function () {
        window.location.href = 'mailto:?subject=' + encodeURIComponent('Mon panier COSY') + '&body=' + encodeURIComponent(shareMessage(currentShareUrl));
    });
    document.getElementById('shareNative').addEventListener('click', function () {
        if (navigator.share) {
            navigator.share({ title: 'Mon panier COSY', text: shareMessage(currentShareUrl).split('\n\nOuvre-le')[0], url: currentShareUrl }).catch(function () {});
        }
    });

    function clampQty(q) { q = parseInt(q, 10); return q > 0 ? Math.min(q, 20) : 1; }

    function itemsFromData(d) {
        const out = [];
        (d.i || []).forEach(function (pair) {
            const p = PRODUCTS.find(function (x) { return x.id === pair[0]; });
            if (!p || p.outOfStock) return;
            out.push({ id: p.id, name: p.name, price: p.price, category: catsOf(p)[0], quantity: clampQty(pair[1]) });
        });
        (d.c || []).forEach(function (t, idx) {
            const name = typeof t[0] === 'string' ? t[0].replace(/[<>]/g, '').slice(0, 120) : '';
            const price = Number(t[1]);
            if (!name || !(price > 0 && price < 500)) return;
            out.push({ id: 'custom-shared-' + Date.now() + '-' + idx, name: name, price: price, category: 'personnalise', quantity: clampQty(t[2]) });
        });
        return out;
    }

    function showSharedCart(items) {
        let modal = document.getElementById('sharedCartModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'custom-modal';
            modal.id = 'sharedCartModal';
            document.body.appendChild(modal);
            modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('active'); });
        }
        const total = items.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-gift"></i> Un panier t\u2019a été partagé</h3>
                    <button class="close-modal" type="button" data-sc-close>&times;</button>
                </div>
                <div class="modal-body">
                    <div class="shared-list">
                        ${items.map(function (i) {
                            return '<div class="row"><span>' + escHtml(i.name) + ' \u00d7' + i.quantity + '</span><span>' + (i.price * i.quantity).toFixed(2) + ' TND</span></div>';
                        }).join('')}
                    </div>
                    <div class="shared-total">Sous-total : ${total.toFixed(2)} TND</div>
                    <button class="btn-add-cart" type="button" data-sc-add><i class="fas fa-plus"></i> Ajouter à mon panier</button>
                    <button class="shared-secondary" type="button" data-sc-close>Non merci, juste regarder</button>
                </div>
            </div>`;
        modal.onclick = function (e) {
            if (e.target === modal || e.target.closest('[data-sc-close]')) { modal.classList.remove('active'); return; }
            if (e.target.closest('[data-sc-add]')) {
                items.forEach(function (it) {
                    const ex = cart.find(function (c) { return c.id === it.id; });
                    if (ex) ex.quantity += it.quantity; else cart.push(Object.assign({}, it));
                });
                saveCart();
                modal.classList.remove('active');
                showToast('Panier ajouté !');
                document.getElementById('cartModal').classList.add('open');
            }
        };
        modal.classList.add('active');
    }

    function handleIncomingLinks() {
        const params = new URLSearchParams(location.search);
        const cartParam = params.get('cart');
        const codeParam = params.get('code');
        if (codeParam) applyPromo(codeParam, false);
        else {
            const saved = localStorage.getItem('cosyPromoCode');
            if (saved) applyPromo(saved, true);
        }
        if (cartParam) {
            try {
                const items = itemsFromData(b64dec(cartParam));
                if (items.length) showSharedCart(items);
                else showToast('Ce panier partagé n\u2019est plus disponible');
            } catch (e) {
                showToast('Lien de panier invalide');
            }
        }
        if (cartParam || codeParam) {
            history.replaceState(null, '', location.pathname + location.hash);
        }
    }
    handleIncomingLinks();
})();