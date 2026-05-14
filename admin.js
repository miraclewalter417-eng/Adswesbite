/*
    eTrend Gigs Admin Dashboard — Script v3.0
*/

// ── DOM Elements ──────────────────────────────────────────────
const sidebar        = document.querySelector('.sidebar');
const sidebarToggle  = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const navItems       = document.querySelectorAll('.sidebar-nav ul li');
const searchInput    = document.querySelector('.search-bar input');
const searchBar      = document.querySelector('.search-bar');
const notification   = document.querySelector('.notification');
const logoutBtn      = document.querySelector('.logout-btn');
const welcomeHeading = document.querySelector('.welcome-text h1');

// ── Sidebar Toggle (Mobile) ───────────────────────────────────
function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    sidebarToggle.querySelector('i').className = 'fas fa-times';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    sidebarToggle.querySelector('i').className = 'fas fa-bars';
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Close sidebar when a nav link is clicked on mobile
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (window.innerWidth <= 768) closeSidebar();
    });
});

// ── Search Bar Focus ──────────────────────────────────────────
if (searchInput && searchBar) {
    searchInput.addEventListener('focus', () => {
        searchBar.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)';
    });
    searchInput.addEventListener('blur', () => {
        searchBar.style.boxShadow = 'none';
    });
}

// ── Notifications ─────────────────────────────────────────────
if (notification) {
    notification.addEventListener('click', () => {
        const badge = notification.querySelector('.badge');
        if (badge) badge.style.display = 'none';
        alert('Notifications:\n1. New order from John Doe\n2. Payout requested by Mike Ross\n3. Maintenance scheduled tonight');
    });
}

// ── Dynamic Greeting ──────────────────────────────────────────
if (welcomeHeading) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const name = currentUser.username || 'Admin';
    const hour = new Date().getHours();
    let greeting = 'Welcome back';
    if (hour < 12)      greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else                greeting = 'Good evening';
    welcomeHeading.textContent = `${greeting}, ${name}! 👋`;
}

// ── Live User Count from localStorage ────────────────────────
function updateDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalUsersEl = document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-details h3');
    if (totalUsersEl) totalUsersEl.textContent = users.length.toLocaleString();
}
updateDashboardStats();

// ── Logout ────────────────────────────────────────────────────
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'auth.html';
        }
    });
}

// ── Admin Manage Accessories API Integration ────────────────────
async function loadAdminAccessories() {
    const tableBody = document.getElementById('admin-items-table');
    if (!tableBody || !window.GadgetAPI) return;

    try {
        const items = await window.GadgetAPI.getItems();
        tableBody.innerHTML = '';
        
        if (items.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No accessories found.</td></tr>';
            return;
        }

        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${item.id}</td>
                <td>
                    <strong>${item.title}</strong>
                    <div style="margin-top: 4px;">
                        <span style="font-size:0.75rem; background:#DC2626; color:white; padding:2px 6px; border-radius:4px;">${item.type}</span>
                        <span style="font-size:0.75rem; background:#E5E7EB; color:#4B5563; padding:2px 6px; border-radius:4px; margin-left:6px;">${item.condition}</span>
                    </div>
                </td>
                <td><img src="${item.image}" alt="Preview" style="width:50px; height:50px; object-fit:cover; border-radius:8px; border:1px solid var(--border);"></td>
                <td>${item.price}</td>
                <td>
                    <button class="btn-delete" onclick="deleteAccessory(${item.id})" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        tableBody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center;">Failed to load accessories.</td></tr>';
    }
}

window.deleteAccessory = async function(id) {
    if (!confirm('Are you sure you want to delete this accessory?')) return;
    
    const tableBody = document.getElementById('admin-items-table');
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Deleting...</td></tr>';
    
    try {
        await window.GadgetAPI.deleteItem(id);
        loadAdminAccessories();
    } catch (err) {
        alert('Failed to delete accessory.');
        loadAdminAccessories();
    }
};

async function loadAdminSuggestions() {
    const tableBody = document.getElementById('admin-suggestions-table');
    if (!tableBody || !window.GadgetAPI) return;

    try {
        const suggestions = await window.GadgetAPI.getSuggestions();
        tableBody.innerHTML = '';
        
        if (suggestions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No suggestions yet.</td></tr>';
            return;
        }

        suggestions.reverse().forEach(sug => {
            const date = new Date(sug.date).toLocaleDateString();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td><strong>${sug.product}</strong></td>
                <td><span style="font-size:0.8rem; background:rgba(0,0,0,0.05); padding:4px 8px; border-radius:4px;">${sug.type}</span></td>
                <td><span class="status pending" style="background: #fef9c3; color: #854d0e; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Under Review</span></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        tableBody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Failed to load suggestions.</td></tr>';
    }
}

// ── Add Item Logic ───────────────────────────────────────────
const addItemModal = document.getElementById('add-item-modal');
const addItemBtn   = document.getElementById('add-item-btn');
const closeAddModal = document.getElementById('close-add-modal');
const addItemForm  = document.getElementById('add-item-form');

if (addItemBtn && addItemModal) {
    addItemBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addItemModal.style.display = 'flex';
    });
}

if (closeAddModal) {
    closeAddModal.addEventListener('click', () => {
        addItemModal.style.display = 'none';
    });
}

if (addItemForm) {
    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = addItemForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const newItem = {
            title: document.getElementById('add-title').value,
            price: document.getElementById('add-price').value,
            category: document.getElementById('add-category').value,
            type: document.getElementById('add-type').value,
            image: document.getElementById('add-image').value,
            description: 'Manually added via Admin Dashboard.',
            condition: 'Brand New',
            specs: ['Added by Admin']
        };

        try {
            await window.GadgetAPI.createItem(newItem);
            addItemForm.reset();
            addItemModal.style.display = 'none';
            loadAdminAccessories();
            updateDashboardStats();
        } catch (err) {
            alert('Failed to add item.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Gadget';
        }
    });
}

function updateDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalUsersEl = document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-details h3');
    if (totalUsersEl) totalUsersEl.textContent = users.length.toLocaleString();

    // Update active listings count
    window.GadgetAPI.getItems().then(items => {
        const listingsEl = document.querySelector('.stats-grid .stat-card:nth-child(4) .stat-details h3');
        if (listingsEl) listingsEl.textContent = items.length.toLocaleString();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdminAccessories();
    loadAdminSuggestions();
    updateDashboardStats();
});
