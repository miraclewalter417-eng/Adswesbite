/**
 * GadgetSwap - Mock API & Database
 * Simulates a real backend API and database using IndexedDB/localStorage.
 */

const DB_KEY = 'gadget_accessories_db';
const DB_SUGGESTIONS_KEY = 'gadget_suggestions_db';

// Initial Seed Data
const latestItems = [
    // CURRENT PRODUCTS
    { id: 1, title: 'iPhone 15 Pro Max', description: 'Natural Titanium, 512GB. Unbeatable camera and performance.', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80', price: '₦2,150,000', type: 'Buy', condition: 'Brand New', specs: ['A17 Pro Chip', '6.7" OLED', '48MP Main Camera'] },
    { id: 2, title: 'MacBook Pro 16" (M3 Max)', description: 'Space Black. 64GB RAM, 2TB SSD. For elite pros.', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80', price: '₦5,200,000', type: 'Sell', condition: 'Brand New', specs: ['M3 Max Chip', '16.2" Liquid Retina', '22h Battery'] },
    { id: 3, title: 'Samsung Galaxy S24 Ultra', description: 'Titanium Gray, 256GB. The ultimate AI phone.', image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&w=400&q=80', price: '₦1,850,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 8 Gen 3', '200MP Camera', 'S-Pen Included'] },
    { id: 4, title: 'PlayStation 5 Slim', description: '1TB Digital Edition. Compact power for gamers.', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80', price: '₦750,000', type: 'Sell', condition: 'Brand New', specs: ['1TB SSD', '4K Gaming', 'Ray Tracing'] },
    
    // OLD / LEGACY PRODUCTS
    { id: 5, title: 'iPhone 11 Pro', description: 'Midnight Green, 256GB. A classic powerhouse.', image: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=400&q=80', price: '₦450,000', type: 'Buy', condition: 'Used/Good', specs: ['A13 Bionic', '5.8" Super Retina', 'Triple 12MP System'] },
    { id: 6, title: 'MacBook Pro 15" (2015)', description: 'The legendary "Last of the Best". Core i7, 16GB RAM.', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80', price: '₦380,000', type: 'Sell', condition: 'Legacy/Refurb', specs: ['Intel Core i7', 'Retina Display', 'MagSafe 2'] },
    { id: 7, title: 'PlayStation 4 Pro', description: '1TB Jet Black. High-performance gaming on a budget.', image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80', price: '₦280,000', type: 'Buy', condition: 'Used', specs: ['4K Capability', 'Boost Mode', 'HDR Support'] },
    { id: 8, title: 'Samsung Galaxy S21 Ultra', description: 'Phantom Black. Still a camera beast in 2024.', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=400&q=80', price: '₦550,000', type: 'Buy', condition: 'Pre-owned', specs: ['Exynos 2100', '108MP Camera', '5000mAh Battery'] },
    
    // NICHES & ACCESSORIES
    { id: 9, title: 'Nintendo GameBoy Advance', description: 'Indigo Blue. Pure nostalgia for retro gamers.', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80', price: '₦120,000', type: 'Sell', condition: 'Collector/Vintage', specs: ['32-bit CPU', 'TFT Display', '2x AA Batteries'] },
    { id: 10, title: 'Sony WH-1000XM3', description: 'Legendary noise canceling. Better comfort than newer models.', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80', price: '₦180,000', type: 'Buy', condition: 'Used/Like New', specs: ['30h Battery', 'LDAC Support', 'USB-C Charging'] },
    { id: 11, title: 'iPad Air 4 (2020)', description: 'Sky Blue, 64GB. TouchID in top button.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80', price: '₦420,000', type: 'Buy', condition: 'Pre-owned', specs: ['A14 Bionic', '10.9" Liquid Retina', 'Apple Pencil 2 Support'] },
    { id: 12, title: 'AirPods Pro (1st Gen)', description: 'Solid noise cancellation for a fraction of the cost.', image: 'https://images.unsplash.com/photo-1588423770574-91023ad664e5?auto=format&fit=crop&w=400&q=80', price: '₦140,000', type: 'Sell', condition: 'Refurbished', specs: ['H1 Chip', 'ANC', 'Transparency Mode'] }
];

// Initialize Database
function initDB() {
    const storedData = localStorage.getItem(DB_KEY);
    if (!storedData) {
        localStorage.setItem(DB_KEY, JSON.stringify(latestItems));
        return;
    }

    const data = JSON.parse(storedData);
    // Force reset if:
    // 1. Data is empty
    // 2. First item lacks 'image' property (old format)
    // 3. Data is from the old 'eTrend' or 'GadgetSwap' (accessories-only) version
    const isOldFormat = data.length > 0 && !data[0].image;
    const isOldTitle = data.length > 0 && (data[0].title === 'Organic Growth' || data[0].title.includes('AirPods Pro (2nd Gen) Case'));
    const isLegacyList = data.length > 0 && !data.some(item => item.condition === 'Legacy/Refurb');

    if (isOldFormat || isOldTitle || isLegacyList) {
        console.log("MaxSale: Resetting database to latest version...");
        localStorage.setItem(DB_KEY, JSON.stringify(latestItems));
    }
}
initDB();

// Simulated API Delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
    /**
     * Get all items from the database
     */
    getItems: async () => {
        await delay(600); // Simulate network latency
        const data = localStorage.getItem(DB_KEY);
        return JSON.parse(data);
    },

    /**
     * Get a single item by ID
     */
    getItemById: async (id) => {
        await delay(400);
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        return data.find(item => item.id === id);
    },

    /**
     * Create a new listing
     */
    createItem: async (itemData) => {
        await delay(800);
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        const newItem = {
            id: Date.now(),
            ...itemData
        };
        data.push(newItem);
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        return newItem;
    },

    /**
     * Delete a listing
     */
    deleteItem: async (id) => {
        await delay(600);
        let data = JSON.parse(localStorage.getItem(DB_KEY));
        data = data.filter(item => item.id !== id);
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        return { success: true };
    },

    /**
     * Get all user suggestions
     */
    getSuggestions: async () => {
        await delay(500);
        const data = localStorage.getItem(DB_SUGGESTIONS_KEY);
        return JSON.parse(data || '[]');
    },

    /**
     * Create a new suggestion
     */
    createSuggestion: async (suggestionData) => {
        await delay(700);
        const data = JSON.parse(localStorage.getItem(DB_SUGGESTIONS_KEY) || '[]');
        const newSuggestion = {
            id: Date.now(),
            ...suggestionData,
            date: new Date().toISOString()
        };
        data.push(newSuggestion);
        localStorage.setItem(DB_SUGGESTIONS_KEY, JSON.stringify(data));
        return newSuggestion;
    }
};

window.GadgetAPI = api;
