import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationSV from "./locales/sv/translation.json";
import translationDE from "./locales/de/translation.json";
import translationNO from "./locales/no/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationIT from "./locales/it/translation.json";

const resources = {
    en: {
        translation: translationEN,
    },
    sv: {
        translation: translationSV,
    },
    es: {
        translation: translationES,
    },
    de: {
        translation: translationDE,
    },
    no: {
        translation: translationNO,
    },
    fr: {
        translation: translationFR,
    },
    it: {
        translation: translationIT,
    }
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;
