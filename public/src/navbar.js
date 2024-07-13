document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profileNavItem = document.getElementById('AA');
    const loginSignupNavItem = document.getElementById('BB');

    console.log("this is profileNavItem: ",profileNavItem)

    if (profileNavItem && loginSignupNavItem) {
        if (token) {
            console.log("Token present:", token);
            // Show the profileNavItem and hide the loginSignupNavItem
            profileNavItem.style.display = 'block';
            loginSignupNavItem.style.display = 'none';
        } else {
            console.log("Token not present");
            // Show the loginSignupNavItem and hide the profileNavItem
            profileNavItem.style.display = 'none';
            loginSignupNavItem.style.display = 'block';
        }
    } else {
        console.error("ProfileNavItem or LoginSignupNavItem not found.");
    }
});

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
