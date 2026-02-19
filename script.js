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
  },
];
const adsGrid = document.getElementById("adsGrid");
const adForm = document.getElementById("adForm");
const modal = document.getElementById("adModal");
const removeBtn = document.getElementById("removeBtn");

// Modal Controls

document.getElementById("openModal").onclick = () =>
  (modal.style.display = "block");
document.querySelector(".close").onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = "none";
};

// Simple Search

// function searchAds() {
//   const term = document.getElementById("searchInput").value.toLowerCase();
//   const filtered = ads.filter((ad) => ad.title.toLowerCase().includes(term));
//   renderAds(filtered);
// }

// Category Filter

function filterCategory(cat) {
  if (cat === "All") return renderAds();
  const filtered = ads.filter((ad) => ad.category === cat);
  renderAds(filtered);
}

async function searchAds() {
  let term = document.getElementById("searchInput").value;
  let cat = document.querySelector(".active-category")?.innerText || "All";
  // This calls the server with specific "query parameters"
  try {
    const response = await fetch(API_URL)(
      "https://api.professional-service.com/data    ",
    );
    const products = await response.json();
    console.log(products);
    searchAds(products);
    // renderAds(filteredAds);
  } catch (error) {
    console.error("error fetching products:", error);
    alert("Could not load products. Please check your connection.");
  }
  getproducts();
}

// Render Ads to Screen

function renderAds(data = ads) {
  console.log(data);
  const rawHtml = data.sort((a, b) => b.id - a.id).map((ad) => cardItem(ad));
  // console.log(rawHtml);
  adsGrid.innerHTML = "";
  adsGrid.append(...rawHtml);
  // adsGrid.appendChild(rawHtml[0]);
}

// Handle Form Submission

adForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newAd = {
    id: Date.now(),
    title: document.getElementById("adTitle").value,
    price: document.getElementById("adPrice").value.toString(),
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

// Start

// renderAds(ads);

// ADS IMG

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
    const compressedBase64 = canvas.toDataURL("image/png", 0.7);

    const adData = {
      title: document.getElementById("adTitle").value,
      image: compressedBase64,
      // ... other fields
    };

    //   await fetch(API_URL, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(adData),
    //   });
    //   loadAds();
    // };
  };
};

function cardItem(ad) {
  const adItem = document.createElement("div");
  adItem.classList.add("ad-card");
  adItem.id = ad.id;
  const adImage = document.createElement("div");
  adImage.classList.add("ad-image");
  const adInfo = document.createElement("div");
  adInfo.classList.add("ad-info");
  adInfo.innerHTML = `<small>${ad.category}</small>
  <h3>${ad.title}</h3>`;
  // <p class="ad-price">$${ad.price.toString().toLocaleString()}</p>`;
  const price = document.createElement("p");
  // console.log(typeof ad.price);
  console.log(ad.price.toLocaleString("en-US"));
  price.textContent = "$" + Number(ad.price).toLocaleString("en-US");
  price.classList.add("ad-price");
  adInfo.appendChild(price);
  const adRmBtn = document.createElement("button");
  adRmBtn.innerText = "Remove Item";
  adRmBtn.classList.add("ad-removeBtn");
  adRmBtn.addEventListener("click", removeAdItem);

  adItem.appendChild(adImage);
  adItem.appendChild(adInfo);
  adItem.appendChild(adRmBtn);

  return adItem;
}

function removeAdItem() {
  //
  console.log(event.target.parentElement.id);
  // event.target.parentElement.remove();

  const latestAds = ads.filter((ad) => ad.id != event.target.parentElement.id);
  localStorage.setItem("myAds", JSON.stringify(latestAds));
  // loadAds()
  console.log({ latestAds });
  ads = latestAds;

  renderAds();
}
let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Newsletter form alert
document.getElementById("newsletterForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thank you for subscribing!");
  this.reset();
});

// Back to top button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
