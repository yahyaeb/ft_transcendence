export function render(): string {
  return `
    <div class="text-center max-w-[600px] w-full mx-auto">
      <div class="mb-12">
        <h1 class="text-7xl font-extrabold mb-4 gradient-purple" 
            style="filter: drop-shadow(0 0 20px rgba(168, 139, 250, 0.5))">
          PONG
        </h1>
        <p class="text-slate-400 text-lg tracking-wide">Transcendence Edition</p>
      </div>
      <div class="flex flex-col gap-6 px-8">
        <!-- Bouton PvP -->
        <!-- data-link indique que c'est un lien géré par notre router -->
        <!-- href="/game-mode" définit vers quelle route naviguer -->
        <a href="/game-mode" data-link 
           class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer block no-underline"
           style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative">
            <h2 class="text-3xl font-bold mb-2 gradient-purple">Joueur vs Joueur</h2>
            <p class="text-slate-400">Défiez un ami sur le même clavier</p>
            <div class="mt-4 text-sm text-slate-500">
              <span class="inline-block mr-3">Joueur 1: W/S</span>
              <span class="inline-block">Joueur 2: ↑/↓</span>
            </div>
          </div>
        </a>
        <a href="/ai-difficulty" data-link 
           class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer block no-underline"
           style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative">
            <h2 class="text-3xl font-bold mb-2 gradient-purple">Joueur vs IA</h2>
            <p class="text-slate-400">Affrontez l'intelligence artificielle</p>
            <div class="mt-4 text-sm text-slate-500">
              <span class="inline-block mr-3">Joueur 1: W/S</span>
            </div>
          </div>
        </a>
      </div>
      <div class="mt-12 text-slate-500 text-sm">
        <p>Utilisez W/S et les flèches ↑/↓ pour contrôler les paddles</p>
      </div>
    </div>
  `;
}

export function onMount(): void {
  console.log("main page mounted");
  
  sessionStorage.clear();
}