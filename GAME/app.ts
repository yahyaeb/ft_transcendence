import { Router } from './router/router';
import { pongRoutes } from './games/pong';
import { tictactoeRoutes } from './games/tictactoe';

function initApp(): void {
  const router = new Router('#app');

  router.addRoute({
    path: '/',
    component: () => `
      <div class="text-center">
        <h1 class="text-5xl font-extrabold mb-8 gradient-purple" style="filter: drop-shadow(0 0 20px rgba(168, 139, 250, 0.5))">
          Transcendence
        </h1>
        <div class="flex flex-col gap-4 max-w-[300px] mx-auto">
          <a href="/pong" data-link 
             class="font-semibold text-lg cursor-pointer px-8 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.5)] no-underline"
             style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
            Jouer à Pong
          </a>
          <a href="/tictactoe" data-link 
             class="font-semibold text-lg cursor-pointer px-8 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.5)] no-underline"
             style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
            Jouer à Tic Tac Toe
          </a>
        </div>
      </div>
    `,
  });

  pongRoutes.forEach(route => router.addRoute(route));
  tictactoeRoutes.forEach(route => router.addRoute(route));

  router.init();
}

document.addEventListener('DOMContentLoaded', initApp);