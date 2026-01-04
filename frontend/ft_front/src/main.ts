import "./style.css";
import { router } from "./router";

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

window.addEventListener("storage", (e)=>{
    if (e.key === 'logout-event'){
        window.location.hash = '#login'
        window.location.reload();
    }
    if (e.key === 'access_token' && e.newValue === null) {
    window.location.hash = '#login';
    window.location.reload();
  }
})