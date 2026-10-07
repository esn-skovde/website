import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { LANGUAGE_CODES, DEFAULT_LANGUAGE, canonicalLanguage } from "./lib/languages";

import translationEN from "./locales/en/translation.json";

/* English is the fallback for every language, so every page needs it and it
   ships in the entry. The other six are a chunk each, fetched for the
   language being shown: bundled, they were 170 kB of the entry, 52 kB
   gzipped, and a visitor needs one of them at most. */
const bundles = import.meta.glob(
    ["./locales/*/translation.json", "!./locales/en/translation.json"],
    { import: "default" }
);

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { en: { translation: translationEN } },
        // The rest arrive after init, through loadLanguage() below.
        partialBundledLanguages: true,
        fallbackLng: DEFAULT_LANGUAGE,
        supportedLngs: LANGUAGE_CODES,
        // The browser reports regional tags like "en-US". These two load the
        // base language's translations for one, but left i18n.language at
        // "en-US", which is no route segment: the detector now turns every
        // tag into one of our codes (convertDetectedLanguage below).
        load: "languageOnly",
        nonExplicitSupportedLngs: true,
        interpolation: { escapeValue: false },
        detection: {
            order: ["path", "localStorage", "navigator"],
            // The language segment's place: 0 on esnskovde.org, 1 under a
            // project page's /<repo>/, where index 0 read the repo
            // name and every load started in the stored or browser language.
            lookupFromPathIndex: import.meta.env.BASE_URL.split("/").filter(Boolean).length,
            // Every detected code, from the URL, storage or the browser, as one
            // of ours: "nb-NO", all that Safari and iOS report for Norwegian,
            // becomes "no", and "SV" is stored as "sv".
            convertDetectedLanguage: (lng) => canonicalLanguage(lng) ?? lng,
            caches: ["localStorage"],
        },
        react: { useSuspense: false },
    });

/**
 * Fetches a language's translations and hands them to i18n. English is
 * already there; so is anything fetched before.
 *
 * i18n.language can name a language whose text has not arrived, and i18n then
 * answers every key in English, which would replace the prerendered page with
 * English text. So whoever shows a language waits for this first: main.jsx
 * before the first render, LanguageLayout before it switches.
 *
 * It never rejects. A chunk that cannot be fetched, offline or taken away by
 * a newer deploy, leaves that language in English, the fallback: better than
 * a page that waits for text that is not coming.
 */
export const loadLanguage = async (language) => {
    if (i18n.hasResourceBundle(language, "translation")) return;

    const load = bundles[`./locales/${language}/translation.json`];
    if (!load) return;

    try {
        const translation = await load();
        // No module means main.jsx is reloading the page to pick up a newer build.
        if (translation) i18n.addResourceBundle(language, "translation", translation);
    } catch (error) {
        console.error(`The ${language} translations did not load:`, error);
    }
};

export default i18n;
