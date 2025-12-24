import { Router } from './router/router';
import { pongRoutes } from './games/pong';
import { tictactoeRoutes } from './games/tictactoe';

function initApp(): void {
  const router = new Router('#app');
  
  pongRoutes.forEach(route => router.addRoute(route));
  tictactoeRoutes.forEach(route => router.addRoute(route));

  router.init();
}

document.addEventListener('DOMContentLoaded', initApp);