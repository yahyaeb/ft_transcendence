
export function render(): string {
  return `
    <div class="text-center max-w-[700px] w-full mx-auto">
      <div class="text-9xl mb-8 animate-bounce" style="filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))">
        🏆
      </div>

      <div class="mb-8">
        <h1 id="winnerTitle" class="text-6xl font-extrabold mb-4 gradient-purple" 
            style="filter: drop-shadow(0 0 25px rgba(168, 139, 250, 0.6))">
          Player 1 Wins!
        </h1>
        <p class="text-2xl text-slate-400 tracking-wide">Félicitations pour cette victoire éclatante!</p>
      </div>

      <div class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 mb-8">
        <div class="text-slate-400 text-sm uppercase tracking-wider mb-4">Score Final</div>
        <div class="flex justify-center items-center gap-8">
          <div>
            <div id="player1Name" class="text-lg text-purple-400 mb-2">Player 1</div>
            <div id="finalScore1" class="text-5xl font-extrabold gradient-purple">5</div>
          </div>

          <div class="text-3xl text-slate-600">-</div>

          <div>
            <div id="player2Name" class="text-lg text-cyan-400 mb-2">Player 2</div>
            <div id="finalScore2" class="text-5xl font-extrabold gradient-cyan">0</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 px-8">
        <button id="replayBtn"
                class="font-semibold text-lg cursor-pointer px-8 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.5)]"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
          Rejouer en 1 vs 1
        </button>
        
        <button id="menuBtn"
                class="font-semibold text-lg cursor-pointer px-8 py-4 bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl text-slate-300 transition-all duration-300 hover:border-purple-500/50 hover:text-white">
          Retour au Menu
        </button>
      </div>
    </div>
  `;
}

export function onMount(): void {

  const urlParams = new URLSearchParams(window.location.search);
  const winner = urlParams.get('winner') || '1'; 
  const score1 = urlParams.get('score1') || '5'; 
  const score2 = urlParams.get('score2') || '0'; 
  const player1 = urlParams.get('player1') || 'Player 1'; 
  const player2 = urlParams.get('player2') || 'Player 2'; 
  const winnerName = winner === '1' ? player1 : player2;

  const winnerTitle = document.getElementById('winnerTitle')!;
  winnerTitle.textContent = `${winnerName} Gagne!`;

  if (winner === '1') {
    winnerTitle.className = 'text-6xl font-extrabold mb-4 gradient-purple';
    winnerTitle.style.filter = 'drop-shadow(0 0 25px rgba(168, 139, 250, 0.6))';
  } else {
    winnerTitle.className = 'text-6xl font-extrabold mb-4 gradient-cyan';
    winnerTitle.style.filter = 'drop-shadow(0 0 25px rgba(34, 211, 238, 0.6))';
  }

  document.getElementById('player1Name')!.textContent = player1;
  document.getElementById('player2Name')!.textContent = player2;
  document.getElementById('finalScore1')!.textContent = score1;
  document.getElementById('finalScore2')!.textContent = score2;


  const replayBtn = document.getElementById('replayBtn');
  replayBtn?.addEventListener('click', () => {
    const wasAiGame = sessionStorage.getItem('ai');
    const aiDifficulty = sessionStorage.getItem('aiDifficulty');
    const wasTournament = sessionStorage.getItem('currentMatch');

    sessionStorage.clear();
    if (wasAiGame) {
      sessionStorage.setItem('ai', wasAiGame);
      if (aiDifficulty) {
        sessionStorage.setItem('aiDifficulty', aiDifficulty);
      }
    }
    if (wasTournament){
      localStorage.removeItem('pvpPlayer2')
    }
    window.history.pushState({}, '', '/pong/gameplay');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  const menuBtn = document.getElementById('menuBtn');
  menuBtn?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'https://localhost:5173/#dashboard';
  });
}
