
import { Router } from './router/router';

import * as MainPage from './components/mainPage';
import * as GameModeSelection from './components/gameModeSelection';
import * as Gameplay from './components/gameplay';
import * as Winner from './components/winner';
import * as TournamentBracket from './components/tournamentBracket';
import * as TournamentMatchWinner from './components/tournamentMatchWinner';

function initApp(): void {

  const router = new Router('#app');
  router.addRoute({
    path: '/',                    
    component: MainPage.render,    
    onMount: MainPage.onMount      
  });


  router.addRoute({
    path: '/game-mode',
    component: GameModeSelection.render,
    onMount: GameModeSelection.onMount
  });

  router.addRoute({
    path: '/gameplay',
    component: Gameplay.render,
    onMount: Gameplay.onMount
  });

  router.addRoute({
    path: '/winner',
    component: Winner.render,
    onMount: Winner.onMount
  });


  router.addRoute({
    path: '/tournament-bracket',
    component: TournamentBracket.render,
    onMount: TournamentBracket.onMount
  });

  router.addRoute({
    path: '/tournament-match-winner',
    component: TournamentMatchWinner.render,
    onMount: TournamentMatchWinner.onMount
  });

  router.init();
}

document.addEventListener('DOMContentLoaded', initApp);