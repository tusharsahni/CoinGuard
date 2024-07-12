document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        fetch('navbar.html').then(response => response.text()),
    ]).then(data => {
        document.getElementById('navbar').innerHTML = data[0];

    });
});



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
// Retrieve userID from URL query parameter
const user_id = getParameterByName('userID');
console.log('User ID retrieved from URL:', user_id);

const budgetID = getParameterByName('budgetID');
console.log("Budget id: ", budgetID);


// Function to update the progress bar
function updateProgress() {
    const monthlyIncome = 10000;
    const monthlyExpenses = 2345.67;
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = (monthlyExpenses / monthlyIncome) * 100;
    progressBar.style.width = progressPercentage + '%';
    document.getElementById('progress-text').innerText = progressPercentage.toFixed(2) + '%';
}

// Function to initialize the pie chart
document.addEventListener('DOMContentLoaded', (event) => {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Miscellaneous'],
            datasets: [{
                data: [800, 500, 200, 300, 545.67],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'none',
                },
                title: {
                    display: false,
                    text: 'Expense Distribution'
                }
            }
        }
    });
});

//function to initialize bar graph 
document.addEventListener('DOMContentLoaded', (event) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug'
                , 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Expenses',
                data: [12, 19, 3, 5, 2, 3, 5, 3, 69, 13, 12, 11],
                borderColor: 'rgba(255, 99, 132, 1)'

            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

// Call the functions when the page loads
window.onload = function () {
    updateProgress();
};

function showDropdown() {
    document.getElementById('dropdownContent').classList.remove('hidden');
}

function hideDropdown() {
    document.getElementById('dropdownContent').classList.add('hidden');
}

document.getElementById('openModalBtn').addEventListener('click', function () {
    document.getElementById('myModal').classList.remove('hidden');
});

document.querySelectorAll('.close').forEach(el => {
    el.addEventListener('click', function () {
        document.getElementById('myModal').classList.add('hidden');
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
            const response = await fetch(`http://localhost:3000/transactions/transactions`);
            if (!response.ok) {
                throw new Error(`Network response was not ok`);
            }
            const transactions = await response.json();
            displayTransactions(transactions.data);
        } catch (error) {
            errorMessage.textContent = `Server side error`;
        }
    };

    const displayTransactions = (transactions) => {
        data.innerHTML = "";
        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", transaction.id); // Set a data attribute for the transaction ID

            row.innerHTML = `
        <td>${transaction.name}</td>
        <td>${transaction.date}</td>
        <td>${transaction.category}</td>
        <td>${transaction.amount}</td>
        <td>
            <button onclick="editTransaction('${transaction.id}')"><u>Edit</u></button>
            <button onclick="deleteTransaction('${transaction.id}')"><u>Delete</u></button>
        </td>
    `;

            data.appendChild(row);
        });
    };

    // Function to add a new transaction or update an existing one
    popupForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the form from submitting normally
        const formData = new FormData(popupForm);
        const transactionData = Object.fromEntries(formData);

        try {
            let response;
            if (isEditing) {
                response = await fetch(`http://localhost:3000/transactions/transactions`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(transactionData),
                });
            } else {
                response = await fetch(`http://localhost:3000/transactions/transactions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(transactionData),
                });
            }

            const responseData = await response.json();
            alert(responseData.message);
            popupForm.reset();
            fetchData();
            isEditing = false;
            document.getElementById('myModal').classList.add('hidden');
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });

    // Function to delete a transaction
    window.deleteTransaction = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/transactions/transactions`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const responseData = await response.json();
            if (!response.ok) {
                errorMessage.textContent = responseData.error;
            }
            alert(responseData.message);
            fetchData();
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    };

    // Function to edit a transaction
    window.editTransaction = async (id) => {
        const transactionRow = document.querySelector(`tr[data-id='${id}']`);
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
            document.getElementById('myModal').classList.remove('hidden');
        } else {
            console.error("Transaction row not found for ID:", id);
        }
    };

    fetchData();
});

