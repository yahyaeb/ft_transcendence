// src/main.ts
import "./style.css";

// Adjust this to match your backend URL + route
const API_BASE = "http://localhost:4999"; // or whatever your port is
const SIGNUP_URL = `${API_BASE}/auth/signup`; // change to /signup or /users if needed

const signupBtn = document.getElementById("signup-btn") as HTMLButtonElement | null;
const usernameInput = document.getElementById("username") as HTMLInputElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;
const passwordInput = document.getElementById("password") as HTMLInputElement | null;
const confirmInput = document.getElementById("confirm") as HTMLInputElement | null;

if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    if (!usernameInput || !emailInput || !passwordInput || !confirmInput) {
      console.error("Missing inputs in the DOM");
      return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    // Simple client-side checks (optional but nice)
    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
        // If your backend uses cookies for session:
        // credentials: "include",
      });

      if (!res.ok) {
        // Try to read error message from backend
        let msg = `Signup failed with status ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData?.message) msg = errorData.message;
        } catch {
          // ignore JSON parse error
        }
        alert(msg);
        console.error("Signup error:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log("Signup success:", data);

      // Example: if backend returns a token or user object
      // localStorage.setItem("token", data.token);

      alert("Account created! 🎉");
      // Optionally redirect:
      // window.location.href = "/login.html";
    } catch (err) {
      console.error("Network or CORS error:", err);
      alert("Unable to reach server. Check if backend is running and CORS is set.");
    }
  });
}
