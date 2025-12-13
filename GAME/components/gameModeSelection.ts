interface TournamentData {
  players: string[];
}

export function render(): string {
  return `
    <div class="text-center max-w-[600px] w-full mx-auto">
      <div class="mb-10">
        <a href="/" data-link 
           class="mb-6 text-slate-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 mx-auto w-fit">
          <span>←</span>
          <span>Retour</span>
        </a>
        <h1 class="text-5xl font-extrabold mb-3 gradient-purple" 
            style="filter: drop-shadow(0 0 20px rgba(168, 139, 250, 0.5))">
          Joueur vs Joueur
        </h1>
        <p class="text-slate-400 text-base tracking-wide">Choisissez votre mode de jeu</p>
      </div>

      <div class="flex flex-col gap-6 px-8">
        <a href="/gameplay" data-link 
           class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer block no-underline"
           style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative">
            <h2 class="text-3xl font-bold mb-2 gradient-purple">Match 1 vs 1</h2>
            <p class="text-slate-400">Un duel classique entre deux joueurs</p>
          </div>
        </a>


        <button id="tournamentBtn" 
                class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer text-left"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative">
            <h2 class="text-3xl flex justify-center font-bold mb-2 gradient-purple">Tournoi</h2>
            <p class="text-slate-400">Organisez un tournoi avec 4 joueurs</p>
          </div>
        </button>
      </div>
    </div>


    <div id="modal" class="fixed inset-0 bg-black/30 backdrop-blur-lg flex justify-center items-center p-5 z-50 hidden">
      <div class="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-400/20 rounded-3xl max-w-[550px] w-full mx-auto shadow-2xl p-10">
        <div class="mb-8 text-center">
          <h2 class="text-4xl font-extrabold mb-2 gradient-purple" 
              style="filter: drop-shadow(0 0 15px rgba(168, 139, 250, 0.4))">
            Configuration Tournoi
          </h2>
          <p class="text-slate-400 text-sm">Entrez les pseudos des 4 joueurs</p>
        </div>

        <div class="space-y-4 mb-8">
          ${[1, 2, 3, 4].map(num => `
            <div class="relative">
              <input id="player${num}" type="text" placeholder="Pseudo joueur ${num}" 
                     class="w-full px-5 py-4 bg-slate-900/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200" />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold">${num}</div>
            </div>
          `).join('')}
        </div>

        <button id="closeModal" 
                class="w-full font-semibold text-lg cursor-pointer px-9 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)]"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
          Valider
        </button>
      </div>
    </div>
  `;
}

export function onMount(): void {
  const tournamentBtn = document.getElementById('tournamentBtn');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');
  const player1 = (document.getElementById('player1') as HTMLInputElement) || 'Player 1'
  const player2 = (document.getElementById('player2') as HTMLInputElement) || 'Player 2'
  const player3 = (document.getElementById('player3') as HTMLInputElement) || 'Player 3'
  const player4 = (document.getElementById('player4') as HTMLInputElement) || 'Player 4'

  player1.value = localStorage.getItem('player1') || ''
  tournamentBtn?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });

  function hasDuplicates(arr: string[]): boolean {
  return new Set(arr).size !== arr.length;
  }
  closeModalBtn?.addEventListener('click', () => {
    const players = [
      (document.getElementById('player1') as HTMLInputElement)?.value.trim() || '',
      (document.getElementById('player2') as HTMLInputElement)?.value.trim() || '',
      (document.getElementById('player3') as HTMLInputElement)?.value.trim() || '',
      (document.getElementById('player4') as HTMLInputElement)?.value.trim() || '',
    ];
    if (players.some(p => p === '')) {
      alert("Veuillez inserer un pseudo pour chaque joueur");
      return; 
    }
    if (hasDuplicates(players)) {
      alert("Veuillez inserer le pseudo une seule fois");
      return; 
    }
    const tournamentData: TournamentData = { players };
    sessionStorage.setItem('tournamentData', JSON.stringify(tournamentData));
    modal?.classList.add('hidden');
    window.history.pushState({}, '', '/tournament-bracket');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  window.addEventListener('keydown', (e)=>{
    if (e.key == "Escape"){
        modal?.classList.add('hidden')
        player2.value = ""
        player3.value = ""
        player4.value = ""
    }
  })
}