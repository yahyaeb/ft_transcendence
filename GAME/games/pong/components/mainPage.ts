import { getGameLanguage } from "../../../state/language_game";
import { translations_game } from "../../../i18n/translations_game";

const lang = getGameLanguage();
const t = translations_game[lang];


export function render(): string {
  return `
    <div class="text-center max-w-[600px] w-full mx-auto">
      <div class="mb-12">
        <button id="backBtn"
            class="text-slate-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 bg-transparent border-none cursor-pointer">
            <span>←</span>
            <span>${t.back}</span>
        </button>
        <h1 class="text-7xl font-extrabold mb-4 gradient-purple leading-tight"
            style="filter: drop-shadow(0 0 20px rgba(168, 139, 250, 0.5))">
          ${t.pong_title}
        </h1>
        <p class="text-slate-400 text-lg tracking-wide">${t.pong_edition}</p>
      </div>
      <div class="flex flex-col gap-6 px-8">
        <a href="/pong/game-mode" data-link 
           class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer block no-underline"
           style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative">
            <h2 class="text-3xl font-bold mb-2 gradient-purple">${t.pong_pvp_title}</h2>
            <p class="text-slate-400">${t.pong_pvp_description}</p>
            <div class="mt-4 text-sm text-slate-500">
              <span class="inline-block mr-3">${t.pong_controls_p1}</span>
              <span class="inline-block">${t.pong_controls_p2}</span>
            </div>
          </div>
        </a>
        <button id="aiButton"
           class="group relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer block no-underline text-left w-full"
           style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2)">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative text-center">
            <h2 class="flex justify-center text-3xl font-bold mb-2 gradient-purple">${t.pong_ai_title}</h2>
            <p class="flex justify-center text-slate-400">${t.pong_ai_description}</p>
            <div class="mt-4 text-sm text-slate-500">
              <span class="inline-block mr-3">${t.pong_controls_p1}</span>
            </div>
          </div>
        </button>
      </div>
      <div class="mt-12 text-slate-500 text-sm">
        <p>${t.pong_controls_help}</p>
      </div>
    </div>

    <div id="aiDifficultyModal" class="fixed inset-0 bg-black/30 backdrop-blur-lg flex justify-center items-center p-5 z-50 hidden">
      <div class="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-400/20 rounded-3xl max-w-[550px] w-full mx-auto shadow-2xl p-10">
        <div class="mb-8 text-center">
          <h2 class="text-4xl font-extrabold mb-2 gradient-purple" 
              style="filter: drop-shadow(0 0 15px rgba(168, 139, 250, 0.4))">
            ${t.pong_ai_difficulty_title}
          </h2>
          <p class="text-slate-400 text-sm">${t.pong_ai_difficulty_subtitle}</p>
        </div>

        <div class="space-y-4">
          <button id="easyBtn" 
                  class="w-full font-semibold text-lg cursor-pointer px-9 py-4 bg-gradient-to-br from-green-500 to-green-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(34,197,94,0.6)]"
                  style="box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4)">
            ${t.pong_difficulty_easy}
          </button>
          
          <button id="mediumBtn" 
                  class="w-full font-semibold text-lg cursor-pointer px-9 py-4 bg-gradient-to-br from-yellow-500 to-orange-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(249,115,22,0.6)]"
                  style="box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4)">
            ${t.pong_difficulty_medium}
          </button>
          
          <button id="impossibleBtn" 
                  class="w-full font-semibold text-lg cursor-pointer px-9 py-4 bg-gradient-to-br from-red-500 to-red-700 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(220,38,38,0.6)]"
                  style="box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4)">
            ${t.pong_difficulty_impossible}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function onMount(): void {
    sessionStorage.removeItem('ai');
    const aiButton = document.getElementById('aiButton');
    const modal = document.getElementById('aiDifficultyModal');
    const easyBtn = document.getElementById('easyBtn');
    const mediumBtn = document.getElementById('mediumBtn');
    const impossibleBtn = document.getElementById('impossibleBtn');
    const returnBtn = document.getElementById('backBtn');

    returnBtn?.addEventListener('click', ()=>{
        window.location.href = 'https://localhost:5173/#dashboard';
    })

    aiButton?.addEventListener('click', (e) => {
        e.preventDefault();
        modal?.classList.remove('hidden');
    });

    easyBtn?.addEventListener('click', () => {
        sessionStorage.setItem('ai', 'isAi');
        sessionStorage.setItem('aiDifficulty', '400');
        modal?.classList.add('hidden');
        window.history.pushState({}, '', '/pong/gameplay');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });

    mediumBtn?.addEventListener('click', () => {
        sessionStorage.setItem('ai', 'isAi');
        sessionStorage.setItem('aiDifficulty', '200');
        modal?.classList.add('hidden');
        window.history.pushState({}, '', '/pong/gameplay');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });

    impossibleBtn?.addEventListener('click', () => {
        sessionStorage.setItem('ai', 'isAi');
        sessionStorage.setItem('aiDifficulty', '0');
        modal?.classList.add('hidden');
        window.history.pushState({}, '', '/pong/gameplay');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
        modal?.classList.add('hidden');
        }
    });
}