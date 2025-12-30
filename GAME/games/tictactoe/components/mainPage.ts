interface GameCustomization {
  xColor: string;
  oColor: string;
  boardBackground: string;
  gridColor: string;
  mapStyle: string;
}

const defaultCustomization: GameCustomization = {
  xColor: '#a78bfa',
  oColor: '#22d3ee',
  boardBackground: '#0f172a',
  gridColor: 'rgba(100, 116, 139, 0.4)',
  mapStyle: 'classic'
};

const mapStyles: Record<string, { name: string; boardBg: string; gridColor: string }> = {
  classic: { name: 'Classique', boardBg: '#0f172a', gridColor: 'rgba(100, 116, 139, 0.4)' },
  neon: { name: 'Néon', boardBg: '#0a0a1a', gridColor: 'rgba(236, 72, 153, 0.5)' },
  retro: { name: 'Rétro', boardBg: '#1a1a2e', gridColor: 'rgba(233, 196, 106, 0.4)' },
  forest: { name: 'Forêt', boardBg: '#0d1f0d', gridColor: 'rgba(34, 197, 94, 0.3)' },
  ocean: { name: 'Océan', boardBg: '#0c1929', gridColor: 'rgba(56, 189, 248, 0.3)' }
};

const colorPresets = {
  symbol: [
    { name: 'Violet', value: '#a78bfa' },
    { name: 'Cyan', value: '#22d3ee' },
    { name: 'Rose', value: '#f472b6' },
    { name: 'Vert', value: '#4ade80' },
    { name: 'Orange', value: '#fb923c' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Jaune', value: '#facc15' },
    { name: 'Blanc', value: '#f8fafc' }
  ]
};

export function render(): string {
  return `
    <div class="text-center max-w-[600px] w-full mx-auto">
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <button id="backBtn"
             class="text-slate-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 bg-transparent border-none cursor-pointer">
            <span>←</span>
            <span>Retour</span>
          </button>
          <button id="customizeBtn" 
                  class="flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-xl border border-slate-400/20 rounded-xl text-slate-300 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300"
                  style="box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15)">
            <span class="text-sm font-medium">Personnaliser</span>
          </button>
        </div>
        <h1 class="text-7xl font-extrabold mb-4 gradient-purple" 
            style="filter: drop-shadow(0 0 20px rgba(168, 139, 250, 0.5))">
          TIC TAC TOE
        </h1>
        <p class="text-slate-400 text-lg tracking-wide">Transcendence Edition</p>
      </div>
      
      <div class="flex flex-col gap-6 px-8">
        <button id="pvpBtn"
           class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer block no-underline text-left w-full"
           style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative text-center">
            <h2 class="text-3xl font-bold mb-2 gradient-purple">Joueur vs Joueur</h2>
            <p class="text-slate-400">Défiez un ami sur le même écran</p>
            <div class="mt-4 text-sm text-slate-500">
              <span class="inline-block">Cliquez pour jouer</span>
            </div>
          </div>
        </button>
      </div>
      
      <div class="mt-12 text-slate-500 text-sm">
        <p>Alignez 3 symboles pour gagner!</p>
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
          <canvas id="previewCanvas" width="200" height="200" 
                  class="border border-slate-600/30 rounded-xl"></canvas>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-300 mb-3">Style de carte</label>
          <div class="grid grid-cols-5 gap-2" id="mapButtonsContainer"></div>
        </div>

        <div class="mb-5">
          <label class="block text-sm font-medium text-slate-300 mb-3">Couleur X (Joueur 1)</label>
          <div class="flex flex-wrap gap-2" id="xColorsContainer"></div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-300 mb-3">Couleur O (Joueur 2)</label>
          <div class="flex flex-wrap gap-2" id="oColorsContainer"></div>
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
          <h2 class="text-4xl font-extrabold flex justify-center mb-2 gradient-purple" 
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

        <button id="startPvpGame" 
                class="w-full font-semibold text-lg cursor-pointer px-9 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.6)]"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
          Commencer le match
        </button>
      </div>
    </div>
  `;
}

export function onMount(): void {
  const backBtn = document.getElementById('backBtn');
  const pvpBtn = document.getElementById('pvpBtn');
  const pvpModal = document.getElementById('pvpModal');
  const startPvpGame = document.getElementById('startPvpGame');
  const pvpPlayer2Input = document.getElementById('pvpPlayer2') as HTMLInputElement;

  const customizeBtn = document.getElementById('customizeBtn');
  const customizationModal = document.getElementById('customizationModal');
  const closeCustomizationModal = document.getElementById('closeCustomizationModal');
  const saveCustomizationBtn = document.getElementById('saveCustomization');
  const resetCustomizationBtn = document.getElementById('resetCustomization');
  const previewCanvas = document.getElementById('previewCanvas') as HTMLCanvasElement;
  const previewCtx = previewCanvas?.getContext('2d');
  const mapButtonsContainer = document.getElementById('mapButtonsContainer');
  const xColorsContainer = document.getElementById('xColorsContainer');
  const oColorsContainer = document.getElementById('oColorsContainer');

  backBtn?.addEventListener('click', () => {
    window.location.href = 'https://localhost:5173/#dashboard';
  });

  let currentCustomization: GameCustomization = { ...defaultCustomization };
  
  const savedCustomization = localStorage.getItem('tictactoeCustomization');
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
        currentCustomization.gridColor = style.gridColor;
        renderMapButtons();
        updatePreview();
      });
      mapButtonsContainer.appendChild(btn);
    });
  }

  function renderXColors() {
    if (!xColorsContainer) return;
    xColorsContainer.innerHTML = '';
    colorPresets.symbol.forEach(color => {
      const btn = document.createElement('button');
      btn.dataset.color = color.value;
      btn.className = `w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
        color.value === currentCustomization.xColor 
          ? 'border-white ring-2 ring-white/50' 
          : 'border-slate-600/30'
      }`;
      btn.style.backgroundColor = color.value;
      btn.style.boxShadow = `0 0 10px ${color.value}40`;
      btn.title = color.name;
      btn.addEventListener('click', () => {
        currentCustomization.xColor = color.value;
        renderXColors();
        updatePreview();
      });
      xColorsContainer.appendChild(btn);
    });
  }

  function renderOColors() {
    if (!oColorsContainer) return;
    oColorsContainer.innerHTML = '';
    colorPresets.symbol.forEach(color => {
      const btn = document.createElement('button');
      btn.dataset.color = color.value;
      btn.className = `w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
        color.value === currentCustomization.oColor 
          ? 'border-white ring-2 ring-white/50' 
          : 'border-slate-600/30'
      }`;
      btn.style.backgroundColor = color.value;
      btn.style.boxShadow = `0 0 10px ${color.value}40`;
      btn.title = color.name;
      btn.addEventListener('click', () => {
        currentCustomization.oColor = color.value;
        renderOColors();
        updatePreview();
      });
      oColorsContainer.appendChild(btn);
    });
  }

  function updatePreview() {
    if (!previewCtx) return;
    const size = 200;
    const cellSize = size / 3;
    
    previewCtx.fillStyle = currentCustomization.boardBackground;
    previewCtx.fillRect(0, 0, size, size);
    
    previewCtx.strokeStyle = currentCustomization.gridColor;
    previewCtx.lineWidth = 3;
    
    previewCtx.beginPath();
    previewCtx.moveTo(cellSize, 10);
    previewCtx.lineTo(cellSize, size - 10);
    previewCtx.stroke();
    
    previewCtx.beginPath();
    previewCtx.moveTo(cellSize * 2, 10);
    previewCtx.lineTo(cellSize * 2, size - 10);
    previewCtx.stroke();
    
    previewCtx.beginPath();
    previewCtx.moveTo(10, cellSize);
    previewCtx.lineTo(size - 10, cellSize);
    previewCtx.stroke();
    
    previewCtx.beginPath();
    previewCtx.moveTo(10, cellSize * 2);
    previewCtx.lineTo(size - 10, cellSize * 2);
    previewCtx.stroke();
    
    const padding = 15;
    previewCtx.shadowBlur = 12;
    
    previewCtx.shadowColor = currentCustomization.xColor;
    previewCtx.strokeStyle = currentCustomization.xColor;
    previewCtx.lineWidth = 4;
    previewCtx.lineCap = 'round';
    
    previewCtx.beginPath();
    previewCtx.moveTo(padding, padding);
    previewCtx.lineTo(cellSize - padding, cellSize - padding);
    previewCtx.stroke();
    
    previewCtx.beginPath();
    previewCtx.moveTo(cellSize - padding, padding);
    previewCtx.lineTo(padding, cellSize - padding);
    previewCtx.stroke();
    
    previewCtx.shadowColor = currentCustomization.oColor;
    previewCtx.strokeStyle = currentCustomization.oColor;
    
    const centerX = cellSize * 1.5;
    const centerY = cellSize * 1.5;
    const radius = (cellSize - padding * 2) / 2;
    
    previewCtx.beginPath();
    previewCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    previewCtx.stroke();
    
    previewCtx.shadowBlur = 0;
  }

  function initCustomizationModal() {
    renderMapButtons();
    renderXColors();
    renderOColors();
    updatePreview();
  }

  customizeBtn?.addEventListener('click', () => {
    const saved = localStorage.getItem('tictactoeCustomization');
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
    localStorage.setItem('tictactoeCustomization', JSON.stringify(currentCustomization));
    customizationModal?.classList.add('hidden');
  });

  pvpBtn?.addEventListener('click', () => {
    pvpModal?.classList.remove('hidden');
  });

  startPvpGame?.addEventListener('click', () => {
    const player2Name = pvpPlayer2Input?.value.trim() || '';
    if (player2Name === '') {
      alert("Veuillez entrer un pseudo pour le joueur 2");
      return;
    }
    localStorage.setItem('tictactoe_pvpPlayer2', player2Name);
    pvpModal?.classList.add('hidden');
    window.history.pushState({}, '', '/tictactoe/gameplay');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      pvpModal?.classList.add('hidden');
      customizationModal?.classList.add('hidden');
      if (pvpPlayer2Input) pvpPlayer2Input.value = '';
    }
  });
}
