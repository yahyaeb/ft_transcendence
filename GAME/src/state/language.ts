export type Language = "fr" | "en";

let currentLanguage: Language = "fr";

export function setLanguage(lang: Language) {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}