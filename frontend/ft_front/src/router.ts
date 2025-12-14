import { renderHome } from "./pages/home";
import { renderLogin } from "./pages/login";
import { renderSignup } from "./pages/signup";
import { renderProfile } from "./pages/profile";
import { isAuthenticated } from "./state/auth";

const routes: Record<string, () => void> = {
  "": renderHome,
  "#home": renderHome,
  "#login": renderLogin,
  "#signup": renderSignup,
  "#profile": renderProfile,
};

export function router() {
  const route = window.location.hash;
  if (route === "#profile" && !isAuthenticated()) {
  window.location.hash = "#login";
  return;
  }
  const page = routes[route] || renderHome;
  page();
}
