document.addEventListener("DOMContentLoaded", function () {
  Promise.all([fetch("navbar.html").then((response) => response.text())]).then(
    (data) => {
      document.getElementById("navbar").innerHTML = data[0];
    }
  );
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// Retrieve userID from URL query parameter
// const user_id = getParameterByName('userID');

const budgetID = localStorage.getItem("budgetId");
// const budgetID = getParameterByName('budgetID');

// console.log("Budget id: ", budgetID);
const user_id = localStorage.getItem("userId");
console.log("User ID retrieved from URL:", user_id);

document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("progressChart").getContext("2d");
  const progressChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Spent", "Remaining"],
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ["#4caf50", "#e0e0e0"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "80%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      animation: {
        duration: 1000,
        easing: "easeInOutQuad",
      },
      // Adjust the chart size
      aspectRatio: 1.5, // Ensures the chart maintains a 1:1 aspect ratio
      layout: {
        padding: 10, // Adds padding around the chart
      },
    },
  });

  async function updateProgress() {
    const userid = 2;
    const response = await fetch(`http://localhost:3000/charts/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid }),
    });

    const data = await response.json();
    //console.log(data.response2);
    const monthlyIncome = data.response2[0].budget;
    const monthlyExpenses = data.response1[0].total_amount;
    console.log("Monthly Income:", monthlyIncome);
    console.log("Monthly Expenses:", monthlyExpenses);
    const progressPercentage = (monthlyExpenses / monthlyIncome) * 100;

    progressChart.data.datasets[0].data = [
      progressPercentage,
      100 - progressPercentage,
    ];

    if (progressPercentage < 50) {
      progressChart.data.datasets[0].backgroundColor = ["#4caf50", "#e0e0e0"];
    } else if (progressPercentage < 75) {
      progressChart.data.datasets[0].backgroundColor = ["#ffeb3b", "#e0e0e0"];
    } else {
      progressChart.data.datasets[0].backgroundColor = ["#f44336", "#e0e0e0"];
    }

    progressChart.update("active");
    document.getElementById("progress-text").innerText =
      progressPercentage.toFixed(2) + "%";
  }

  updateProgress();
});

// Function to initialize the pie chart
document.addEventListener("DOMContentLoaded", function () {
  Promise.all([fetch("navbar.html").then((response) => response.text())]).then(
    (data) => {
      document.getElementById("navbar").innerHTML = data[0];
    }
  );

  const budgetID = localStorage.getItem("budgetId");
  const user_id = localStorage.getItem("userId");
  console.log("User ID retrieved from URL:", user_id);
  fetchChartData();
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function fetchChartData() {
  const userid = 2;
  try {
    const response = await fetch(`http://localhost:3000/charts/piecharts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid }),
    });

    const data = await response.json();
    
    // Static labels and their colors
    const staticLabels = ["Rent", "Utilities", "Miscellaneous", "Groceries", "Entertainment"];
    const backgroundColors = [
      "rgba(239, 68, 68, 1)", // Rent
      "rgba(59, 130, 246, 1)", // Utilities
      "rgba(234, 179, 8, 1)", // Miscellaneous
      "rgba(34, 197, 94, 1)", // Groceries
      "rgba(139, 92, 246, 1)" // Entertainment
    ];
    const borderColors = [
      "rgba(255, 99, 132, 1)", // Rent
      "rgba(54, 162, 235, 1)", // Utilities
      "rgba(255, 206, 86, 1)", // Miscellaneous
      "rgba(75, 192, 192, 1)", // Groceries
      "rgba(153, 102, 255, 1)" // Entertainment
    ];

    // Initialize chartData with zeros
    const chartData = new Array(staticLabels.length).fill(0);

    // Map API data to static labels
    data.data.forEach(item => {
      const index = staticLabels.indexOf(item.category);
      if (index !== -1) {
        chartData[index] = item.total_amount;
      }
    });

    const ctx = document.getElementById("expenseChart").getContext("2d");
    const expenseChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: staticLabels,
        datasets: [
          {
            data: chartData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: "right",
          },
          title: {
            display: false,
            text: "Expense Distribution",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
}

//function to initialize bar graph
document.addEventListener("DOMContentLoaded", (event) => {
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "April",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Expenses",
          data: [12, 19, 3, 5, 2, 3, 5, 3, 69, 13, 12, 11],
          borderColor: "rgba(255, 99, 132, 1)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

// Call the functions when the page loads
// window.onload = function () {
//   updateProgress();
// };

document.getElementById("openModalBtn").addEventListener("click", function () {
  document.getElementById("myModal").classList.remove("hidden");
});

document.querySelectorAll(".close").forEach((el) => {
  el.addEventListener("click", function () {
    document.getElementById("myModal").classList.add("hidden");
  });
});

//function to display transactions
document.addEventListener("DOMContentLoaded", () => {
  const popupForm = document.getElementById("popupForm");
  const data = document.getElementById("data");
  const errorMessage = document.getElementById("errorMessage");
  let isEditing = false;

  const fetchData = async () => {
    try {
      const userid = 2;
      const response = await fetch(
        `http://localhost:3000/transactions/getTransactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const transactions = await response.json();
      displayTransactions(transactions.data);
    } catch (error) {
      errorMessage.textContent = "Server side error";
    }
  };

  const displayTransactions = (transactions) => {
    data.innerHTML = "";
    transactions.forEach((transaction) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", transaction.id); // Set a data attribute for the transaction ID

      row.innerHTML = `
            <td class="px-6 py-3">${transaction.name}</td>
            <td class="px-6 py-3">${transaction.date}</td>
            <td class="px-6 py-3">${parseFloat(transaction.amount).toFixed(
              2
            )}</td> <!-- Format amount -->
            <td class="px-6 py-3">${transaction.category}</td>
            <td class="px-6 py-3">
                <button class="small-button px-3 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onclick="editTransaction('${
                  transaction.id
                }')" class="text-white hover:underline">Edit</button>
                <button class="small-button px-3 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75" onclick="deleteTransaction('${
                  transaction.id
                }')" class="text-red-500 hover:underline">Delete</button>
            </td>
        `;

      data.appendChild(row);
    });
  };

  // Function to add a new transaction or update an existing one
  popupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    const formData = new FormData(popupForm);
    const userid = 2;
    if (userid) {
      formData.append("userid", userid);
    }
    const transactionData = Object.fromEntries(formData);
    try {
      let response;
      if (isEditing) {
        response = await fetch(
          `http://localhost:3000/transactions/transactions`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData),
          }
        );
      } else {
        response = await fetch(
          `http://localhost:3000/transactions/transactions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData),
          }
        );
      }

      const responseData = await response.json();
      location.reload();
      alert(responseData.message);
      popupForm.reset();
      fetchData();
      isEditing = false;
      document.getElementById("myModal").classList.add("hidden");
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });

  // Function to delete a transaction
  window.deleteTransaction = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/transactions/transactions`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        errorMessage.textContent = responseData.error;
      }
      location.reload();
      alert(responseData.message);
      fetchData();
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  };

  // Function to edit a transaction
  window.editTransaction = async (id) => {
    const transactionRow = document.querySelector(tr[(id = "${id}")]);
    if (transactionRow) {
      const cells = transactionRow.children;
      console.log("Editing transaction with ID:", id);
      console.log("Cells:", cells);

      document.getElementById("transactionId").value = id;
      document.getElementById("name").value = cells[0].textContent;
      document.getElementById("date").value = cells[1].textContent;
      document.getElementById("category").value = cells[2].textContent;
      document.getElementById("amount").value = cells[3].textContent;

      isEditing = true;
      document.getElementById("myModal").classList.remove("hidden");
    } else {
      console.error("Transaction row not found for ID:", id);
    }
  };

  fetchData();
});

// to set today's date by default
function setDefaultDate() {
  var today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
}

window.onload = setDefaultDate;