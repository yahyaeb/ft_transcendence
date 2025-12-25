interface TournamentData {
  players: string[];
}

interface GameCustomization {
  paddle1Color: string;
  paddle2Color: string;
  ballColor: string;
  boardBackground: string;
  mapStyle: string;
  centerLineColor: string;
}

const defaultCustomization: GameCustomization = {
  paddle1Color: '#a78bfa',
  paddle2Color: '#22d3ee',
  ballColor: '#f8fafc',
  boardBackground: '#0f172a',
  mapStyle: 'classic',
  centerLineColor: 'rgba(100, 116, 139, 0.25)'
};

const mapStyles: Record<string, { name: string; boardBg: string; centerLineColor: string }> = {
  classic: { name: 'Classique', boardBg: '#0f172a', centerLineColor: 'rgba(100, 116, 139, 0.25)' },
  neon: { name: 'Néon', boardBg: '#0a0a1a', centerLineColor: 'rgba(236, 72, 153, 0.5)' },
  retro: { name: 'Rétro', boardBg: '#1a1a2e', centerLineColor: 'rgba(233, 196, 106, 0.4)' },
  forest: { name: 'Forêt', boardBg: '#0d1f0d', centerLineColor: 'rgba(34, 197, 94, 0.3)' },
  ocean: { name: 'Océan', boardBg: '#0c1929', centerLineColor: 'rgba(56, 189, 248, 0.3)' }
};

const colorPresets = {
  paddle: [
    { name: 'Violet', value: '#a78bfa' },
    { name: 'Cyan', value: '#22d3ee' },
    { name: 'Rose', value: '#f472b6' },
    { name: 'Vert', value: '#4ade80' },
    { name: 'Orange', value: '#fb923c' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Jaune', value: '#facc15' },
    { name: 'Blanc', value: '#f8fafc' }
  ],
  ball: [
    { name: 'Blanc', value: '#f8fafc' },
    { name: 'Or', value: '#fbbf24' },
    { name: 'Rose', value: '#f472b6' },
    { name: 'Vert', value: '#4ade80' },
    { name: 'Cyan', value: '#22d3ee' }
  ]
};

export function render(): string {
  return `
    <div class="text-center max-w-[600px] w-full mx-auto">
      <div class="mb-10">
        <div class="flex items-center justify-between mb-6">
          <a href="/pong" data-link 
             class="text-slate-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2">
            <span>←</span>
            <span>Retour</span>
          </a>
          <button id="customizeBtn" 
                  class="flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-xl border border-slate-400/20 rounded-xl text-slate-300 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300"
                  style="box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15)">
            <span class="text-sm font-medium">Personnaliser</span>
          </button>
        </div>
        <h1 class="text-5xl font-extrabold mb-3 gradient-purple" 
            style="filter: drop-shadow(0 0 20px rgba(168, 139, 250, 0.5))">
          Joueur vs Joueur
        </h1>
        <p class="text-slate-400 text-base tracking-wide">Choisissez votre mode de jeu</p>
      </div>

      <div class="flex flex-col gap-6 px-8">
        <button id="pvpBtn"
           class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer text-left"
           style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative">
            <h2 class="text-3xl flex justify-center font-bold mb-2 gradient-purple">Match 1 vs 1</h2>
            <p class="text-slate-400 flex justify-center">Un duel classique entre deux joueurs</p>
          </div>
        </button>


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

    <div id="customizationModal" class="fixed inset-0 bg-black/50 backdrop-blur-lg flex justify-center items-center p-5 z-50 hidden overflow-y-auto">
      <div class="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-400/20 rounded-3xl max-w-[700px] w-full mx-auto shadow-2xl p-8 my-8">
        <button id="closeCustomizationModal" 
                class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-2xl">
          ✕
        </button>
        
        <div class="mb-6 text-center">
          <h2 class="text-3xl font-extrabold mb-2 gradient-purple" 
              style="filter: drop-shadow(0 0 15px rgba(168, 139, 250, 0.4))">
            Personnalisation
          </h2>
          <p class="text-slate-400 text-sm">Personnalisez votre expérience de jeu</p>
        </div>

        <div class="mb-6 flex justify-center">
          <canvas id="previewCanvas" width="300" height="150" 
                  class="border border-slate-600/30 rounded-xl"></canvas>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-300 mb-3">Style de carte</label>
          <div class="grid grid-cols-5 gap-2" id="mapButtonsContainer"></div>
        </div>

        <div class="mb-5">
          <label class="block text-sm font-medium text-slate-300 mb-3">Couleur Paddle Joueur 1</label>
          <div class="flex flex-wrap gap-2" id="paddle1ColorsContainer"></div>
        </div>

        <div class="mb-5">
          <label class="block text-sm font-medium text-slate-300 mb-3">Couleur Paddle Joueur 2</label>
          <div class="flex flex-wrap gap-2" id="paddle2ColorsContainer"></div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-300 mb-3">Couleur de la balle</label>
          <div class="flex flex-wrap gap-2" id="ballColorsContainer"></div>
        </div>

        <div class="flex gap-4">
          <button id="resetCustomization" 
                  class="flex-1 font-semibold text-base cursor-pointer px-6 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 transition-all duration-300 hover:bg-slate-600/50">
            Réinitialiser
          </button> 
          <button id="saveCustomization" 
                  class="flex-1 font-semibold text-base cursor-pointer px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)]"
                  style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>

    <div id="pvpModal" class="fixed inset-0 bg-black/30 backdrop-blur-lg flex justify-center items-center p-5 z-50 hidden">
      <div class="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-400/20 rounded-3xl max-w-[550px] w-full mx-auto shadow-2xl p-10">
        <div class="mb-8 text-center">
          <h2 class="font-extrabold flex justify-center mb-2 gradient-purple" 
              style="filter: drop-shadow(0 0 15px rgba(168, 139, 250, 0.4))">
            Match 1 vs 1
          </h2>
          <p class="text-slate-400 flex justify-center text-sm">Entrez le pseudo du joueur 2</p>
        </div>

        <div class="space-y-4 mb-8">
          <div class="relative">
            <input id="pvpPlayer2" type="text" placeholder="Pseudo joueur 2" 
                   class="w-full px-5 py-4 bg-slate-900/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
        </div>

        <button id="closePvpModal" 
                class="w-full font-semibold text-lg cursor-pointer px-9 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)]"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
          Commencer le match
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

const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');

  if (tokenFromUrl) {
    localStorage.setItem("access_token", tokenFromUrl);
  }

  const TOKEN_KEY = "access_token";
  export const TOKEN = localStorage.getItem(TOKEN_KEY);


export function getUsernameFromToken(): string {
  const TOKEN_KEY = "access_token";
  const TOKEN = localStorage.getItem(TOKEN_KEY);
  if (!TOKEN) {
    return '';
  }
  try {
    const payload = JSON.parse(atob(TOKEN.split('.')[1]));
    return payload.username;
  } catch {
    return '';
  }
}

export function onMount(): void {
  const pvpBtn = document.getElementById('pvpBtn');
  const pvpModal = document.getElementById('pvpModal');
  const closePvpModalBtn = document.getElementById('closePvpModal');
  const pvpPlayer2Input = document.getElementById('pvpPlayer2') as HTMLInputElement;

  const tournamentBtn = document.getElementById('tournamentBtn');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');
  const player1 = (document.getElementById('player1') as HTMLInputElement) || 'Player 1'
  const player2 = (document.getElementById('player2') as HTMLInputElement) || 'Player 2'
  const player3 = (document.getElementById('player3') as HTMLInputElement) || 'Player 3'
  const player4 = (document.getElementById('player4') as HTMLInputElement) || 'Player 4'

  const customizeBtn = document.getElementById('customizeBtn');
  const customizationModal = document.getElementById('customizationModal');
  const closeCustomizationModal = document.getElementById('closeCustomizationModal');
  const saveCustomizationBtn = document.getElementById('saveCustomization');
  const resetCustomizationBtn = document.getElementById('resetCustomization');
  const previewCanvas = document.getElementById('previewCanvas') as HTMLCanvasElement;
  const previewCtx = previewCanvas?.getContext('2d');
  const mapButtonsContainer = document.getElementById('mapButtonsContainer');
  const paddle1ColorsContainer = document.getElementById('paddle1ColorsContainer');
  const paddle2ColorsContainer = document.getElementById('paddle2ColorsContainer');
  const ballColorsContainer = document.getElementById('ballColorsContainer');

  let currentCustomization: GameCustomization = { ...defaultCustomization };
  
  const savedCustomization = localStorage.getItem('gameCustomization');
  if (savedCustomization) {
    try {
      currentCustomization = { ...defaultCustomization, ...JSON.parse(savedCustomization) };
    } catch (e) {
      currentCustomization = { ...defaultCustomization };
    }
  }

  function renderMapButtons() {
    if (!mapButtonsContainer) return;
    mapButtonsContainer.innerHTML = '';
    Object.entries(mapStyles).forEach(([key, style]) => {
      const btn = document.createElement('button');
      btn.dataset.map = key;
      btn.className = `map-btn px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2 ${
        key === currentCustomization.mapStyle 
          ? 'border-purple-500 bg-purple-500/20 text-purple-300' 
          : 'border-slate-600/30 bg-slate-800/50 text-slate-400 hover:border-slate-500'
      }`;
      btn.textContent = style.name;
      btn.addEventListener('click', () => {
        currentCustomization.mapStyle = key;
        currentCustomization.boardBackground = style.boardBg;
        currentCustomization.centerLineColor = style.centerLineColor;
        renderMapButtons();
        updatePreview();
      });
      mapButtonsContainer.appendChild(btn);
    });
  }

  function renderPaddle1Colors() {
    if (!paddle1ColorsContainer) return;
    paddle1ColorsContainer.innerHTML = '';
    colorPresets.paddle.forEach(color => {
      const btn = document.createElement('button');
      btn.dataset.color = color.value;
      btn.className = `w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
        color.value === currentCustomization.paddle1Color 
          ? 'border-white ring-2 ring-white/50' 
          : 'border-slate-600/30'
      }`;
      btn.style.backgroundColor = color.value;
      btn.style.boxShadow = `0 0 10px ${color.value}40`;
      btn.title = color.name;
      btn.addEventListener('click', () => {
        currentCustomization.paddle1Color = color.value;
        renderPaddle1Colors();
        updatePreview();
      });
      paddle1ColorsContainer.appendChild(btn);
    });
  }

  function renderPaddle2Colors() {
    if (!paddle2ColorsContainer) return;
    paddle2ColorsContainer.innerHTML = '';
    colorPresets.paddle.forEach(color => {
      const btn = document.createElement('button');
      btn.dataset.color = color.value;
      btn.className = `w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
        color.value === currentCustomization.paddle2Color 
          ? 'border-white ring-2 ring-white/50' 
          : 'border-slate-600/30'
      }`;
      btn.style.backgroundColor = color.value;
      btn.style.boxShadow = `0 0 10px ${color.value}40`;
      btn.title = color.name;
      btn.addEventListener('click', () => {
        currentCustomization.paddle2Color = color.value;
        renderPaddle2Colors();
        updatePreview();
      });
      paddle2ColorsContainer.appendChild(btn);
    });
  }

  function renderBallColors() {
    if (!ballColorsContainer) return;
    ballColorsContainer.innerHTML = '';
    colorPresets.ball.forEach(color => {
      const btn = document.createElement('button');
      btn.dataset.color = color.value;
      btn.className = `w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
        color.value === currentCustomization.ballColor 
          ? 'border-white ring-2 ring-white/50' 
          : 'border-slate-600/30'
      }`;
      btn.style.backgroundColor = color.value;
      btn.style.boxShadow = `0 0 10px ${color.value}40`;
      btn.title = color.name;
      btn.addEventListener('click', () => {
        currentCustomization.ballColor = color.value;
        renderBallColors();
        updatePreview();
      });
      ballColorsContainer.appendChild(btn);
    });
  }

  function updatePreview() {
    if (!previewCtx) return;
    
    previewCtx.fillStyle = currentCustomization.boardBackground;
    previewCtx.fillRect(0, 0, 300, 150);
    
    previewCtx.strokeStyle = currentCustomization.centerLineColor;
    previewCtx.lineWidth = 2;
    previewCtx.setLineDash([8, 8]);
    previewCtx.beginPath();
    previewCtx.moveTo(150, 0);
    previewCtx.lineTo(150, 150);
    previewCtx.stroke();
    
    previewCtx.beginPath();
    previewCtx.arc(150, 75, 40, 0, 2 * Math.PI);
    previewCtx.stroke();
    previewCtx.setLineDash([]);
    
    previewCtx.shadowBlur = 12;
    
    previewCtx.shadowColor = currentCustomization.paddle1Color;
    previewCtx.fillStyle = currentCustomization.paddle1Color;
    previewCtx.fillRect(15, 50, 8, 50);
    
    previewCtx.shadowColor = currentCustomization.paddle2Color;
    previewCtx.fillStyle = currentCustomization.paddle2Color;
    previewCtx.fillRect(277, 50, 8, 50);
    
    previewCtx.shadowColor = currentCustomization.ballColor;
    previewCtx.fillStyle = currentCustomization.ballColor;
    previewCtx.beginPath();
    previewCtx.arc(150, 75, 6, 0, 2 * Math.PI);
    previewCtx.fill();
    
    previewCtx.shadowBlur = 0;
  }

  function initCustomizationModal() {
    renderMapButtons();
    renderPaddle1Colors();
    renderPaddle2Colors();
    renderBallColors();
    updatePreview();
  }

  customizeBtn?.addEventListener('click', () => {
    const saved = localStorage.getItem('gameCustomization');
    if (saved) {
      try {
        currentCustomization = { ...defaultCustomization, ...JSON.parse(saved) };
      } catch (e) {
        currentCustomization = { ...defaultCustomization };
      }
    }
    initCustomizationModal();
    customizationModal?.classList.remove('hidden');
  });

  closeCustomizationModal?.addEventListener('click', () => {
    customizationModal?.classList.add('hidden');
  });

  resetCustomizationBtn?.addEventListener('click', () => {
    currentCustomization = { ...defaultCustomization };
    initCustomizationModal();
  });

  saveCustomizationBtn?.addEventListener('click', () => {
    localStorage.setItem('gameCustomization', JSON.stringify(currentCustomization));
    customizationModal?.classList.add('hidden');
  });

  player1.value = localStorage.getItem('player1') || ''

  pvpBtn?.addEventListener('click', () => {
    pvpModal?.classList.remove('hidden');
  });

  closePvpModalBtn?.addEventListener('click', () => {
    const player2Name = pvpPlayer2Input?.value.trim() || '';
    if (player2Name === '') {
      alert("Veuillez entrer un pseudo pour le joueur 2");
      return;
    }
    localStorage.setItem('pvpPlayer2', player2Name);
    pvpModal?.classList.add('hidden');
    window.history.pushState({}, '', '/pong/gameplay');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

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
    window.history.pushState({}, '', '/pong/tournament-bracket');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  window.addEventListener('keydown', (e)=>{
    if (e.key == "Escape"){
        modal?.classList.add('hidden')
        pvpModal?.classList.add('hidden')
        player2.value = ""
        player3.value = ""
        player4.value = ""
        if (pvpPlayer2Input) pvpPlayer2Input.value = ""
    }
  })
}