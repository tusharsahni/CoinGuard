document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    if (token) {
        fetch("http://localhost:3000/auth/verify", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.email) { // Verify the response contains user data
                window.location.href = "homepage.html"; // Redirect if token is valid
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
                const response = await fetch("http://localhost:3000/auth/login", {
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
                    window.location.href = "homepage.html"; // Redirect to success page
                } else {
                    const errorData = await response.json();
                    console.log("Login failed:", errorData);
                    loginError.textContent = errorData.message || "Invalid email or password";
                }
            } catch (error) {
                console.error("Error during login:", error);
                document.getElementById("login-error").textContent = error;
            }
        });
});
