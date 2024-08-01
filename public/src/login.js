document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  if (token) {
    fetch("https://coinguard-t3bb.onrender.com/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.email) {
          // Verify the response contains user data
          window.location.href = "budget.html"; // Redirect if token is valid
        }
      })
      .catch((error) => console.error("Error verifying token:", error));
  }

  document
    .getElementById("login-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // console.log("Submitting login form with", { email, password });

      try {
        const response = await fetch("https://coinguard-t3bb.onrender.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const loginError = document.getElementById("login-error");

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful:", data);
          localStorage.setItem("token", data.token); // Store token in local storage
          console.log(data.user_id);
          localStorage.setItem("userId", data.user_id);
          const userID = data.user_id;
          // window.location.href = "homepage.html"; // Redirect to success page
          //    window.location.href = `homepage.html`;
          window.location.replace("budget.html");
        } else {
          const errorData = await response.json();
          console.log("Login failed:", errorData);
          loginError.textContent =
            errorData.message || "Invalid email or password";
        }
      } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("login-error").textContent = error;
      }
    });
});

document.getElementById("openModalBtn").addEventListener("click", function () {
  document.getElementById("myModal").classList.remove("hidden");
});

document.querySelectorAll(".close").forEach((el) => {
  el.addEventListener("click", function () {
    document.getElementById("myModal").classList.add("hidden");
  });
});

// Fetch countries and populate the dropdown
fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    const countryDropdown = document.getElementById("country");
    const countryCodeDropdown = document.getElementById("country-code");

    // Sort countries alphabetically
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    data.forEach((country) => {
      // Add countries to the country dropdown
      // const countryOption = document.createElement("option");
      // countryOption.value = country.name.common;
      // countryOption.textContent = country.name.common;
      // countryDropdown.appendChild(countryOption);

      // Add country codes to the country code dropdown
      if (country.idd.root && country.idd.suffixes) {
        country.idd.suffixes.forEach((suffix) => {
          const codeOption = document.createElement("option");
          codeOption.value = `${country.idd.root}${suffix}`;
          codeOption.textContent = `${country.name.common} (${country.idd.root}${suffix})`;
          countryCodeDropdown.appendChild(codeOption);
        });
      }
    });
  })
  .catch((error) => console.error("Error fetching countries:", error));

document.addEventListener("DOMContentLoaded", () => {
  const selects = document.querySelectorAll("select");

  selects.forEach((select) => {
    select.addEventListener("change", (event) => {
      const target = event.target;
      const placeholder = target.querySelector("option[disabled]");

      if (target.value === "") {
        placeholder.classList.add("text-gray-400");
        target.classList.add("text-gray-400");
        target.classList.remove("text-gray-700");
      } else {
        placeholder.classList.remove("text-gray-400");
        target.classList.add("text-gray-700");
        target.classList.remove("text-gray-400");
      }
    });

    // Initialize color based on the current value
    const target = select;
    const placeholder = target.querySelector("option[disabled]");

    if (target.value === "") {
      placeholder.classList.add("text-gray-400");
      target.classList.add("text-gray-400");
      target.classList.remove("text-gray-700");
    } else {
      placeholder.classList.remove("text-gray-400");
      target.classList.add("text-gray-700");
      target.classList.remove("text-gray-400");
    }
  });
});

const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.getElementById("password1").value;
  const confirmpassword = document.getElementById("confirm-password").value;
  console.log(password);
  console.log(confirmpassword);
  // Check if passwords match
  if (password !== confirmpassword) {
    alert('Password and Confirm Password do not match.');
    return; // Exit the function to prevent form submission
  }

  const formData = new FormData(signupForm);
  const userData = Object.fromEntries(formData.entries());
  try {
    const response = await fetch("https://coinguard-t3bb.onrender.com/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    if (response.ok) {
      alert("Sign up successful!");
      signupForm.reset();
    } else {
      alert("Sign up failed: " + responseData.message);
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
});
