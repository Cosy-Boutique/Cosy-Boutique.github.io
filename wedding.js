/* ============================================================
   THE WEDDING COLLECTION — wedding.js
   À charger APRÈS le script principal de index.html :
   <script src="wedding.js"></script>   (juste avant </body>)

   Contient :
   - la collection "wedding" (données + produits)
   - l'affichage de son univers (filtres, bandeau précommande, carrousels)
   - la gestion des précommandes : panier -> choix du pays -> WhatsApp
   - le minimum de 45 pièces pour les porte-clés invités
   ============================================================ */
(function () {
    'use strict';

    // ----------------------------------------------------------
    // 1) DONNÉES  (noms et prix = EXEMPLES, à modifier par toi)
    // ----------------------------------------------------------
    // Taux TND -> USD de la collection Wedding UNIQUEMENT.
    // Le reste du site continue d'utiliser USD_RATE (dans index.html).
    const WEDDING_USD_RATE = 0.50;   // <-- CHANGE CETTE VALEUR

    const imgur = (id) => 'https://i.imgur.com/' + id + '.jpg';
    const imgs = (ids) => ids.map(imgur);

    // Note affichée uniquement quand on filtre sur "Parures & dos"
    const PEARL_NOTE = 'Nos parures et accessoires pour le dos sont réalisés avec de vraies perles, et non avec des perles en plastique.';

    const WEDDING_FILTERS = [
        { key: 'all',       label: 'Tout' },
        { key: 'bouquet',   label: 'Bouquets' },
        { key: 'coiffure',  label: 'Coiffure' },
        { key: 'panier',    label: 'Paniers' },
        { key: 'parure-dos', label: 'Parures & dos' },
        { key: 'pin',       label: 'Pins' },
        { key: 'cadeau',    label: 'Cadeaux invités' }
    ];

    // preorder:true  => précommande (1 à 2 semaines à l'avance)
    // preorder absent => disponible directement (parures, accessoires dos)
    // images: [...]  => 2 ou 3 images = carrousel automatique
    const WEDDING_PRODUCTS = [
        // ===== BOUQUETS (précommande) =====
        { id: 'wb-bq-001', name: 'Bouquet Éternité',   group: 'bouquet', price: 120.00, preorder: true, images: imgs(['G11s1jL', 'vXkxGs7', 'gKH77OD']) },
        { id: 'wb-bq-002', name: 'Bouquet Camélia',    group: 'bouquet', price: 120.00, preorder: true, images: imgs(['Ej2rPym', 'ur2vO3I', 'w6TElWw']) },
        { id: 'wb-bq-003', name: 'Bouquet Pureté',     group: 'bouquet', price: 120.00, preorder: true, images: imgs(['9FWQOYJ', 'zQTKzLc']) },
        { id: 'wb-bq-004', name: 'Bouquet Ivoire',     group: 'bouquet', price: 120.00, preorder: true, images: imgs(['bPquBS7', 'u2ppdJm']) },
        { id: 'wb-bq-005', name: 'Bouquet Séraphine',  group: 'bouquet', price: 120.00, preorder: true, images: imgs(['WMGNOWT', 'SgQfWRx']) },
        { id: 'wb-bq-006', name: 'Bouquet Aurore',     group: 'bouquet', price: 120.00, preorder: true, images: imgs(['GiEdL2x']) },
        { id: 'wb-bq-007', name: 'Bouquet Célestine',  group: 'bouquet', price: 120.00, preorder: true, images: imgs(['AcC2ZfL']) },

        // ===== COIFFURE (précommande) =====
        { id: 'wb-hr-001', name: 'Serre-tête Perlé',   group: 'coiffure', price: 15.00, preorder: true, subtitle: 'Serre-tête', images: imgs(['97b4nHI']) },
        { id: 'wb-hr-002', name: 'Serre-tête Lune',    group: 'coiffure', price: 15.00, preorder: true, subtitle: 'Serre-tête', images: imgs(['nEnlxbt']) },
        { id: 'wb-hr-003', name: 'Serre-tête Halo',    group: 'coiffure', price: 15.00, preorder: true, subtitle: 'Serre-tête', images: imgs(['D23Viqm']) },
        { id: 'wb-hr-004', name: 'Serre-tête Aurélia', group: 'coiffure', price: 15.00, preorder: true, subtitle: 'Serre-tête', images: imgs(['AUGyuJj']) },
        { id: 'wb-hr-005', name: 'Serre-tête Étoile',  group: 'coiffure', price: 15.00, preorder: true, subtitle: 'Serre-tête', images: imgs(['I4SLjPs']) },
        { id: 'wb-hr-006', name: 'Broche Rosée',       group: 'coiffure', price: 10.00, preorder: true, subtitle: 'Broche à cheveux', images: imgs(['mAKZJOa']) },

        // ===== PANIERS (précommande) =====
        { id: 'wb-pn-001', name: 'Panier Allégresse',  group: 'panier', price: 30.00, preorder: true, subtitle: "Vendu à l'unité", images: imgs(['zyL6fd3']) },
        { id: 'wb-pn-002', name: 'Panier Cérémonie',   group: 'panier', price: 30.00, preorder: true, images: imgs(['8LJVFvM']) },
        { id: 'wb-pn-003', name: 'Panier Dentelle',    group: 'panier', price: 30.00, preorder: true, subtitle: "Vendu à l'unité", images: imgs(['3jcEuiB']) },
        { id: 'wb-pn-004', name: 'Panier Pétale',      group: 'panier', price: 30.00, preorder: true, images: imgs(['8ac9DHI']) },
        { id: 'wb-pn-005', name: 'Panier Jardin',      group: 'panier', price: 30.00, preorder: true, images: imgs(['gDhztsi']) },

        // ===== PARURES (disponibles directement) =====
        { id: 'wb-pr-001', name: 'Parure Neige',       group: 'parure-dos', price: 40.00, subtitle: 'Parure · vraies perles', images: imgs(['oR1M2Kn']) },
        { id: 'wb-pr-002', name: 'Parure Perle Royale', group: 'parure-dos', price: 40.00, subtitle: 'Parure · vraies perles', images: imgs(['ZylQBFl']) },
        { id: 'wb-pr-003', name: 'Parure Alliance',    group: 'parure-dos', price: 40.00, subtitle: 'Parure · vraies perles', images: imgs(['nnNv5YC']) },
        { id: 'wb-pr-004', name: 'Parure Rosée',       group: 'parure-dos', price: 40.00, subtitle: 'Parure · vraies perles', images: imgs(['M9OHVgl']) },
        { id: 'wb-pr-005', name: 'Parure Opale',       group: 'parure-dos', price: 40.00, subtitle: 'Parure · vraies perles', images: imgs(['Sdd0PWu']) },
        { id: 'wb-pr-006', name: 'Parure Divine',      group: 'parure-dos', price: 40.00, subtitle: 'Parure · vraies perles', images: imgs(['QU4E1G4']) },

        // ===== ACCESSOIRES POUR LE DOS (disponibles directement) =====
        { id: 'wb-ds-001', name: 'Dos Cascade',        group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['M8OiH33']) },
        { id: 'wb-ds-002', name: 'Dos Chaîne Perlée',  group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['jUnJ4oP']) },
        { id: 'wb-ds-003', name: 'Dos Nacré',          group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['dBUBwTA']) },
        { id: 'wb-ds-004', name: 'Dos Voile de Perles', group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['U4txwLz']) },
        { id: 'wb-ds-005', name: 'Dos Aurore',         group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['GkPWpdj']) },
        { id: 'wb-ds-006', name: 'Dos Céleste',        group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['y1ICanJ']) },
        { id: 'wb-ds-007', name: 'Dos Étoilé',         group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['qHwWzCi']) },
        { id: 'wb-ds-008', name: 'Dos Soie',           group: 'parure-dos', price: 50.00, subtitle: 'Accessoire pour le dos · vraies perles', images: imgs(['5mw6zDg']) },

        // ===== PINS (précommande) =====
        { id: 'wb-pi-001', name: 'Pin Alliance',       group: 'pin', price: 10.00, preorder: true, subtitle: 'Pin pour la veste du marié', images: imgs(['kumVQD6']) },
        { id: 'wb-pi-002', name: 'Pin Boutonnière',    group: 'pin', price: 10.00, preorder: true, subtitle: 'Pin pour la veste du marié', images: imgs(['PDADT6M']) },
        { id: 'wb-pi-003', name: 'Pin Éternel',        group: 'pin', price: 10.00, preorder: true, subtitle: 'Pin pour la veste du marié', images: imgs(['1ABjKh1']) },

        // ===== CADEAUX INVITÉS : PORTE-CLÉS (précommande, minimum 45) =====
        // Pas de photo pour l'instant : ajoute des liens dans images: [...] quand tu les as.
        { id: 'wb-key-001', name: 'Porte-clés pour vos invités', group: 'cadeau', price: 3.00, preorder: true,
          minQuantity: 45, wide: true, 
          subtitle: 'Personnalisables : initiales et date des mariés', images: imgs(['1hH7MmG','ipmLslL','5ykiY0g']) }
    ];

    // ----------------------------------------------------------
    // 2) ENREGISTREMENT DE LA COLLECTION
    // ----------------------------------------------------------
    COLLECTIONS.wedding = {
        slug: 'wedding',
        name: 'The Wedding Collection',
        eyebrow: 'Nouvelle collection',
        quote: 'Le plus beau jour mérite des détails faits main.',
        tileImage: 'wedding/couverture.jpg',
        backgroundGradient: 'linear-gradient(180deg, #FBF6EC 0%, #F1E6D2 55%, #E7D6B6 100%)',
        notice: 'Collection sur précommande : à commander 1 à 2 semaines à l’avance. ' +
                'Les parures et accessoires pour le dos sont disponibles directement.'
    };

    // ----------------------------------------------------------
    // 3) STYLES
    // ----------------------------------------------------------
    const css = document.createElement('style');
    css.textContent = `
    .wedding-universe .collection-universe-title { color: #2b2418; text-shadow: none; }
    .wedding-universe .collection-universe-quote { color: #6b5d44; margin-bottom: 22px; }
    .wedding-universe .hero-eyebrow { color: var(--gold-bead); }
    .wedding-extras { margin-bottom: 26px; }
    .wedding-notice { max-width: 580px; margin: 0 auto 20px; text-align: center; font-size: 13px; color: #5a4b30;
        background: rgba(255,255,255,0.72); border: 1px solid #e6d9bf; border-radius: 14px; padding: 10px 16px; }
    .wedding-notice b { color: var(--gold-bead); }
    .wedding-extras .filters { margin-bottom: 0; }
    .wedding-pearl-note { max-width: 560px; margin: 16px auto 0; text-align: center; font-size: 13px; font-style: italic; color: #6b5d44; line-height: 1.5; }
    .wedding-pearl-note i { color: var(--gold-bead); margin-right: 6px; font-style: normal; }
    .wedding-universe .filter-btn { background: rgba(255,255,255,0.6); border-color: #dccfb4; color: #3a3226; }
    .wedding-universe .filter-btn.active, .wedding-universe .filter-btn:hover { background: var(--gold-bead); border-color: var(--gold-bead); color: #fff; box-shadow: 0 6px 14px rgba(201,162,74,0.3); }

    .wedding-img { position: relative; width: 100%; height: 320px; overflow: hidden; background: linear-gradient(135deg, #f5f0e8, #e8e0d5); }
    .wedding-slide { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.8s ease-in-out; }
    .wedding-slide.active { opacity: 1; }
    .wedding-img.single .wedding-slide { opacity: 1; }
    .wedding-img { touch-action: pan-y; cursor: grab; user-select: none; -webkit-user-select: none; }
    .wedding-slide { pointer-events: none; -webkit-user-drag: none; }
    .wedding-dots { position: absolute; left: 0; right: 0; bottom: 10px; display: flex; justify-content: center; gap: 6px; z-index: 3; }
    .wedding-dot { width: 8px; height: 8px; border-radius: 50%; border: none; padding: 0; cursor: pointer; background: rgba(255,255,255,0.65); box-shadow: 0 0 0 1px rgba(0,0,0,0.15); }
    .wedding-dot.active { background: var(--gold-bead); box-shadow: none; }
    .wedding-badge { position: absolute; top: 12px; left: 12px; z-index: 3; font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; color: #fff; }
    .wedding-badge.pre { background: var(--gold-bead); box-shadow: 0 4px 10px rgba(201,162,74,0.4); }
    .wedding-badge.ok { background: var(--green-dark); box-shadow: 0 4px 10px rgba(143,174,134,0.4); }
    .wedding-card .product-info { text-align: center; }
    .wedding-card .btn-add.pre { border-color: var(--gold-bead); color: #8a6d2a; }
    .wedding-card .btn-add.pre:hover { background: var(--gold-bead); color: #fff; }

    .wedding-card.wide { grid-column: 1 / -1; flex-direction: row; flex-wrap: wrap; }
    .wedding-card.wide .wedding-img { flex: 1 1 260px; height: auto; min-height: 240px; }
    .wedding-card.wide .product-info { flex: 2 1 320px; text-align: left; padding: 24px; justify-content: center; }
    .wedding-key-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 56px; color: var(--gold-bead); }
    .wedding-key-list { list-style: none; margin: 10px 0 6px; font-size: 13px; color: var(--text-light); }
    .wedding-key-list li { padding: 3px 0 3px 20px; position: relative; }
    .wedding-key-list li::before { content: '\\2726'; position: absolute; left: 0; color: var(--gold-bead); }
    .wedding-card.wide .btn-add { max-width: 340px; }

    .preorder-tag { display: inline-block; margin-left: 4px; font-size: 9px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
        color: #8a6d2a; background: #f6ecd2; padding: 2px 7px; border-radius: 20px; vertical-align: middle; }
    .preorder-note { font-size: 12px; color: #6b5d44; background: #faf4e4; border: 1px solid #eadfc2; border-radius: 12px; padding: 9px 12px; margin-bottom: 12px; line-height: 1.5; }

    @media (max-width: 768px) { .wedding-img { height: 200px; } .wedding-card.wide .wedding-img { height: auto; min-height: 180px; } }
    @media (max-width: 480px) { .wedding-img { height: 170px; } .wedding-card.wide .product-info { padding: 16px; } }
    @media (max-width: 360px) { .wedding-img { height: 145px; } }
    `;
    document.head.appendChild(css);

    // ----------------------------------------------------------
    // 4) UTILITAIRES
    // ----------------------------------------------------------
    let timers = [];
    function clearTimers() { timers.forEach(clearInterval); timers = []; }

    function findProduct(id) { return WEDDING_PRODUCTS.find((p) => p.id === id); }
    function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

    // ----------------------------------------------------------
    // 5) CARTES PRODUITS
    // ----------------------------------------------------------
    function imageBlockHtml(p) {
        const imgsList = p.images || [];
        if (imgsList.length === 0) {
            return '<div class="wedding-img single"><div class="wedding-key-ph"><i class="fas fa-key"></i></div></div>';
        }
        const slides = imgsList.map((u, i) =>
            '<img class="wedding-slide' + (i === 0 ? ' active' : '') + '" src="' + u + '" alt="' + escapeHtml(p.name) + '" loading="lazy">'
        ).join('');
        const dots = imgsList.length > 1
            ? '<div class="wedding-dots">' + imgsList.map((_, i) =>
                '<button class="wedding-dot' + (i === 0 ? ' active' : '') + '" data-dot="' + i + '" aria-label="Image ' + (i + 1) + '"></button>').join('') + '</div>'
            : '';
        return '<div class="wedding-img' + (imgsList.length === 1 ? ' single' : '') + '">' + slides + dots + '</div>';
    }

    function cardHtml(p) {
        const isOut = p.outOfStock === true;
        const usd = (p.price * WEDDING_USD_RATE).toFixed(2);

        let badge;
        if (isOut) badge = '<span class="badge-out-of-stock">Rupture de stock</span>';
        else if (p.preorder) badge = '<span class="wedding-badge pre">Précommande</span>';
        else badge = '<span class="wedding-badge ok">Disponible</span>';

        let button;
        if (isOut) {
            button = '<button class="btn-add disabled" disabled><i class="fas fa-ban"></i> Rupture de stock</button>';
        } else if (p.minQuantity) {
            button = '<button class="btn-add pre" data-wid="' + p.id + '"><i class="fas fa-calendar-check"></i> Précommander (min. ' + p.minQuantity + ')</button>';
        } else if (p.preorder) {
            button = '<button class="btn-add pre" data-wid="' + p.id + '"><i class="fas fa-calendar-check"></i> Précommander</button>';
        } else {
            button = '<button class="btn-add" data-wid="' + p.id + '"><i class="fas fa-plus"></i> Ajouter au panier</button>';
        }

        const sub = p.subtitle ? '<div class="product-subtitle">' + p.subtitle + '</div>' : '';

        if (p.wide) {
            const unit = p.price.toFixed(2) + ' TND <small>(' + usd + ' USD)</small> <small>/ pièce</small>';
            return '' +
              '<div class="product-card wedding-card wide" data-group="' + p.group + '">' +
                '<div style="position:relative;flex:1 1 260px;display:flex">' + imageBlockHtml(p).replace('class="wedding-img', 'style="width:100%" class="wedding-img') + badge + '</div>' +
                '<div class="product-info">' +
                  '<div class="product-name">' + p.name + '</div>' + sub +
                  '<ul class="wedding-key-list">' +
                    '<li>Précommande uniquement, minimum ' + p.minQuantity + ' pièces</li>' +
                    '<li>Initiales et date des mariés personnalisables</li>' +
                    '<li>Tous les détails se valident obligatoirement sur WhatsApp</li>' +
                  '</ul>' +
                  '<div class="product-price">' + unit + '</div>' +
                  button +
                '</div>' +
              '</div>';
        }

        return '' +
          '<div class="product-card wedding-card' + (isOut ? ' out-of-stock' : '') + '" data-group="' + p.group + '">' +
            '<div style="position:relative">' + imageBlockHtml(p) + badge + '</div>' +
            '<div class="product-info">' +
              '<div class="product-name">' + p.name + '</div>' + sub +
              '<div class="product-price">' + p.price.toFixed(2) + ' TND <small>(' + usd + ' USD)</small></div>' +
              button +
            '</div>' +
          '</div>';
    }

    // ----------------------------------------------------------
    // 6) CARROUSELS (défilement auto + pastilles + glissement tactile)
    // ----------------------------------------------------------
    function setupCarousels(root) {
        root.querySelectorAll('.wedding-img').forEach((box) => {
            const slides = box.querySelectorAll('.wedding-slide');
            if (slides.length < 2) return;
            const dots = box.querySelectorAll('.wedding-dot');
            let cur = 0;
            let timer = null;

            function go(i) {
                slides[cur].classList.remove('active');
                if (dots[cur]) dots[cur].classList.remove('active');
                cur = (i + slides.length) % slides.length;
                slides[cur].classList.add('active');
                if (dots[cur]) dots[cur].classList.add('active');
            }

            // défilement automatique (se met en pause pendant que la personne touche l'image)
            function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
            function startAuto() {
                stopAuto();
                timer = setInterval(() => go(cur + 1), 3500);
                timers.push(timer);
            }
            startAuto();

            // pastilles cliquables
            dots.forEach((d) => d.addEventListener('click', (e) => {
                e.stopPropagation();
                go(parseInt(d.dataset.dot, 10));
                startAuto();
            }));

            // glissement au doigt (mobile) ou à la souris (ordinateur)
            let startX = null, startY = null, lastX = null;

            function finishSwipe() {
                if (startX === null) return;
                const dx = lastX - startX;
                const dy = (box._lastY !== undefined ? box._lastY : startY) - startY;
                startX = null;
                if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                    go(cur + (dx < 0 ? 1 : -1));     // glisse vers la gauche = photo suivante
                }
                startAuto();
            }

            box.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                startX = lastX = e.clientX;
                startY = e.clientY;
                box._lastY = e.clientY;
                stopAuto();
            });
            box.addEventListener('pointermove', (e) => {
                if (startX === null) return;
                lastX = e.clientX;
                box._lastY = e.clientY;
            });
            box.addEventListener('pointerup', finishSwipe);
            box.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') finishSwipe(); });
            box.addEventListener('pointercancel', () => { if (startX !== null) { startX = null; startAuto(); } });
        });
    }

    // ----------------------------------------------------------
    // 7) UNIVERS WEDDING
    // ----------------------------------------------------------
    let currentGroup = 'all';

    function renderWeddingGrid() {
        clearTimers();
        const grid = document.getElementById('collectionUniverseGrid');
        const list = WEDDING_PRODUCTS.filter((p) => currentGroup === 'all' || p.group === currentGroup);
        grid.innerHTML = list.map(cardHtml).join('');
        setupCarousels(grid);
        const pearlNote = document.getElementById('weddingPearlNote');
        if (pearlNote) pearlNote.style.display = (currentGroup === 'parure-dos') ? 'block' : 'none';
    }

    function removeExtras() {
        const old = document.getElementById('weddingExtras');
        if (old) old.remove();
        const universe = document.getElementById('section-collection-universe');
        if (universe) universe.classList.remove('wedding-universe');
    }

    function openWeddingUniverse() {
        const col = COLLECTIONS.wedding;

        ['section-accueil', 'section-collections-gallery', 'section-boutique', 'section-personnalisation']
            .forEach((id) => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });

        const universe = document.getElementById('section-collection-universe');
        universe.classList.add('wedding-universe');

        const bg = document.getElementById('collectionUniverseBg');
        bg.innerHTML = '';
        bg.style.background = col.backgroundGradient;
        document.getElementById('collectionUniverseOverlay').style.background = 'none';

        document.getElementById('collectionUniverseEyebrow').textContent = col.eyebrow;
        document.getElementById('collectionUniverseTitle').textContent = col.name;
        document.getElementById('collectionUniverseQuote').textContent = col.quote;

        // bandeau précommande + filtres, placés juste avant la grille
        const grid = document.getElementById('collectionUniverseGrid');
        const old = document.getElementById('weddingExtras');
        if (old) old.remove();
        const extras = document.createElement('div');
        extras.id = 'weddingExtras';
        extras.className = 'wedding-extras';
        extras.innerHTML =
            '<div class="wedding-notice"><b>Collection sur précommande</b> : à commander 1 à 2 semaines à l’avance. ' +
            'Les parures et accessoires pour le dos sont disponibles directement.</div>' +
            '<div class="filters" id="weddingFilters">' +
            WEDDING_FILTERS.map((f) =>
                '<button class="filter-btn' + (f.key === 'all' ? ' active' : '') + '" data-wgroup="' + f.key + '">' + f.label + '</button>').join('') +
            '</div>' +
            '<p class="wedding-pearl-note" id="weddingPearlNote" style="display:none"><i class="fas fa-gem"></i>' + PEARL_NOTE + '</p>';
        grid.parentNode.insertBefore(extras, grid);

        currentGroup = 'all';
        extras.querySelectorAll('[data-wgroup]').forEach((btn) => {
            btn.addEventListener('click', () => {
                extras.querySelectorAll('[data-wgroup]').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                currentGroup = btn.dataset.wgroup;
                renderWeddingGrid();
            });
        });

        renderWeddingGrid();

        universe.style.display = 'flex';
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // Délégation : ajout au panier depuis la grille wedding
    document.getElementById('collectionUniverseGrid').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-wid]');
        if (!btn) return;
        const p = findProduct(btn.dataset.wid);
        if (!p || p.outOfStock) return;
        addWeddingToCart(p);
    });

    function addWeddingToCart(p) {
        const existing = cart.find((it) => it.id === p.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: p.id,
                name: p.name,
                price: p.price,
                category: 'mariage',
                quantity: p.minQuantity || 1,
                preorder: !!p.preorder,
                minQuantity: p.minQuantity || 0
            });
        }
        saveCart();
        const qtyInfo = (!existing && p.minQuantity) ? ' (' + p.minQuantity + ' pièces)' : '';
        showToast(p.name + qtyInfo + (p.preorder ? ' ajouté (précommande) !' : ' ajouté au panier !'));
    }

    // ----------------------------------------------------------
    // 8) BRANCHEMENT SUR LE SITE EXISTANT
    // ----------------------------------------------------------
    // 8a) ouverture des collections : wedding géré ici, les autres comme avant
    const _openCollectionUniverse = openCollectionUniverse;
    openCollectionUniverse = function (slug) {
        if (slug === 'wedding') {
            openWeddingUniverse();
        } else {
            clearTimers();
            removeExtras();
            const bg = document.getElementById('collectionUniverseBg');
            if (bg) bg.style.background = '';
            _openCollectionUniverse(slug);
        }
    };

    // 8b) quand on quitte l'univers : on nettoie
    const _showSection = showSection;
    showSection = function (id) {
        clearTimers();
        removeExtras();
        const bg = document.getElementById('collectionUniverseBg');
        if (bg) bg.style.background = '';
        _showSection(id);
    };

    // 8c) panier : étiquette "Précommande" + bouton WhatsApp
    function cartHasPreorder() { return cart.some((it) => it.preorder); }

    function decorateCart() {
        document.querySelectorAll('#cartItemsList .cart-item').forEach((row, i) => {
            const it = cart[i];
            if (!it || it.category !== 'mariage') return;

            // prix affiché avec le taux Wedding
            const priceEl = row.querySelector('.cart-item-price');
            if (priceEl) {
                priceEl.innerHTML = it.price.toFixed(2) + ' TND (' + (it.price * WEDDING_USD_RATE).toFixed(2) + ' USD)' +
                    (it.minQuantity ? ' <span class="min-qty">· min. ' + it.minQuantity + '</span>' : '');
            }

            // étiquette précommande
            if (it.preorder) {
                const nameEl = row.querySelector('.cart-item-name');
                if (nameEl && !nameEl.querySelector('.preorder-tag')) {
                    nameEl.insertAdjacentHTML('beforeend', ' <span class="preorder-tag">Précommande</span>');
                }
            }
        });

        const has = cartHasPreorder();
        const btn = document.getElementById('checkoutWhatsAppBtn');
        if (btn) {
            btn.innerHTML = has
                ? '<i class="fab fa-whatsapp"></i> Continuer sur WhatsApp'
                : '<i class="fas fa-bag-shopping"></i> Confirmer ma commande';
        }

        let note = document.getElementById('preorderNote');
        if (!note) {
            note = document.createElement('div');
            note.id = 'preorderNote';
            note.className = 'preorder-note';
            const total = document.getElementById('cartTotalDisplay');
            total.parentNode.insertBefore(note, total.nextSibling);
        }
        note.style.display = has ? 'block' : 'none';
        note.innerHTML = '<i class="fas fa-calendar-check"></i> Ton panier contient des articles en <b>précommande</b> ' +
            '(à commander 1 à 2 semaines à l’avance). Après avoir choisi ton pays, tu seras redirigée vers WhatsApp ' +
            'pour valider tous les détails.';

        const pay = document.querySelector('.payment-note');
        if (pay) pay.style.display = has ? 'none' : '';
    }

    const _updateCartUI = updateCartUI;
    updateCartUI = function () { _updateCartUI(); decorateCart(); };

    // 8c-bis) taux de change : Wedding a le sien, le reste du site garde USD_RATE
    function rateFor(item) { return item.category === 'mariage' ? WEDDING_USD_RATE : USD_RATE; }
    function cartSubtotalUSD() { return cart.reduce((sum, it) => sum + it.price * it.quantity * rateFor(it), 0); }

    updateTotals = function () {
        const subtotalTND = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
        const subtotalUSD = cartSubtotalUSD();
        let totalDisplay;
        if (selectedCountry === 'tunisia') {
            const totalTND = subtotalTND + SHIPPING_TUNISIA_TND;
            const totalUSD = subtotalUSD + SHIPPING_TUNISIA_TND * USD_RATE;
            totalDisplay = 'Total: ' + totalTND.toFixed(2) + ' TND (' + totalUSD.toFixed(2) + ' USD)';
        } else if (selectedCountry === 'kinshasa') {
            totalDisplay = 'Total: ' + subtotalUSD.toFixed(2) + ' USD + frais de livraison';
        } else {
            totalDisplay = 'Total: ' + subtotalTND.toFixed(2) + ' TND (' + subtotalUSD.toFixed(2) + ' USD)';
        }
        document.getElementById('cartTotalDisplay').innerHTML = totalDisplay;
    };

    // commande classique (sans précommande) : le sous-total en USD envoyé à la base utilise aussi le bon taux
    if (typeof supabaseClient !== 'undefined' && supabaseClient && typeof supabaseClient.rpc === 'function') {
        const _rpc = supabaseClient.rpc.bind(supabaseClient);
        supabaseClient.rpc = function (name, params) {
            if (name === 'submit_order' && params && params.p_currency === 'USD') {
                params = Object.assign({}, params, { p_subtotal: cartSubtotalUSD() });
            }
            return _rpc(name, params);
        };
    }
    CATEGORY_LABELS.mariage = 'Mariage';

    // 8d) minimum de quantité (porte-clés : 45)
    const _changeQuantity = window.changeQuantity;
    window.changeQuantity = function (idx, delta) {
        const it = cart[idx];
        if (it && it.minQuantity && delta < 0 && it.quantity + delta < it.minQuantity) {
            showToast('Minimum ' + it.minQuantity + ' pièces pour cet article');
            return;
        }
        _changeQuantity(idx, delta);
    };

    // 8e) bouton de validation : WhatsApp si précommande, sinon comportement normal
    function buildWhatsAppMessage() {
        const isTn = selectedCountry === 'tunisia';
        const money = (tnd, rate) => isTn ? tnd.toFixed(2) + ' TND' : (tnd * rate).toFixed(2) + ' USD';

        let subTND = 0;
        const lines = cart.map((it) => {
            const line = it.price * it.quantity;
            subTND += line;
            const extra = it.preorder ? ' [précommande]' : '';
            return '• ' + it.name + ' × ' + it.quantity + ' — ' + money(line, rateFor(it)) + extra;
        });
        const subtotalText = isTn ? subTND.toFixed(2) + ' TND' : cartSubtotalUSD().toFixed(2) + ' USD';

        let msg = 'Bonjour Cosy 👋\nJe souhaite passer commande :\n\n' + lines.join('\n') + '\n\n';
        msg += 'Sous-total : ' + subtotalText + '\n';
        if (isTn) {
            msg += 'Livraison : ' + SHIPPING_TUNISIA_TND.toFixed(2) + ' TND\n';
            msg += 'Total : ' + (subTND + SHIPPING_TUNISIA_TND).toFixed(2) + ' TND\n';
        } else {
            msg += 'Livraison : sur devis\n';
        }
        msg += 'Pays : ' + (isTn ? 'Tunisie' : 'Kinshasa') + '\n\n';
        msg += 'Cette commande contient des articles en précommande. ';
        msg += 'Pouvons-nous valider ensemble les détails (initiales, date, couleurs, délais) ?';
        return msg;
    }

    const oldBtn = document.getElementById('checkoutWhatsAppBtn');
    if (oldBtn) {
        const newBtn = oldBtn.cloneNode(true);   // supprime l'ancien écouteur
        oldBtn.parentNode.replaceChild(newBtn, oldBtn);
        newBtn.addEventListener('click', () => {
            if (!cartHasPreorder()) { openOrderForm(); return; }   // commande classique

            if (cart.length === 0) { showToast('Votre panier est vide'); return; }
            if (!selectedCountry) { showToast('Veuillez sélectionner votre pays de livraison'); return; }

            const number = selectedCountry === 'tunisia' ? WHATSAPP_TUNISIA : WHATSAPP_KINSHASA;
            const url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(buildWhatsAppMessage());
            window.open(url, '_blank');
        });
    }

    // ----------------------------------------------------------
    // 9) INITIALISATION
    // ----------------------------------------------------------
    renderCollectionsGallery();     // fait apparaître la vignette Wedding sur l'accueil
    const tileCount = document.querySelector('.collection-tile[data-collection="wedding"] .collection-tile-caption p');
    if (tileCount) {
        const n = WEDDING_PRODUCTS.length;
        tileCount.textContent = n + ' pièce' + (n > 1 ? 's' : '') + ' · sur précommande';
    }
    updateCartUI();                 // applique l'affichage précommande si le panier en contient déjà
})();
