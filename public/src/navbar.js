document.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
      initializeNavListeners();
      fetchUserData();
      const token = localStorage.getItem("token");
      const profileNavItem = document.getElementById("profilenavitem");
      const loginSignupNavItem = document.getElementById("loginsignupnavitem");

      console.log("This is profileNavItem: ", profileNavItem);

      if (token) {
        console.log("Token exists:", token);
        // Hide the login/signup item and show the profile item
        if (loginSignupNavItem) {
          loginSignupNavItem.style.display = "none";
        }
        if (profileNavItem) {
          profileNavItem.style.display = "block";
        }
      } else {
        console.log("Token does not exist");
        // Show the login/signup item and hide the profile item
        if (loginSignupNavItem) {
          loginSignupNavItem.style.display = "block";
        }
        if (profileNavItem) {
          profileNavItem.style.display = "none";
        }
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));
});
let hideDropdownTimeout;
function showDropdown() {
  clearTimeout(hideDropdownTimeout);
  const dropdownContent = document.getElementById("dropdownContent");
  if (dropdownContent) {
    dropdownContent.classList.remove("hidden");
  }
}

function hideDropdown() {
  hideDropdownTimeout = setTimeout(() => {
    const dropdownContent = document.getElementById("dropdownContent");

    if (dropdownContent) {
      dropdownContent.classList.add("hidden");
    }
  }, 200);
}

function logout() {
  // localStorage.removeItem("token");
  localStorage.clear();
  window.location.href = "./login.html";
}

function initializeNavListeners() {
  const profileNavItem = document.getElementById("profilenavitem");
  const dropdownContent = document.getElementById("dropdownContent");
  if (profileNavItem) {
    profileNavItem.addEventListener("mouseenter", showDropdown);
    profileNavItem.addEventListener("mouseleave", hideDropdown);
  }
  if (dropdownContent) {
    dropdownContent.addEventListener("mouseenter", showDropdown);
    dropdownContent.addEventListener("mouseleave", hideDropdown);
  }
}

async function fetchUserData() {
  const user_id = localStorage.getItem("userId");
  try {
    console.log(user_id);
    const response = await fetch("https://coinguard-t3bb.onrender.com/account/account", {
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
    document.getElementById(
      "UserDetail"
    ).innerHTML = `${data.name}<br>${data.contact}`;
    
  } catch (error) {
    console.log(error);
  }
}
