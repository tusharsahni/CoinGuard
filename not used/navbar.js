document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profileNavItem = document.getElementById('AA');
    const loginSignupNavItem = document.getElementById('BB');

   
   fetchUserData();


    console.log("this is profileNavItem: ", profileNavItem);

    if (profileNavItem && loginSignupNavItem) {

        if (token) {
            console.log("Token present:", token);
            // Show the profileNavItem and hide the loginSignupNavItem
            if (loginSignupNavItem) {
                loginSignupNavItem.style.display = 'none';
            }
            if (profileNavItem) {
                profileNavItem.style.display = 'block';
            }
        } else {
            console.log("Token not present");
            // Show the loginSignupNavItem and hide the profileNavItem
            if (loginSignupNavItem) {
                loginSignupNavItem.style.display = 'block';
            }
            if (profileNavItem) {
                profileNavItem.style.display = 'none';
            }
        }
    } else {
        console.error("ProfileNavItem or LoginSignupNavItem not found.");
    }

});


async function fetchUserData() {

    const user_id = localStorage.getItem('userId');
    try{

        const response = await fetch("http://localhost:3000/account/account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
        });

        const result = await response.json();
        const data = result.data[0];

        console.log("User name for navbar: " + data.name);
        console.log("User contact for navbar: " + data.contact);
    
//document.getElementById('UserDetail').textContent= data.name;
        document.getElementById('UserDetail').innerHTML = `${data.name}<br>${data.contact}`;
    }catch (error){
        console.log(error);
    }
}

function showDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    if (dropdownContent) {
        dropdownContent.style.display = 'block';
    }
}

function hideDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    if (dropdownContent) {
        dropdownContent.style.display = 'none';
    }
}

// Function to clear JWT token from localStorage
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Redirect to login page or update UI as needed
    window.location.replace("login.html");// Example redirect to login page
}
