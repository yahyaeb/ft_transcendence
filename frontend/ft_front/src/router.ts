import { renderHome } from "./pages/home";
import { renderLogin } from "./pages/login";
import { renderSignup } from "./pages/signup";

const routes: Record<string, () => void> = {
  "": renderHome,
  "#home": renderHome,
  "#login": renderLogin,
  "#signup": renderSignup,
};

export function router() {
  const route = window.location.hash;
  const page = routes[route] || renderHome;
  page();
}
