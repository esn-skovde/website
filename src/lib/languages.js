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

/* Browsers name Norwegian by its written standard, Bokmål (nb) or Nynorsk
   (nn), and Safari and iOS send only "nb-NO". Our Norwegian copy is Bokmål
   and lives under "no". */
export const LANGUAGE_ALIASES = { nb: "no", nn: "no" };

/**
 * "en-US" -> "en", "SV" -> "sv", "nb-NO" -> "no", "pt-BR" -> null (unsupported).
 *
 * Without this the detector hands back "en-US", every internal link is built
 * as /en-US/..., and none of those paths match a route.
 */
export const canonicalLanguage = (value) => {
    if (!value) return null;
    const base = String(value).toLowerCase().split(/[-_]/)[0];
    const code = LANGUAGE_ALIASES[base] ?? base;
    return LANGUAGE_CODES.includes(code) ? code : null;
};

/** canonicalLanguage(), falling back to English. */
export const normalizeLanguage = (value) => canonicalLanguage(value) ?? DEFAULT_LANGUAGE;

/** Exactly a code as it appears in a URL: "sv", but not "SV" or "sv-SE". */
export const isSupportedLanguage = (value) => LANGUAGE_CODES.includes(value);

export const languageName = (code) =>
    SUPPORTED_LANGUAGES.find((l) => l.code === normalizeLanguage(code))?.name ?? "English";
