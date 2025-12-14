import { getLanguage } from "../state/language";
import { translations } from "../i18n/translations";
import { getUser, logout } from "../state/auth";


type Gender = "male" | "female" | "berserker" | "";

export function renderProfile() {
  const app = document.getElementById("app");
  if (!app) return;

  const user = getUser();

  const lang = getLanguage();
  const t = translations[lang];

  // Front-only profile state
  let profile = {
    avatar: "👾",
    nickname: user?.username ?? "Player",
    age: "",
    gender: "" as Gender,
    achievements: [
      { title: "First Login", icon: "🥇" },
      { title: "Pong Beginner", icon: "🏓" },
      { title: "42 Student", icon: "🎓" },
    ],
  };

  function render() {
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center px-6 py-10">

        <div class="w-full max-w-4xl flex justify-between items-center mb-10">
          <h1 class="text-3xl font-bold text-white">${t.profile}</h1>
          <a href="#home" class="text-sm text-gray-300 hover:underline">← Home</a>
        </div>

        <div class="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">

          <!-- Avatar Picker -->
          <div class="flex items-center gap-6 mb-10">
            <div class="text-6xl">${profile.avatar}</div>
            <div class="flex gap-3">
              ${["👾", "😺", "🤖", "🦄", "🐧"]
                .map(
                  (a) =>
                    `<button data-avatar="${a}" class="avatar-btn text-2xl hover:scale-110 transition">${a}</button>`
                )
                .join("")}
            </div>
          </div>

          <!-- Identity -->
          <h2 class="text-2xl font-bold text-white">${profile.nickname}</h2>
          <p class="text-gray-400 mb-8">${user?.email}</p>

          <!-- Editable fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            <div>
              <label class="block text-sm text-gray-300 mb-1">
                ${t.age}
              </label>
              <input id="age-input" type="number" min="1"
                value="${profile.age}"
                class="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none" />
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-1">
                ${t.gender}
              </label>
              <select id="gender-select"
                class="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none">
                <option value="">—</option>
                <option value="male" ${profile.gender === "male" ? "selected" : ""}>Male</option>
                <option value="female" ${profile.gender === "female" ? "selected" : ""}>Female</option>
                <option value="berserker" ${profile.gender === "berserker" ? "selected" : ""}>Berserker</option>
              </select>
            </div>

          </div>

          <!-- Achievements -->
          <div class="mb-10">
            <h3 class="text-xl font-semibold text-white mb-4">${t.achievements}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              ${profile.achievements
                .map(
                  (a) => `
                  <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div class="text-3xl mb-2">${a.icon}</div>
                    <span class="text-sm text-gray-300">${a.title}</span>
                  </div>
                `
                )
                .join("")}
            </div>
          </div>

          <div class="flex justify-end">
            <button id="logout-btn"
              class="px-6 py-3 rounded-xl font-semibold text-white bg-red-500/80 hover:bg-red-500 transition">
              ${t.logout}
            </button>
          </div>

        </div>
      </div>
    `;

    // Avatar picker logic
    document.querySelectorAll<HTMLButtonElement>(".avatar-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        profile.avatar = btn.dataset.avatar as string;
        render();
      });
    });

    // Age input
    const ageInput = document.getElementById("age-input") as HTMLInputElement;
    ageInput.addEventListener("input", () => {
      profile.age = ageInput.value;
    });

    // Gender select
    const genderSelect = document.getElementById("gender-select") as HTMLSelectElement;
    genderSelect.addEventListener("change", () => {
      profile.gender = genderSelect.value as Gender;
    });

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn?.addEventListener("click", () => {
      logout();
      window.location.hash = "#home";
    });
  }

  render();
}