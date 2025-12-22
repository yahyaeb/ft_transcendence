import { Route } from '../../router/router';

import * as MainPage from './components/mainPage';
import * as Gameplay from './components/gameplay';
import * as Winner from './components/winner'

export const tictactoeRoutes: Route[] = [
  { path: '/tictactoe', component: MainPage.render, onMount: MainPage.onMount },
  { path: '/tictactoe/gameplay', component: Gameplay.render, onMount: Gameplay.onMount },
  { path: '/tictactoe/winner', component: Winner.render, onMount: Winner.onMount },
];