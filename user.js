// ----------------------------
// INITIAL VALUES
// ----------------------------
let balance = 25000;
let referralEarnings = 5000;

// ----------------------------
// DOM ELEMENTS
// ----------------------------
const balanceDisplay = document.querySelector(".balance-card h2");
const depositModal = document.getElementById("depositModal");
const withdrawModal = document.getElementById("withdrawModal");
const editProfileModal = document.getElementById("editProfileModal");
const confirmDeposit = document.getElementById("confirmDeposit");
const confirmWithdraw = document.getElementById("confirmWithdraw");
const notification = document.getElementById("notification");
const themeToggle = document.getElementById("themeToggle");
const editBtn = document.querySelector(".edit-btn");
const createAdBtn = document.getElementById("createAdBtn");
const refEarningsDisplay = document.getElementById("refEarnings");
const adList = document.getElementById("adList");
const depositBtn = document.querySelector(
  "button[onclick=\"openModal('depositModal')\"]",
);
const withdrawBtn = document.querySelector(
  "button[onclick=\"openModal('withdrawModal')\"]",
);

// ----------------------------
// NOTIFICATION FUNCTION
// ----------------------------
function showNotification(message, type = "info") {
  notification.textContent = message;
  notification.style.background = type === "error" ? "#ef4444" : "#8158fc";
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), 3000);
}

// ----------------------------
// DARK MODE TOGGLE
// ----------------------------
if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    updateChartColors();
  });
}

// ----------------------------
// MODAL FUNCTIONS
// ----------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "flex";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

// Close modals when clicking outside
[depositModal, withdrawModal, editProfileModal].forEach((modal) => {
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
});

// ----------------------------
// DEPOSIT MODAL
// ----------------------------
if (depositBtn && depositModal && confirmDeposit) {
  depositBtn.addEventListener("click", () => openModal("depositModal"));

  confirmDeposit.addEventListener("click", () => {
    const amount = Number(document.getElementById("depositAmount").value);
    if (amount > 0) {
      balance += amount;
      balanceDisplay.textContent = "₦" + balance.toLocaleString();
      showNotification("Deposit Successful!");
      closeModal("depositModal");
      document.getElementById("depositAmount").value = "";
    } else {
      showNotification("Enter a valid amount", "error");
    }
  });
}

// ----------------------------
// WITHDRAW MODAL
// ----------------------------
if (withdrawBtn && withdrawModal && confirmWithdraw) {
  withdrawBtn.addEventListener("click", () => openModal("withdrawModal"));

  confirmWithdraw.addEventListener("click", () => {
    const amount = Number(document.getElementById("withdrawAmount").value);
    if (amount > 0 && amount <= balance) {
      balance -= amount;
      balanceDisplay.textContent = "₦" + balance.toLocaleString();
      showNotification("Withdrawal Request Sent (Admin Approval Needed)");
      closeModal("withdrawModal");
      document.getElementById("withdrawAmount").value = "";
    } else {
      showNotification("Insufficient Balance or Invalid Amount", "error");
    }
  });
}

// ----------------------------
// EDIT PROFILE MODAL
// ----------------------------
if (editBtn && editProfileModal) {
  editBtn.addEventListener("click", () => openModal("editProfileModal"));

  const saveProfileBtn = editProfileModal.querySelector("button");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      showNotification("Profile updated!");
      closeModal("editProfileModal");
    });
  }
}

// ----------------------------
// CREATE AD FUNCTION
// ----------------------------
if (createAdBtn) {
  createAdBtn.addEventListener("click", () => {
    const title = document.getElementById("adTitle").value.trim();
    const budget = Number(document.getElementById("adBudget").value);

    if (!title || budget <= 0) {
      showNotification("Enter valid ad details", "error");
      return;
    }

    if (budget > balance) {
      showNotification("Insufficient balance for this ad", "error");
      return;
    }

    balance -= budget;
    balanceDisplay.textContent = "₦" + balance.toLocaleString();

    const adItem = document.createElement("p");
    adItem.textContent = `${title} - ₦${budget.toLocaleString()} (Running)`;
    adList.appendChild(adItem);

    showNotification("Ad Launched Successfully!");
    document.getElementById("adTitle").value = "";
    document.getElementById("adBudget").value = "";
  });
}

// ----------------------------
// REFERRAL DISPLAY
// ----------------------------
if (refEarningsDisplay) {
  refEarningsDisplay.textContent = "₦" + referralEarnings.toLocaleString();
}

// ----------------------------
// CHART.JS ANALYTICS
// ----------------------------
let adChart;
const ctx = document.getElementById("adChart");
if (ctx) {
  adChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Clicks",
          data: [120, 190, 300, 250, 220, 400, 350],
          borderColor: "#8158fc",
          backgroundColor: "rgba(129,88,252,0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: document.body.classList.contains("dark") ? "white" : "#000",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: document.body.classList.contains("dark") ? "white" : "#000",
          },
        },
        y: {
          ticks: {
            color: document.body.classList.contains("dark") ? "white" : "#000",
          },
        },
      },
    },
  });
}

// Update chart colors when dark mode toggles
function updateChartColors() {
  if (!adChart) return;
  const isDark = document.body.classList.contains("dark");
  adChart.options.plugins.legend.labels.color = isDark ? "white" : "#000";
  adChart.options.scales.x.ticks.color = isDark ? "white" : "#000";
  adChart.options.scales.y.ticks.color = isDark ? "white" : "#000";
  adChart.update();
}

// ----------------------------
// SIDEBAR MOBILE TOGGLE
// ----------------------------
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && sidebar) {
  menuToggle.addEventListener("change", () => {
    sidebar.style.display = menuToggle.checked ? "block" : "none";
  });
}
