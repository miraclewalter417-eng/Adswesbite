// const express = require("express");
// const fs = require("fs");
// const cors = require("cors");
// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(express.json({ limit: "50mb" })); // Allows large image uploads
// app.use(express.static("public")); // Serves your HTML/CSS/JS files

// const DATA_FILE = "./database.json";

// // Helper to read database
// const getAds = () => JSON.parse(fs.readFileSync(DATA_FILE));

// // 1. Get all ads
// app.get("/api/ads", (req, res) => {
//   res.json(getAds());
// });

// // 2. Post a new ad
// app.post("/api/ads", (req, res) => {
//   const ads = getAds();
//   const newAd = { id: Date.now(), ...req.body };
//   ads.push(newAd);
//   fs.writeFileSync(DATA_FILE, JSON.stringify(ads, null, 2));
//   res.status(201).json(newAd);
// });

// // 3. Delete an ad (Admin)
// app.delete("/api/ads/:id", (req, res) => {
//   let ads = getAds();
//   ads = ads.filter((ad) => ad.id != req.params.id);
//   fs.writeFileSync(DATA_FILE, JSON.stringify(ads, null, 2));
//   res.json({ message: "Deleted successfully" });
// });

// app.listen(PORT, () =>
//   console.log(`Server running at http://localhost:${PORT}`),
// );

// const API_URL = "http://localhost:3000/api/ads";

// // Fetch ads from your Node.js server
// async function loadAds() {
//   const response = await fetch(API_URL);
//   const ads = await response.json();
//   renderAds(ads);
// }

// // Post ad to your Node.js server
// adForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const file = document.getElementById("adImage").files[0];
//   const reader = new FileReader();

//   reader.onload = async function (event) {
//     const adData = {
//       title: document.getElementById("adTitle").value,
//       price: document.getElementById("adPrice").value,
//       category: document.getElementById("adCategory").value,
//       desc: document.getElementById("adDesc").value,
//       image: event.target.result,
//     };

//     await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(adData),
//     });

//     loadAds(); // Refresh the list
//     modal.style.display = "none";
//   };
//   reader.readAsDataURL(file);
// });

// loadAds();

// // Optimized Search & Filter API
// app.get('/api/ads', (req, res) => {
//     let ads = getAds();
//     const { search, category } = req.query;

//     if (search) {
//         ads = ads.filter(ad => ad.title.toLowerCase().includes(search.toLowerCase()));
//     }
//     if (category && category !== 'All') {
//         ads = ads.filter(ad => ad.category === category);
//     }

//     res.json(ads);
// });

// // DELETE route for Admin
// app.delete('/api/ads/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     let ads = JSON.parse(fs.readFileSync('./database.json'));

//     // Filter out the ad with the matching ID
//     const updatedAds = ads.filter(ad => ad.id !== id);

//     fs.writeFileSync('./database.json', JSON.stringify(updatedAds, null, 2));
//     res.json({ message: "Ad removed by admin" });
// });
