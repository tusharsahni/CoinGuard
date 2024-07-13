document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        fetch('navbar.html').then(response => response.text()),
    ]).then(data => {
        document.getElementById('navbar').innerHTML = data[0];
    });
});

function updateProgress() {
    const monthlyIncome = 10000;
    const monthlyExpenses = 2345.67;
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = (monthlyExpenses / monthlyIncome) * 100;
    progressBar.style.width = progressPercentage + '%';
    document.getElementById('progress-text').innerText = progressPercentage.toFixed(2) + '%';
}

window.onload = function () {
    updateProgress();
};



document.addEventListener('DOMContentLoaded', () => {
    const popupForm = document.getElementById("popupForm");
    const data = document.getElementById("data");
    const errorMessage = document.getElementById("errorMessage");
    let isEditing = false;
    let currentEditId = null;

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/transactions`);
            if (!response.ok) {
                throw new Error(`Network response was not ok`);
            }
            const transactions = await response.json();
            displayTransactions(transactions.data);
        } catch (error) {
            console.log('Fetch error:', error);
            errorMessage.textContent = `Server side error`;
        }
    };

    const displayTransactions = (transactions) => {
        data.innerHTML = "";
        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.name}</td>
                <td>${transaction.type ? "Income" : "Expense"}</td>
                <td>${transaction.date}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.category}</td>
                <td>
                    <button onclick="editTransaction('${transaction.id}')"><u>Edit</u></button>
                    <button onclick="deleteTransaction('${transaction.id}')"><u>Delete</u></button>
                </td>
            `;
            data.appendChild(row);
        });
    };

    // Function to handle adding or editing a transaction
    popupForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the form from submitting normally
        const formData = new FormData(popupForm);
        const transactionData = Object.fromEntries(formData);
        let response;
        let responseData;

        try {
            if (isEditing && currentEditId) {
                response = await fetch(
                    `http://localhost:3000/transactions/${currentEditId}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(transactionData),
                    }
                );
            } else {
                response = await fetch(`http://localhost:3000/transactions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(transactionData),
                });
            }

            responseData = await response.json();

            if (response.ok) {
                alert(responseData.message);
                popupForm.reset();
                fetchData();
                isEditing = false;
                currentEditId = null;
                document.getElementById('myModal').classList.add('hidden');
            } else {
                throw new Error(responseData.message || 'An error occurred');
            }
        } catch (error) {
            console.log('Error:', error);
            errorMessage.textContent = error.message;
        }
    });

    // Function to delete a transaction
    window.deleteTransaction = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/transactions/${id}`, {
                method: 'DELETE'
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error);
            }
            alert(responseData.message);
            fetchData();
        } catch (error) {
            console.log('Delete error:', error);
            errorMessage.textContent = error.message;
        }
    };

    // Function to edit a transaction
    window.editTransaction = (id) => {
        const transaction = Array.from(data.children).find(
            (transaction) => transaction.children[0].textContent === id
        );

        if (transaction) {
            document.getElementById("transactionId").value = transaction.children[0].textContent;
            document.getElementById("name").value = transaction.children[1].textContent;
            document.getElementById("type").value = transaction.children[2].textContent === "Income" ? "true" : "false";
            document.getElementById("date").value = transaction.children[3].textContent;
            document.getElementById("amount").value = transaction.children[4].textContent;
            document.getElementById("category").value = transaction.children[5].textContent;
            isEditing = true;
            currentEditId = id;
            document.getElementById('myModal').classList.remove('hidden');
        }
    };

    document.querySelectorAll('.close').forEach(el => {
        el.addEventListener('click', () => {
            document.getElementById('myModal').classList.add('hidden');
        });
    });

    // Add event listeners for export buttons
    document.getElementById('export-csv').addEventListener('click', exportTableToCSV);
    document.getElementById('export-pdf').addEventListener('click', exportTableToPDF);

    function exportTableToCSV() {
        var table = document.getElementById('dataTable');
        var rows = Array.from(table.querySelectorAll('tr'));
        var csvContent = rows.map(row => {
            var cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map(cell => cell.innerText).join(',');
        }).join('\n');

        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'table-data.csv');
    }

    async function exportTableToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const table = document.getElementById('dataTable');
        const rows = Array.from(table.querySelectorAll('tr'));
    
        // Prepare the data for autoTable
        const head = [Array.from(rows[0].querySelectorAll('th')).map(th => th.innerText)];
        const body = rows.slice(1).map(row => Array.from(row.querySelectorAll('td')).map(td => td.innerText));
    
        // Add autoTable to the PDF document
        doc.autoTable({
            head: head,
            body: body,
        });
    
        // Save the PDF
        doc.save('table-data.pdf');
    }
    
    fetchData();
});