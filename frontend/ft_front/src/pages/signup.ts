export function renderSignup() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0b0f1f] to-[#1c2236]">

      <div class="w-full max-w-md bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-400/10 shadow-2xl">

        <h2 class="text-4xl font-extrabold text-center mb-2 text-white">
          Inscription
        </h2>
        <p class="text-slate-400 text-center mb-8">
          Crée ton compte pour rejoindre l’aventure
        </p>

        <form class="space-y-5">

          <div>
            <label class="block text-sm text-slate-400 mb-1">Username</label>
            <input id="signup-username" type="text" required
              class="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600/30 text-white placeholder-slate-500
                     focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
              placeholder="Votre pseudo" />
          </div>

          <div>
            <label class="block text-sm text-slate-400 mb-1">Email</label>
            <input id="signup-email" type="email" required
              class="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600/30 text-white placeholder-slate-500
                     focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
              placeholder="email@exemple.com" />
          </div>

          <div>
            <label class="block text-sm text-slate-400 mb-1">Mot de passe</label>
            <input id="signup-password" type="password" required
              class="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600/30 text-white placeholder-slate-500
                     focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
              placeholder="••••••••" />
          </div>

          <button type="submit"
            class="w-full py-3 rounded-2xl font-semibold text-white
                   bg-gradient-to-br from-indigo-500 to-purple-600
                   transition-all duration-300 hover:-translate-y-1
                   hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)]">
            Créer un compte
          </button>
        </form>

        <p class="text-slate-400 text-sm text-center mt-6">
          Déjà un compte ?
          <a href="#login" class="text-purple-400 hover:underline ml-1">
            Se connecter
          </a>
        </p>

        <div class="text-center mt-4">
          <a href="#home"
             class="text-sm text-slate-400 hover:text-purple-400 transition">
            ← Retour à l'accueil
          </a>
        </div>

      </div>
    </div>
  `;
}

export function onMountSignup(): void {
  const form = document.querySelector<HTMLFormElement>("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (document.getElementById("signup-username") as HTMLInputElement)?.value.trim();
    const email = (document.getElementById("signup-email") as HTMLInputElement)?.value.trim();
    const password = (document.getElementById("signup-password") as HTMLInputElement)?.value;

    if (!username || !email || !password) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    try {
      const res = await fetch("https://localhost:4999/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log("Signup error:", res.status, data);
        alert(data?.error ?? data?.message ?? "Signup failed");
        return;
      }

      alert(data?.message ?? "User created succesfully!");
      window.location.hash = "#login";
    } catch (err) {
      console.error(err);
      alert("Erreur réseau. Réessaie.");
    }
  });
}
