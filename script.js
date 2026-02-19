// ===============================
// INITIAL DATA (LocalStorage)
// ===============================
let ads = JSON.parse(localStorage.getItem("myAds")) || [];

const adsGrid = document.getElementById("adsGrid");
const adForm = document.getElementById("adForm");
const modal = document.getElementById("adModal");
const searchInput = document.getElementById("searchInput");

// ===============================
// MODAL CONTROLS
// ===============================
document.getElementById("openModal").onclick = () => {
  modal.style.display = "block";
};
document.querySelector(".close").onclick = () => {
  modal.style.display = "none";
};
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// ===============================
// RENDER ADS
// ===============================
function renderAds(data = ads) {
  adsGrid.innerHTML = "";
  if (data.length === 0) {
    adsGrid.innerHTML = "<p>No ads found.</p>";
    return;
  }

  data
    .sort((a, b) => b.id - a.id)
    .forEach((ad) => {
      adsGrid.appendChild(cardItem(ad));
    });
}

// ===============================
// CREATE CARD
// ===============================
function cardItem(ad) {
  const adItem = document.createElement("div");
  adItem.classList.add("ad-card");
  adItem.dataset.id = ad.id;

  const adImage = document.createElement("div");
  adImage.classList.add("ad-image");

  if (ad.image) {
    const img = document.createElement("img");
    img.src = ad.image;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    adImage.appendChild(img);
  } else {
    adImage.textContent = "No Image";
  }

  const adInfo = document.createElement("div");
  adInfo.classList.add("ad-info");
  adInfo.innerHTML = `
    <small>${ad.category}</small>
    <h3>${ad.title}</h3>
  `;

  const price = document.createElement("p");
  price.classList.add("ad-price");
  price.textContent = "₦" + Number(ad.price).toLocaleString("en-NG");
  adInfo.appendChild(price);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("ad-removeBtn");
  removeBtn.innerText = "Remove Item";
  removeBtn.addEventListener("click", () => removeAdItem(ad.id));

  adItem.appendChild(adImage);
  adItem.appendChild(adInfo);
  adItem.appendChild(removeBtn);

  return adItem;
}

// ===============================
// REMOVE AD
// ===============================
function removeAdItem(id) {
  ads = ads.filter((ad) => ad.id !== id);
  localStorage.setItem("myAds", JSON.stringify(ads));
  renderAds();
}

// ===============================
// FORM SUBMISSION
// ===============================
adForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("adImage");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      saveAd(event.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    saveAd(null);
  }
});

function saveAd(imageData) {
  const newAd = {
    id: Date.now(),
    title: document.getElementById("adTitle").value,
    price: document.getElementById("adPrice").value,
    category: document.getElementById("adCategory").value,
    desc: document.getElementById("adDesc").value,
    image: imageData,
    source: "user",
  };

  ads.push(newAd);
  localStorage.setItem("myAds", JSON.stringify(ads));
  renderAds();
  adForm.reset();
  modal.style.display = "none";
}

// ===============================
// SEARCH FUNCTION (Works for API + Local)
// ===============================
searchInput.addEventListener("input", searchAds);

function searchAds() {
  const term = searchInput.value.toLowerCase();

  const filtered = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(term) ||
      ad.category.toLowerCase().includes(term),
  );

  renderAds(filtered);
}

// ===============================
// CATEGORY FILTER
// ===============================
function filterCategory(cat) {
  if (cat === "All") {
    renderAds();
    return;
  }

  const filtered = ads.filter((ad) => ad.category === cat);
  renderAds(filtered);
}

// ===============================
// API INTEGRATION (FakeStore API)
// ===============================
async function loadAPIProducts() {
  // Only load API products if localStorage is empty
  if (ads.length > 0) {
    renderAds(ads);
    return;
  }

  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    const apiAds = products.map((item) => ({
      id: item.id + 10000,
      title: item.title,
      price: item.price * 1000,
      category: "Electronics",
      desc: item.description,
      image: item.image,
      source: "api",
    }));

    ads = apiAds;
    localStorage.setItem("myAds", JSON.stringify(ads));
    renderAds(ads);
  } catch (error) {
    console.error("API Error:", error);
  }
}

// ===============================
// NEWSLETTER
// ===============================
document
  .getElementById("newsletterForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for subscribing!");
    this.reset();
  });

// ===============================
// BACK TO TOP
// ===============================
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===============================
// START APP
// ===============================
loadAPIProducts();
