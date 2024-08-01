document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  console.log('token:',token);
  if (!token) {
    window.location.href = "./login.html";
  }
  Promise.all([fetch("navbar.html").then((response) => response.text())]).then(
    (data) => {
      document.getElementById("navbar").innerHTML = data[0];
    }
  );
});
const userid = localStorage.getItem("userId");
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
                )}</td>
                <td class="px-6 py-3">${transaction.category}</td>
            `;

    data.appendChild(row);
  });
};

//function to display transactions
document.addEventListener("DOMContentLoaded", () => {
  const popupForm = document.getElementById("popupForm");
  const data = document.getElementById("data");
  const errorMessage = document.getElementById("errorMessage");
  let isEditing = false;

  const fetchData = async () => {
    try {
      //const userid = 2;
      const response = await fetch(
        `https://coinguard-t3bb.onrender.com/transactions/getHistory`,
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
      console.log(transactions.data);
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
                  <td class="px-6 py-3">${parseFloat(
                    transaction.amount
                  ).toFixed(2)}</td> <!-- Format amount -->
                  <td class="px-6 py-3">${transaction.category}</td>
              `;

      data.appendChild(row);
    });
  };

  // Function to add a new transaction or update an existing one
  popupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    const formData = new FormData(popupForm);
    //const userid = 2;
    if (userid) {
      formData.append("userid", userid);
    }
    const transactionData = Object.fromEntries(formData);
    try {
      let response;
      if (isEditing) {
        response = await fetch(
          `https://coinguard-t3bb.onrender.com/transactions/transactions`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData),
          }
        );
      } else {
        response = await fetch(
          `https://coinguard-t3bb.onrender.com/transactions/transactions`,
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
        `https://coinguard-t3bb.onrender.com/transactions/transactions`,
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

document
  .getElementById("export-csv")
  .addEventListener("click", exportTableToCSV);
document
  .getElementById("export-pdf")
  .addEventListener("click", exportTableToPDF);

function exportTableToCSV() {
  var table = document.getElementById("dataTable");
  var rows = Array.from(table.querySelectorAll("tr"));
  var csvContent = rows
    .map((row) => {
      var cells = Array.from(row.querySelectorAll("th, td"));
      return cells.map((cell) => cell.innerText).join(",");
    })
    .join("\n");

  var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "table-data.csv");
}

async function exportTableToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const table = document.getElementById("dataTable");
  const rows = Array.from(table.querySelectorAll("tr"));

  // Prepare the data for autoTable
  const head = [
    Array.from(rows[0].querySelectorAll("th")).map((th) => th.innerText),
  ];
  const body = rows
    .slice(1)
    .map((row) =>
      Array.from(row.querySelectorAll("td")).map((td) => td.innerText)
    );

  // Add autoTable to the PDF document
  doc.autoTable({
    head: head,
    body: body,
  });

  // Save the PDF
  doc.save("table-data.pdf");
}

const sortDate = async () => {
  try {
    const response = await fetch(`https://coinguard-t3bb.onrender.com/search/sortdate`);
    if (!response.ok) {
      errorMessage.textContent = "Failed to fetch";
    }
    const data = response.json();
    displayTransactions(data);
  } catch (err) {
    console.log(err);
    errorMessage.textContent = "Server side error";
  }
};

document
  .getElementById("filterCategory")
  .addEventListener("click", function () {
    document.getElementById("categoryDropdown").classList.toggle("hidden");
  });

function showDropdown2(categoryDropdown) {
  const dropdown = document.getElementById(categoryDropdown);
  if (dropdown) {
    dropdown.style.display = "block";
  }
}

// Function to hide the dropdown
function hideDropdown2(categoryDropdown) {
  const dropdown = document.getElementById(categoryDropdown);
  if (dropdown) {
    dropdown.style.display = "none";
  }
}

document.addEventListener("click", function (event) {
  var categoryDropdown = document.getElementById("categoryDropdown");
  // var dateDropdown = document.getElementById('dateDropdown');
  if (
    !categoryDropdown.contains(event.target) &&
    !document.getElementById("filterCategory").contains(event.target)
  ) {
    categoryDropdown.classList.add("hidden");
  }

  // if (
  //   !dateDropdown.contains(event.target) &&
  //   !document.getElementById("filterDate").contains(event.target)
  // ) {
  //   dateDropdown.classList.add("hidden");
  // }
});

async function showCategory(category) {
  const errorMessage = document.getElementById("errorMessage");
  try {
    //const userid = 2;
    if (category === "All") {
      location.reload();
    }
    const response = await fetch(
      `https://coinguard-t3bb.onrender.com/search/categorysearch`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, category }),
      }
    );
    const transaction = await response.json();
    console.log(transaction);
    displayTransactions(transaction.data);
    hideDropdown2();
  } catch (error) {
    console.error(error);
    errorMessage.textContent = error.message;
  }
}

document
  .getElementById("filterDate")
  .addEventListener("click", async function () {
    document.getElementById("dropdown-content").classList.add("show");
  });
document.getElementById("filterDate").addEventListener("click", function () {
  document.getElementById("dropdown-content").classList.remove("hidden");
});

document.querySelectorAll(".close").forEach((el) => {
  el.addEventListener("click", function () {
    document.getElementById("dropdown-content").classList.add("hidden");
  });
});

document
  .getElementById("applyFilter")
  .addEventListener("click", async function () {
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    //const userid = 2;
    console.log("Selected dates:", startDate, "to", endDate);
    if (startDate && endDate) {
      console.log("Selected dates:", startDate, "to", endDate);
      // You can add your filtering logic here

      const response = await fetch(`https://coinguard-t3bb.onrender.com/search/datesearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate, userid }),
      });

      const transactions = await response.json();
      console.log(transactions.data);
      displayTransactions(transactions.data);
      document.getElementById("dropdown-content").classList.remove("show");
    } else {
      alert("Please select both start and end dates.");
    }
  });
