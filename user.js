// ----------------------------
// INITIAL VALUES
// ----------------------------
let balance = 25000;
let referralEarnings = 5000;

// ----------------------------
// DOM ELEMENTS
// ----------------------------
const balanceDisplay = document.querySelector(".balance-card h2");
const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
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
// DEPOSIT MODAL
// ----------------------------
if (depositBtn && depositModal && confirmDeposit) {
  depositBtn.addEventListener("click", () => {
    depositModal.style.display = "flex";
  });

  function closeDepositModal() {
    depositModal.style.display = "none";
  }

  confirmDeposit.addEventListener("click", () => {
    const amount = Number(document.getElementById("depositAmount").value);
    if (amount > 0) {
      balance += amount;
      balanceDisplay.textContent = "₦" + balance.toLocaleString();
      showNotification("Deposit Successful!");
      closeDepositModal();
    } else {
      showNotification("Enter a valid amount", "error");
    }
  });

  depositModal.addEventListener("click", (e) => {
    if (e.target === depositModal) closeDepositModal();
  });
}

// ----------------------------
// WITHDRAW MODAL
// ----------------------------
if (withdrawBtn && withdrawModal && confirmWithdraw) {
  withdrawBtn.addEventListener("click", () => {
    withdrawModal.style.display = "flex";
  });

  function closeWithdrawModal() {
    withdrawModal.style.display = "none";
  }

  confirmWithdraw.addEventListener("click", () => {
    const amount = Number(document.getElementById("withdrawAmount").value);
    if (amount > 0 && amount <= balance) {
      balance -= amount;
      balanceDisplay.textContent = "₦" + balance.toLocaleString();
      showNotification("Withdrawal Request Sent (Admin Approval Needed)");
      closeWithdrawModal();
    } else {
      showNotification("Insufficient Balance or Invalid Amount", "error");
    }
  });

  withdrawModal.addEventListener("click", (e) => {
    if (e.target === withdrawModal) closeWithdrawModal();
  });
}

// ----------------------------
// EDIT PROFILE MODAL
// ----------------------------
if (editBtn && editProfileModal) {
  editBtn.addEventListener("click", () => {
    editProfileModal.style.display = "flex";
  });

  const saveProfileBtn = editProfileModal.querySelector("button");
  saveProfileBtn.addEventListener("click", () => {
    showNotification("Profile updated!");
    editProfileModal.style.display = "none";
  });

  editProfileModal.addEventListener("click", (e) => {
    if (e.target === editProfileModal) editProfileModal.style.display = "none";
  });
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

    const adList = document.getElementById("adList");
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
// OPTIONAL: LOGOUT (if sidebar exists)
// ----------------------------
const logoutLink = document.querySelector(".logout-btn");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    showNotification("Logging out...");
    setTimeout(() => {
      window.location.href = "register.html";
    }, 1000);
  });
}
