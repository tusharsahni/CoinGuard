document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        fetch('navbar.html').then(response => response.text()),
    ]).then(data => {
        document.getElementById('navbar').innerHTML = data[0];

    });

  

    const user_id = localStorage.getItem('userId');
    console.log('User ID retrieved from URL:', user_id);
     

    // Async function to handle modal opening
    async function openModal() {
        document.getElementById('myModalBudget').classList.remove('hidden');
    }

    // Add event listener to open modal
    document.getElementById('openMyModal').addEventListener('click', openModal);

    // Add event listeners to close buttons
    document.querySelectorAll('.close').forEach(el => {
        el.addEventListener('click', function () {
            document.getElementById('myModalBudget').classList.add('hidden');
        });
    });

    // Handle form submission
    document.getElementById('popupFormBudget').addEventListener('submit', async function (event) {
        event.preventDefault();


        // Close the modal
        document.getElementById('myModalBudget').classList.add('hidden');

        // Clear form fields
        const name = document.getElementById('budgetName').value ;
        const amount = document.getElementById('budgetAmount').value ;

        try {
            // Perform asynchronous operations here, if needed
            const response = await fetch("http://localhost:3000/category/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id, name, amount }),
            });

        // Clear form fields after adding the card
        document.getElementById('budgetName').value = '';
        document.getElementById('budgetAmount').value = '';
            
          
            // Handle response or further processing
        } catch (error) {
            console.error('Error:', error);
        }
    });


    async function loadBudgetCards() {
        try {
            const response = await fetch("http://localhost:3000/category/categoriesload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user_id }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const data = result.data;
            data.forEach(budget => {
                const card = document.createElement('div');
                const budget_id = budget.category_id;
                const detailUrl = `budget.html?userID=${user_id}&budgetID=${budget_id}`
                showCard(budget.name,detailUrl,budget.amount);
            });
        } catch (error) {
            console.error('Error fetching budget data:', error);
        }
    }


    function showCard(budgetName, detailUrl, budgetAmount) {
        const cardContainer = document.getElementById('cards-container');
    
        const card = document.createElement('div');
        card.className = 'bg-gray-50 p-4 rounded-lg shadow';
        card.innerHTML = `
            <a href="${detailUrl}" >
                <h3 class="text-lg font-semibold text-gray-700">${budgetName}</h3>
                <div class="mt-2">
                    <div class="flex items-center">
                        <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div class="bg-blue-600 h-4 rounded-full" style="width: 50%;"></div>
                        </div>
                        <span class="ml-2 text-gray-700">Amount: ₹${budgetAmount}</span>
                    </div>
                </div>
            </a>
        `;
    
        cardContainer.appendChild(card);
    }
    loadBudgetCards();
});
