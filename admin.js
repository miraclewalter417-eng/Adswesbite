/*
    MaxSale Admin Dashboard — Script v4.0
    Full tab navigation, live stats, inventory management
*/

// ── Auth Guard Removed ────────────────────────────────────────

// ── DOM refs ──────────────────────────────────────────────────
const sidebar        = document.getElementById('sidebar');
const sidebarToggle  = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const adminSearch    = document.getElementById('admin-search');

// ── Toast ─────────────────────────────────────────────────────
function showAdminToast(msg, type = 'success') {
    const toast = document.getElementById('admin-toast');
    toast.className = `admin-toast show ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
    setTimeout(() => toast.className = 'admin-toast', 3000);
}

// ── Sidebar (Mobile) ──────────────────────────────────────────
function openSidebar()  { sidebar.classList.add('active'); sidebarOverlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('active'); sidebarOverlay.classList.remove('active'); }

if (sidebarToggle) sidebarToggle.addEventListener('click', () => sidebar.classList.contains('active') ? closeSidebar() : openSidebar());
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// ── Tab Navigation ────────────────────────────────────────────
const navItems = document.querySelectorAll('.sidebar-nav li[data-tab]');

window.switchTab = function(tabName) {
    // Deactivate all
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    navItems.forEach(li => li.classList.remove('active'));

    // Activate target
    const target = document.getElementById(`tab-${tabName}`);
    if (target) target.classList.add('active');

    const navItem = document.querySelector(`.sidebar-nav li[data-tab="${tabName}"]`);
    if (navItem) navItem.classList.add('active');

    if (window.innerWidth <= 768) closeSidebar();
};

navItems.forEach(li => {
    li.addEventListener('click', (e) => {
        const tab = li.dataset.tab;
        if (tab) { e.preventDefault(); switchTab(tab); }
    });
});

// ── Greeting ──────────────────────────────────────────────────
const greetingEl = document.getElementById('greeting-heading');
const adminNameEl = document.getElementById('admin-name');
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const adminName   = currentUser.username ? currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1) : 'Admin';

if (adminNameEl) adminNameEl.textContent = adminName;
if (greetingEl) {
    const h = new Date().getHours();
    const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    greetingEl.textContent = `${greet}, ${adminName}! 👋`;
}

// ── Notifications ─────────────────────────────────────────────
const notifBtn      = document.getElementById('notif-btn');
const notifDropdown = document.getElementById('notif-dropdown');
const notifBadge    = document.getElementById('notif-badge');

if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('open');
        if (notifBadge) notifBadge.style.display = 'none';
    });
    document.addEventListener('click', () => notifDropdown.classList.remove('open'));
}

// ── Exit Dashboard ────────────────────────────────────────────
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Exit from the admin dashboard?')) {
        window.location.href = 'index.html';
    }
});

// ── Live Stats ────────────────────────────────────────────────
async function updateDashboardStats() {
    const users       = JSON.parse(localStorage.getItem('users') || '[]');
    const suggestions = JSON.parse(localStorage.getItem('gadget_suggestions_db') || '[]');
    const cart        = JSON.parse(localStorage.getItem('maxsale_cart') || '[]');

    const el = (id) => document.getElementById(id);
    if (el('stat-users'))       animateCount(el('stat-users'), users.length);
    if (el('stat-suggestions')) animateCount(el('stat-suggestions'), suggestions.length);
    if (el('stat-orders'))      animateCount(el('stat-orders'), cart.length);

    // Badge on sidebar
    const sugBadge = document.getElementById('sug-badge');
    if (sugBadge) sugBadge.textContent = suggestions.length;

    if (window.GadgetAPI) {
        const items = await window.GadgetAPI.getItems();
        if (el('stat-listings')) animateCount(el('stat-listings'), items.length);
        if (el('inv-count')) el('inv-count').textContent = `(${items.length} total)`;
    }
}

function animateCount(el, target) {
    const start = parseInt(el.textContent.replace(/\D/g, '')) || 0;
    const diff  = target - start;
    const steps = 20;
    let step = 0;
    const timer = setInterval(() => {
        step++;
        el.textContent = Math.round(start + (diff * step / steps)).toLocaleString();
        if (step >= steps) clearInterval(timer);
    }, 30);
}

// ── Load Full Inventory Table ─────────────────────────────────
let allItems = [];

async function loadAdminAccessories() {
    const tbody = document.getElementById('admin-items-table');
    const recentTbody = document.getElementById('recent-items-table');
    if (!tbody || !window.GadgetAPI) return;

    try {
        allItems = await window.GadgetAPI.getItems();
        renderInventoryTable(allItems, tbody);

        // Render 5 recent items on dashboard tab
        if (recentTbody) renderRecentTable(allItems.slice(0, 8), recentTbody);

        if (document.getElementById('inv-count')) {
            document.getElementById('inv-count').textContent = `(${allItems.length} total)`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="error-cell">Failed to load inventory.</td></tr>`;
    }
}

function renderInventoryTable(items, tbody) {
    if (!tbody) return;
    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No products match your filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = items.map(item => {
        const typeColor = item.type === 'Buy' ? '#DC2626' : item.type === 'Sell' ? '#16A34A' : '#F59E0B';
        const isSold = item.isSoldOut === true;
        
        return `
        <tr class="${isSold ? 'row-sold-out' : ''}">
            <td><img src="${item.image || ''}" alt="" class="item-preview-img" onerror="this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&q=60'"></td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <strong class="item-name">${item.title}</strong>
                    ${isSold ? '<span class="sold-badge">SOLD</span>' : ''}
                </div>
                <div class="item-sub">${item.description ? item.description.substring(0, 45) + '...' : ''}</div>
            </td>
            <td><span class="chip">${item.category}</span></td>
            <td class="price-cell">${item.price}</td>
            <td><span class="badge-type" style="background:${typeColor}20; color:${typeColor}; border:1px solid ${typeColor}40;">${item.type}</span></td>
            <td><span class="badge-cond">${item.condition}</span></td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="btn-icon-toggle" onclick="openEditModal(${item.id})" title="Edit Product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-toggle ${isSold ? 'active' : ''}" 
                            onclick="toggleSold(${item.id})" 
                            title="${isSold ? 'Mark as Available' : 'Mark as Sold Out'}">
                        <i class="fas fa-${isSold ? 'undo' : 'tag'}"></i>
                    </button>
                    <button class="btn-icon-del" onclick="deleteItem(${item.id})" title="Delete Product">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function renderRecentTable(items, tbody) {
    tbody.innerHTML = items.map(item => {
        const typeColor = item.type === 'Buy' ? '#DC2626' : item.type === 'Sell' ? '#16A34A' : '#F59E0B';
        return `
        <tr>
            <td><div style="display:flex; align-items:center; gap:10px;">
                <img src="${item.image}" style="width:38px; height:38px; object-fit:cover; border-radius:8px;" onerror="this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&q=60'">
                <div>
                    <strong>${item.title}</strong>
                    ${item.isSoldOut ? '<br><small style="color:#DC2626; font-weight:700;">SOLD OUT</small>' : ''}
                </div>
            </div></td>
            <td><span class="chip">${item.category}</span></td>
            <td class="price-cell">${item.price}</td>
            <td><span class="badge-type" style="background:${typeColor}20; color:${typeColor}; border:1px solid ${typeColor}40;">${item.type}</span></td>
            <td><span class="badge-cond">${item.condition}</span></td>
        </tr>`;
    }).join('');
}

// ── Toggle Sold Status ────────────────────────────────────────
window.toggleSold = async function(id) {
    try {
        const updatedItem = await window.GadgetAPI.toggleSoldStatus(id);
        const statusMsg = updatedItem.isSoldOut ? 'marked as Sold Out' : 'marked as Available';
        showAdminToast(`Product ${statusMsg}!`);
        logActivity('Status Updated', `"${updatedItem.title}" ${statusMsg}`, 'tag', updatedItem.isSoldOut ? '#DC2626' : '#16A34A');
        loadAdminAccessories();
        updateDashboardStats();
    } catch (err) {
        showAdminToast('Failed to update status.', 'error');
    }
};

// ── Inventory Search + Filter ─────────────────────────────────
const invSearch  = document.getElementById('inv-search');
const catFilter  = document.getElementById('inv-category-filter');

function filterInventory() {
    const q   = (invSearch?.value || '').toLowerCase();
    const cat = catFilter?.value || '';
    let filtered = allItems.filter(item =>
        (!q || item.title.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)) &&
        (!cat || item.category === cat)
    );
    renderInventoryTable(filtered, document.getElementById('admin-items-table'));
    if (document.getElementById('inv-count'))
        document.getElementById('inv-count').textContent = `(${filtered.length} of ${allItems.length})`;
}

invSearch?.addEventListener('input', filterInventory);
catFilter?.addEventListener('change', filterInventory);

// Top-bar search shortcuts to inventory tab
adminSearch?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    if (q.length > 1) {
        switchTab('inventory');
        if (invSearch) { invSearch.value = q; filterInventory(); }
    }
});

// ── Delete Item ───────────────────────────────────────────────
window.deleteItem = async function(id) {
    if (!confirm('Permanently delete this product from the catalog?')) return;
    try {
        const item = allItems.find(i => i.id === id);
        await window.GadgetAPI.deleteItem(id);
        showAdminToast('Product deleted successfully!');
        logActivity('Product Deleted', `"${item?.title || 'Unknown'}" removed from catalog`, 'trash-alt', '#DC2626');
        loadAdminAccessories();
        updateDashboardStats();
    } catch (err) {
        showAdminToast('Failed to delete product.', 'error');
    }
};

// ── Load Suggestions ──────────────────────────────────────────
async function loadAdminSuggestions() {
    const tbody = document.getElementById('admin-suggestions-table');
    if (!tbody || !window.GadgetAPI) return;

    try {
        const suggestions = await window.GadgetAPI.getSuggestions();
        const sugBadge = document.getElementById('sug-badge');
        if (sugBadge) sugBadge.textContent = suggestions.length;

        if (suggestions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-cell">No suggestions yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = [...suggestions].reverse().map((sug, i) => {
            const date = new Date(sug.date).toLocaleDateString('en-NG');
            return `
            <tr>
                <td>${date}</td>
                <td><strong>${sug.product}</strong></td>
                <td><span class="chip">${sug.type}</span></td>
                <td><span class="status-badge pending">Under Review</span></td>
                <td>
                    <button class="btn-link" onclick="approveSuggestion('${sug.product}', '${sug.type}')">
                        <i class="fas fa-check"></i> Add to Catalog
                    </button>
                </td>
            </tr>`;
        }).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" class="error-cell">Failed to load suggestions.</td></tr>`;
    }
}

window.approveSuggestion = async function(product, type) {
    // Open Add Modal and pre-fill
    openAddModal();
    document.getElementById('add-title').value = product;
    document.getElementById('add-category').value = 'Accessories'; // Default
    document.getElementById('add-type').value = type;
    showAdminToast('Pre-filled from suggestion. Add details and save.');
    logActivity('Reviewing Suggestion', `Processing "${product}"`, 'lightbulb', '#F59E0B');
};

// ── Load Orders ───────────────────────────────────────────────
async function loadOrders() {
    const tbody = document.getElementById('orders-table');
    if (!tbody) return;

    try {
        // In this local-storage version, we'll fetch from 'maxsale_orders'
        const orders = JSON.parse(localStorage.getItem('maxsale_orders') || '[]');
        
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-cell"><i class="fas fa-inbox" style="font-size:2rem; color:#E5E7EB; display:block; margin-bottom:8px;"></i>No orders yet.<br><small>Orders appear here when customers checkout via WhatsApp.</small></td></tr>`;
            return;
        }

        tbody.innerHTML = orders.reverse().map(order => `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${order.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}</td>
                <td style="font-weight:700; color:var(--primary);">${order.total}</td>
                <td><span class="status-badge success">Completed</span></td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" class="error-cell">Failed to load orders.</td></tr>`;
    }
}

window.clearActivity = function() {
    if (!confirm('Clear all recent activity logs?')) return;
    localStorage.removeItem('maxsale_activity_log');
    renderActivityLog();
    showAdminToast('Activity log cleared.');
};

// ── Add Item Modal ────────────────────────────────────────────
const addItemModal = document.getElementById('add-item-modal');

function openAddModal() { addItemModal.style.display = 'flex'; }
function closeAddModal() { addItemModal.style.display = 'none'; document.getElementById('add-item-form').reset(); }

document.getElementById('add-item-btn')?.addEventListener('click', openAddModal);
document.getElementById('add-item-btn-2')?.addEventListener('click', openAddModal);
document.getElementById('close-add-modal')?.addEventListener('click', closeAddModal);
document.getElementById('cancel-add-modal')?.addEventListener('click', closeAddModal);

// Close on overlay click
addItemModal?.addEventListener('click', (e) => { if (e.target === addItemModal) closeAddModal(); });

// ── Image Upload Handling ─────────────────────────────────────
const imgFileInput = document.getElementById('add-image-file');
const imgPreview    = document.getElementById('image-upload-preview');
const previewImg    = document.getElementById('preview-img');
const clearUpload   = document.getElementById('clear-upload');
const imgUrlInput   = document.getElementById('add-image');

imgFileInput?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewImg.src = event.target.result;
            imgPreview.style.display = 'block';
            imgUrlInput.value = ''; // Clear URL if file is chosen
            imgUrlInput.disabled = true;
        };
        reader.readAsDataURL(file);
    }
});

clearUpload?.addEventListener('click', () => {
    imgFileInput.value = '';
    imgPreview.style.display = 'none';
    previewImg.src = '';
    imgUrlInput.disabled = false;
});

// Clear file if URL is typed
imgUrlInput?.addEventListener('input', () => {
    if (imgUrlInput.value) {
        imgFileInput.value = '';
        imgPreview.style.display = 'none';
        previewImg.src = '';
    }
});

document.getElementById('add-item-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const specsRaw = document.getElementById('add-specs').value;
    const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Added by Admin'];

    // Get Image (Priority: Uploaded File > URL > Default)
    let finalImage = imgUrlInput.value.trim();
    if (previewImg.src && previewImg.src.startsWith('data:image')) {
        finalImage = previewImg.src;
    }

    const newItem = {
        title:       document.getElementById('add-title').value.trim(),
        price:       document.getElementById('add-price').value.trim(),
        category:    document.getElementById('add-category').value,
        type:        document.getElementById('add-type').value,
        condition:   document.getElementById('add-condition').value,
        image:       finalImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
        description: document.getElementById('add-desc').value.trim() || 'Added via Admin Dashboard.',
        specs
    };

    try {
        const result = await window.GadgetAPI.createItem(newItem);
        closeAddModal();
        showAdminToast(`"${newItem.title}" added to catalog!`);
        logActivity('New Product', `"${newItem.title}" added to ${newItem.category}`, 'plus-circle', '#16A34A');
        
        // Reset image preview state
        if (clearUpload) clearUpload.click();
        
        loadAdminAccessories();
        updateDashboardStats();
    } catch (err) {
        showAdminToast('Failed to save product.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
    }
});

// ── Edit Item Modal ───────────────────────────────────────────
const editItemModal = document.getElementById('edit-item-modal');
const editForm      = document.getElementById('edit-item-form');

window.openEditModal = async function(id) {
    try {
        const item = await window.GadgetAPI.getItemById(id);
        if (!item) return;

        document.getElementById('edit-id').value = item.id;
        document.getElementById('edit-title').value = item.title;
        document.getElementById('edit-price').value = item.price;
        document.getElementById('edit-category').value = item.category;
        document.getElementById('edit-type').value = item.type;
        document.getElementById('edit-condition').value = item.condition || 'Brand New';
        document.getElementById('edit-image').value = item.image || '';
        document.getElementById('edit-desc').value = item.description || '';

        editItemModal.style.display = 'flex';
    } catch (err) {
        showAdminToast('Failed to load product details.', 'error');
    }
};

function closeEditModal() { editItemModal.style.display = 'none'; }
document.getElementById('close-edit-modal')?.addEventListener('click', closeEditModal);
document.getElementById('cancel-edit-modal')?.addEventListener('click', closeEditModal);
editItemModal?.addEventListener('click', (e) => { if (e.target === editItemModal) closeEditModal(); });

editForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('edit-id').value);
    const submitBtn = e.target.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    const updatedData = {
        title:       document.getElementById('edit-title').value.trim(),
        price:       document.getElementById('edit-price').value.trim(),
        category:    document.getElementById('edit-category').value,
        type:        document.getElementById('edit-type').value,
        condition:   document.getElementById('edit-condition').value,
        image:       document.getElementById('edit-image').value.trim(),
        description: document.getElementById('edit-desc').value.trim()
    };

    try {
        await window.GadgetAPI.updateItem(id, updatedData);
        showAdminToast('Product updated successfully!');
        logActivity('Product Edited', `"${updatedData.title}" details updated`, 'edit', '#3B82F6');
        closeEditModal();
        loadAdminAccessories();
    } catch (err) {
        showAdminToast('Failed to update product.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Update Product';
    }
});

// ── Settings & Profile ────────────────────────────────────────
window.saveSettings = function() {
    const name    = document.getElementById('settings-name')?.value;
    const role    = document.getElementById('settings-role')?.value;
    const avatar  = document.getElementById('settings-avatar')?.value;
    const wa      = document.getElementById('settings-wa')?.value;
    const store   = document.getElementById('settings-store')?.value;

    const settings = { name, role, avatar, wa, store };
    localStorage.setItem('maxsale_admin_profile', JSON.stringify(settings));
    
    // Update UI immediately
    applyProfileSettings(settings);
    showAdminToast('Profile & settings updated!');
    logActivity('Profile Updated', 'Admin profile details changed', 'user-cog', '#3B82F6');
};

function applyProfileSettings(s) {
    if (!s) return;
    if (document.getElementById('admin-name')) document.getElementById('admin-name').textContent = s.name || 'Admin';
    if (document.querySelector('.admin-info span')) document.querySelector('.admin-info span').textContent = s.role || 'Super Admin';
    if (document.querySelector('.admin-profile img')) {
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name || 'Admin')}&background=DC2626&color=fff&bold=true`;
        document.querySelector('.admin-profile img').src = s.avatar || defaultAvatar;
    }
    if (document.getElementById('greeting-heading')) {
        const h = new Date().getHours();
        const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
        document.getElementById('greeting-heading').textContent = `${greet}, ${s.name || 'Admin'}! 👋`;
    }
}

function loadSettings() {
    const s = JSON.parse(localStorage.getItem('maxsale_admin_profile'));
    if (s) {
        if (document.getElementById('settings-name'))   document.getElementById('settings-name').value = s.name || '';
        if (document.getElementById('settings-role'))   document.getElementById('settings-role').value = s.role || '';
        if (document.getElementById('settings-avatar')) document.getElementById('settings-avatar').value = s.avatar || '';
        if (document.getElementById('settings-wa'))     document.getElementById('settings-wa').value = s.wa || '';
        if (document.getElementById('settings-store'))  document.getElementById('settings-store').value = s.store || '';
        applyProfileSettings(s);
    }
}

window.resetCatalog = function() {
    if (!confirm('This will clear ALL custom products and restore the default catalog. Are you sure?')) return;
    localStorage.removeItem('gadget_accessories_db');
    localStorage.removeItem('maxsale_catalog_version');
    showAdminToast('Catalog reset! Refresh to reload defaults.');
    setTimeout(() => location.reload(), 1500);
};

// ── Activity Log ──────────────────────────────────────────────
function logActivity(action, details, icon = 'info-circle', color = 'var(--primary)') {
    const log = JSON.parse(localStorage.getItem('maxsale_activity_log') || '[]');
    log.unshift({ action, details, icon, color, time: new Date().toISOString() });
    localStorage.setItem('maxsale_activity_log', JSON.stringify(log.slice(0, 10)));
    renderActivityLog();
}

function renderActivityLog() {
    const container = document.getElementById('activity-log');
    if (!container) return;
    const log = JSON.parse(localStorage.getItem('maxsale_activity_log') || '[]');
    
    if (log.length === 0) {
        container.innerHTML = '<p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">No recent activity.</p>';
        return;
    }

    container.innerHTML = log.map(item => {
        const time = new Date(item.time);
        const diff = Math.floor((new Date() - time) / 60000);
        const timeStr = diff < 1 ? 'Just now' : diff < 60 ? `${diff}m ago` : `${Math.floor(diff/60)}h ago`;
        
        return `
        <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:32px; height:32px; border-radius:8px; background:${item.color}15; color:${item.color}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i class="fas fa-${item.icon}" style="font-size:0.8rem;"></i>
            </div>
            <div style="flex:1;">
                <p style="font-size:0.8rem; font-weight:600; margin:0; color:var(--text-main);">${item.action}</p>
                <p style="font-size:0.7rem; color:var(--text-muted); margin:0;">${item.details}</p>
            </div>
            <span style="font-size:0.65rem; color:var(--text-muted);">${timeStr}</span>
        </div>`;
    }).join('');
}

// ── Export CSV ────────────────────────────────────────────────
window.exportCSV = function() {
    if (allItems.length === 0) return showAdminToast('Nothing to export!', 'error');
    
    const headers = ['ID', 'Title', 'Category', 'Price', 'Type', 'Condition', 'Sold Out'];
    const rows = allItems.map(i => [i.id, i.title, i.category, i.price, i.type, i.condition, i.isSoldOut]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "maxsale_inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAdminToast('Inventory exported to CSV!');
    logActivity('Exported Data', 'Inventory CSV downloaded', 'file-csv', '#16A34A');
};

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateDashboardStats();
    loadAdminAccessories();
    loadAdminSuggestions();
    loadOrders();
    renderActivityLog();
    
    // Quick add button
    document.getElementById('add-item-btn-quick')?.addEventListener('click', openAddModal);

    // Sidebar Toggle Mobile
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        sidebar?.classList.toggle('active');
        overlay?.classList.toggle('active');
    };

    toggle?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);

    // Initial log if empty
    const existing = localStorage.getItem('maxsale_activity_log');
    if (!existing) {
        logActivity('System Startup', 'Dashboard initialized successfully', 'power-off', '#16A34A');
    }
});
