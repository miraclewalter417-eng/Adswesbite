//Add active class

let list = document.querySelectorAll(".list");
for (let i = 0; i < list.length; i++) {
  list[i].onclick = function () {
    let j = 0;
    while (j < list.length) {
      list[j++].className = "list";
    }
    list[i].className = "list active";
  };
}

// INCOME CHART

const ctxOne = document.getElementById("myChartOne");

new Chart(ctxOne, {
  type: "line",
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    datasets: [
      {
        label: "# of Votes",
        data: [20, 30, 100, 60, 50, 90, 40, 30, 10],
        backgroundColor: "transparent",
        borderColor: "#ffc15e",
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

// OUTCOME CHART

const ctxTwo = document.getElementById("myChartTwo");

new Chart(ctxTwo, {
  type: "line",
  data: {
    labels: [1, 2, 3, 4, 5, 6],
    datasets: [
      {
        label: "# of Votes",
        data: [50, 70, 100, 80, 120, 90],
        backgroundColor: "transparent",
        borderColor: "#8158fc",
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

// WEEK CHART JS

const ctxThree = document.getElementById("myChartThree");

var myChartnew = new Chart(ctxThree, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "This week",
        data: [48, 45, 25, 35, 65, 70],
        backgroundColor: "#8158fc",
        borderRadius: 20,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
      {
        label: "last week",
        data: [70, 25, 20, 43, 60, 85, 47],
        backgroundColor: "#ffc15e",
        borderRadius: 20,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
    ],
  },
  options: {
    layout: {
      padding: {
        top: 30,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

// TOGGLE BTN

function toggleData(value) {
  const visibilityData = myChartnew.isDatasetVisible(value);
  // console.log (myChart.isDatasetVisible(0));
  if (visibilityData === true) {
    myChartnew.hide(value);
  }
  if (visibilityData === false) {
    myChartnew.show(value);
  }
}
