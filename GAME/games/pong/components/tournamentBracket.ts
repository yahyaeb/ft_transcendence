export function render(): string {
  return `
    <div class="text-center max-w-[1200px] w-full mx-auto">
      <div class="mb-10">
        <a href="/pong/game-mode" data-link 
           class="mb-6 text-slate-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 mx-auto w-fit">
          <span>←</span>
          <span>Retour</span>
        </a>
        <h1 class="text-5xl font-extrabold mb-3 gradient-purple" 
            style="filter: drop-shadow(0 0 20px rgba(168, 139, 250, 0.5))">
          Organisation du Tournoi
        </h1>
        <p class="text-slate-400 text-base tracking-wide">Tableau des matchs</p>
      </div>
      <div class="flex justify-center items-center gap-16 px-8">
        <div class="flex flex-col gap-12">
          <div class="text-left">
            <h3 class="text-sm text-slate-500 uppercase tracking-wider mb-4 text-center">Demi-Finales</h3>
            <div class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-6 mb-8 min-w-[280px]">
              <div class="text-xs text-slate-500 uppercase tracking-wider mb-3">Match 1</div>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-slate-900/50 rounded-lg px-4 py-3 border border-purple-500/30">
                  <span id="match1-player1" class="text-purple-400 font-semibold">Player 1</span>
                </div>
                <div class="flex items-center justify-between bg-slate-900/50 rounded-lg px-4 py-3 border border-cyan-500/30">
                  <span id="match1-player2" class="text-cyan-400 font-semibold">Player 2</span>
                </div>
              </div>
            </div>
            <div class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-6 min-w-[280px]">
              <div class="text-xs text-slate-500 uppercase tracking-wider mb-3">Match 2</div>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-slate-900/50 rounded-lg px-4 py-3 border border-purple-500/30">
                  <span id="match2-player1" class="text-purple-400 font-semibold">Player 3</span>
                </div>
                <div class="flex items-center justify-between bg-slate-900/50 rounded-lg px-4 py-3 border border-cyan-500/30">
                  <span id="match2-player2" class="text-cyan-400 font-semibold">Player 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center">
          <div class="text-3xl mb-4" style="filter: drop-shadow(0 0 10px rgba(168, 139, 250, 0.5))">→</div>
          <div class="h-32"></div>
          <div class="text-3xl" style="filter: drop-shadow(0 0 10px rgba(168, 139, 250, 0.5))">→</div>
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-sm text-slate-500 uppercase tracking-wider mb-4 text-center">Finale</h3>
          <div class="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-yellow-500/30 rounded-2xl p-8 min-w-[320px]">
            <div class="text-xs text-yellow-400 uppercase tracking-wider mb-4 text-center font-semibold">Match Final</div>
            <div class="space-y-4">
              <div class="flex items-center justify-between bg-slate-900/70 rounded-xl px-5 py-4 border-2 border-purple-500/40">
                <span class="text-purple-300 font-semibold">Gagnant Match 1</span>
              </div>
              <div class="text-center text-2xl font-bold text-yellow-400">VS</div>
              <div class="flex items-center justify-between bg-slate-900/70 rounded-xl px-5 py-4 border-2 border-cyan-500/40">
                <span class="text-cyan-300 font-semibold">Gagnant Match 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-12">
        <button id="startTournament"
                class="font-semibold text-lg cursor-pointer px-12 py-5 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)]"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
          Commencer le Tournoi
        </button>
      </div>
    </div>
  `;
}

export function onMount(): void {
  const tournamentDataStr = sessionStorage.getItem('tournamentData');
  
  if (tournamentDataStr) {
    const tournamentData = JSON.parse(tournamentDataStr);
    const players = tournamentData.players;

    document.getElementById('match1-player1')!.textContent = players[0];
    document.getElementById('match1-player2')!.textContent = players[1];
    document.getElementById('match2-player1')!.textContent = players[2];
    document.getElementById('match2-player2')!.textContent = players[3];

    sessionStorage.setItem('tournamentPlayers', JSON.stringify({
      player1: players[0],
      player2: players[1],
      player3: players[2],
      player4: players[3]
    }));
  }

  const startTournamentButton = document.getElementById('startTournament');
  startTournamentButton?.addEventListener('click', () => {
    sessionStorage.setItem('currentMatch', '1');
    sessionStorage.setItem('match1Winner', '');
    sessionStorage.setItem('match2Winner', '');

    const tournamentPlayersStr = sessionStorage.getItem('tournamentPlayers');
    if (tournamentPlayersStr) {
      const players = JSON.parse(tournamentPlayersStr);
      window.history.pushState({}, '', '/pong/gameplay');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  });
  
}
