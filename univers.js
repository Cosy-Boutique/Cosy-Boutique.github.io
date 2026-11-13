/* ============================================================
   COSY - UNIVERS FEMME / HOMME (étape 1)
   À charger APRÈS le script principal et AVANT wedding.js :
   <script src="univers.js?v=1"></script>
   ============================================================ */
(function () {
    'use strict';

    // ============================================================
    // 1. CONFIGURATION (tout ce que tu peux modifier est ici)
    // ============================================================

    // Photos des deux grandes tuiles d'accueil.
    // Remplace par tes vraies photos, ex : { src: 'univers/femme.jpg', local: true }
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
            tagline: 'Colliers et bracelets qui ont du caractère, à ton style.',
            tileImage: { src: 'cross/cross-04.jpg', local: true },
            categories: [
                { key: 'collier-homme', label: 'Colliers' },
                { key: 'bracelet',      label: 'Bracelets' },
                { key: 'parure',        label: 'Parures' },
                { key: 'autres',        label: 'Autres accessoires' }
            ]
        }
    };

    // Les 3 styles (photos provisoires = photos de tes produits)
    const STYLES = {
        minimaliste: {
            label: 'Minimaliste',
            desc: {
                femme: 'Fin, discret, intemporel. Le bijou qui se fait oublier tout en sublimant.',
                homme: 'Sobre et épuré. Une touche subtile qui va avec tout.'
            },
            image: {
                femme: { src: 'WhatsApp_Image_2026-01-26_at_08.34.45_tcfhsj.jpg', local: false },
                homme: { src: 'PHOTO-2026-03-09-16-50-31_24_he6zvr.jpg', local: false }
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

    // Les Essentiels (univers Homme) : modifie simplement cette liste d'identifiants
    const ESSENTIAL_IDS = [
        'ch-003', // Anubis
        'ch-012', // Kora
        'ch-004', // Apollon
        'cr-004', // Redemption
        'cr-005', // Graceful
        'br-043', // Lunaris
        'br-042', // Opaline
        'br-014', // Yuan
        'br-039'  // Ashanti
    ];

    // Articles non-colliers visibles AUSSI dans l'univers Homme
    // (par défaut, tout ce qui n'est pas "collier homme" ou Cross va dans Femme)
    const MIXED_IDS = [
        'br-042', 'br-043', 'br-014', 'br-039', 'br-002', 'br-003',
        'br-nouv-005', 'br-nouv-006', 'br-nouv-007'
    ];

    // Style de chaque produit (PREMIÈRE PROPOSITION : à corriger selon ton œil).
    // Un produit absent de ces listes n'apparaît que dans "Tous les styles".
    const STYLE_LISTS = {
        minimaliste: [
            'ch-001', 'ch-002', 'ch-003', 'ch-012', 'br-042', 'br-043', 'br-014', 'br-039',
            'cf-006', 'cf-007', 'cf-008', 'cf-022', 'cf-023', 'cf-024', 'cf-028',
            'ba-014', 'ba-015', 'ba-016', 'chv-008', 'chv-012'
        ],
        stylish: [
            'ch-004', 'ch-006', 'ch-008', 'ch-011', 'br-nouv-006', 'br-002', 'br-003',
            'cf-002', 'cf-010', 'cf-020', 'cf-021', 'cf-025', 'pr-001', 'pr-003', 'pr-005',
            'chv-006', 'chv-002'
        ],
        maximaliste: [
            'ch-005', 'ch-007', 'ch-009', 'ch-010', 'br-nouv-005', 'br-nouv-007',
            'cf-029', 'pr-002', 'pr-007', 'pr-008', 'ba-001', 'ba-012', 'chv-009', 'chv-010'
        ]
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
        if (p.style) return p.style;
        if (STYLE_BY_ID[p.id]) return STYLE_BY_ID[p.id];
        if (p.collection === 'cross') return 'stylish';
        return null;
    }

    function img(ref) { return getImageUrl(ref.src, ref.local); }
    function esc(s) { return String(s).replace(/"/g, '&quot;'); }

    // ============================================================
    // 3. STYLES CSS
    // ============================================================
    const css = `
    .univers-tiles-section { max-width: 1200px; margin: 0 auto; padding: 36px 20px 12px; }
    .univers-tiles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .univers-tile {
        position: relative; min-height: 500px; border-radius: 28px; overflow: hidden; cursor: pointer;
        background: linear-gradient(135deg, #f5e9e6, #e8e0d5); box-shadow: var(--shadow-md);
        transition: transform .45s var(--ease-soft), box-shadow .45s var(--ease-soft);
    }
    .univers-tile:hover { transform: translateY(-6px); box-shadow: var(--shadow-glow); }
    .univers-tile > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .7s ease; }
    .univers-tile:hover > img { transform: scale(1.05); }
    .univers-tile-body {
        position: absolute; left: 0; right: 0; bottom: 0; color: #fff;
        padding: 90px 24px 24px; background: linear-gradient(0deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.35) 60%, transparent 100%);
    }
    .univers-tile-eyebrow { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-bead-soft); font-weight: 600; }
    .univers-tile-title { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 34px; margin: 4px 0 16px; }
    .univers-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .univers-chip {
        background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.55); color: #fff;
        backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
        padding: 8px 16px; border-radius: 40px; font-size: 13px; font-weight: 500; cursor: pointer;
        font-family: inherit; transition: all .2s;
    }
    .univers-chip:hover { background: #fff; color: var(--text-dark); transform: translateY(-2px); }

    .univers-page-head { text-align: center; margin-bottom: 36px; position: relative; }
    .univers-back {
        display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px;
        background: var(--white-soft); border: 1px solid var(--border-light); border-radius: var(--radius-btn);
        padding: 9px 18px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .2s;
    }
    .univers-back:hover { border-color: var(--pink-soft); color: var(--pink-dark); }
    .univers-page-head h2 { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 500; letter-spacing: -.02em; }
    .univers-page-head p.tagline { margin-top: 12px; color: var(--text-light); }

    .essentials-block { margin-bottom: 56px; }
    .badge-essential {
        position: absolute; top: 12px; left: 12px; z-index: 2; background: var(--gold-bead); color: #fff;
        font-size: 10px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
        padding: 6px 12px; border-radius: 20px; box-shadow: 0 4px 10px rgba(201,162,74,.4);
    }
    .essentials-block .new-card-img .badge-out-of-stock { top: auto; bottom: 12px; right: 12px; }
    .essentials-more { cursor: pointer; }
    .essentials-more:hover { background: #fff; }

    .style-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 48px; }
    .style-card {
        position: relative; min-height: 320px; border-radius: var(--radius-card); overflow: hidden; cursor: pointer;
        background: linear-gradient(135deg, #f5f0e8, #e8e0d5); border: 2px solid transparent;
        transition: transform .4s var(--ease-soft), box-shadow .4s var(--ease-soft), border-color .2s;
    }
    .style-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-glow); }
    .style-card.active { border-color: var(--gold-bead); box-shadow: var(--shadow-glow); }
    .style-card > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
    .style-card:hover > img { transform: scale(1.05); }
    .style-card-body {
        position: absolute; left: 0; right: 0; bottom: 0; padding: 70px 20px 20px; color: #fff;
        background: linear-gradient(0deg, rgba(0,0,0,.75) 0%, transparent 100%);
    }
    .style-card-body h3 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 24px; }
    .style-card-body p { font-size: 13px; color: rgba(255,255,255,.88); margin: 6px 0 14px; }
    .style-card-btn {
        background: #fff; color: var(--text-dark); border: none; border-radius: 40px; padding: 9px 18px;
        font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s;
    }
    .style-card-btn:hover { background: var(--pink-soft); color: #fff; }
    .style-card.active .style-card-btn { background: var(--gold-bead); color: #fff; }

    .univers-filter-label { text-align: center; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--text-light); font-weight: 600; margin: 0 0 10px; }
    .univers-filters { margin-bottom: 22px !important; }
    #universGridAnchor { scroll-margin-top: 90px; }
    .univers-empty { grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-light); background: var(--white-soft); border-radius: var(--radius-card); }
    .univers-empty i { font-size: 30px; color: var(--pink-soft); display: block; margin-bottom: 12px; }

    @media (max-width: 700px) {
        .univers-tiles-grid { grid-template-columns: 1fr; gap: 16px; }
        .univers-tile { min-height: 420px; }
        .univers-tile-title { font-size: 28px; }
        .univers-page-head h2 { font-size: 28px; }
        .style-card { min-height: 260px; }
    }
    @media (max-width: 480px) {
        .univers-filters { justify-content: flex-start; }
    }`;
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ============================================================
    // 4. TUILES D'ACCUEIL (Femme d'abord, Homme ensuite)
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
            if (chip) {
                e.stopPropagation();
                openUnivers(chip.dataset.univers, chip.dataset.cat);
                return;
            }
            const tile = e.target.closest('.univers-tile');
            if (tile) openUnivers(tile.dataset.univers);
        });
    }

    // ============================================================
    // 5. PAGE D'UNIVERS
    // ============================================================
    const state = { u: 'femme', cat: 'all', style: 'all' };

    function buildUniversContainer() {
        const boutique = document.getElementById('section-boutique');
        if (!boutique) return;
        const div = document.createElement('div');
        div.id = 'section-univers';
        div.style.display = 'none';
        boutique.parentNode.insertBefore(div, boutique);

        div.addEventListener('click', function (e) {
            const t = e.target;
            if (t.closest('[data-u-back]')) { showSection('accueil'); window.scrollTo({ top: 0 }); return; }
            const catBtn = t.closest('[data-u-cat]');
            if (catBtn) { state.cat = catBtn.dataset.uCat; updateGrid(); return; }
            const styleBtn = t.closest('[data-u-style]');
            if (styleBtn) {
                const s = styleBtn.dataset.uStyle;
                // re-cliquer sur le style actif le désactive
                state.style = (state.style === s && styleBtn.classList.contains('style-card')) ? 'all' : s;
                updateGrid();
                if (styleBtn.classList.contains('style-card')) scrollToGrid();
                return;
            }
            if (t.closest('[data-u-more]')) { state.cat = 'all'; state.style = 'all'; updateGrid(); scrollToGrid(); }
        });
    }

    function scrollToGrid() {
        const a = document.getElementById('universGridAnchor');
        if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        const items = ESSENTIAL_IDS
            .map(function (id) { return PRODUCTS.find(function (p) { return p.id === id; }); })
            .filter(Boolean);
        if (!items.length) return '';
        return `
        <section class="essentials-block">
            <div class="new-arrivals-header">
                <div>
                    <h2><i class="fas fa-gem" style="color:var(--gold-bead); font-size:20px;"></i> Les Essentiels</h2>
                    <p>Les basiques qu\u2019un homme devrait avoir, quel que soit son style.</p>
                </div>
            </div>
            <div class="new-arrivals-scroll">
                ${items.map(function (p) {
                    const isOut = p.outOfStock === true;
                    const btn = isOut
                        ? '<button class="btn-add disabled" disabled>Rupture de stock</button>'
                        : `<button class="btn-add" data-add-id="${p.id}" data-add-name="${esc(p.name)}" data-add-price="${p.price}" data-add-category="${catsOf(p)[0]}"><i class="fas fa-plus"></i> Ajouter</button>`;
                    return `
                    <div class="new-card${isOut ? ' out-of-stock' : ''}">
                        <div class="new-card-img">
                            <img src="${getImageUrl(p.image, p.localImage)}" alt="${esc(p.name)}" loading="lazy">
                            <span class="badge-essential">Essentiel</span>
                            ${isOut ? '<span class="badge-out-of-stock">Rupture</span>' : ''}
                        </div>
                        <div class="new-card-info">
                            <div class="new-card-name">${p.name}</div>
                            <div class="new-card-price">${p.price.toFixed(2)} TND</div>
                            ${btn}
                        </div>
                    </div>`;
                }).join('')}
                <div class="coming-soon-card essentials-more" data-u-more>
                    <div class="icon"><i class="fas fa-arrow-right"></i></div>
                    <h4>Toute la boutique homme</h4>
                    <p>Voir toutes les pièces</p>
                </div>
            </div>
        </section>`;
    }

    function renderShell() {
        const c = UNIVERS[state.u];
        const root = document.getElementById('section-univers');
        root.innerHTML = `
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
                    <div class="style-card" data-u-style="${key}" data-style-card="${key}">
                        <img src="${img(s.image[state.u])}" alt="${s.label}">
                        <div class="style-card-body">
                            <h3>${s.label}</h3>
                            <p>${s.desc[state.u]}</p>
                            <button class="style-card-btn" type="button">Explorer ce style</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>

            <div id="universGridAnchor"></div>
            <p class="univers-filter-label">Catégorie</p>
            <div class="filters univers-filters" id="uCatFilters">
                <button class="filter-btn" data-u-cat="all">Tous</button>
                ${c.categories.map(function (cat) {
                    return `<button class="filter-btn" data-u-cat="${cat.key}">${cat.label}</button>`;
                }).join('')}
            </div>
            <p class="univers-filter-label">Style</p>
            <div class="filters univers-filters" id="uStyleFilters">
                <button class="filter-btn" data-u-style="all">Tous les styles</button>
                ${Object.keys(STYLES).map(function (key) {
                    return `<button class="filter-btn" data-u-style="${key}">${STYLES[key].label}</button>`;
                }).join('')}
            </div>
            <div class="products-grid" id="universGrid"></div>`;
    }

    function updateGrid() {
        document.querySelectorAll('#uCatFilters .filter-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.uCat === state.cat);
        });
        document.querySelectorAll('#uStyleFilters .filter-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.uStyle === state.style);
        });
        document.querySelectorAll('.style-card').forEach(function (c) {
            c.classList.toggle('active', c.dataset.styleCard === state.style);
        });

        const items = PRODUCTS.filter(function (p) {
            if (getUnivers(p).indexOf(state.u) === -1) return false;
            if (state.cat !== 'all' && catsOf(p).indexOf(state.cat) === -1) return false;
            if (state.style !== 'all' && getStyle(p) !== state.style) return false;
            return true;
        });

        const grid = document.getElementById('universGrid');
        if (!items.length) {
            const msg = state.style !== 'all'
                ? 'Aucune pièce de ce style dans cette catégorie pour le moment.'
                : 'Cette catégorie arrive bientôt. Revenez vite !';
            grid.innerHTML = `<div class="univers-empty"><i class="fas fa-gem"></i>${msg}</div>`;
        } else {
            grid.innerHTML = items.map(cardHtml).join('');
        }
    }

    function openUnivers(u, cat, style) {
        state.u = u;
        state.cat = cat || 'all';
        state.style = style || 'all';
        showSection(u); // le wrapper ci-dessous affiche la page
        if (state.cat !== 'all' || state.style !== 'all') {
            setTimeout(scrollToGrid, 150);
        }
    }

    // ============================================================
    // 6. BRANCHEMENT SUR LA NAVIGATION EXISTANTE
    // ============================================================
    function hook() {
        const tiles = document.getElementById('section-univers-tiles');
        const univ = document.getElementById('section-univers');

        const origShow = showSection;
        showSection = function (id) {
            if (id === 'femme' || id === 'homme') {
                origShow('accueil'); // remet l'état à zéro (et masque l'univers de collection)
                ['section-accueil', 'section-collections-gallery'].forEach(function (sid) {
                    const el = document.getElementById(sid);
                    if (el) el.style.display = 'none';
                });
                tiles.style.display = 'none';
                if (state.u !== id) state.u = id;
                renderShell();
                updateGrid();
                univ.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'auto' });
                return;
            }
            origShow(id);
            tiles.style.display = (id === 'accueil') ? 'block' : 'none';
            univ.style.display = 'none';
        };

        // Les collections (ex : Cross) cachent déjà leurs propres sections : on cache aussi les nôtres
        const origOpenCollection = openCollectionUniverse;
        openCollectionUniverse = function (slug) {
            origOpenCollection(slug);
            tiles.style.display = 'none';
            univ.style.display = 'none';
        };
    }

    // Liens Femme / Homme dans les menus (desktop + mobile)
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
        add(document.getElementById('mobileMenu'), 'mobile-nav-link', true);
    }

    // ============================================================
    // 7. INITIALISATION
    // ============================================================
    buildTiles();
    buildUniversContainer();
    hook();
    injectNavLinks();
})();
