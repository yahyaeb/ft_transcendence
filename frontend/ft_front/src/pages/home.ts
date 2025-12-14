import { isAuthenticated } from "../state/auth";
import { getLanguage, setLanguage } from "../state/language";
import { translations } from "../i18n/translations";

export function renderHome() {
  const app = document.getElementById("app");
  if (!app) return;

  const loggedIn = isAuthenticated();

  const lang = getLanguage();
  const t = translations[lang];

  app.innerHTML = `
    <header class="w-full flex justify-end items-center p-6 gap-4">

      <select id="language-select"
        class="px-4 py-2 text-sm text-white bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
        <option value="fr" ${lang === "fr" ? "selected" : ""}>🇫🇷 FR</option>
        <option value="en" ${lang === "en" ? "selected" : ""}>🇬🇧 EN</option>
      </select>

      ${
        loggedIn
          ? `<a href="#profile"
              class="px-4 py-2 text-sm text-white bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition">
              👤 ${t.profile}
            </a>`
          : `<a href="#login"
              class="px-4 py-2 text-sm text-white bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition">
              🔐 ${t.login}
            </a>`
      }

    </header>

    <main class="flex flex-col items-center text-center px-6 mt-20">
      <h1 class="text-5xl font-bold text-white mb-6">${t.home_title}</h1>

      <p class="text-gray-300 max-w-xl text-lg mb-12 text-left text-justify">
        ${t.home_description}
      </p>

      <div class="flex flex-col md:flex-row gap-6">
        <a href="#game"
          class="px-12 py-6 text-xl text-white rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 shadow-xl hover:opacity-90 transition">
          🏓 Play
        </a>

        <button
          class="px-12 py-6 text-xl text-white rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 shadow-xl hover:opacity-90 transition">
          ✨ Feature
        </button>

        <button
          class="px-12 py-6 text-xl text-white rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 shadow-xl hover:opacity-90 transition">
          ⚙️ Settings
        </button>
      </div>
    </main>
  `;

  const languageSelect = document.getElementById("language-select") as HTMLSelectElement;
  languageSelect?.addEventListener("change", () => {
    setLanguage(languageSelect.value as "fr" | "en");
    renderHome();
  });
}