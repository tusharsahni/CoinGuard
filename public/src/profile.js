document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  console.log("token:", token);
  if (!token) {
    window.location.href = "./login.html";
  }
  Promise.all([fetch("navbar.html").then((response) => response.text())]).then(
    (data) => {
      document.getElementById("navbar").innerHTML = data[0];
    }
  );
  await fetchUserInfo();
});
const userid = localStorage.getItem("userId");
async function fetchUserInfo() {
  //const user_id = 2;
  try {
    const user_id = userid;
    console.log("userid from profile page", userid);
    const response = await fetch("https://coinguard-t3bb.onrender.com/account/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    const result = await response.json();
    console.log("result", result);
    const data = result.data[0];
    const email = result.email[0];

    document.getElementById("nameShown").textContent = data.name;
    document.getElementById("contactShown").textContent = data.contact;
    document.getElementById("genderShown").textContent = data.gender;
    document.getElementById("countryShown").textContent = data.country;
    document.getElementById("emailShown").textContent = email.email;
    document.getElementById("budgetShown").textContent = data.budget;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function saveProfile() {
  //const user_id = 2;
  const profileData = {
    user_id: userid,
    name: document.getElementById("name").value,
    country: document.getElementById("country").value,
    gender: document.getElementById("gender").value,
    email: document.getElementById("email").value,
    contact: document.getElementById("phone").value,
    budget: document.getElementById("budget").value,
  };

  try {
    const response = await fetch("https://coinguard-t3bb.onrender.com/account/account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      document.getElementById("nameShown").textContent = profileData.name;
      document.getElementById("countryShown").textContent = profileData.country;
      document.getElementById("genderShown").textContent = profileData.gender;
      document.getElementById("emailShown").textContent = profileData.email;
      document.getElementById("contactShown").textContent = profileData.contact;
      document.getElementById("budgetShown").textContent = profileData.budget;

      alert("Profile updated successfully!");
      toggleEdit();
    } else {
      const errorData = await response.json();
      alert("Failed to update profile: " + errorData.message);
    }
  } catch (error) {
    alert("Failed to update profile: " + error.message);
  }
}

function toggleEdit() {
  const displayFields = document.querySelectorAll(".display-field");
  const editFields = document.querySelectorAll(".edit-field");

  if (document.getElementById("edit-button").classList.contains("hidden")) {
    displayFields.forEach((el) => el.classList.toggle("hidden"));
    editFields.forEach((el) => el.classList.toggle("hidden"));
    document.getElementById("edit-button").classList.toggle("hidden");
    document.getElementById("save-button").classList.toggle("hidden");
    document.getElementById("cancel-button").classList.toggle("hidden");
  } else {
    document.getElementById("name").value =
      document.getElementById("nameShown").textContent;
    document.getElementById("country").value =
      document.getElementById("countryShown").textContent;
    document.getElementById("gender").value =
      document.getElementById("genderShown").textContent;
    document.getElementById("email").value =
      document.getElementById("emailShown").textContent;
    document.getElementById("phone").value =
      document.getElementById("contactShown").textContent;
    document.getElementById("budget").value =
      document.getElementById("budgetShown").textContent;

    displayFields.forEach((el) => el.classList.toggle("hidden"));
    editFields.forEach((el) => el.classList.toggle("hidden"));
    document.getElementById("edit-button").classList.toggle("hidden");
    document.getElementById("save-button").classList.toggle("hidden");
    document.getElementById("cancel-button").classList.toggle("hidden");
  }
}

const user_id = localStorage.getItem("userId");
console.log("User ID retrieved from URL:", user_id);

function cancelEdit() {
  toggleEdit();
}
