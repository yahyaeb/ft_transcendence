import { isAuthenticated } from "./state/auth";


type Route = {
  render: () => void;
  onMount?: () => void;
  protected?: boolean;
};

const routes: Record<string, Route> = {
  "#home": { render: () => import("./pages/home").then(m => m.renderHome()) },

  "#login": { render: () => import("./pages/login").then(m => {
    m.renderLogin();
    m.onMountLogin();
  }) },

  "#signup": { render: () => import("./pages/signup").then(m => {
    m.renderSignup();
    m.onMountSignup?.();
  }) },

  "#dashboard": {
    protected: true,
    render: () => import("./pages/dashboard").then(m => {
      m.renderDashboard();
      m.onMountDashboard();
    }),
  },

  "#stats-pong": {
    protected: true,
    render: () => import("./pages/stats-pong").then(m => {
      m.renderStatsPong();
      m.onMountStatsPong?.();
    }),
  },

  "#stats-tictactoe": {
    protected: true,
    render: () => import("./pages/stats-tictactoe").then(m => {
      m.renderStatsTicTacToe();
      m.onMountStatsTicTacToe?.();
    }),
  },

  "#profile": {
    protected: true,
    render: () => import("./pages/profile").then(m => {
      m.renderProfile();
      m.onMountProfile?.();
    }),
  },

  "#settings": {
    protected: true,
    render: () => import("./pages/settings").then(m => {
      m.renderSettings();
      m.onMountSettings?.();
    }),
  },
};

export function router() {
  const route = window.location.hash || "#home";
  const target = routes[route] || routes["#home"];

  if (target.protected && !isAuthenticated()) {
    window.location.hash = "#login";
    return;
  }

  const app = document.getElementById("app");
  if (app) app.innerHTML = "";

  target.render();
}
