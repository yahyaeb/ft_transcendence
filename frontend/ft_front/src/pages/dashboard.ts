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
              Tic-Tac-Toe
            </button>
          </div>
        </div>

        <!-- Menu -->
        <nav class="flex flex-col gap-4 text-slate-300">
          <button id="profileBtn" class="text-left font-medium hover:text-purple-400 transition">
            Profile
          </button>
          <button id="settingsBtn" class="text-left font-medium hover:text-purple-400 transition">
            Settings
          </button>
        </nav>

        <!-- Players list -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-wider text-slate-400">
              Joueurs
            </p>
            <span class="text-[11px] text-slate-500"></span>
          </div>

          <div class="relative mb-4">
            <input
              id="players-search"
              type="text"
              placeholder="Rechercher un joueur…"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/20 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/15 transition"
            />
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</div>
          </div>

          <ul id="players-list" class="space-y-1">
            <li class="group flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 hover:bg-slate-900/35 transition">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-full bg-slate-900/40 border border-slate-600/20 flex items-center justify-center text-slate-400">
                  👤
                </div>
                <p class="text-sm font-medium text-slate-200 truncate">PlayerOne</p>
              </div>

              <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Accepter"
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/30 transition"
                >
                  ✓
                </button>
                <button
                  type="button"
                  title="Refuser"
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/30 transition"
                >
                  ✕
                </button>
                <button
                  type="button"
                  title="Bloquer"
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition"
                >
                  🚫
                </button>
              </div>
            </li>

            <li class="group flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 hover:bg-slate-900/35 transition">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-full bg-slate-900/40 border border-slate-600/20 flex items-center justify-center text-slate-400">
                  👤
                </div>
                <p class="text-sm font-medium text-slate-200 truncate">PlayerTwo</p>
              </div>

              <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" title="Accepter" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/30 transition">✓</button>
                <button type="button" title="Refuser" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/30 transition">✕</button>
                <button type="button" title="Bloquer" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition">🚫</button>
              </div>
            </li>

            <li class="group flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 hover:bg-slate-900/35 transition">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-full bg-slate-900/40 border border-slate-600/20 flex items-center justify-center text-slate-400">
                  👤
                </div>
                <p class="text-sm font-medium text-slate-200 truncate">PlayerThree</p>
              </div>

              <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" title="Accepter" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/30 transition">✓</button>
                <button type="button" title="Refuser" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/30 transition">✕</button>
                <button type="button" title="Bloquer" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition">🚫</button>
              </div>
            </li>
          </ul>

          <!--
            TODO (backend):
            - Remplacer cette liste mockée par la liste réelle (amis / joueurs / demandes)
            - Brancher la recherche sur endpoint backend
            - Brancher ✓ ✕ 🚫 sur endpoints backend
          -->
        </div>

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

            <button id="pongBtn"
              class="relative group w-[320px] h-[180px] rounded-3xl overflow-hidden border border-slate-400/10 hover:scale-105 transition-all duration-300"
              style="background-image: url('/images/games/pong.png'); background-size: cover; background-position: center;">
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/20 transition"></div>

              <span class="relative z-10 flex items-center justify-center h-full text-3xl font-extrabold text-white drop-shadow-lg tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                 Pong
              </span>
            </button>

            <button id="tictactoeBtn"
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
                <p class="text-slate-400 mb-4">Victoires</p>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs uppercase tracking-wide text-slate-500 mb-1">
                      Classique
                    </p>
                    <p class="text-3xl font-extrabold gradient-green">
                      12
                    </p>
                  </div>

                  <div>
                    <p class="text-xs uppercase tracking-wide text-slate-500 mb-1">
                      Tournois
                    </p>
                    <p class="text-3xl font-extrabold gradient-purple">
                      1
                    </p>
                  </div>
                </div>
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

            <div class="bg-slate-900/60 rounded-2xl p-6">
              <canvas id="statsLineChart" width="600" height="260"></canvas>
              <div class="mt-6 flex justify-center gap-6 text-sm text-slate-400">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span>Victoires</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-cyan-400"></span>
                  <span>Défaites</span>
                </div>
              </div>
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

  const TOKEN_KEY = "access_token";
  const token = localStorage.getItem(TOKEN_KEY) || "";
  const pongBtn = document.getElementById('pongBtn');
  const tictactoeBtn = document.getElementById('tictactoeBtn');

  avatarBtn?.addEventListener("click", () => {
    window.location.hash = "#profile";
  });

  const settingsBtn = document.getElementById("settingsBtn");

  settingsBtn?.addEventListener("click", () => {
    window.location.hash = "#settings";
  });

  const profileBtn = document.getElementById("profileBtn");

  profileBtn?.addEventListener("click", () => {
    window.location.hash = "#profile";
  });

  const canvas = document.getElementById("statsLineChart") as HTMLCanvasElement | null;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = {
      labels: ["J1", "J2", "J3", "J4", "J5", "J6"],
      wins: [2, 3, 5, 6, 9, 12],
      losses: [1, 1, 2, 3, 4, 5]
    };

    const padding = 40;
    const maxValue = Math.max(...data.wins, ...data.losses);
    const stepX = (canvas.width - padding * 2) / (data.labels.length - 1);
    const stepY = (canvas.height - padding * 2) / maxValue;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    function drawLine(values: number[], color: string) {
      if (!ctx || !canvas) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = padding + i * stepX;
        const y = canvas.height - padding - v * stepY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    drawLine(data.wins, "#8b5cf6");   // purple (theme)
    drawLine(data.losses, "#22d3ee"); // cyan (theme)
  }
  pongBtn?.addEventListener('click', () => {
    window.location.href = `https://localhost:5174/pong?token=${encodeURIComponent(token)}`;
  });

  tictactoeBtn?.addEventListener('click', () => {
    window.location.href = `https://localhost:5174/tictactoe?token=${encodeURIComponent(token)}`;
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