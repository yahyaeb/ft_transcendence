

export type GameLanguage = "fr" | "en" | "it";

const DEFAULT_LANG: GameLanguage = "fr";

function normalizeLang(value: string | null): GameLanguage {
  if (value === "en" || value === "fr" || value === "it") return value;
  return DEFAULT_LANG;
}

export function getGameLanguage(): GameLanguage {
  // 1) Try URL query ?lang=
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");

  if (urlLang) {
    const normalized = normalizeLang(urlLang);
    sessionStorage.setItem("game_lang", normalized);
    return normalized;
  }

  // 2) Fallback to sessionStorage
  const storedLang = sessionStorage.getItem("game_lang");
  if (storedLang) {
    return normalizeLang(storedLang);
  }

  // 3) Default
  return DEFAULT_LANG;
}