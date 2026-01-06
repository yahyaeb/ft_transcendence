export type Language = "fr" | "en" | "it";

const STORAGE_KEY = "app_language";

export function getLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "fr" || stored === "en" || stored === "it") {
    return stored;
  }
  return "fr";
}

export function setLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEY, lang);
}