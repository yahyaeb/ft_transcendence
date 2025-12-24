// src/pages/dashboard.ts

export function renderDashboard() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen flex bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200">

      <!-- SIDEBAR -->
      <aside class="w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-400/10 p-6 flex flex-col gap-10">

        <!-- Game Switch -->
        <div>
          <p class="text-xs uppercase tracking-wider text-slate-400 mb-3">
            Jeu actif
          </p>
          <div id="game-switch" class="flex bg-slate-900/60 rounded-full p-1">
            <button
              data-game="pong"
              class="flex-1 rounded-full py-1 text-sm font-semibold bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
              Pong
            </button>
            <button
              data-game="Tic Tac Toe"
              class="flex-1 rounded-full py-1 text-sm text-slate-400 hover:text-white transition">
              Tic Tac Toe
            </button>
          </div>
        </div>

        <!-- Menu -->
        <nav class="flex flex-col gap-4 text-slate-300">
          <button class="text-left font-medium hover:text-purple-400 transition">
            Profile
          </button>
          <button class="text-left font-medium hover:text-purple-400 transition">
            Settings
          </button>
        </nav>

      </aside>

      <!-- MAIN -->
      <main class="flex-1 flex flex-col">

        <!-- HEADER -->
        <header class="flex justify-end items-center px-6 pt-4 pb-2">
         <div
  			id="avatar-btn"
  			class="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:ring-2 hover:ring-purple-500 transition cursor-pointer"
  			title="Profil">
  			👤
		</div>
        </header>

        <!-- CONTENT -->
        <section class="flex-1 px-10 pt-0">

          <h1 class="text-4xl font-semibold mb-4 mt-0 text-slate-400 tracking-wide">
            Tableau de bord
          </h1>

          <div class="flex gap-12 justify-center mb-16">

            <button
              class="relative group w-[320px] h-[180px] rounded-3xl overflow-hidden border border-slate-400/10 hover:scale-105 transition-all duration-300"
              style="background-image: url('/images/games/pong.png'); background-size: cover; background-position: center;">
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/20 transition"></div>

              <span class="relative z-10 flex items-center justify-center h-full text-3xl font-extrabold text-white drop-shadow-lg tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                 Pong
              </span>
            </button>

            <button
              class="relative group w-[320px] h-[180px] rounded-3xl overflow-hidden border border-slate-400/10 hover:scale-105 transition-all duration-300"
              style="background-image: url('/images/games/tictactoe.png'); background-size: cover; background-position: center;">
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/20 transition"></div>

              <span class="relative z-10 flex items-center justify-center h-full text-3xl font-extrabold text-white drop-shadow-lg tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                 Tic Tac Toe
              </span>
            </button>

          </div>

          <section class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-3xl p-10">

            <h2 class="text-3xl font-bold mb-8">
              Statistiques du jeu
            </h2>

            <div class="grid grid-cols-3 gap-8 mb-10">
              <div class="bg-slate-900/60 rounded-2xl p-6 text-center">
                <p class="text-slate-400 mb-1">Victoires</p>
                <p class="text-4xl font-extrabold gradient-green">12</p>
              </div>
              <div class="bg-slate-900/60 rounded-2xl p-6 text-center">
                <p class="text-slate-400 mb-1">Défaites</p>
                <p class="text-4xl font-extrabold gradient-red">5</p>
              </div>
              <div class="bg-slate-900/60 rounded-2xl p-6 text-center">
                <p class="text-slate-400 mb-1">Winrate</p>
                <p class="text-4xl font-extrabold gradient-cyan">70%</p>
              </div>
            </div>

            <div class="bg-slate-900/60 rounded-2xl h-64 flex items-center justify-center text-slate-500">
              📊 Graphiques (à venir)
            </div>

          </section>

        </section>
      </main>
    </div>
  `;
}

export function onMountDashboard(): void {
  const switchButtons = document.querySelectorAll<HTMLButtonElement>(
    '#game-switch button'
  );
  const avatarBtn = document.getElementById("avatar-btn");
  	avatarBtn?.addEventListener("click", () => {
  	window.location.hash = "#profile";
	});

  switchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchButtons.forEach(b => {
        b.classList.remove(
          'bg-gradient-to-br',
          'from-indigo-500',
          'to-purple-600',
          'text-white',
          'shadow'
        );
        b.classList.add('text-slate-400');
      });

      btn.classList.add(
        'bg-gradient-to-br',
        'from-indigo-500',
        'to-purple-600',
        'text-white',
        'shadow'
      );
      btn.classList.remove('text-slate-400');
    });
  });
}