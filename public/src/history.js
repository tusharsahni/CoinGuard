document.addEventListener("DOMContentLoaded", function () {
  Promise.all([fetch("navbar.html").then((response) => response.text())]).then(
    (data) => {
      document.getElementById("navbar").innerHTML = data[0];
    }
  );
});

// function updateProgress() {
//     const monthlyIncome = 10000;
//     const monthlyExpenses = 2345.67;
//     const progressBar = document.getElementById('progress-bar');
//     const progressPercentage = (monthlyExpenses / monthlyIncome) * 100;
//     progressBar.style.width = progressPercentage + '%';
//     document.getElementById('progress-text').innerText = progressPercentage.toFixed(2) + '%';
// }

// window.onload = function () {
//     updateProgress();
// };

//document.addEventListener('DOMContentLoaded', () => {
// const popupForm = document.getElementById("popupForm");
// const data = document.getElementById("data");
// const errorMessage = document.getElementById("errorMessage");
// let isEditing = false;
// let currentEditId = null;

// const fetchData = async () => {
//     try {
//         const response = await fetch(`http://localhost:3000/transactions/getTransactions`);
//         if (!response.ok) {
//             throw new Error(`Network response was not ok`);
//         }
//         const transactions = await response.json();
//         displayTransactions(transactions.data);
//     } catch (error) {
//         console.log('Fetch error:', error);
//         errorMessage.textContent = `Server side error`;
//     }
// };

// const displayTransactions = (transactions) => {
//     data.innerHTML = "";
//     transactions.forEach((transaction) => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${transaction.name}</td>
//             <td>${transaction.type ? "Income" : "Expense"}</td>
//             <td>${transaction.date}</td>
//             <td>${transaction.amount}</td>
//             <td>${transaction.category}</td>
//             <td>
//                 <button onclick="editTransaction('${transaction.id}')"><u>Edit</u></button>
//                 <button onclick="deleteTransaction('${transaction.id}')"><u>Delete</u></button>
//             </td>
//         `;
//         data.appendChild(row);
//     });
// };

// // Function to handle adding or editing a transaction
// popupForm.addEventListener("submit", async (event) => {
//     event.preventDefault(); // Prevent the form from submitting normally
//     const formData = new FormData(popupForm);
//     const transactionData = Object.fromEntries(formData);
//     let response;
//     let responseData;

//     try {
//         if (isEditing && currentEditId) {
//             response = await fetch(
//                 `http://localhost:3000/transactions/transactions/${currentEditId}`,
//                 {
//                     method: "PUT",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(transactionData),
//                 }
//             );
//         } else {
//             response = await fetch(`http://localhost:3000/transactions/transactions`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(transactionData),
//             });
//         }

//         responseData = await response.json();

//         if (response.ok) {
//             alert(responseData.message);
//             popupForm.reset();
//             fetchData();
//             isEditing = false;
//             currentEditId = null;
//             document.getElementById('myModal').classList.add('hidden');
//         } else {
//             throw new Error(responseData.message || 'An error occurred');
//         }
//     } catch (error) {
//         console.log('Error:', error);
//         errorMessage.textContent = error.message;
//     }
// });

// // Function to delete a transaction
// window.deleteTransaction = async (id) => {
//     try {
//         const response = await fetch(
//             `http://localhost:3000/transactions/transactions/${id}`, {
//             method: 'DELETE'
//         });

//         const responseData = await response.json();
//         if (!response.ok) {
//             throw new Error(responseData.error);
//         }
//         alert(responseData.message);
//         fetchData();
//     } catch (error) {
//         console.log('Delete error:', error);
//         errorMessage.textContent = error.message;
//     }
// };

// // Function to edit a transaction
// window.editTransaction = (id) => {
//     const transaction = Array.from(data.children).find(
//         (transaction) => transaction.children[0].textContent === id
//     );

//     if (transaction) {
//         document.getElementById("transactionId").value = transaction.children[0].textContent;
//         document.getElementById("name").value = transaction.children[1].textContent;
//         document.getElementById("type").value = transaction.children[2].textContent === "Income" ? "true" : "false";
//         document.getElementById("date").value = transaction.children[3].textContent;
//         document.getElementById("amount").value = transaction.children[4].textContent;
//         document.getElementById("category").value = transaction.children[5].textContent;
//         isEditing = true;
//         currentEditId = id;
//         document.getElementById('myModal').classList.remove('hidden');
//     }
// };

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
        `http://localhost:3000/transactions/getHistory`,
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
    const response = await fetch(`http://localhost:3000/search/sortdate`);
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

document.getElementById('filterCategory').addEventListener('click', function () {
  document.getElementById('categoryDropdown').classList.toggle('hidden');
});

function showDropdown2(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
      dropdown.style.display = 'block';
  }
}

// Function to hide the dropdown
function hideDropdown2(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
      dropdown.style.display = 'none';
  }
}


document.addEventListener('click', function (event) {
  var categoryDropdown = document.getElementById('categoryDropdown');
  // var dateDropdown = document.getElementById('dateDropdown');
  if (!categoryDropdown.contains(event.target) && !document.getElementById('filterCategory').contains(event.target)) {
      categoryDropdown.classList.add('hidden');
  }
  
  // if (!dateDropdown.contains(event.target) && !document.getElementById('filterDate').contains(event.target)) {
  //     dateDropdown.classList.add('hidden');
  // }

  
});


async function showCategory(category) {
  const errorMessage = document.getElementById("errorMessage");
  try{
    const userid = 2;
    if(category==='All'){
      location.reload();
    }
    const response = await fetch(
      `http://localhost:3000/search/categorysearch`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, category }),
      }
    );
    const transaction = await response.json();
    console.log(transaction);
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
    displayTransactions(transaction.data);
    hideDropdown2();
  }catch(error){
    console.error(error);
    errorMessage.textContent = error.message;
  }
}