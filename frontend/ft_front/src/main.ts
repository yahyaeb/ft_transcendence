import "./style.css";
import { router } from "./router";

window.addEventListener("hashchange", router);
window.addEventListener("load", router);