import { getUser, isAuthenticated } from "../state/auth";


export function renderSettings() {
  const app = document.getElementById("app");
  if (!app) return;

  // Sécurité SPA : si non connecté, on ne devrait jamais arriver ici
  if (!isAuthenticated()) {
    window.location.hash = "#login";
    return;
  }

  const user = getUser();

  app.innerHTML = `
    <div class="min-h-screen w-full bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200 flex justify-center px-6 py-16">

      <div class="w-full max-w-2xl bg-slate-800/40 backdrop-blur-xl border border-slate-400/20 rounded-3xl p-10 shadow-2xl">

        <!-- Title -->
        <h1 class="text-4xl font-extrabold mb-10 gradient-purple"
            style="filter: drop-shadow(0 0 20px rgba(168,139,250,0.5))">
          Settings
        </h1>

        <!-- AVATAR SECTION -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Avatar</h2>

          <div class="relative w-24 h-24">
            <img
              src="${user?.avatarUrl ?? "/avatars/default-avatar.png"}"
              alt="avatar"
              class="w-full h-full rounded-full object-cover border border-slate-400/30 bg-slate-700/60"
            />

            <!-- Overlay + button -->
            <button
              id="upload-avatar-btn"
              title="Changer l’avatar"
              class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 transition">
              +
            </button>
          </div>

          <!-- TODO BACKEND -->
          <!--
            Ici :
            - ouvrir un input type="file"
            - envoyer le fichier vers le backend (POST /users/avatar)
            - récupérer l’URL retournée
            - mettre à jour l’avatar utilisateur
          -->
        </section>

        <!-- USERNAME SECTION -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Nom d’utilisateur</h2>

          <input
            id="username-input"
            type="text"
            value="${user?.username ?? ""}"
            class="w-full px-5 py-4 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition"
          />

          <!-- TODO BACKEND -->
          <!--
            Ici :
            - envoyer le nouveau username au backend
            - vérifier unicité / erreurs
            - mettre à jour l’état global utilisateur
          -->
        </section>

        <!-- PASSWORD SECTION -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Mot de passe</h2>

          <input
            id="password-input"
            type="password"
            placeholder="Nouveau mot de passe"
            class="w-full px-5 py-4 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition"
          />

          <!-- TODO BACKEND -->
          <!--
            Ici :
            - vérifier la sécurité du mot de passe
            - envoyer au backend (PATCH /users/password)
          -->
        </section>

        <!-- ACTIONS -->
        <div class="flex justify-between items-center mt-10">
          <a
            href="#profile"
            class="text-slate-400 hover:text-purple-400 transition">
            ← Retour au profil
          </a>

          <button
            id="save-settings-btn"
            class="px-8 py-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)] transition">
            Sauvegarder
          </button>
        </div>

        <!-- TODO BACKEND -->
        <!--
          Bouton "Sauvegarder" :
          - regrouper toutes les modifications
          - envoyer au backend
          - afficher un feedback utilisateur (toast / message)
        -->

      </div>
    </div>
  `;
}

export function onMountSettings() {
  // Placeholder pour logique JS future

  // TODO :
  // gestion click upload avatar
  // gestion submit settings
  // gestion erreurs backend
}