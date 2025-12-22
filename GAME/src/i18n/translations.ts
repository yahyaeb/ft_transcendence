import type { Language } from "../state/language";

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    home_title: "Bienvenue sur Transcendence",
    home_description:
      "Un projet Full-Stack moderne autour du Pong, avec authentification et matchmaking.",
    login: "Connexion",
    profile: "Profil",
    logout: "Déconnexion",
    age: "Âge",
    gender: "Genre",
    achievements: "Succès",
    play: "Jouer",
    feature: "Fonctionnalité",
    settings: "Paramètres",
  },
  en: {
    home_title: "Welcome on Transcendence",
    home_description:
      "A modern Full-Stack Pong project with authentication and matchmaking.",
    login: "Login",
    profile: "Profile",
    logout: "Logout",
    age: "Age",
    gender: "Gender",
    achievements: "Achievements",
    play: "Play",
    feature: "Feature",
    settings: "Settings",
  },
};