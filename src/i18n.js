import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { LANGUAGE_CODES, DEFAULT_LANGUAGE, canonicalLanguage } from "./lib/languages";

import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationSV from "./locales/sv/translation.json";
import translationDE from "./locales/de/translation.json";
import translationNO from "./locales/no/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationIT from "./locales/it/translation.json";

const resources = {
    en: { translation: translationEN },
    sv: { translation: translationSV },
    es: { translation: translationES },
    de: { translation: translationDE },
    no: { translation: translationNO },
    fr: { translation: translationFR },
    it: { translation: translationIT },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
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
            // project page's /esn-skovde-website/, where index 0 read the repo
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

export default i18n;
