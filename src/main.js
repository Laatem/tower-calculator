import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// Résidu d'une ancienne feature (mode dev) retirée du produit : purge l'entrée
// chez les utilisateurs qui l'ont encore en localStorage.
try { localStorage.removeItem("tower-dev-mode"); } catch (e) {}

createApp(App).mount("#app");
