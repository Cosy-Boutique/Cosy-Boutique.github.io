/* ============================================================
   MODIFICATIONS COSY — À charger APRÈS wedding.js
   ============================================================ */
(function () {
    'use strict';

    // ============================================================
    // 1. PAGE D'ACCUEIL : HERO SECTION (suppression bouton + immersif)
    // ============================================================
    const heroCta = document.getElementById('discoverBtn');
    if (heroCta) heroCta.remove();

    // Ajout d'une classe pour un style plus immersif (géré en CSS ci-dessous)
    const heroSection = document.getElementById('section-accueil');
    if (heroSection) heroSection.classList.add('hero-immersive');

    // Injection du CSS pour le hero immersif
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
            position: absolute;
            inset: 0;
            max-width: 100%;
            border-radius: 0;
            box-shadow: none;
            opacity: 1;
            transform: none;
            animation: none;
            height: 100%;
        }
        .hero-immersive .video-container video {
            width: 100%;
            height: 100%;
            max-height: none;
            min-height: 100vh;
            object-fit: cover;
        }
        .hero-immersive .hero-scrim {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            text-align: center;
        }
        .hero-immersive .hero-title {
            font-size: clamp(38px, 8vw, 72px);
            line-height: 1.1;
            margin-bottom: 20px;
            animation: none;
            opacity: 1;
            text-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        .hero-immersive .hero-quote {
            font-size: clamp(15px, 2vw, 20px);
            margin-bottom: 30px;
            animation: none;
            opacity: 1;
            color: rgba(255,255,255,0.95);
            letter-spacing: 0.05em;
        }
        .hero-immersive .hero-eyebrow {
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            margin: 0;
            color: rgba(255,255,255,0.9);
            font-size: 13px;
            animation: none;
            opacity: 1;
            z-index: 2;
        }
        .hero-immersive .hero-eyebrow .dot {
            background: var(--gold-bead-soft);
        }
        @media (max-width: 768px) {
            .hero-immersive .hero-title { font-size: 38px; }
            .hero-immersive .hero-quote { font-size: 14px; }
        }
    `;
    document.head.appendChild(heroStyle);

    // ============================================================
    // 2. SECTION WEDDING : SUPPRIMER LES TUILES "POUR ELLE" / "POUR LUI"
    // ============================================================
    // On masque la section des tuiles uniquement quand on est dans l'univers Wedding
    const observer = new MutationObserver(() => {
        const weddingUniverse = document.querySelector('.wedding-universe');
        const tilesSection = document.getElementById('section-univers-tiles');
        if (weddingUniverse && tilesSection) {
            tilesSection.style.display = 'none';
        }
    });
    const universeEl = document.getElementById('section-collection-universe');
    if (universeEl) {
        observer.observe(universeEl, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    // ============================================================
    // 3. PAGES FEMME / HOMME : NOUVELLE PRÉSENTATION "EXPLORER PAR CATÉGORIES"
    // ============================================================
    // On ajoute une grille de tuiles de catégories (4 carrés) en haut de la page univers.
    // On supprime l'ancienne section de filtres par catégorie (déjà présente dans le shell)
    // et on ajoute une nouvelle grille de tuiles.

    // D'abord, on modifie le CSS pour la nouvelle grille de catégories
    const catStyle = document.createElement('style');
    catStyle.textContent = `
        .univers-category-tiles {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 48px;
        }
        .univers-category-tile {
            position: relative;
            border-radius: var(--radius-card);
            overflow: hidden;
            height: 220px;
            cursor: pointer;
            border: 1px solid var(--border-light);
            transition: transform 0.4s var(--ease-soft), box-shadow 0.4s var(--ease-soft);
            background: linear-gradient(135deg, #f5f0e8, #e8e0d5);
        }
        .univers-category-tile:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-glow);
            border-color: var(--pink-soft);
        }
        .univers-category-tile img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .univers-category-tile:hover img {
            transform: scale(1.06);
        }
        .univers-category-tile .cat-name {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 18px 16px;
            background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%);
            color: #fff;
            font-family: 'Playfair Display', serif;
            font-size: 18px;
            font-weight: 500;
            text-align: center;
        }
        @media (max-width: 768px) {
            .univers-category-tiles { grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .univers-category-tile { height: 160px; }
            .univers-category-tile .cat-name { font-size: 15px; padding: 12px; }
        }
    `;
    document.head.appendChild(catStyle);

    // On "wrap" la fonction renderShell de univers.js pour ajouter les tuiles de catégories
    // et supprimer l'ancienne section de filtres par catégorie.
    const _renderShell = window.renderShell; // si univers.js expose renderShell (ce n'est pas le cas, il est dans une IIFE)
    // Comme renderShell n'est pas exposé, on va plutôt surcharger showSection pour modifier le DOM après rendu.

    const _showSection = showSection;
    showSection = function (id) {
        _showSection(id);

        if (id === 'femme' || id === 'homme') {
            // Attendre que le DOM soit mis à jour
            setTimeout(() => {
                const root = document.getElementById('section-univers');
                if (!root) return;

                // Supprimer l'ancienne section de filtres par catégorie
                const oldCatFilters = document.getElementById('uCatFilters');
                if (oldCatFilters) {
                    const parent = oldCatFilters.parentNode;
                    // Supprimer aussi le label "Catégorie" juste avant
                    const prev = oldCatFilters.previousElementSibling;
                    if (prev && prev.classList.contains('univers-filter-label')) prev.remove();
                    oldCatFilters.remove();
                }

                // Supprimer la section "Explorer par style" ? Non, on la garde mais on la déplace après les catégories ?
                // L'utilisateur veut garder "Explorer par style" et "Explorer par catégorie" en haut.
                // On va donc ajouter les tuiles de catégories juste après le head (avant les styles)
                // et laisser les styles.

                // Vérifier si les tuiles de catégories existent déjà
                if (root.querySelector('.univers-category-tiles')) return;

                // Récupérer les catégories depuis UNIVERS (défini dans univers.js, mais pas exposé globalement)
                // On va les redéfinir ici en dur ou les extraire du DOM existant.
                // On peut les extraire des anciens boutons de filtre (qu'on a supprimés), donc on les redéfinit.
                const UNIVERS_CATS = {
                    femme: [
                        { key: 'collier-femme', label: 'Colliers', image: 'WhatsApp_Image_2026-01-26_at_08.16.18_4_z6tfdm.jpg', local: false },
                        { key: 'bracelet', label: 'Bracelets', image: 'br-042.jpg', local: true }, // à adapter
                        { key: 'parure', label: 'Parures', image: 'ef84b59a-d20a-46dc-9357-9482bc95b238_tcwjju.jpg', local: false },
                        { key: 'baya', label: 'Baya', image: 'b16d1544-332c-4330-aebb-cd4b82146df4_dx5e8b.jpg', local: false }
                    ],
                    homme: [
                        { key: 'collier-homme', label: 'Colliers', image: 'cross/cross-04.jpg', local: true },
                        { key: 'bracelet', label: 'Bracelets', image: 'PHOTO-2026-03-09-16-50-31_24_he6zvr.jpg', local: false },
                        { key: 'parure', label: 'Parures', image: 'ef84b59a-d20a-46dc-9357-9482bc95b238_tcwjju.jpg', local: false },
                        { key: 'autres', label: 'Autres', image: '4545495b-90e9-4c95-bf0d-5c8abc7f2278_herlei.jpg', local: false }
                    ]
                };

                const u = (state && state.u) ? state.u : (root.querySelector('.univers-page-head h2')?.textContent === 'Pour Lui' ? 'homme' : 'femme');
                const cats = UNIVERS_CATS[u];
                if (!cats) return;

                // Créer la grille de tuiles
                const tilesGrid = document.createElement('div');
                tilesGrid.className = 'univers-category-tiles';
                tilesGrid.innerHTML = cats.map(cat => {
                    const imgUrl = getImageUrl(cat.image, cat.local);
                    return `
                        <div class="univers-category-tile" data-cat-key="${cat.key}">
                            <img src="${imgUrl}" alt="${cat.label}" loading="lazy">
                            <div class="cat-name">${cat.label}</div>
                        </div>
                    `;
                }).join('');

                // Insérer après le head (univers-page-head)
                const head = root.querySelector('.univers-page-head');
                if (head) {
                    head.insertAdjacentElement('afterend', tilesGrid);
                } else {
                    root.prepend(tilesGrid);
                }

                // Ajouter les écouteurs de clic sur les tuiles
                tilesGrid.querySelectorAll('.univers-category-tile').forEach(tile => {
                    tile.addEventListener('click', () => {
                        const catKey = tile.dataset.catKey;
                        // Mettre à jour le state et la grille
                        if (typeof state !== 'undefined') {
                            state.cat = catKey;
                            state.style = 'all'; // On affiche tous les styles pour cette catégorie
                        }
                        // Mettre à jour les boutons de filtre de style (désactiver)
                        document.querySelectorAll('#uStyleFilters .filter-btn').forEach(b => b.classList.remove('active'));
                        const allStyleBtn = document.querySelector('#uStyleFilters .filter-btn[data-u-style="all"]');
                        if (allStyleBtn) allStyleBtn.classList.add('active');

                        // Mettre à jour la grille
                        if (typeof updateGrid === 'function') updateGrid();

                        // Scroll vers la grille
                        const anchor = document.getElementById('universGridAnchor');
                        if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                });

                // Mettre à jour les tuiles actives si une catégorie est déjà sélectionnée
                if (state && state.cat !== 'all') {
                    const activeTile = tilesGrid.querySelector(`.univers-category-tile[data-cat-key="${state.cat}"]`);
                    if (activeTile) activeTile.style.borderColor = 'var(--gold-bead)';
                }

            }, 150);
        }
    };

    // ============================================================
    // 4. PANIER : POSSIBILITÉ DE PARTAGE
    // ============================================================
    // On ajoute un bouton "Partager le panier" dans le panier.
    // On modifie le HTML du panier pour ajouter ce bouton après le total.

    const shareStyle = document.createElement('style');
    shareStyle.textContent = `
        .share-cart-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            margin-top: 10px;
            padding: 12px;
            border-radius: var(--radius-btn);
            border: 1px solid var(--pink-soft);
            background: transparent;
            color: var(--pink-dark);
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .share-cart-btn:hover {
            background: var(--pink-soft);
            color: #fff;
        }
        .promo-code-section {
            margin-top: 15px;
            display: flex;
            gap: 8px;
        }
        .promo-code-section input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid var(--border-light);
            border-radius: 30px;
            font-family: inherit;
            font-size: 14px;
        }
        .promo-code-section button {
            padding: 10px 18px;
            border-radius: 30px;
            border: none;
            background: var(--gold-bead);
            color: #fff;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .promo-code-section button:hover {
            opacity: 0.9;
        }
        .promo-message {
            font-size: 12px;
            margin-top: 6px;
            text-align: center;
        }
        .promo-message.success { color: var(--green-dark); }
        .promo-message.error { color: #e74c3c; }
    `;
    document.head.appendChild(shareStyle);

    // Ajouter le bouton de partage et le champ promo dans le footer du panier
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
        // Bouton de partage
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-cart-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Partager mon panier';
        shareBtn.addEventListener('click', shareCart);
        cartFooter.appendChild(shareBtn);

        // Section code promo
        const promoDiv = document.createElement('div');
        promoDiv.className = 'promo-code-section';
        promoDiv.innerHTML = `
            <input type="text" id="promoCodeInput" placeholder="Code promo">
            <button id="applyPromoBtn">Appliquer</button>
        `;
        cartFooter.appendChild(promoDiv);

        const promoMsg = document.createElement('div');
        promoMsg.id = 'promoMessage';
        promoMsg.className = 'promo-message';
        cartFooter.appendChild(promoMsg);

        // Écouteur pour appliquer le code promo
        document.getElementById('applyPromoBtn').addEventListener('click', applyPromoCode);
        document.getElementById('promoCodeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyPromoCode();
        });
    }

    // Fonction de partage du panier
    function shareCart() {
        if (cart.length === 0) {
            showToast("Votre panier est vide");
            return;
        }

        let text = "🛍️ Mon panier Cosy Boutique :\n\n";
        cart.forEach(item => {
            text += `• ${item.name} × ${item.quantity} — ${item.price.toFixed(2)} TND\n`;
        });
        let totalTND = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        text += `\nTotal : ${totalTND.toFixed(2)} TND\n`;
        text += "\nDécouvrez la boutique : https://cosy-boutique.com"; // à adapter

        if (navigator.share) {
            navigator.share({
                title: 'Mon panier Cosy Boutique',
                text: text,
                url: window.location.href
            }).catch(() => {
                // Si le partage natif échoue, on propose WhatsApp
                fallbackShare(text);
            });
        } else {
            fallbackShare(text);
        }
    }

    function fallbackShare(text) {
        // Proposer WhatsApp et Email
        const choice = confirm("Partager via WhatsApp ? (Annuler pour Email)");
        if (choice) {
            const phone = WHATSAPP_TUNISIA; // ou laisser vide pour choisir le contact
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        } else {
            const subject = encodeURIComponent("Mon panier Cosy Boutique");
            const body = encodeURIComponent(text);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }
    }

    // ============================================================
    // 5. PANIER : CODES PROMOTIONNELS
    // ============================================================
    // Codes promo (exemple : à adapter)
    const PROMO_CODES = {
        'COSY10': { type: 'percent', value: 10 },
        'WELCOME5': { type: 'percent', value: 5 },
        'TUNISIA10': { type: 'percent', value: 10 }
    };

    let activePromo = null; // { code, type, value }

    // Sauvegarde dans localStorage
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
        // Calcul du sous-total
        const subtotalTND = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
        let subtotalUSD = cart.reduce((sum, it) => {
            const rate = (it.category === 'mariage') ? WEDDING_USD_RATE : USD_RATE;
            return sum + it.price * it.quantity * rate;
        }, 0);

        // Appliquer la promo (sur le sous-total TND et USD)
        let discountTND = 0;
        let discountUSD = 0;
        if (activePromo) {
            if (activePromo.type === 'percent') {
                discountTND = subtotalTND * (activePromo.value / 100);
                discountUSD = subtotalUSD * (activePromo.value / 100);
            }
        }

        const finalTND = subtotalTND - discountTND;
        const finalUSD = subtotalUSD - discountUSD;

        let totalDisplay = '';
        if (selectedCountry === 'tunisia') {
            const shipping = SHIPPING_TUNISIA_TND;
            const totalTND = finalTND + shipping;
            const totalUSD = finalUSD + shipping * USD_RATE;
            totalDisplay = `Total: ${totalTND.toFixed(2)} TND (${totalUSD.toFixed(2)} USD)`;
            if (discountTND > 0) {
                totalDisplay += ` <small style="color:var(--green-dark)">(-${discountTND.toFixed(2)} TND)</small>`;
            }
        } else if (selectedCountry === 'kinshasa') {
            totalDisplay = `Total: ${finalUSD.toFixed(2)} USD + frais de livraison`;
            if (discountUSD > 0) {
                totalDisplay += ` <small style="color:var(--green-dark)">(-${discountUSD.toFixed(2)} USD)</small>`;
            }
        } else {
            totalDisplay = `Total: ${finalTND.toFixed(2)} TND (${finalUSD.toFixed(2)} USD)`;
            if (discountTND > 0) {
                totalDisplay += ` <small style="color:var(--green-dark)">(-${discountTND.toFixed(2)} TND)</small>`;
            }
        }

        document.getElementById('cartTotalDisplay').innerHTML = totalDisplay;
    };

    // ============================================================
    // 6. LOGIQUE DE NAVIGATION PAR STYLE (déjà géré par univers.js)
    // ============================================================
    // univers.js gère déjà le clic sur les cartes de style et met à jour state.style puis updateGrid.
    // On n'a rien à faire de plus, mais on s'assure que le scroll se fait bien.
    // On peut ajouter un scroll automatique après le clic sur une carte de style.
    // (déjà fait dans univers.js avec scrollToGrid())

    // ============================================================
    // INITIALISATION : rafraîchir l'affichage du panier
    // ============================================================
    setTimeout(() => {
        if (typeof updateTotals === 'function') updateTotals();
        // Restaurer le code promo dans le champ si présent
        if (activePromo) {
            const input = document.getElementById('promoCodeInput');
            const msg = document.getElementById('promoMessage');
            if (input) input.value = activePromo.code;
            if (msg) {
                msg.textContent = `Code "${activePromo.code}" appliqué : -${activePromo.value}%`;
                msg.className = 'promo-message success';
            }
        }
    }, 500);

})();