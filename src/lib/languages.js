// The seven languages the site ships translations for. Anything else — most
// commonly a regional tag like "en-US" from the browser's language detector —
// is folded back to its base language, or to English.
export const SUPPORTED_LANGUAGES = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "sv", name: "Svenska", flag: "🇸🇪" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "no", name: "Norsk", flag: "🇳🇴" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

/**
 * "en-US" -> "en", "EN" -> "en", "pt-BR" -> "en" (unsupported).
 *
 * Without this the detector hands back "en-US", every internal link is built
 * as /en-US/..., and none of those paths match a route.
 */
export const normalizeLanguage = (value) => {
    if (!value) return DEFAULT_LANGUAGE;
    const base = String(value).toLowerCase().split(/[-_]/)[0];
    return LANGUAGE_CODES.includes(base) ? base : DEFAULT_LANGUAGE;
};

export const isSupportedLanguage = (value) =>
    Boolean(value) && LANGUAGE_CODES.includes(String(value).toLowerCase());

export const languageName = (code) =>
    SUPPORTED_LANGUAGES.find((l) => l.code === normalizeLanguage(code))?.name ?? "English";
