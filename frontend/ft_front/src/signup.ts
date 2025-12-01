// src/signup.ts
import { signup } from "./api/auth";

const form = document.getElementById("signup-form") as HTMLFormElement | null;
const msgEl = document.getElementById("signup-message") as HTMLParagraphElement | null;

if (!form) {
  console.error("Signup form not found");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!msgEl) return;

    msgEl.textContent = "";
    msgEl.className = "text-sm text-center mt-1"; // reset classes

    const usernameInput = document.getElementById("username") as HTMLInputElement | null;
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    const confirmInput = document.getElementById("confirm") as HTMLInputElement | null;

    if (!usernameInput || !emailInput || !passwordInput || !confirmInput) {
      msgEl.textContent = "Internal error: inputs not found.";
      msgEl.classList.add("text-red-400");
      return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (password !== confirm) {
      msgEl.textContent = "Passwords do not match.";
      msgEl.classList.add("text-red-400");
      return;
    }

    try {
      await signup({ username, email, password });

      msgEl.textContent = "Account created! Redirecting to login…";
      msgEl.classList.add("text-green-400");

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 800);
    } catch (err: any) {
      msgEl.textContent = err?.message || "Signup failed";
      msgEl.classList.add("text-red-400");
    }
  });
}
