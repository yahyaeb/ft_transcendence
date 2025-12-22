import { Route } from '../../router/router';

import * as MainPage from './components/mainPage';
import * as GameModeSelection from './components/gameModeSelection';
import * as Gameplay from './components/gameplay';
import * as Winner from './components/winner';
import * as TournamentBracket from './components/tournamentBracket';
import * as TournamentMatchWinner from './components/tournamentMatchWinner';

export const pongRoutes: Route[] = [
  { path: '/pong', component: MainPage.render, onMount: MainPage.onMount },
  { path: '/pong/game-mode', component: GameModeSelection.render, onMount: GameModeSelection.onMount },
  { path: '/pong/gameplay', component: Gameplay.render, onMount: Gameplay.onMount },
  { path: '/pong/winner', component: Winner.render, onMount: Winner.onMount },
  { path: '/pong/tournament-bracket', component: TournamentBracket.render, onMount: TournamentBracket.onMount },
  { path: '/pong/tournament-match-winner', component: TournamentMatchWinner.render, onMount: TournamentMatchWinner.onMount },
];