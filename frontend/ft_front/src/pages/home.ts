import { isAuthenticated } from "../state/auth";
import { getLanguage, setLanguage } from "../state/language";
import { translations } from "../i18n/translations";
import { getAvatar } from "../state/profile";

export function renderHome() {
  const app = document.getElementById("app");
  if (!app) return;

  const lang = getLanguage();
  const t = translations[lang];
  const loggedIn = isAuthenticated();
  // Sécurité : si token expiré / session invalide → déconnexion complète
  if (!loggedIn) {
    localStorage.removeItem("user");
    sessionStorage.clear();
  }
  const avatar = loggedIn
  ? getAvatar()
  : "/avatars/default-avatar.png";

  app.innerHTML = `
    <div class="min-h-screen w-full bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200 flex flex-col">

      <!-- Header -->
      <header class="flex justify-end items-center p-6 gap-4">
        <select id="language-select"
          class="px-3 py-2 text-sm bg-slate-800/60 backdrop-blur-xl border border-slate-400/20 rounded-lg">
          <option value="fr" ${lang === "fr" ? "selected" : ""}>🇫🇷 FR</option>
          <option value="en" ${lang === "en" ? "selected" : ""}>🇬🇧 EN</option>
        </select>

        <a
          href="${loggedIn ? "#profile" : "#login"}"
          class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700/60 backdrop-blur-xl border border-slate-400/30 hover:border-purple-500/60 transition overflow-hidden"
          aria-label="${loggedIn ? "Aller au profil" : "Aller à la connexion"}"
        >
          <img src="${avatar}"
               alt="avatar"
               class="w-full h-full object-cover opacity-80" />
        </a>
      </header>

      <!-- Main -->
      <main class="flex-1 flex flex-col items-center justify-center text-center px-6">

        <h1 class="text-6xl font-extrabold mb-6 gradient-purple"
            style="filter: drop-shadow(0 0 25px rgba(168,139,250,0.6))">
          ${t.home_title}
        </h1>

        <p class="max-w-xl text-slate-400 text-lg mb-12">
          ${t.home_description}
        </p>

        <!-- Features -->
        <div class="flex gap-14 mb-14">
          ${[
            { name: "Frontend", img: "/team/frontend.png" },
            { name: "Backend", img: "/team/backend.png" },
            { name: "Game", img: "/team/game.png" }
          ].map(member => `
            <div class="flex flex-col items-center gap-3">
              <div class="w-28 h-28 rounded-full bg-slate-800/40 backdrop-blur-xl border border-slate-400/20 overflow-hidden">
                <img src="${member.img}"
                     alt="${member.name}"
                     class="w-full h-full object-cover opacity-90" />
              </div>
              <span class="text-sm text-slate-400">${member.name}</span>
            </div>
          `).join("")}
        </div>

        <!-- CTA -->
        <a href="#login"
           class="px-12 py-5 text-xl rounded-2xl font-semibold bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)] transition">
          ${t.login}
        </a>

      </main>
    </div>
  `;

  const languageSelect = document.getElementById("language-select") as HTMLSelectElement;
  languageSelect?.addEventListener("change", () => {
    setLanguage(languageSelect.value as "fr" | "en");
    renderHome();
  });
}