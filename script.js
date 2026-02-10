// Initial Data (Loads from Local Storage or uses defaults)
let ads = JSON.parse(localStorage.getItem("myAds")) || [
  {
    id: 1,
    title: "Vintage Camera",
    price: 120,
    category: "Electronics",
    desc: "Perfect condition",
  },
  {
    id: 2,
    title: "Web Design Service",
    price: 500,
    category: "Services",
    desc: "Modern UI/UX",
  }
];

const adsGrid = document.getElementById("adsGrid");
const adForm = document.getElementById("adForm");
const modal = document.getElementById("adModal");

// Render Ads to Screen
function renderAds(data = ads) {
  adsGrid.innerHTML = data
    .map(
      (ad) => `
        <div class="ad-card">
            <div style="height:150px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; color:#94a3b8">No Image</div>
            <div class="ad-info">
                <small>${ad.category}</small>
                <h3>${ad.title}</h3>
                <p class="ad-price">$${ad.price}</p>
                <p>${ad.desc.substring(0, 50)}...</p>
            </div>
        </div>
    `,
    )
    .join("");
}

// Handle Form Submission
adForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newAd = {
    id: Date.now(),
    title: document.getElementById("adTitle").value,
    price: document.getElementById("adPrice").value,
    category: document.getElementById("adCategory").value,
    desc: document.getElementById("adDesc").value,
  };

  ads.push(newAd);
  localStorage.setItem("myAds", JSON.stringify(ads)); 
  
  // Save to browser memory
  renderAds();
  adForm.reset();
  modal.style.display = "none";
});

// Modal Controls
document.getElementById("openModal").onclick = () =>
  (modal.style.display = "block");
document.querySelector(".close").onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = "none";
};

// Simple Search
function searchAds() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = ads.filter((ad) => ad.title.toLowerCase().includes(term));
  renderAds(filtered);
}

// Category Filter
function filterCategory(cat) {
  if (cat === "All") return renderAds();
  const filtered = ads.filter((ad) => ad.category === cat);
  renderAds(filtered);
}

// Start
renderAds();

async function searchAds() {
  const term = document.getElementById("searchInput").value;
  const cat = document.querySelector(".active-category")?.innerText || "All";

  // This calls the server with specific "query parameters"
  const response = await fetch(`${API_URL}?search=${term}&category=${cat}`);
  const filteredAds = await response.json();
  renderAds(filteredAds);
}

reader.onload = async function (event) {
  const img = new Image();
  img.src = event.target.result;

  img.onload = async function () {
    const canvas = document.createElement("canvas");
    const MAX_WIDTH = 800;
    const scaleSize = MAX_WIDTH / img.width;
    canvas.width = MAX_WIDTH;
    canvas.height = img.height * scaleSize;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert to a smaller JPEG instead of a heavy PNG
    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

    const adData = {
      title: document.getElementById("adTitle").value,
      image: compressedBase64,
      // ... other fields
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adData),
    });
    loadAds();
  };
};