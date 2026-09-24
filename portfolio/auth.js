const API_URL = "http://localhost:5000/api";


// ==================== REGISTER ====================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const message = document.getElementById("registerMessage");

        try {

            const response = await fetch(`${API_URL}/auth/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await response.json();

            if (!response.ok) {
                message.textContent = data.message;
                return;
            }

            message.textContent = "Registration successful! Redirecting...";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {

            message.textContent = "Unable to connect to server.";

        }

    });

}


// ==================== LOGIN ====================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        try {

            const response = await fetch(`${API_URL}/auth/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            if (!response.ok) {
                message.textContent = data.message;
                return;
            }

            localStorage.setItem("token", data.token);

            message.textContent = "Login successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);

        } catch (error) {

            message.textContent = "Unable to connect to server.";

        }

    });

}