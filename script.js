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

    // Hide suggestions on click outside
    document.addEventListener('click', (e) => {
        if (suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
});

let allProducts = [];

// ── API Integration ───────────────────────────────────────────
async function loadAccessories() {
    const container = document.getElementById('api-gigs-container');
    if (!container) return;

    try {
        allProducts = await window.GadgetAPI.getItems();
        renderProducts(allProducts);
    } catch (err) {
        container.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1 / -1;">Failed to load accessories from API.</p>`;
        console.error("API Error:", err);
    }
}

function filterAndRenderProducts(query) {
    const filtered = allProducts.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        (item.specs && item.specs.some(s => s.toLowerCase().includes(query)))
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
    if (!container) return;

    container.innerHTML = ''; // Clear container

    if (items.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #E5E7EB; margin-bottom: 20px;"></i>
                <h3 style="color: var(--text-main);">No products found</h3>
                <p style="color: var(--text-muted);">Try a different search term or browse our categories.</p>
            </div>
        `;
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'solution-card animate-fade-up';
        card.style.animationDelay = `${index * 0.05}s`;
        
        // Define tag color based on type
        let tagColor = '#DC2626'; // Default red
        if (item.type === 'Swap') tagColor = '#f59e0b';
        if (item.type === 'Sell') tagColor = '#16A34A';

        const imageUrl = item.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80';

        card.innerHTML = `
            <div style="position:absolute; top:20px; right:20px; background:${tagColor}; color:white; padding:4px 10px; border-radius:8px; font-size:0.8rem; font-weight:bold; z-index:2;">${item.type}</div>
            <div class="card-image"><img src="${imageUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" onerror="this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'"></div>
            <h3 style="margin-top:15px; font-size:1.2rem;">${item.title}</h3>
            <p style="margin-bottom: 12px; font-size:0.9rem;">${item.description}</p>
            <div style="margin-bottom: 15px; text-align: left;">
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 6px;">
                    ${item.specs ? item.specs.map(spec => `<li style="font-size:0.7rem; background:rgba(0,0,0,0.04); padding:3px 8px; border-radius:4px; color:var(--text-muted); border: 1px solid rgba(0,0,0,0.05);"><i class="fas fa-check" style="font-size:0.6rem; margin-right:4px; color:var(--secondary);"></i>${spec}</li>`).join('') : ''}
                </ul>
            </div>
            <div style="margin-bottom: 16px;">
                <span style="font-size:0.75rem; background:#E5E7EB; color:#4B5563; padding:4px 8px; border-radius:4px; font-weight:600;">Condition: ${item.condition}</span>
            </div>
            <span class="price-tag" style="color:var(--primary); font-size:1.4rem;">${item.price}</span>
        `;
        
        container.appendChild(card);
        
        // Ensure new cards are animated if they are in view
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
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
