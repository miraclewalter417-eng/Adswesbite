/*
    MaxSale — Main Site Script v3.0
*/

// ── Mobile Nav ────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const nav        = document.querySelector('.nav');
const navOverlay = document.getElementById('nav-overlay');

function openNav() {
    nav.classList.add('active');
    navOverlay.classList.add('active');
    menuToggle.querySelector('i').className = 'fas fa-times';
    document.body.style.overflow = 'hidden';
}

function closeNav() {
    nav.classList.remove('active');
    navOverlay.classList.remove('active');
    menuToggle.querySelector('i').className = 'fas fa-bars';
    document.body.style.overflow = '';
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.contains('active') ? closeNav() : openNav();
    });
}

if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
}

// Close nav on link click (mobile)
document.querySelectorAll('.nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeNav();
    });
});

// ── Header Scroll Effect ──────────────────────────────────────
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Scroll Animations (Intersection Observer) ─────────────────
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animate-fade-up').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)';
        el.dataset.delay = index * 80;
        scrollObserver.observe(el);
    });

    // Load API Data
    if (window.GadgetAPI) {
        loadAccessories();
    }

    // ── Hero Buttons ───────────────────────────────────────────
    const heroSwapBtn = document.getElementById('hero-swap-btn');
    const heroBrowseBtn = document.getElementById('hero-browse-btn');
    const productsSection = document.getElementById('api-gigs-container');

    if (heroSwapBtn) {
        heroSwapBtn.addEventListener('click', () => {
            // Activate the Swap filter tab if it exists
            const swapTab = document.querySelector('.category-tab[data-category="Smartphones"]');
            if (swapTab) swapTab.click();
            // Scroll to products
            productsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showToast('Browsing phones for Swap!', 'exchange-alt');
        });
    }

    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', () => {
            productsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Handle Suggestion Form
    const suggestionForm = document.getElementById('suggestion-form');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const product = document.getElementById('suggest-product').value;
            const type = document.getElementById('suggest-type').value;
            const btn = suggestionForm.querySelector('button');
            const message = document.getElementById('suggestion-message');

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                await window.GadgetAPI.createSuggestion({ product, type });
                suggestionForm.reset();
                suggestionForm.style.display = 'none';
                message.style.display = 'block';
            } catch (err) {
                alert('Something went wrong. Please try again.');
                btn.disabled = false;
                btn.textContent = 'Send Suggestion';
            }
        });
    }

    // Search Logic
    const searchInput = document.getElementById('product-search');
    const clearBtn = document.getElementById('clear-search');
    const suggestionsBox = document.getElementById('search-suggestions');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            // Toggle Clear Button
            clearBtn.style.display = query.length > 0 ? 'flex' : 'none';
            
            // Handle Suggestions
            if (query.length > 1) {
                showSuggestions(query);
            } else {
                suggestionsBox.style.display = 'none';
            }

            filterAndRenderProducts(query);
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length > 1) {
                suggestionsBox.style.display = 'block';
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            suggestionsBox.style.display = 'none';
            filterAndRenderProducts('');
            searchInput.focus();
        });
    }

    // Category Filtering Logic
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            filterByCategory(category);
        });
    });

    // ── Back to Top Logic ─────────────────────────────────────
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 300);
        }, { passive: true });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize Cart/Wishlist Counts from LocalStorage
    updateStatsDisplay();

    // Toast logic
    window.showToast = function(message, icon = 'check-circle') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Global Event Delegation for Cart & Wishlist
    document.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('.add-to-cart');
        if (cartBtn) {
            e.stopPropagation();
            const productId = cartBtn.dataset.id;
            addToCart(productId);
        }

        const heartBtn = e.target.closest('.header-icon i.far.fa-heart');
        if (heartBtn) {
            heartBtn.classList.replace('far', 'fas');
            heartBtn.style.color = 'var(--primary)';
            showToast('Added to Wishlist!', 'heart');
        }

        // Bottom Nav Logic
        const homeLink = e.target.closest('.bottom-nav-item i.fa-home')?.parentElement;
        if (homeLink) {
            e.preventDefault();
            resetFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const searchLink = e.target.closest('.bottom-nav-item i.fa-search')?.parentElement;
        if (searchLink) {
            e.preventDefault();
            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.focus();
                window.scrollTo({ top: searchInput.offsetTop - 100, behavior: 'smooth' });
            }
        }

        const swapLink = e.target.closest('.bottom-nav-item i.fa-exchange-alt')?.parentElement;
        if (swapLink) {
            e.preventDefault();
            filterByCategory('Smartphones');
            showToast('Showing phones for Swap', 'exchange-alt');
        }
    });
});

function updateStatsDisplay() {
    const cart = JSON.parse(localStorage.getItem('maxsale_cart') || '[]');
    const badge = document.querySelector('.badge-count');
    if (badge) badge.textContent = cart.length;
}

function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('maxsale_cart') || '[]');
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem('maxsale_cart', JSON.stringify(cart));
        updateStatsDisplay();
        showToast('Added to your bag!');
    } else {
        showToast('Item already in bag!', 'info-circle');
    }
}

let allProducts = [];
let activeCategory = 'All';

function filterByCategory(category) {
    activeCategory = category;
    const searchInput = document.getElementById('product-search');
    const query = searchInput.value.toLowerCase();
    
    let filtered = allProducts;
    
    // Filter by Category using explicit field
    if (category !== 'All') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    // Filter by Search Query
    if (query) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query) ||
            (item.specs && item.specs.some(s => s.toLowerCase().includes(query)))
        );
    }
    
    renderProducts(filtered);
}

// ── Skeleton Loader ───────────────────────────────────────────
function showSkeletons() {
    const container = document.getElementById('api-gigs-container');
    if (!container) return;
    
    container.innerHTML = Array(6).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
            <div class="skeleton skeleton-price"></div>
        </div>
    `).join('');
}

// ── Modal Logic ──────────────────────────────────────────────
const productModal = document.getElementById('product-modal');
const modalClose   = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

let currentModalItem = null;

function openProductModal(item) {
    if (!productModal) return;
    currentModalItem = item;

    const modalImg = document.getElementById('modal-image');
    modalImg.classList.remove('loaded');
    modalImg.src = item.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
    modalImg.onload = () => modalImg.classList.add('loaded');
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-description').textContent = item.description;
    document.getElementById('modal-condition').textContent = item.condition;
    document.getElementById('modal-price').textContent = item.price;
    
    const tag = document.getElementById('modal-tag');
    tag.textContent = item.type;
    tag.style.background = item.type === 'Swap' ? '#f59e0b' : (item.type === 'Sell' ? '#16A34A' : '#DC2626');

    // Specs
    const specsList = document.getElementById('modal-specs-list');
    specsList.innerHTML = item.specs ? item.specs.map(spec => `
        <li><i class="fas fa-check-circle"></i> ${spec}</li>
    `).join('') : '<li>No specifications provided</li>';

    // Show Modal
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalClose)   modalClose.addEventListener('click', closeProductModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeProductModal);

// Close on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductModal();
});

// Modal Add to Cart
const modalCartBtn = document.getElementById('modal-add-to-cart-btn');
if (modalCartBtn) {
    modalCartBtn.addEventListener('click', () => {
        if (currentModalItem) {
            addToCart(currentModalItem.id.toString());
            closeProductModal();
        }
    });
}

// ── API Integration ───────────────────────────────────────────
async function loadAccessories() {
    const container = document.getElementById('api-gigs-container');
    if (!container) return;

    showSkeletons(); // Show skeletons before loading

    try {
        allProducts = await window.GadgetAPI.getItems();
        setTimeout(() => {
            renderProducts(allProducts);
        }, 800); // Small delay to appreciate the skeleton smoothness
    } catch (err) {
        container.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1 / -1;">Failed to load accessories from API.</p>`;
        console.error("API Error:", err);
    }
}

function filterAndRenderProducts(query) {
    let filtered = allProducts;
    
    // Apply Category Filter using explicit field
    if (activeCategory !== 'All') {
        filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Apply Search
    const q = query.toLowerCase();
    filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        (item.specs && item.specs.some(s => s.toLowerCase().includes(q)))
    );
    
    renderProducts(filtered);
    
    const countDisplay = document.getElementById('search-count');
    if (countDisplay) {
        if (query === '') {
            countDisplay.textContent = 'Showing all products';
        } else {
            countDisplay.textContent = `Found ${filtered.length} product${filtered.length === 1 ? '' : 's'} matching "${query}"`;
        }
    }
}

function showSuggestions(query) {
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!suggestionsBox) return;

    const matches = allProducts.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 suggestions

    if (matches.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    suggestionsBox.innerHTML = matches.map(item => `
        <div class="suggestion-item" style="padding: 12px 20px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: var(--ease); border-bottom: 1px solid rgba(0,0,0,0.05);" data-title="${item.title}">
            <img src="${item.image}" alt="" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">${item.title}</div>
                <div style="font-size: 0.8rem; color: var(--primary); font-weight: 500;">${item.price}</div>
            </div>
            <i class="fas fa-chevron-right" style="font-size: 0.8rem; color: #D1D5DB;"></i>
        </div>
    `).join('');

    suggestionsBox.style.display = 'block';

    // Add click events to suggestions
    suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.dataset.title;
            const searchInput = document.getElementById('product-search');
            searchInput.value = title;
            suggestionsBox.style.display = 'none';
            filterAndRenderProducts(title.toLowerCase());
        });

        // Hover effect styling
        item.addEventListener('mouseenter', () => item.style.background = '#F9FAFB');
        item.addEventListener('mouseleave', () => item.style.background = 'white');
    });
}

function renderProducts(items) {
    const container = document.getElementById('api-gigs-container');
    const countDisplay = document.getElementById('search-count');
    if (!container) return;

    container.innerHTML = ''; // Clear container

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No gadgets found</h3>
                <p>Try adjusting your search or category filters.</p>
                <button class="btn btn-get-started" onclick="resetFilters()" style="margin-top:20px; padding:10px 25px;">Reset All Filters</button>
            </div>
        `;
        return;
    }

    if (countDisplay && activeCategory !== 'All') {
        countDisplay.textContent = `${items.length} ${activeCategory} found`;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'solution-card animate-fade-up';
        card.style.animationDelay = `${index * 0.05}s`;
        
        let tagColor = '#DC2626';
        if (item.type === 'Swap') tagColor = '#f59e0b';
        if (item.type === 'Sell') tagColor = '#16A34A';

        const imageUrl = item.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80';
        
        // Random rating for professional look
        const rating = (Math.random() * (5 - 4) + 4).toFixed(1);

        card.innerHTML = `
            <div style="position:absolute; top:20px; right:20px; background:${tagColor}; color:white; padding:4px 10px; border-radius:8px; font-size:0.8rem; font-weight:bold; z-index:2; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">${item.type}</div>
            <div class="card-image">
                <img src="${imageUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" 
                     onload="this.classList.add('loaded'); this.parentElement.classList.add('is-loaded')" 
                     onerror="this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'; this.classList.add('loaded'); this.parentElement.classList.add('is-loaded')">
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                <h3 style="font-size:1.1rem; margin:0; color: var(--text-main);">${item.title}</h3>
                <div style="font-size:0.8rem; color:#F59E0B; font-weight:700;"><i class="fas fa-star"></i> ${rating}</div>
            </div>
            
            <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                <span style="font-size:0.65rem; background:#E5E7EB; color:#4B5563; padding:2px 6px; border-radius:4px; font-weight:700; text-transform: uppercase;">${item.condition}</span>
                <span style="font-size:0.75rem; color:var(--text-muted); opacity: 0.8;">Verified Seller</span>
            </div>

            <p style="margin: 8px 0 12px; font-size:0.85rem; color:var(--text-muted); line-height: 1.5;">${item.description.substring(0, 60)}...</p>
            
            <div style="margin-bottom: 15px; text-align: left;">
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 6px;">
                    ${item.specs ? item.specs.slice(0, 2).map(spec => `<li style="font-size:0.65rem; background:rgba(0,0,0,0.03); padding:3px 8px; border-radius:4px; color:var(--text-muted); border: 1px solid rgba(0,0,0,0.05);"><i class="fas fa-check" style="font-size:0.55rem; color:var(--secondary); margin-right:3px;"></i>${spec}</li>`).join('') : ''}
                </ul>
            </div>
            
            <div style="display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:12px; border-top:1px solid rgba(0,0,0,0.05);">
                <span class="price-tag" style="color:var(--primary); font-size:1.35rem; font-weight:800;">${item.price}</span>
                <div style="display:flex; gap:8px;">
                    <button class="view-product-btn" data-id="${item.id}" title="View Details" style="background:#F3F4F6; color:var(--text-main); border:none; width:40px; height:40px; border-radius:12px; cursor:pointer; transition:var(--ease); display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-to-cart" data-id="${item.id}" title="Add to Bag" style="background:var(--primary); color:white; border:none; width:40px; height:40px; border-radius:12px; cursor:pointer; transition:var(--ease); display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        // View Details button opens modal
        card.querySelector('.view-product-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openProductModal(item);
        });

        // Card click (not on buttons) also opens modal
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart') && !e.target.closest('.view-product-btn')) {
                openProductModal(item);
            }
        });

        container.appendChild(card);
        
        // Trigger fade-in for new cards
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });
}

// ── Smooth Scroll ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Utility Functions ─────────────────────────────────────────
window.resetFilters = function() {
    const searchInput = document.getElementById('product-search');
    if (searchInput) searchInput.value = '';
    
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(t => t.classList.remove('active'));
    if (categoryTabs[0]) categoryTabs[0].classList.add('active');
    
    activeCategory = 'All';
    const countDisplay = document.getElementById('search-count');
    if (countDisplay) countDisplay.textContent = 'Showing all products';
    
    renderProducts(allProducts);
};
