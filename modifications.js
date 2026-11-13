/* ============================================================
   MODIFICATIONS COSY — À charger APRÈS wedding.js et univers.js
   ============================================================ */
(function () {
    'use strict';

    /* ============================================================
       1. HERO IMMERSIF (suppression bouton + style plein écran)
       ============================================================ */
    const heroCta = document.getElementById('discoverBtn');
    if (heroCta) heroCta.remove();

    const heroSection = document.getElementById('section-accueil');
    if (heroSection) heroSection.classList.add('hero-immersive');

    const heroStyle = document.createElement('style');
    heroStyle.textContent = `
        .hero-immersive {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            background: #000;
            overflow: hidden;
        }
        .hero-immersive .video-container {
            position: absolute; inset: 0; max-width: 100%;
            border-radius: 0; box-shadow: none;
            opacity: 1; transform: none; animation: none; height: 100%;
        }
        .hero-immersive .video-container video {
            width: 100%; height: 100%; max-height: none; min-height: 100vh; object-fit: cover;
        }
        .hero-immersive .hero-scrim {
            position: absolute; inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.78) 100%);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 40px 24px; text-align: center;
        }
        .hero-immersive .hero-title {
            font-size: clamp(38px, 8vw, 76px); line-height: 1.05; margin-bottom: 22px;
            animation: none; opacity: 1; text-shadow: 0 8px 40px rgba(0,0,0,0.35);
            letter-spacing: -0.015em;
        }
        .hero-immersive .hero-quote {
            font-size: clamp(15px, 2vw, 20px); margin-bottom: 0;
            animation: none; opacity: 1; color: rgba(255,255,255,0.95);
            letter-spacing: 0.06em;
        }
        .hero-immersive .hero-eyebrow {
            position: absolute; top: 24px; left: 0; right: 0; margin: 0;
            color: rgba(255,255,255,0.9); font-size: 13px;
            animation: none; opacity: 1; z-index: 2;
        }
        .hero-immersive .hero-eyebrow .dot { background: var(--gold-bead-soft); }
        @media (max-width: 768px) {
            .hero-immersive .hero-title { font-size: 38px; }
            .hero-immersive .hero-quote { font-size: 14px; }
        }
    `;
    document.head.appendChild(heroStyle);

    /* ============================================================
       2. WEDDING : masquer les tuiles Pour Elle / Pour Lui
       ============================================================ */
    const universeEl = document.getElementById('section-collection-universe');
    if (universeEl) {
        const obs = new MutationObserver(() => {
            const wedding = document.querySelector('.wedding-universe');
            const tiles = document.getElementById('section-univers-tiles');
            if (tiles) tiles.style.display = wedding ? 'none' : '';
        });
        obs.observe(universeEl, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    /* ============================================================
       3. PAGES FEMME / HOMME : remplacer les boutons de catégorie
          par 4 tuiles visuelles cliquables
       ============================================================ */
    const catStyle = document.createElement('style');
    catStyle.textContent = `
        .univers-category-tiles {
            display: grid; grid-template-columns: repeat(4, 1fr);
            gap: 18px; margin-bottom: 44px;
        }
        .univers-category-tile {
            position: relative; border-radius: var(--radius-card);
            overflow: hidden; height: 220px; cursor: pointer;
            border: 2px solid transparent;
            transition: transform 0.4s var(--ease-soft), box-shadow 0.4s var(--ease-soft), border-color 0.25s;
            background: linear-gradient(135deg, #f5f0e8, #e8e0d5);
        }
        .univers-category-tile:hover {
            transform: translateY(-6px); box-shadow: var(--shadow-glow);
            border-color: var(--pink-soft);
        }
        .univers-category-tile.active {
            border-color: var(--gold-bead);
            box-shadow: var(--shadow-glow);
        }
        .univers-category-tile img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.5s ease;
        }
        .univers-category-tile:hover img { transform: scale(1.06); }
        .univers-category-tile .cat-name {
            position: absolute; left: 0; right: 0; bottom: 0;
            padding: 22px 14px 14px;
            background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%);
            color: #fff; font-family: 'Playfair Display', serif;
            font-size: 17px; font-weight: 500; text-align: center;
            letter-spacing: 0.01em;
        }
        .univers-category-tile .cat-active-badge {
            position: absolute; top: 10px; right: 10px;
            width: 22px; height: 22px; border-radius: 50%;
            background: var(--gold-bead); color: #fff;
            display: none; align-items: center; justify-content: center;
            font-size: 11px; z-index: 2;
        }
        .univers-category-tile.active .cat-active-badge { display: flex; }
        @media (max-width: 768px) {
            .univers-category-tiles { grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .univers-category-tile { height: 160px; }
            .univers-category-tile .cat-name { font-size: 14px; padding: 16px 10px 10px; }
        }
    `;
    document.head.appendChild(catStyle);

    // Les images par catégorie (on peut les modifier)
    const CATEGORY_IMAGES = {
        femme: {
            'collier-femme': 'WhatsApp_Image_2026-01-26_at_08.16.18_4_z6tfdm.jpg',
            'bracelet':      'br-nouv-001.jpg',
            'parure':        'ef84b59a-d20a-46dc-9357-9482bc95b238_tcwjju.jpg',
            'baya':          'b16d1544-332c-4330-aebb-cd4b82146df4_dx5e8b.jpg'
        },
        homme: {
            'collier-homme': 'cross/cross-04.jpg',
            'bracelet':      'PHOTO-2026-03-09-16-50-31_24_he6zvr.jpg',
            'parure':        'ef84b59a-d20a-46dc-9357-9482bc95b238_tcwjju.jpg',
            'autres':        '4545495b-90e9-4c95-bf0d-5c8abc7f2278_herlei.jpg'
        }
    };
    const LOCAL_IMAGES = new Set([
        'cross/cross-04.jpg',
        'br-nouv-001.jpg'
    ]);

    // On sauvegarde la fonction updateGrid originale pour pouvoir l'appeler
    // et ensuite mettre à jour l'état actif des tuiles.
    const _origUpdateGrid = window.updateGrid;

    function buildCategoryTiles(u, root) {
        // Supprimer les anciens boutons de catégorie
        const oldFilters = root.querySelector('#uCatFilters');
        if (oldFilters) {
            const prev = oldFilters.previousElementSibling;
            if (prev && prev.classList.contains('univers-filter-label')) prev.remove();
            oldFilters.remove();
        }

        // Supprimer l'éventuelle ancienne grille de tuiles
        const oldTiles = root.querySelector('.univers-category-tiles');
        if (oldTiles) oldTiles.remove();

        // Catégories à afficher (4 par univers)
        const catsByUnivers = {
            femme: [
                { key: 'collier-femme', label: 'Colliers' },
                { key: 'bracelet',      label: 'Bracelets' },
                { key: 'parure',        label: 'Parures' },
                { key: 'baya',          label: 'Baya' }
            ],
            homme: [
                { key: 'collier-homme', label: 'Colliers' },
                { key: 'bracelet',      label: 'Bracelets' },
                { key: 'parure',        label: 'Parures' },
                { key: 'autres',        label: 'Autres' }
            ]
        };
        const cats = catsByUnivers[u];
        if (!cats) return;

        const grid = document.createElement('div');
        grid.className = 'univers-category-tiles';
        grid.innerHTML = cats.map(cat => {
            const imgName = CATEGORY_IMAGES[u][cat.key];
            const isLocal = LOCAL_IMAGES.has(imgName);
            const url = getImageUrl(imgName, isLocal);
            return `
                <div class="univers-category-tile" data-cat-key="${cat.key}">
                    <img src="${url}" alt="${cat.label}" loading="lazy">
                    <span class="cat-active-badge"><i class="fas fa-check"></i></span>
                    <div class="cat-name">${cat.label}</div>
                </div>
            `;
        }).join('');

        // Insérer juste après le titre de la page (univers-page-head)
        const head = root.querySelector('.univers-page-head');
        if (head) head.insertAdjacentElement('afterend', grid);
        else root.prepend(grid);

        // Écouteur clic
        grid.querySelectorAll('.univers-category-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                const key = tile.dataset.catKey;
                // On réinitialise le style pour afficher TOUS les styles
                state.cat = key;
                state.style = 'all';
                // Mettre à jour les filtres de style (visuel)
                document.querySelectorAll('#uStyleFilters .filter-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.uStyle === 'all');
                });
                document.querySelectorAll('.style-card').forEach(c => c.classList.remove('active'));
                // Mettre à jour la grille
                updateGrid();
                // Mettre à jour la tuile active
                grid.querySelectorAll('.univers-category-tile').forEach(t => t.classList.remove('active'));
                tile.classList.add('active');
                // Scroll vers la grille
                const anchor = document.getElementById('universGridAnchor');
                if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Marquer comme active la tuile correspondant au state actuel
        if (state.cat !== 'all') {
            const active = grid.querySelector(`.univers-category-tile[data-cat-key="${state.cat}"]`);
            if (active) active.classList.add('active');
        }
    }

    // On surcharge showSection pour injecter les tuiles après le rendu de univers.js
    const _showSection = showSection;
    showSection = function (id) {
        _showSection(id);
        if (id === 'femme' || id === 'homme') {
            setTimeout(() => {
                const root = document.getElementById('section-univers');
                if (!root) return;
                // On reconstruit les tuiles à chaque affichage (les catégories changent selon l'univers)
                buildCategoryTiles(state.u || id, root);
            }, 120);
        }
    };

    // On surcharge aussi openUnivers pour injecter après ouverture
    const _openUnivers = openUnivers;
    openUnivers = function (u, cat, style) {
        _openUnivers(u, cat, style);
        setTimeout(() => {
            const root = document.getElementById('section-univers');
            if (!root) return;
            buildCategoryTiles(u, root);
        }, 150);
    };

    /* ============================================================
       4. PANIER : bouton partage + code promo AVANT le bouton de validation
       ============================================================ */
    const shareStyle = document.createElement('style');
    shareStyle.textContent = `
        .share-cart-btn {
            display: flex; align-items: center; justify-content: center;
            gap: 8px; width: 100%; margin-top: 10px; padding: 12px;
            border-radius: var(--radius-btn); border: 1px solid var(--pink-soft);
            background: transparent; color: var(--pink-dark);
            font-weight: 500; font-size: 14px; cursor: pointer;
            transition: all 0.2s; font-family: inherit;
        }
        .share-cart-btn:hover { background: var(--pink-soft); color: #fff; }

        .promo-block {
            margin-top: 14px;
            padding: 14px;
            background: var(--white-soft);
            border: 1px solid var(--border-light);
            border-radius: 14px;
        }
        .promo-block-title {
            font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
            text-transform: uppercase; color: var(--text-light);
            margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }
        .promo-block-title i { color: var(--gold-bead); }
        .promo-code-section { display: flex; gap: 8px; }
        .promo-code-section input {
            flex: 1; padding: 10px 14px; border: 1px solid var(--border-light);
            border-radius: 30px; font-family: inherit; font-size: 14px;
        }
        .promo-code-section button {
            padding: 10px 18px; border-radius: 30px; border: none;
            background: var(--gold-bead); color: #fff; font-weight: 600;
            font-size: 13px; cursor: pointer; font-family: inherit;
            transition: opacity 0.2s;
        }
        .promo-code-section button:hover { opacity: 0.9; }
        .promo-message {
            font-size: 12px; margin-top: 8px; text-align: center;
        }
        .promo-message.success { color: var(--green-dark); }
        .promo-message.error { color: #e74c3c; }
    `;
    document.head.appendChild(shareStyle);

    // On reconstruit le footer du panier dans le bon ordre :
    // 1) pays, 2) total, 3) code promo, 4) note précommande, 5) bouton partager, 6) bouton confirmer
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
        // Récupérer les éléments existants
        const countrySel = document.getElementById('countrySelector');
        const cartTotal = document.getElementById('cartTotalDisplay');
        const checkoutBtn = document.getElementById('checkoutWhatsAppBtn');
        const payNote = cartFooter.querySelector('.payment-note');

        // Vider et réorganiser
        cartFooter.innerHTML = '';

        if (countrySel) cartFooter.appendChild(countrySel);
        if (cartTotal) cartFooter.appendChild(cartTotal);

        // Bloc code promo
        const promoBlock = document.createElement('div');
        promoBlock.className = 'promo-block';
        promoBlock.innerHTML = `
            <div class="promo-block-title"><i class="fas fa-tag"></i> Code promo</div>
            <div class="promo-code-section">
                <input type="text" id="promoCodeInput" placeholder="Saisir un code">
                <button id="applyPromoBtn">Appliquer</button>
            </div>
            <div id="promoMessage" class="promo-message"></div>
        `;
        cartFooter.appendChild(promoBlock);

        // Bouton partage
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-cart-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Partager mon panier';
        shareBtn.addEventListener('click', shareCart);
        cartFooter.appendChild(shareBtn);

        // Bouton confirmer (remis en dernier)
        if (checkoutBtn) cartFooter.appendChild(checkoutBtn);

        // Note paiement
        if (payNote) cartFooter.appendChild(payNote);

        // Écouteurs promo
        document.getElementById('applyPromoBtn').addEventListener('click', applyPromoCode);
        document.getElementById('promoCodeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyPromoCode();
        });
    }

    // Partage du panier
    function shareCart() {
        if (cart.length === 0) { showToast("Votre panier est vide"); return; }

        let text = "🛍️ Mon panier Cosy Boutique :\n\n";
        cart.forEach(item => {
            text += `• ${item.name} × ${item.quantity} — ${item.price.toFixed(2)} TND\n`;
        });
        const totalTND = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        text += `\nTotal : ${totalTND.toFixed(2)} TND\n`;
        text += "\nDécouvrez la boutique : " + window.location.origin;

        if (navigator.share) {
            navigator.share({ title: 'Mon panier Cosy Boutique', text: text, url: window.location.href })
                .catch(() => fallbackShare(text));
        } else {
            fallbackShare(text);
        }
    }

    function fallbackShare(text) {
        const choice = confirm("Partager via WhatsApp ? (Annuler pour Email)");
        if (choice) {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else {
            window.location.href = `mailto:?subject=${encodeURIComponent("Mon panier Cosy")}&body=${encodeURIComponent(text)}`;
        }
    }

    // Codes promo
    const PROMO_CODES = {
        'COSY10':    { type: 'percent', value: 10 },
        'WELCOME5':  { type: 'percent', value: 5 },
        'TUNISIA10': { type: 'percent', value: 10 }
    };
    let activePromo = null;
    try {
        const saved = localStorage.getItem('cosyPromo');
        if (saved) activePromo = JSON.parse(saved);
    } catch (e) {}

    function applyPromoCode() {
        const input = document.getElementById('promoCodeInput');
        const msg = document.getElementById('promoMessage');
        if (!input || !msg) return;
        const code = input.value.trim().toUpperCase();
        if (!code) {
            msg.textContent = 'Veuillez saisir un code.';
            msg.className = 'promo-message error';
            return;
        }
        const promo = PROMO_CODES[code];
        if (!promo) {
            msg.textContent = 'Code invalide.';
            msg.className = 'promo-message error';
            activePromo = null;
            localStorage.removeItem('cosyPromo');
            updateTotals();
            return;
        }
        activePromo = { code, type: promo.type, value: promo.value };
        localStorage.setItem('cosyPromo', JSON.stringify(activePromo));
        msg.textContent = `Code "${code}" appliqué : -${promo.value}%`;
        msg.className = 'promo-message success';
        updateTotals();
    }

    // Surcharger updateTotals pour appliquer la promo
    const _updateTotals = updateTotals;
    updateTotals = function () {
        const subtotalTND = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const subtotalUSD = cart.reduce((s, i) => {
            const rate = (i.category === 'mariage') ? WEDDING_USD_RATE : USD_RATE;
            return s + i.price * i.quantity * rate;
        }, 0);

        let discountTND = 0, discountUSD = 0;
        if (activePromo && activePromo.type === 'percent') {
            discountTND = subtotalTND * (activePromo.value / 100);
            discountUSD = subtotalUSD * (activePromo.value / 100);
        }
        const finalTND = subtotalTND - discountTND;
        const finalUSD = subtotalUSD - discountUSD;

        let display = '';
        if (selectedCountry === 'tunisia') {
            const ship = SHIPPING_TUNISIA_TND;
            display = `Total: ${(finalTND + ship).toFixed(2)} TND (${(finalUSD + ship * USD_RATE).toFixed(2)} USD)`;
            if (discountTND > 0) display += ` <small style="color:var(--green-dark)">(-${discountTND.toFixed(2)} TND)</small>`;
        } else if (selectedCountry === 'kinshasa') {
            display = `Total: ${finalUSD.toFixed(2)} USD + frais de livraison`;
            if (discountUSD > 0) display += ` <small style="color:var(--green-dark)">(-${discountUSD.toFixed(2)} USD)</small>`;
        } else {
            display = `Total: ${finalTND.toFixed(2)} TND (${finalUSD.toFixed(2)} USD)`;
            if (discountTND > 0) display += ` <small style="color:var(--green-dark)">(-${discountTND.toFixed(2)} TND)</small>`;
        }
        const totalEl = document.getElementById('cartTotalDisplay');
        if (totalEl) totalEl.innerHTML = display;
    };

    // Restaurer l'affichage du code promo au chargement
    setTimeout(() => {
        if (activePromo) {
            const input = document.getElementById('promoCodeInput');
            const msg = document.getElementById('promoMessage');
            if (input) input.value = activePromo.code;
            if (msg) {
                msg.textContent = `Code "${activePromo.code}" appliqué : -${activePromo.value}%`;
                msg.className = 'promo-message success';
            }
        }
        updateTotals();
    }, 400);

    /* ============================================================
       5. CARROUSEL "LES ESSENTIELS" : swipe seul, cadence modérée
       ============================================================ */
    const essentialStyle = document.createElement('style');
    essentialStyle.textContent = `
        .essentials-scroll-wrap {
            position: relative;
        }
        .essentials-scroll-wrap .new-arrivals-scroll {
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
            cursor: grab;
        }
        .essentials-scroll-wrap .new-arrivals-scroll:active { cursor: grabbing; }
        .essentials-scroll-wrap .new-arrivals-scroll::-webkit-scrollbar { height: 0; }
        .essentials-scroll-wrap .new-arrivals-scroll { scrollbar-width: none; }
        .essentials-arrow {
            position: absolute; top: 50%; transform: translateY(-50%);
            width: 40px; height: 40px; border-radius: 50%;
            background: rgba(255,255,255,0.95); border: 1px solid var(--border-light);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 3; transition: all 0.2s;
            box-shadow: var(--shadow-sm); color: var(--text-dark);
        }
        .essentials-arrow:hover { background: var(--pink-soft); color: #fff; border-color: var(--pink-soft); }
        .essentials-arrow.left  { left: -6px; }
        .essentials-arrow.right { right: -6px; }
        @media (max-width: 768px) { .essentials-arrow { display: none; } }
    `;
    document.head.appendChild(essentialStyle);

    // On observe l'apparition du bloc Essentiels pour l'enrichir
    const essentialsObserver = new MutationObserver(() => {
        const scroller = document.querySelector('.essentials-block .new-arrivals-scroll');
        if (!scroller) return;
        if (scroller.parentElement && scroller.parentElement.classList.contains('essentials-scroll-wrap')) return;

        // Envelopper avec flèches
        const wrap = document.createElement('div');
        wrap.className = 'essentials-scroll-wrap';
        scroller.parentNode.insertBefore(wrap, scroller);
        wrap.appendChild(scroller);

        // Flèches
        const left = document.createElement('button');
        left.className = 'essentials-arrow left';
        left.innerHTML = '<i class="fas fa-chevron-left"></i>';
        const right = document.createElement('button');
        right.className = 'essentials-arrow right';
        right.innerHTML = '<i class="fas fa-chevron-right"></i>';
        wrap.appendChild(left);
        wrap.appendChild(right);

        left.addEventListener('click', () => scrollEssentials(-1));
        right.addEventListener('click', () => scrollEssentials(1));

        // Swipe souris pour desktop
        let isDown = false, startX = 0, scrollStart = 0;
        scroller.addEventListener('mousedown', (e) => {
            isDown = true; startX = e.pageX - scroller.offsetLeft;
            scrollStart = scroller.scrollLeft;
            scroller.style.scrollBehavior = 'auto';
        });
        scroller.addEventListener('mouseleave', () => { isDown = false; scroller.style.scrollBehavior = 'smooth'; });
        scroller.addEventListener('mouseup', () => { isDown = false; scroller.style.scrollBehavior = 'smooth'; });
        scroller.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scroller.offsetLeft;
            scroller.scrollLeft = scrollStart - (x - startX) * 1.2;
        });
    });
    essentialsObserver.observe(document.body, { childList: true, subtree: true });

    function scrollEssentials(direction) {
        const scroller = document.querySelector('.essentials-block .new-arrivals-scroll');
        if (!scroller) return;
        const card = scroller.querySelector('.new-card');
        const step = card ? card.offsetWidth + 20 : 260;
        scroller.scrollBy({ left: direction * step * 2, behavior: 'smooth' });
    }

    /* ============================================================
       6. MENU HAMBURGER — refonte complète
       ============================================================ */
    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
        /* Overlay sombre */
        #overlay {
            background: rgba(0,0,0,0.55) !important;
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
        }

        /* Panneau principal */
        .mobile-menu {
            width: 88vw !important; max-width: 380px !important;
            left: -100vw !important;
            height: 100vh !important;
            padding: 0 !important;
            border-radius: 0 24px 24px 0 !important;
            background: var(--white-pure) !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
            overflow: hidden !important;
            box-shadow: 4px 0 40px rgba(0,0,0,0.18) !important;
        }
        .mobile-menu.open { left: 0 !important; }

        /* Header du menu */
        .mm-header {
            padding: 22px 22px 18px;
            background: linear-gradient(135deg, var(--pink-pale) 0%, var(--white-soft) 100%);
            border-bottom: 1px solid var(--border-light);
            display: flex; align-items: center; justify-content: space-between;
            position: relative;
        }
        .mm-brand {
            font-family: 'Playfair Display', serif;
            font-size: 26px; font-weight: 500; letter-spacing: -0.02em;
            color: var(--text-dark);
        }
        .mm-brand span { color: var(--pink-soft); }
        .mm-close {
            width: 38px; height: 38px; border-radius: 50%;
            background: #fff; border: 1px solid var(--border-light);
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; color: var(--text-dark);
            cursor: pointer; transition: all 0.2s;
        }
        .mm-close:hover { background: var(--pink-soft); color: #fff; border-color: var(--pink-soft); transform: rotate(90deg); }

        /* Corps scrollable */
        .mm-body {
            flex: 1; overflow-y: auto;
            padding: 8px 0 24px;
            -webkit-overflow-scrolling: touch;
        }
        .mm-body::-webkit-scrollbar { width: 4px; }
        .mm-body::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 10px; }

        /* Section titre */
        .mm-section {
            padding: 16px 22px 8px;
        }
        .mm-section-title {
            font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
            color: var(--text-light); font-weight: 600;
            display: flex; align-items: center; gap: 10px;
        }
        .mm-section-title::after {
            content: ''; flex: 1; height: 1px;
            background: linear-gradient(90deg, var(--border-light), transparent);
        }

        /* Liens principaux */
        .mm-link {
            display: flex; align-items: center; gap: 14px;
            padding: 14px 22px;
            text-decoration: none; color: var(--text-dark);
            font-size: 16px; font-weight: 500;
            border-bottom: none !important;
            transition: all 0.2s;
            position: relative;
        }
        .mm-link:hover { background: var(--pink-pale); color: var(--pink-dark); }
        .mm-link i.mm-icon {
            width: 36px; height: 36px; border-radius: 50%;
            background: var(--white-soft); border: 1px solid var(--border-light);
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; color: var(--pink-dark); flex-shrink: 0;
        }
        .mm-link:hover i.mm-icon { background: var(--pink-soft); color: #fff; border-color: var(--pink-soft); }
        .mm-link .mm-chevron {
            margin-left: auto; font-size: 12px; color: var(--text-light);
            transition: transform 0.2s;
        }
        .mm-link:hover .mm-chevron { transform: translateX(3px); color: var(--pink-dark); }

        /* Cartes univers */
        .mm-univers {
            display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
            padding: 10px 22px 6px;
        }
        .mm-univers-card {
            position: relative; border-radius: 16px; overflow: hidden;
            height: 130px; cursor: pointer; border: 1px solid var(--border-light);
            transition: transform 0.25s, box-shadow 0.25s;
            background: var(--white-soft);
        }
        .mm-univers-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-glow); }
        .mm-univers-card img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.4s;
        }
        .mm-univers-card:hover img { transform: scale(1.07); }
        .mm-univers-card-body {
            position: absolute; inset: 0;
            background: linear-gradient(0deg, rgba(0,0,0,0.72) 0%, transparent 65%);
            display: flex; flex-direction: column; justify-content: flex-end;
            padding: 12px; color: #fff;
        }
        .mm-univers-card-eyebrow { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-bead-soft); font-weight: 600; }
        .mm-univers-card-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 500; margin-top: 2px; }

        /* Catégories rapides */
        .mm-cats {
            display: flex; flex-wrap: wrap; gap: 8px;
            padding: 6px 22px 14px;
        }
        .mm-cat-chip {
            padding: 8px 14px; border-radius: 30px;
            background: var(--white-soft); border: 1px solid var(--border-light);
            font-size: 12.5px; font-weight: 500; color: var(--text-dark);
            cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .mm-cat-chip:hover { background: var(--pink-soft); border-color: var(--pink-soft); color: #fff; transform: translateY(-1px); }

        /* Collections */
        .mm-collections {
            display: flex; flex-direction: column; gap: 8px;
            padding: 4px 22px 12px;
        }
        .mm-collection-row {
            display: flex; align-items: center; gap: 12px;
            padding: 12px 14px; border-radius: 14px;
            background: var(--white-soft); border: 1px solid var(--border-light);
            cursor: pointer; transition: all 0.2s;
        }
        .mm-collection-row:hover { background: #fff; border-color: var(--pink-soft); transform: translateX(3px); }
        .mm-collection-thumb {
            width: 44px; height: 44px; border-radius: 10px; overflow: hidden; flex-shrink: 0;
            background: var(--pink-pale);
        }
        .mm-collection-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .mm-collection-info { flex: 1; }
        .mm-collection-info h4 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 15px; margin: 0; }
        .mm-collection-info p { font-size: 11.5px; color: var(--text-light); margin: 2px 0 0; }
        .mm-collection-row > i { color: var(--text-light); font-size: 11px; }

        /* Bas du menu */
        .mm-footer {
            padding: 14px 22px 20px;
            border-top: 1px solid var(--border-light);
            background: var(--white-soft);
        }
        .mm-footer-cta {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; padding: 12px;
            background: var(--pink-soft); color: #fff;
            border-radius: 30px; border: none; font-weight: 600;
            font-size: 14px; cursor: pointer; font-family: inherit;
            transition: all 0.2s; text-decoration: none;
        }
        .mm-footer-cta:hover { background: var(--pink-dark); transform: translateY(-1px); }
        .mm-footer-note { text-align: center; font-size: 11px; color: var(--text-light); margin-top: 10px; }

        /* Animation d'entrée des items */
        .mobile-menu.open .mm-anim {
            animation: mmSlideIn 0.4s var(--ease-soft) both;
        }
        .mobile-menu.open .mm-anim:nth-child(1) { animation-delay: 0.05s; }
        .mobile-menu.open .mm-anim:nth-child(2) { animation-delay: 0.1s; }
        .mobile-menu.open .mm-anim:nth-child(3) { animation-delay: 0.15s; }
        .mobile-menu.open .mm-anim:nth-child(4) { animation-delay: 0.2s; }
        .mobile-menu.open .mm-anim:nth-child(5) { animation-delay: 0.25s; }
        @keyframes mmSlideIn {
            from { opacity: 0; transform: translateX(-16px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(menuStyle);

    // Reconstruction complète du contenu du menu mobile
    function rebuildMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        if (!menu) return;

        const universData = (typeof UNIVERS !== 'undefined') ? UNIVERS : null;
        const collectionsData = (typeof COLLECTIONS !== 'undefined') ? COLLECTIONS : {};

        const femmeImg = universData ? getImageUrl(universData.femme.tileImage.src, universData.femme.tileImage.local) : '';
        const hommeImg = universData ? getImageUrl(universData.homme.tileImage.src, universData.homme.tileImage.local) : '';

        // Catégories femme et homme (4 chacun)
        const femmeCats = [
            { key: 'collier-femme', label: 'Colliers' },
            { key: 'bracelet', label: 'Bracelets' },
            { key: 'parure', label: 'Parures' },
            { key: 'baya', label: 'Baya' }
        ];
        const hommeCats = [
            { key: 'collier-homme', label: 'Colliers' },
            { key: 'bracelet', label: 'Bracelets' },
            { key: 'parure', label: 'Parures' },
            { key: 'autres', label: 'Autres' }
        ];

        // Collections existantes (sauf celles affichées autrement)
        const colRows = Object.values(collectionsData).map(col => {
            const count = PRODUCTS ? PRODUCTS.filter(p => p.collection === col.slug).length : 0;
            const img = getImageUrl(col.tileImage, true);
            return `
                <div class="mm-collection-row" data-mm-collection="${col.slug}">
                    <div class="mm-collection-thumb"><img src="${img}" alt="${col.name}"></div>
                    <div class="mm-collection-info">
                        <h4>${col.name}</h4>
                        <p>${count} pièce${count > 1 ? 's' : ''}</p>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;
        }).join('');

        menu.innerHTML = `
            <div class="mm-header">
                <div class="mm-brand">COSY<span>.</span></div>
                <button class="mm-close" id="mmCloseBtn" aria-label="Fermer"><i class="fas fa-times"></i></button>
            </div>

            <div class="mm-body">
                <div class="mm-section mm-anim">
                    <div class="mm-section-title">Accueil</div>
                </div>
                <a href="#" class="mm-link mm-anim" data-mm-nav="accueil">
                    <i class="fas fa-house mm-icon"></i>
                    <span>Page d'accueil</span>
                    <i class="fas fa-chevron-right mm-chevron"></i>
                </a>

                <div class="mm-section mm-anim">
                    <div class="mm-section-title">Explorer</div>
                </div>
                <div class="mm-univers mm-anim">
                    <div class="mm-univers-card" data-mm-univers="femme">
                        <img src="${femmeImg}" alt="Femme">
                        <div class="mm-univers-card-body">
                            <div class="mm-univers-card-eyebrow">Univers</div>
                            <div class="mm-univers-card-title">Femme</div>
                        </div>
                    </div>
                    <div class="mm-univers-card" data-mm-univers="homme">
                        <img src="${hommeImg}" alt="Homme">
                        <div class="mm-univers-card-body">
                            <div class="mm-univers-card-eyebrow">Univers</div>
                            <div class="mm-univers-card-title">Homme</div>
                        </div>
                    </div>
                </div>

                <div class="mm-section mm-anim">
                    <div class="mm-section-title">Catégories rapides</div>
                </div>
                <div class="mm-cats mm-anim">
                    ${femmeCats.map(c => `<button class="mm-cat-chip" data-mm-cat="${c.key}" data-mm-u="femme">${c.label} · Femme</button>`).join('')}
                    ${hommeCats.map(c => `<button class="mm-cat-chip" data-mm-cat="${c.key}" data-mm-u="homme">${c.label} · Homme</button>`).join('')}
                </div>

                <div class="mm-section mm-anim">
                    <div class="mm-section-title">Collections</div>
                </div>
                <div class="mm-collections mm-anim">
                    ${colRows || '<p style="font-size:13px;color:var(--text-light);padding:0 22px;">Aucune collection</p>'}
                </div>

                <div class="mm-section mm-anim">
                    <div class="mm-section-title">Personnalisation</div>
                </div>
                <a href="#" class="mm-link mm-anim" data-mm-nav="personnalisation">
                    <i class="fas fa-palette mm-icon"></i>
                    <span>Créer mon bracelet</span>
                    <i class="fas fa-chevron-right mm-chevron"></i>
                </a>
            </div>

            <div class="mm-footer">
                <button class="mm-footer-cta" data-mm-nav="boutique">
                    <i class="fas fa-shopping-bag"></i> Voir toute la boutique
                </button>
                <div class="mm-footer-note">Be Cosy, Be Creative</div>
            </div>
        `;

        // Écouteurs
        const closeBtn = document.getElementById('mmCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => { if (typeof closeMobileMenu === 'function') closeMobileMenu(); });

        menu.querySelectorAll('[data-mm-nav]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const target = el.dataset.mmNav;
                if (typeof showSection === 'function') showSection(target);
                if (typeof closeMobileMenu === 'function') closeMobileMenu();
            });
        });

        menu.querySelectorAll('[data-mm-univers]').forEach(el => {
            el.addEventListener('click', () => {
                const u = el.dataset.mmUnivers;
                if (typeof showSection === 'function') showSection(u);
                if (typeof closeMobileMenu === 'function') closeMobileMenu();
            });
        });

        menu.querySelectorAll('[data-mm-cat]').forEach(el => {
            el.addEventListener('click', () => {
                const u = el.dataset.mmU;
                const cat = el.dataset.mmCat;
                if (typeof closeMobileMenu === 'function') closeMobileMenu();
                // Ouvre l'univers puis sélectionne la catégorie
                setTimeout(() => {
                    if (typeof openUnivers === 'function') {
                        openUnivers(u, cat);
                    }
                }, 200);
            });
        });

        menu.querySelectorAll('[data-mm-collection]').forEach(el => {
            el.addEventListener('click', () => {
                const slug = el.dataset.mmCollection;
                if (typeof closeMobileMenu === 'function') closeMobileMenu();
                setTimeout(() => {
                    if (typeof openCollectionUniverse === 'function') openCollectionUniverse(slug);
                }, 200);
            });
        });
    }

    // Reconstruire le menu une fois que les données (UNIVERS, COLLECTIONS) sont prêtes
    // On attend un peu que les autres scripts aient fini leur init
    setTimeout(rebuildMobileMenu, 300);
    // Et on reconstruit aussi après un éventuel re-render des collections
    const menuRebuildObs = new MutationObserver(() => {
        const menu = document.getElementById('mobileMenu');
        if (menu && !menu.querySelector('.mm-header')) rebuildMobileMenu();
    });
    menuRebuildObs.observe(document.body, { childList: true, subtree: false });

    /* ============================================================
       7. NAVIGATION PAR STYLE : déjà géré par univers.js (aucun ajout)
       ============================================================ */

})();
