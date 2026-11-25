/* ============================================================
   VARIANTES DE PRODUITS — À charger APRÈS modifications.js
   ============================================================ */
(function () {
    'use strict';

    // ============================================================
    // 1. CSS pour les pastilles et le produit variantes
    // ============================================================
    const css = document.createElement('style');
    css.textContent = `
        .product-card.has-variants .product-img {
            cursor: pointer;
        }
        .product-card.has-variants .variant-chip-active {
            position: absolute; bottom: 10px; left: 10px; z-index: 3;
            background: rgba(255,255,255,0.92); backdrop-filter: blur(4px);
            font-size: 11px; font-weight: 600; padding: 4px 10px;
            border-radius: 20px; color: var(--text-dark);
            box-shadow: var(--shadow-sm);
        }
        .variant-picker {
            display: flex; align-items: center; justify-content: center;
            gap: 8px; margin: 8px 0 2px;
            min-height: 28px;
        }
        .variant-dot {
            width: 22px; height: 22px; border-radius: 50%;
            border: 2px solid transparent; cursor: pointer;
            position: relative; transition: all 0.2s;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12);
        }
        .variant-dot:hover { transform: scale(1.15); }
        .variant-dot.selected {
            border-color: var(--text-dark);
            transform: scale(1.15);
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), 0 0 0 2px #fff inset;
        }
        .variant-dot.selected::after {
            content: ''; position: absolute; inset: 3px;
            border-radius: 50%;
            box-shadow: inset 0 0 0 1.5px #fff;
        }
        .variant-label {
            font-size: 12px; color: var(--text-light);
            text-align: center; min-height: 16px;
            font-weight: 500;
        }
        .variant-label strong { color: var(--text-dark); font-weight: 600; }
        @media (max-width: 480px) {
            .variant-dot { width: 18px; height: 18px; }
        }
    `;
    document.head.appendChild(css);

    // ============================================================
    // 2. Repérer les produits qui ont des variantes
    // ============================================================
    function hasVariants(p) {
        return Array.isArray(p.variants) && p.variants.length > 0;
    }

    // ============================================================
    // 3. Construire le bloc HTML des variantes pour une carte
    // ============================================================
    function buildVariantBlock(p) {
        if (!hasVariants(p)) return '';
        const dots = p.variants.map((v, i) => {
            const hex = v.colorHex || '#cccccc';
            return `<button class="variant-dot${i === 0 ? ' selected' : ''}"
                            data-variant-index="${i}"
                            data-variant-id="${v.id}"
                            title="${v.color}"
                            aria-label="${v.color}"
                            style="background:${hex};"></button>`;
        }).join('');
        const firstColor = p.variants[0].color || '';
        return `
            <div class="variant-picker" data-variant-picker="${p.id}">${dots}</div>
            <div class="variant-label" data-variant-label="${p.id}">
                Couleur : <strong>${firstColor}</strong>
            </div>
        `;
    }

    // ============================================================
    // 4. Enrichir une carte produit déjà affichée
    // ============================================================
    function enrichCard(card, p) {
        if (!hasVariants(p)) return;
        if (card.dataset.variantsEnriched === '1') return;

        card.classList.add('has-variants');
        card.dataset.productId = p.id;
        card.dataset.variantsEnriched = '1';

        const info = card.querySelector('.product-info');
        if (!info) return;

        // Insérer les pastilles avant le prix
        const priceEl = info.querySelector('.product-price');
        const block = document.createElement('div');
        block.innerHTML = buildVariantBlock(p);
        if (priceEl) priceEl.insertAdjacentElement('beforebegin', block);
        else info.appendChild(block);

        // Écouteurs sur les pastilles
        card.querySelectorAll('.variant-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(dot.dataset.variantIndex, 10);
                selectVariant(card, p, idx);
            });
        });

        // Mettre à jour les data-* du bouton ajouter au panier pour la 1ère variante
        syncAddButton(card, p, 0);
    }

    // ============================================================
    // 5. Sélectionner une variante (image + label + bouton panier)
    // ============================================================
    function selectVariant(card, p, idx) {
        const variant = p.variants[idx];
        if (!variant) return;

        // Pastilles
        card.querySelectorAll('.variant-dot').forEach((d, i) => {
            d.classList.toggle('selected', i === idx);
        });

        // Label couleur
        const labelEl = card.querySelector(`[data-variant-label="${p.id}"]`);
        if (labelEl) labelEl.innerHTML = `Couleur : <strong>${variant.color}</strong>`;

        // Image (crossfade doux)
        const imgEl = card.querySelector('.product-img img');
        if (imgEl && variant.image) {
            const newUrl = getImageUrl(variant.image, variant.localImage || p.localImage);
            if (imgEl.src !== newUrl) {
                imgEl.style.opacity = '0.4';
                imgEl.style.transition = 'opacity 0.25s ease';
                const pre = new Image();
                pre.onload = () => {
                    imgEl.src = newUrl;
                    imgEl.style.opacity = '1';
                };
                pre.onerror = () => {
                    imgEl.src = newUrl;
                    imgEl.style.opacity = '1';
                };
                pre.src = newUrl;
            }
        }

        // Bouton ajouter au panier
        syncAddButton(card, p, idx);
    }

    // ============================================================
    // 6. Mettre à jour les data-* du bouton "Ajouter au panier"
    // ============================================================
    function syncAddButton(card, p, idx) {
        const variant = p.variants[idx];
        const btn = card.querySelector('.btn-add[data-add-id]');
        if (!btn || !variant) return;

        const variantId = variant.id;
        const variantName = `${p.name} — ${variant.color}`;

        btn.dataset.addId = variantId;
        btn.dataset.addName = variantName.replace(/"/g, '&quot;');
        btn.dataset.addPrice = p.price;
        btn.dataset.addCategory = Array.isArray(p.category) ? p.category[0] : p.category;
    }

    // ============================================================
    // 7. Observer : enrichir les cartes dès qu'elles apparaissent
    // ============================================================
    function getProductById(id) {
        if (typeof PRODUCTS === 'undefined') return null;
        return PRODUCTS.find(p => p.id === id) || null;
    }

    function enrichAllVisibleCards() {
        // On parcourt toutes les cartes produit déjà présentes
        document.querySelectorAll('.product-card').forEach(card => {
            if (card.dataset.variantsEnriched === '1') return;

            // Comment retrouver le produit ? Par le bouton "Ajouter au panier"
            const btn = card.querySelector('.btn-add[data-add-id]');
            if (!btn) return;

            const addId = btn.dataset.addId;

            // Trouver le produit parent à partir d'une variante possible
            let parent = null;
            if (typeof PRODUCTS !== 'undefined') {
                parent = PRODUCTS.find(p =>
                    p.id === addId ||
                    (Array.isArray(p.variants) && p.variants.some(v => v.id === addId))
                );
            }
            if (!parent || !hasVariants(parent)) return;

            // Trouver l'index de la variante correspondant au bouton actuel
            let idx = 0;
            if (parent.id !== addId) {
                idx = parent.variants.findIndex(v => v.id === addId);
                if (idx < 0) idx = 0;
            }

            enrichCard(card, parent);

            // Si le bouton pointait déjà sur une variante précise, on sélectionne celle-ci
            if (parent.id !== addId) {
                selectVariant(card, parent, idx);
            }
        });
    }

    // Lancer au chargement
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(enrichAllVisibleCards, 600);
    });

    // Relancer à chaque modification de grille (boutique, univers, collections)
    const obs = new MutationObserver(() => {
        // debounce
        clearTimeout(window.__variantEnrichTimer);
        window.__variantEnrichTimer = setTimeout(enrichAllVisibleCards, 150);
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // Écouter les appels de displayProducts et updateGrid pour ré-enrichir
    if (typeof displayProducts === 'function') {
        const _dp = displayProducts;
        displayProducts = function (cat) {
            _dp(cat);
            setTimeout(enrichAllVisibleCards, 200);
        };
    }
    if (typeof updateGrid === 'function') {
        const _ug = updateGrid;
        updateGrid = function () {
            _ug();
            setTimeout(enrichAllVisibleCards, 200);
        };
    }
    /* ============================================================
   GALERIE ANGLES — version minimale
   ============================================================ */
(function attachGallery() {
    const init = () => {
        document.querySelectorAll('.product-card').forEach(card => {
            if (card.dataset.gallery === '1') return;

            const btn = card.querySelector('.btn-add[data-add-id]');
            if (!btn) return;

            const p = (typeof PRODUCTS !== 'undefined')
                ? PRODUCTS.find(x => x.id === btn.dataset.addId)
                : null;
            if (!p || !Array.isArray(p.images) || p.images.length < 2) return;

            const imgWrap = card.querySelector('.product-img');
            const imgEl = imgWrap && imgWrap.querySelector('img');
            if (!imgEl) return;

            card.dataset.gallery = '1';
            let idx = 0;
            const total = p.images.length;

            imgWrap.style.position = 'relative';

            const counter = document.createElement('span');
            counter.textContent = `1/${total}`;
            Object.assign(counter.style, {
                position: 'absolute', top: '8px', right: '8px',
                background: 'rgba(0,0,0,.55)', color: '#fff',
                fontSize: '11px', fontWeight: '600',
                padding: '2px 8px', borderRadius: '20px',
                zIndex: 3, pointerEvents: 'none'
            });
            imgWrap.appendChild(counter);

            const goTo = (i) => {
                idx = ((i % total) + total) % total;
                const url = getImageUrl(p.images[idx], p.localImage);
                imgEl.style.opacity = '0.4';
                const pre = new Image();
                pre.onload = () => { imgEl.src = url; imgEl.style.opacity = '1'; };
                pre.onerror = () => { imgEl.src = url; imgEl.style.opacity = '1'; };
                pre.src = url;
                counter.textContent = `${idx + 1}/${total}`;
                [...dots.children].forEach((el, k) => {
                    el.style.background = k === idx ? '#b56576' : 'rgba(255,255,255,.9)';
                });
            };

            const dots = document.createElement('div');
            Object.assign(dots.style, {
                position: 'absolute', bottom: '8px', left: '50%',
                transform: 'translateX(-50%)', display: 'flex',
                gap: '4px', zIndex: 3
            });
            for (let i = 0; i < total; i++) {
                const d = document.createElement('span');
                Object.assign(d.style, {
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: i === 0 ? '#b56576' : 'rgba(255,255,255,.9)',
                    cursor: 'pointer'
                });
                d.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goTo(i);
                });
                dots.appendChild(d);
            }
            imgWrap.appendChild(dots);

            let sx = null;
            imgWrap.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) sx = e.touches[0].clientX;
            }, { passive: true });
            imgWrap.addEventListener('touchend', (e) => {
                if (sx == null) return;
                const dx = e.changedTouches[0].clientX - sx;
                sx = null;
                if (Math.abs(dx) < 30) return;
                goTo(dx < 0 ? idx + 1 : idx - 1);
            });
        });
    };

    const obs = new MutationObserver(() => {
        clearTimeout(window.__galTimer);
        window.__galTimer = setTimeout(init, 120);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(init, 600);
})();
})();