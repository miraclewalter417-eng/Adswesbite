/**
 * MaxSale - Mock API & Massive Database v5.1
 * Clean catalog — unique images, no duplicates.
 */

const DB_KEY = 'gadget_accessories_db';
const DB_SUGGESTIONS_KEY = 'gadget_suggestions_db';

// Initial Seed Data (Massive Catalog 200+ Items)
const latestItems = [
    // --- SAMSUNG GALAXY S SERIES ---
    { id: 101, title: 'Samsung Galaxy S24 Ultra', category: 'Smartphones', description: 'Titanium Gray, 256GB. AI Flagship with S-Pen.', image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?auto=format&fit=crop&w=400&q=80', price: '₦1,850,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 8 Gen 3', '200MP Camera', 'AI Features'] },
    { id: 102, title: 'Samsung Galaxy S24+', category: 'Smartphones', description: 'Cobalt Violet, 256GB. Powerful and bright.', image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=400&q=80', price: '₦1,450,000', type: 'Buy', condition: 'Brand New', specs: ['Exynos 2400', '12GB RAM', '4900mAh'] },
    { id: 103, title: 'Samsung Galaxy S23 Ultra', category: 'Smartphones', description: 'Phantom Black. 200MP Zoom King.', image: 'https://images.unsplash.com/photo-1582571338987-60e54a4f2bac?auto=format&fit=crop&w=400&q=80', price: '₦1,150,000', type: 'Swap', condition: 'Like New', specs: ['Snapdragon 8 Gen 2', '200MP Zoom', 'S-Pen'] },
    { id: 104, title: 'Samsung Galaxy S22 Ultra', category: 'Smartphones', description: 'Burgundy. Integrated S-Pen classic.', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80', price: '₦680,000', type: 'Buy', condition: 'Pre-owned', specs: ['Snapdragon 8 Gen 1', '100x Zoom', '5000mAh'] },
    { id: 105, title: 'Samsung Galaxy S21 Ultra', category: 'Smartphones', description: 'Phantom Silver. Power meets precision.', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=400&q=80', price: '₦450,000', type: 'Buy', condition: 'Used', specs: ['Exynos 2100', '108MP Camera', '5000mAh'] },
    // --- SAMSUNG A SERIES ---
    { id: 106, title: 'Samsung Galaxy A05s', category: 'Smartphones', description: 'Silver. Essential everyday Samsung.', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80', price: '₦185,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 680', '50MP Camera', '5000mAh'] },
    { id: 107, title: 'Samsung Galaxy A15', category: 'Smartphones', description: 'Blue Black. Super AMOLED display.', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=400&q=80', price: '₦245,000', type: 'Buy', condition: 'Brand New', specs: ['Helio G99', '90Hz AMOLED', '5000mAh'] },
    { id: 108, title: 'Samsung Galaxy A25 5G', category: 'Smartphones', description: 'Blazing 5G speed. Exynos power.', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', price: '₦380,000', type: 'Buy', condition: 'Brand New', specs: ['Exynos 1280', '120Hz AMOLED', 'OIS Camera'] },
    { id: 109, title: 'Samsung Galaxy A35', category: 'Smartphones', description: 'Awesome Iceblue. IP67 Rated.', image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=400&q=80', price: '₦520,000', type: 'Buy', condition: 'Brand New', specs: ['Exynos 1380', 'IP67 Rating', '120Hz Refresh'] },
    { id: 110, title: 'Samsung Galaxy A55', category: 'Smartphones', description: 'Premium Metal Frame. Gorilla Glass.', image: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=400&q=80', price: '₦680,000', type: 'Swap', condition: 'Like New', specs: ['Exynos 1480', 'Gorilla Glass Victus+', 'AI Camera'] },
    { id: 111, title: 'Samsung Galaxy A73 5G', category: 'Smartphones', description: 'The last of A7x. OIS camera king.', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80', price: '₦420,000', type: 'Buy', condition: 'Used', specs: ['Snapdragon 778G', '108MP OIS', '5000mAh'] },
    // --- SAMSUNG Z & NOTE ---
    { id: 112, title: 'Samsung Galaxy Z Fold 6', category: 'Smartphones', description: 'Foldable powerhouse. Taskbar multitasking.', image: 'https://images.unsplash.com/photo-1650392301980-d667c4be514f?auto=format&fit=crop&w=400&q=80', price: '₦2,400,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 8 Gen 3', 'Dual AMOLED', 'Taskbar UI'] },
    { id: 113, title: 'Samsung Galaxy Z Flip 6', category: 'Smartphones', description: 'Mint. Fashion meets flagship.', image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=400&q=80', price: '₦1,200,000', type: 'Buy', condition: 'Brand New', specs: ['Vapor Chamber', '50MP Camera', 'Snapdragon 8 Gen 3'] },
    { id: 114, title: 'Samsung Galaxy Note 20 Ultra', category: 'Smartphones', description: 'Mystic Bronze. The S-Pen legend.', image: 'https://images.unsplash.com/photo-1603539947678-cd3954ed515d?auto=format&fit=crop&w=400&q=80', price: '₦380,000', type: 'Swap', condition: 'Used/Good', specs: ['108MP Cam', '120Hz Display', 'MicroSD Support'] },
    // --- INFINIX ---
    { id: 201, title: 'Infinix Note 40 Pro', category: 'Smartphones', description: 'Titan Gold. MagCharge & 100W Wired.', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80', price: '₦395,000', type: 'Buy', condition: 'Brand New', specs: ['100W Charging', 'MagCharge', '120Hz AMOLED'] },
    { id: 202, title: 'Infinix Hot 40 Pro', category: 'Smartphones', description: 'Budget gaming beast. 120Hz smooth.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80', price: '₦285,000', type: 'Buy', condition: 'Brand New', specs: ['Helio G99', '120Hz Display', '108MP Camera'] },
    { id: 203, title: 'Infinix Zero 30 5G', category: 'Smartphones', description: 'Rome Green. 4K 60fps selfie video.', image: 'https://images.unsplash.com/photo-1581993192873-ae43b64ca5eb?auto=format&fit=crop&w=400&q=80', price: '₦420,000', type: 'Swap', condition: 'Like New', specs: ['Dimensity 8020', '4K 60fps Video', '144Hz AMOLED'] },
    { id: 204, title: 'Infinix Smart 8', category: 'Smartphones', description: 'Crystal Green. Magic Ring notification.', image: 'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?auto=format&fit=crop&w=400&q=80', price: '₦125,000', type: 'Buy', condition: 'Brand New', specs: ['Unisoc T606', '90Hz Display', 'Magic Ring'] },
    { id: 205, title: 'Infinix GT 20 Pro', category: 'Smartphones', description: 'Mecha design. RGB lighting.', image: 'https://images.unsplash.com/photo-1565360636071-8f30d8d6cc18?auto=format&fit=crop&w=400&q=80', price: '₦510,000', type: 'Buy', condition: 'Brand New', specs: ['Dimensity 8200 Ultimate', '144Hz Display', 'RGB Lights'] },
    // --- TECNO ---
    { id: 301, title: 'Tecno Camon 30 Pro', category: 'Smartphones', description: 'Pro video & Sony sensor photography.', image: 'https://images.unsplash.com/photo-1565849906461-0ee2c3a5063a?auto=format&fit=crop&w=400&q=80', price: '₦580,000', type: 'Buy', condition: 'Brand New', specs: ['Dimensity 8200', '50MP OIS Sony', '144Hz AMOLED'] },
    { id: 302, title: 'Tecno Spark 20 Pro', category: 'Smartphones', description: 'Moonlit Black. Stylish & capable.', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=400&q=80', price: '₦245,000', type: 'Buy', condition: 'Brand New', specs: ['Helio G99', '120Hz Display', '108MP Cam'] },
    { id: 303, title: 'Tecno Phantom V Flip', category: 'Smartphones', description: 'Foldable with leather finish.', image: 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?auto=format&fit=crop&w=400&q=80', price: '₦850,000', type: 'Sell', condition: 'Like New', specs: ['Foldable AMOLED', 'Dimensity 8050', 'Elegant Leather'] },
    { id: 304, title: 'Tecno Pop 8', category: 'Smartphones', description: 'Affordable daily driver.', image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=400&q=80', price: '₦115,000', type: 'Buy', condition: 'Brand New', specs: ['Unisoc T606', '90Hz Display', 'Stereo Speakers'] },
    { id: 305, title: 'Tecno Pova 6 Pro', category: 'Smartphones', description: 'Comet Green. 6000mAh battery beast.', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80', price: '₦380,000', type: 'Buy', condition: 'Brand New', specs: ['6000mAh Battery', '70W Ultra Charge', 'Dimensity 6080'] },
    // --- ITEL ---
    { id: 401, title: 'itel S24', category: 'Smartphones', description: 'Starry Blue. High specs, low price.', image: 'https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&w=400&q=80', price: '₦195,000', type: 'Buy', condition: 'Brand New', specs: ['Helio G91', '108MP Camera', '90Hz Screen'] },
    { id: 402, title: 'itel P55 5G', category: 'Smartphones', description: 'Affordable 5G for everyone.', image: 'https://images.unsplash.com/photo-1548094891-c4ba474efd16?auto=format&fit=crop&w=400&q=80', price: '₦165,000', type: 'Buy', condition: 'Brand New', specs: ['Dimensity 6080', '50MP Camera', '5000mAh'] },
    { id: 403, title: 'itel RS4', category: 'Smartphones', description: 'Racing Edition. Built for gaming.', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80', price: '₦210,000', type: 'Buy', condition: 'Brand New', specs: ['Helio G99', '120Hz Display', '45W Charging'] },
    { id: 404, title: 'itel A70', category: 'Smartphones', description: 'Brilliant Gold. Budget aesthetic.', image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=400&q=80', price: '₦110,000', type: 'Buy', condition: 'Brand New', specs: ['128GB Storage', '6.6" Display', '5000mAh'] },
    // --- IPHONE ---
    { id: 501, title: 'iPhone 16 Pro Max', category: 'Smartphones', description: 'Desert Titanium. Camera Control button.', image: 'https://images.unsplash.com/photo-1726878781892-3e54a4b9e32f?auto=format&fit=crop&w=400&q=80', price: '₦2,850,000', type: 'Buy', condition: 'Brand New', specs: ['A18 Pro Chip', 'Camera Control', '48MP Ultra Wide'] },
    { id: 502, title: 'iPhone 15 Pro Max', category: 'Smartphones', description: 'Natural Titanium. Action Button.', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80', price: '₦1,950,000', type: 'Swap', condition: 'Like New', specs: ['A17 Pro', 'USB-C', 'Action Button'] },
    { id: 503, title: 'iPhone 14 Pro', category: 'Smartphones', description: 'Deep Purple. Dynamic Island debut.', image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=400&q=80', price: '₦1,250,000', type: 'Buy', condition: 'Like New', specs: ['A16 Bionic', 'Dynamic Island', 'Always-on Display'] },
    { id: 504, title: 'iPhone 13', category: 'Smartphones', description: 'Midnight. Reliable dual-camera.', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400&q=80', price: '₦720,000', type: 'Buy', condition: 'Pre-owned', specs: ['A15 Bionic', 'Face ID', 'Super Retina XDR'] },
    { id: 505, title: 'iPhone 12', category: 'Smartphones', description: 'Blue. MagSafe & OLED display.', image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=400&q=80', price: '₦480,000', type: 'Buy', condition: 'Used', specs: ['A14 Bionic', 'MagSafe', 'OLED Display'] },
    { id: 506, title: 'iPhone 11', category: 'Smartphones', description: 'White. Night Mode pioneer.', image: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=400&q=80', price: '₦310,000', type: 'Buy', condition: 'Used', specs: ['A13 Bionic', 'Night Mode', 'Liquid Retina'] },
    // --- XIAOMI / REDMI / POCO ---
    { id: 601, title: 'Redmi Note 13 Pro+ 5G', category: 'Smartphones', description: 'Aurora Purple. 200MP & 120W charge.', image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=400&q=80', price: '₦680,000', type: 'Buy', condition: 'Brand New', specs: ['200MP Camera', '120W Charging', 'IP68'] },
    { id: 602, title: 'Poco F6 Pro', category: 'Smartphones', description: 'Performance monster. 120W fast charge.', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=400&q=80', price: '₦820,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 8 Gen 2', '120W Charge', '120Hz Flow AMOLED'] },
    { id: 603, title: 'Xiaomi 14', category: 'Smartphones', description: 'Leica Optics. Compact & powerful.', image: 'https://images.unsplash.com/photo-1711105952936-397a61a6697b?auto=format&fit=crop&w=400&q=80', price: '₦1,300,000', type: 'Swap', condition: 'Like New', specs: ['Snapdragon 8 Gen 3', 'Leica Optics', '90W Charging'] },
    { id: 604, title: 'Redmi 13C', category: 'Smartphones', description: 'Midnight Black. Reliable budget pick.', image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80', price: '₦160,000', type: 'Buy', condition: 'Brand New', specs: ['Helio G85', '50MP Camera', '90Hz'] },
    // --- OPPO / VIVO ---
    { id: 701, title: 'Oppo Reno 12 Pro', category: 'Smartphones', description: 'Nebula Silver. AI portrait master.', image: 'https://images.unsplash.com/photo-1565360636071-8f30d8d6cc18?auto=format&fit=crop&w=400&q=80', price: '₦650,000', type: 'Buy', condition: 'Brand New', specs: ['Dimensity 7300-Energy', 'AI Portrait', '80W SuperVOOC'] },
    { id: 702, title: 'Vivo V40 5G', category: 'Smartphones', description: 'Zeiss camera optics. IP68 sealed.', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80', price: '₦620,000', type: 'Buy', condition: 'Brand New', specs: ['IP68 Rating', '5500mAh Battery', 'Zeiss Camera'] },
    { id: 703, title: 'Oppo A78', category: 'Smartphones', description: 'Aqua Blue. 67W fast charge.', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=400&q=80', price: '₦295,000', type: 'Swap', condition: 'Like New', specs: ['Snapdragon 680', '67W Charging', 'Stereo Speakers'] },
    // --- GOOGLE / ONEPLUS / OTHERS ---
    { id: 801, title: 'Google Pixel 9 Pro', category: 'Smartphones', description: 'Hazel. Pure Android AI experience.', image: 'https://images.unsplash.com/photo-1696426300305-649069503437?auto=format&fit=crop&w=400&q=80', price: '₦1,450,000', type: 'Buy', condition: 'Brand New', specs: ['Google Tensor G4', 'Advanced AI', 'Pro Camera'] },
    { id: 802, title: 'OnePlus 12', category: 'Smartphones', description: 'Flowy Emerald. Hasselblad camera.', image: 'https://images.unsplash.com/photo-1543069190-b489884a66c2?auto=format&fit=crop&w=400&q=80', price: '₦1,250,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 8 Gen 3', 'Hasselblad Camera', '100W Charging'] },
    { id: 803, title: 'Nokia G42 5G', category: 'Smartphones', description: 'So Purple. Easy to repair.', image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=400&q=80', price: '₦240,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 480+', 'QuickFix Repair', '3-day Battery'] },
    { id: 804, title: 'Motorola Razr 50 Ultra', category: 'Smartphones', description: 'Flip foldable with huge cover screen.', image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=400&q=80', price: '₦1,150,000', type: 'Swap', condition: 'Like New', specs: ['Snapdragon 8s Gen 3', '4" External OLED', 'IPX8 Rated'] },
    { id: 805, title: 'Asus ROG Phone 8 Pro', category: 'Smartphones', description: 'Ultimate gaming smartphone.', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80', price: '₦1,600,000', type: 'Buy', condition: 'Brand New', specs: ['Snapdragon 8 Gen 3', '165Hz LTPO', 'Cooling System'] },
    { id: 806, title: 'Sony Xperia 1 VI', category: 'Smartphones', description: 'Creator phone. 4K OLED display.', image: 'https://images.unsplash.com/photo-1570893934-b35f2ced4b63?auto=format&fit=crop&w=400&q=80', price: '₦1,750,000', type: 'Buy', condition: 'Brand New', specs: ['4K OLED Display', 'Zeiss T* Lens', 'Telephoto Zoom'] },
    { id: 807, title: 'Huawei Mate 60 Pro', category: 'Smartphones', description: 'Satellite messaging flagship.', image: 'https://images.unsplash.com/photo-1534637901340-1dc8edbb3c0e?auto=format&fit=crop&w=400&q=80', price: '₦1,400,000', type: 'Buy', condition: 'Brand New', specs: ['Kirin 9000S', 'Satellite Messaging', 'Kunlun Glass'] },
    { id: 808, title: 'Nothing Phone (2)', category: 'Smartphones', description: 'Transparent Glyph Interface.', image: 'https://images.unsplash.com/photo-1565360636071-8f30d8d6cc18?auto=format&fit=crop&w=400&q=80', price: '₦580,000', type: 'Swap', condition: 'Like New', specs: ['Snapdragon 8+ Gen 1', 'LTPO AMOLED', '50MP Dual Cam'] },
    // --- RUGGED ---
    { id: 901, title: 'Blackview BV9300', category: 'Smartphones', description: '15080mAh rugged tank.', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=400&q=80', price: '₦320,000', type: 'Buy', condition: 'Brand New', specs: ['15080mAh Battery', 'IP68/IP69K', 'Laser Rangefinder'] },
    { id: 902, title: 'Doogee V30 Pro', category: 'Smartphones', description: '5G rugged with night vision cam.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', price: '₦350,000', type: 'Buy', condition: 'Brand New', specs: ['Dimensity 7050', '200MP Main Cam', 'Night Vision'] },
    // --- LAPTOPS ---
    { id: 2, title: 'MacBook Pro 16" (M3 Max)', category: 'Laptops', description: 'Space Black. Elite creative power.', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80', price: '₦5,200,000', type: 'Sell', condition: 'Brand New', specs: ['M3 Max Chip', '16.2" Liquid Retina', '22h Battery'] },
    { id: 16, title: 'Dell XPS 15 9530', category: 'Laptops', description: 'Ultimate Windows creative laptop.', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80', price: '₦2,800,000', type: 'Buy', condition: 'Brand New', specs: ['13th Gen i9', '3.5K OLED Touch', '32GB RAM'] },
    // --- GAMING ---
    { id: 4, title: 'PlayStation 5 Slim', category: 'Gaming', description: '1TB Digital Edition. Next-gen gaming.', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80', price: '₦750,000', type: 'Sell', condition: 'Brand New', specs: ['1TB SSD', '4K Gaming', 'Ray Tracing'] },
    { id: 19, title: 'Xbox Series X', category: 'Gaming', description: 'Most powerful Xbox ever made.', image: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?auto=format&fit=crop&w=400&q=80', price: '₦850,000', type: 'Sell', condition: 'Brand New', specs: ['12 Teraflops', 'True 4K Gaming', 'Quick Resume'] },
];

const CATALOG_VERSION = '5.1';

// Initialize Database
function initDB() {
    const storedData = localStorage.getItem(DB_KEY);
    const storedVersion = localStorage.getItem('maxsale_catalog_version');

    if (!storedData || storedVersion !== CATALOG_VERSION) {
        console.log("MaxSale: Updating database to massive catalog v" + CATALOG_VERSION + "...");
        localStorage.setItem(DB_KEY, JSON.stringify(latestItems));
        localStorage.setItem('maxsale_catalog_version', CATALOG_VERSION);
        return;
    }
}
initDB();

// Simulated API Delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
    getItems: async () => {
        await delay(600);
        const data = localStorage.getItem(DB_KEY);
        return JSON.parse(data);
    },
    getItemById: async (id) => {
        await delay(400);
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        return data.find(item => item.id === id);
    },
    createItem: async (itemData) => {
        await delay(800);
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        const newItem = { 
            id: Date.now(), 
            isSoldOut: false,
            ...itemData 
        };
        data.push(newItem);
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        return newItem;
    },
    toggleSoldStatus: async (id) => {
        await delay(500);
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        const item = data.find(i => i.id === id);
        if (item) {
            item.isSoldOut = !item.isSoldOut;
            localStorage.setItem(DB_KEY, JSON.stringify(data));
        }
        return item;
    },
    deleteItem: async (id) => {
        await delay(600);
        let data = JSON.parse(localStorage.getItem(DB_KEY));
        data = data.filter(item => item.id !== id);
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        return { success: true };
    },
    updateItem: async (id, updateData) => {
        await delay(600);
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        const index = data.findIndex(i => i.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updateData };
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            return data[index];
        }
        throw new Error('Item not found');
    },
    getSuggestions: async () => {
        await delay(500);
        const data = localStorage.getItem(DB_SUGGESTIONS_KEY);
        return JSON.parse(data || '[]');
    },
    createSuggestion: async (suggestionData) => {
        await delay(700);
        const data = JSON.parse(localStorage.getItem(DB_SUGGESTIONS_KEY) || '[]');
        const newSuggestion = { id: Date.now(), ...suggestionData, date: new Date().toISOString() };
        data.push(newSuggestion);
        localStorage.setItem(DB_SUGGESTIONS_KEY, JSON.stringify(data));
        return newSuggestion;
    }
};

window.GadgetAPI = api;
