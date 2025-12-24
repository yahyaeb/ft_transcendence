

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
        <p class="text-2xl text-slate-400 tracking-wide">Bon courage pour la suite</p>
      </div>

      <div class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 mb-8">
        <div class="text-slate-400 text-sm uppercase tracking-wider mb-4">Score Final</div>
        <div class="flex justify-center items-center gap-8">
          <!-- Score joueur 1 -->
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

      <div id="nextMatchInfo" class="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-yellow-500/30 rounded-2xl p-6 mb-8">
        <div class="text-xs text-yellow-400 uppercase tracking-wider mb-4">Prochain Match</div>
        <div class="flex justify-center items-center gap-4">
          <div id="nextPlayer1" class="text-xl font-bold text-purple-300"></div>
          <div class="text-2xl text-yellow-400 font-bold">VS</div>
          <div id="nextPlayer2" class="text-xl font-bold text-cyan-300"></div>
        </div>
      </div>
      
      <div class="flex flex-col gap-4 px-8">
        <button id="nextMatchBtn"
                class="font-semibold text-lg cursor-pointer px-8 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.5)]"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
          Prochain Match
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
  winnerTitle.textContent = `${winnerName} Wins!`;

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

  const tournamentPlayersStr = sessionStorage.getItem('tournamentPlayers');
  const currentMatch = sessionStorage.getItem('currentMatch') || '1';

  const nextPlayer1Element = document.getElementById('nextPlayer1')!;
  const nextPlayer2Element = document.getElementById('nextPlayer2')!;

  if (tournamentPlayersStr) {
    const tournamentPlayers = JSON.parse(tournamentPlayersStr);

    if (currentMatch === '1') {
      nextPlayer1Element.textContent = tournamentPlayers.player3 || 'Player 3';
      nextPlayer2Element.textContent = tournamentPlayers.player4 || 'Player 4';
    } else if (currentMatch === '2') {
      const match1Winner = sessionStorage.getItem('match1Winner') || 'Gagnant Match 1';
      const match2Winner = winnerName; 
      
      nextPlayer1Element.textContent = match1Winner;
      nextPlayer2Element.textContent = match2Winner;
    }
  }
  const nextMatchBtn = document.getElementById('nextMatchBtn');
  nextMatchBtn?.addEventListener('click', () => {
    
    if (tournamentPlayersStr) {
      const tournamentPlayers = JSON.parse(tournamentPlayersStr);
      if (currentMatch === '1') {
        sessionStorage.setItem('currentMatch', '2');
        window.history.pushState({}, '', '/pong/gameplay');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else if (currentMatch === '2') {
        const match1Winner = sessionStorage.getItem('match1Winner');
        const match2Winner = sessionStorage.getItem('match2Winner');
        sessionStorage.setItem('currentMatch', 'final');
        window.history.pushState({}, '', '/pong/gameplay');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  });
}
