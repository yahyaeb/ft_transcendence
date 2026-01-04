import { login, fetchMe} from "../state/auth.ts";
import { getLanguage } from "../state/language";
import { translations } from "../i18n/translations";

export function renderLogin() {
  const app = document.getElementById("app");
  if (!app) return;

  const lang = getLanguage();
  const t = translations[lang];

  app.innerHTML = `
    <div class="min-h-screen w-full bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200 flex items-center justify-center px-6">

      <div class="w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-400/20 rounded-3xl p-10 shadow-2xl">

        <!-- Avatar -->
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 rounded-full bg-slate-700/60 border border-slate-400/30 overflow-hidden">
            <img src="/avatars/default-avatar.png"
                 alt="avatar"
                 class="w-full h-full object-cover opacity-80" />
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl font-extrabold text-center mb-2 gradient-purple"
            style="filter: drop-shadow(0 0 20px rgba(168,139,250,0.5))">
          ${t.login}
        </h1>

        <p class="text-center text-slate-400 mb-8">
          ${t.login_description ?? "Connecte-toi pour accéder à ton profil"}
        </p>

        <!-- Form -->
        <form id="login-form" class="space-y-5">

          <input
            id="email"
            type="text"
            placeholder="${t.email ?? "Email"}"
            required
            class="w-full px-5 py-4 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
          />

          <div class="relative">
            <input
              id="password"
              type="password"
              placeholder="${t.password ?? "Mot de passe"}"
              required
              class="w-full px-5 py-4 pr-12 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
            />
            <button
              type="button"
              id="toggle-password"
              class="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-purple-400 transition"
              aria-label="Afficher le mot de passe">
              <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5
                         c4.478 0 8.268 2.943 9.542 7
                         -1.274 4.057-5.064 7-9.542 7
                         -4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
                    <!-- 2FA Toggle -->
          <div class="flex items-center justify-between text-sm text-slate-400">
            <label for="twofa-toggle" class="select-none">
              j'ai un code à double authentification
            </label>
            <input
              id="twofa-toggle"
              type="checkbox"
              class="h-5 w-5 accent-purple-500 cursor-pointer"
            />
          </div>
          <input
            id="twofa-code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="Tapez votre code"
            class="hidden w-full px-5 py-4 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
          />

          <button
            type="submit"
            class="w-full mt-2 px-6 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)] transition">
            ${t.login}
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center space-y-3">

          <p class="text-sm text-slate-400">
            ${t.no_account ?? "Pas encore de compte ?"}
            <a href="#signup"
               class="text-purple-400 hover:underline ml-1">
              ${t.signup ?? "Créer un compte"}
            </a>
          </p>

          <a href="#home"
             class="block text-sm text-slate-400 hover:text-purple-400 transition">
            ← ${t.back_home ?? "Retour à l'accueil"}
          </a>

        </div>

      </div>
    </div>
  `;
}


export function onMountLogin() {
  const form = document.getElementById("login-form") as HTMLFormElement | null;
  const emailInput = document.getElementById("email") as HTMLInputElement | null; // <-- match your HTML
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  const togglePasswordBtn = document.getElementById("toggle-password") as HTMLButtonElement | null;
  const twofaToggle = document.getElementById("twofa-toggle") as HTMLInputElement | null;
  const twofaCodeInput = document.getElementById("twofa-code") as HTMLInputElement | null;

  if (!form || !emailInput || !passwordInput || !twofaToggle || !twofaCodeInput) return;

  const eyeIcon = document.getElementById("eye-icon");
  togglePasswordBtn?.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    eyeIcon?.classList.toggle("opacity-40", !isHidden);
  });

  twofaToggle.addEventListener("change", () => {
    if (twofaToggle.checked) {
      twofaCodeInput.classList.remove("hidden");
      twofaCodeInput.focus();
    } else {
      twofaCodeInput.classList.add("hidden");
      twofaCodeInput.value = "";
    }
  });

  twofaCodeInput.addEventListener("input", () => {
    twofaCodeInput.value = twofaCodeInput.value.replace(/\D/g, "").slice(0, 6);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const code = twofaToggle.checked ? twofaCodeInput.value.trim() : undefined;

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      await login({email, password, code });
      window.location.hash = "#dashboard";
    } catch (err: any) {
      alert(err?.message ?? "Login failed");
    }
  });
}