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



          
            // console.log("budgetId:", budgetId)
            // localStorage.setItem("budgetId", budgetId);




            data.forEach(budget => {
                const card = document.createElement('div');
                const budgetId = budget.category_id;
                console.log("budget ID:", budgetId);
                const Url = `budget.html`
                showCard(budget.name,Url,budget.amount,budgetId);
            });
        } catch (error) {
            console.error('Error fetching budget data:', error);
        }
    }

    function showCard(budgetName, Url, budgetAmount, budgetId) {
        const cardContainer = document.getElementById('cards-container');
        const card = document.createElement('div');
        card.className = 'bg-gray-50 p-4 rounded-lg shadow';
    
        // Create anchor element
        const anchor = document.createElement('a');
        anchor.href = Url;
    
        // Attach click event listener to store budgetId
        anchor.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default action of following the link
            storeBudgetId(budgetId);
            // Optionally, navigate to the URL after storing budgetId
            window.location.href = anchor.href;
        });
    
        // Construct card HTML
        anchor.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-700">${budgetName}</h3>
            <div class="mt-2">
                <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div class="bg-blue-600 h-4 rounded-full" style="width: 50%;"></div>
                    </div>
                    <span class="ml-2 text-gray-700">Amount: ₹${budgetAmount}</span>
                </div>
            </div>
        `;
    
        // Append anchor to card and card to container
        card.appendChild(anchor);
        cardContainer.appendChild(card);
    }

    function storeBudgetId(budgetId) {
        localStorage.setItem('budgetId', budgetId);
        
        
    }
    
    
    // Function to store budgetId in localStorage
  
    
    loadBudgetCards();
});
