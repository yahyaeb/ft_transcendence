import { login } from "../state/auth";

export function renderLogin() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
        <h2 class="text-3xl font-bold text-white text-center mb-6">Connexion</h2>

        <form class="space-y-5">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Email</label>
            <input id="login-email" type="email" required
              class="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="email@exemple.com" />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Mot de passe</label>
            <input id="login-password" type="password" required
              class="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••" />
          </div>

          <button type="submit"
            class="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition">
            Se connecter
          </button>
        </form>

        <p class="text-gray-300 text-sm text-center mt-6">
          Pas encore de compte ?
          <a href="#signup" class="text-purple-400 hover:underline ml-1">Créer un compte</a>
        </p>

        <div class="text-center mt-4">
          <a href="#home" class="text-sm text-gray-400 hover:underline">← Retour à l'accueil</a>
        </div>
      </div>
    </div>
  `;

  const form = app.querySelector("form") as HTMLFormElement | null;
  const emailInput = app.querySelector("#login-email") as HTMLInputElement | null;

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = (emailInput?.value || "mock@email.com").trim();
    const username = email.split("@")[0] || "mock_user";

    login(username, email);

    // Retour Home => tu verras le bouton Profile
    window.location.hash = "#home";
  });
}