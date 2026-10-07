/* Intl formatters for the page's language, each built once.

   A DisplayNames, ListFormat or DateTimeFormat reads locale data when it is
   made, and a page asks for the same few again and again: every board card
   names two or three languages. Plain JS, like languages.js and routes.js, so
   Node can import it as well as the app. */

/* The locale each of the site's language codes formats with. English is
   British, which puts the day before the month as the site's own dates do
   ("12 May 2026"). Norwegian is Bokmål: that is what its copy is written in,
   and nb is the tag every engine knows it by. */
const LOCALES = { en: "en-GB", no: "nb" };

export const intlLocale = (lang) => LOCALES[lang] ?? lang;

const instances = new Map();

/* null where this browser has no such formatter (DisplayNames and ListFormat
   are the newer ones) or refuses the options, so a caller can show the text as
   it was written instead of failing the page. */
const cached = (kind, lang, options) => {
    const key = `${kind}|${lang}|${JSON.stringify(options)}`;
    if (!instances.has(key)) {
        let instance = null;
        try {
            instance = new Intl[kind](intlLocale(lang), options);
        } catch {
            /* unsupported */
        }
        instances.set(key, instance);
    }
    return instances.get(key);
};

export const displayNames = (lang, options) => cached("DisplayNames", lang, options);
export const listFormat = (lang, options) => cached("ListFormat", lang, options);
export const dateTimeFormat = (lang, options) => cached("DateTimeFormat", lang, options);
