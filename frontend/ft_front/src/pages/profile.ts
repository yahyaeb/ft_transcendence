import { getLanguage } from "../state/language";
import { translations } from "../i18n/translations";
import { getUser, logout } from "../state/auth";
import { paintAvatars } from "../ui/avatar";

export function renderProfile() {

  const app = document.getElementById("app");
  if (!app) return;

  const user = getUser();
  const lang = getLanguage();
  const t = translations[lang];

  if (!user) {
    window.location.hash = "#login";
    return;
  }

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200 px-6 py-12 flex justify-center">

      <div class="w-full max-w-3xl">

        <!-- Header -->
        <div class="flex justify-between items-center mb-10">
          <h1 class="text-4xl font-extrabold gradient-purple"
              style="filter: drop-shadow(0 0 20px rgba(168,139,250,0.5))">
            ${t.profile}
          </h1>
          <a href="#dashboard"
             class="text-sm text-slate-400 hover:text-purple-400 transition">
            ← Dashboard
          </a>
        </div>

        <!-- Profile Card -->
        <div class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/20 rounded-3xl p-10 shadow-2xl">

          <!-- User Info -->
          <div class="flex items-center gap-8 mb-10">

            <!-- Avatar (backend-managed later) -->
            <div class="w-24 h-24 rounded-full bg-slate-700/60 border border-slate-400/30 overflow-hidden flex items-center justify-center text-3xl">
              <img
                data-avatar
                alt="avatar"
                class="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 class="text-2xl font-bold text-white">${user.username}</h2>
              <p class="text-slate-400">${user.email ?? ""}</p>
              <p class="text-sm text-slate-500 mt-1">
                ${t.language ?? "Langue"} : ${lang.toUpperCase()}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-4">

            <button id="logout-btn"
              class="px-6 py-3 rounded-xl font-semibold bg-red-500/80 hover:bg-red-500 transition">
              ${t.logout}
            </button>
          </div>

        </div>
      </div>
    </div>
  `;
  paintAvatars(true);
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    logout();
    window.location.hash = "#home";
  });
}