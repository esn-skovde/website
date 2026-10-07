/* The board page's facts in the reader's language.

   src/data/boardMembers.json is typed by hand, in English: "India",
   "Swedish", "May 2026", "March 16, 2025". Rather than ask for codes, the
   lookups below start from that English text, so the file stays exactly as
   it is written. Anything they do not recognise (a spelling the engine has no
   name for, a date in some other shape) shows as it was typed, never as a
   code or as nothing. English is the file's own language and always shows as
   written.

   Plain JS, like intl.js, so Node can import it as well as the app. */
import { displayNames, listFormat, dateTimeFormat } from "./intl.js";

const DATA_LANGUAGE = "en";

/* One spelling for "Côte d'Ivoire" and "Cote d’Ivoire", "Bosnia & Herzegovina"
   and "Bosnia and Herzegovina", "The Netherlands" and "Netherlands", "Saint
   Lucia" and "St. Lucia". */
const spelling = (name) =>
    name
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/\bsaint\b/g, "st")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/^the /, "");

/* Names English speakers use that the engine's own English names do not. */
const ALIASES = {
    region: {
        USA: "US",
        "United States of America": "US",
        UK: "GB",
        "Great Britain": "GB",
        Holland: "NL",
        "Czech Republic": "CZ",
        Turkey: "TR",
        "Ivory Coast": "CI",
        Burma: "MM",
        Myanmar: "MM",
        "Hong Kong": "HK",
        Macau: "MO",
        Palestine: "PS",
        "East Timor": "TL",
        Macedonia: "MK",
        "Cabo Verde": "CV",
        Swaziland: "SZ",
    },
    language: {
        Mandarin: "zh",
        Cantonese: "yue",
        Farsi: "fa",
        Bengali: "bn",
        Filipino: "fil",
        Tagalog: "tl",
    },
};

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const codeLookups = new Map();

/* English name -> code, read back out of the engine's own English names for
   every two-letter code, so there is no list of the world's countries and
   languages here to keep up to date. */
const readCodes = (type) => {
    const codes = new Map();
    const english = displayNames(DATA_LANGUAGE, { type, fallback: "none" });
    if (english) {
        for (const a of LETTERS) {
            for (const b of LETTERS) {
                const code = type === "region" ? `${a}${b}`.toUpperCase() : `${a}${b}`;
                const known = english.of(code);
                if (known && !codes.has(spelling(known))) codes.set(spelling(known), code);
            }
        }
    }
    for (const [alias, code] of Object.entries(ALIASES[type])) codes.set(spelling(alias), code);
    return codes;
};

const codeFor = (type, name) => {
    if (!codeLookups.has(type)) codeLookups.set(type, readCodes(type));
    return codeLookups.get(type).get(spelling(name));
};

const nameIn = (type, code, lang) => displayNames(lang, { type, fallback: "none" })?.of(code);

const joined = (items, lang) =>
    listFormat(lang, { type: "conjunction" })?.format(items) ?? items.join(", ");

/** "India" -> "Indien". A pair such as "Indonesia and The Netherlands" is named as a list. */
export const countryName = (text, lang) => {
    if (lang === DATA_LANGUAGE || !text) return text;
    // The whole text first: "Trinidad and Tobago" is one country.
    const parts = codeFor("region", text)
        ? [text]
        : text.split(/\s*(?:,|;|\/|&|\band\b)\s*/i).filter(Boolean);
    const names = parts.map((part) => {
        const code = codeFor("region", part);
        return code && nameIn("region", code, lang);
    });
    return names.length && names.every(Boolean) ? joined(names, lang) : text;
};

/** ["Swedish", "English"] -> "svenska och engelska". An unknown language keeps its English name. */
export const languageList = (names, lang) => {
    const list = (names ?? []).map((name) => String(name).trim()).filter(Boolean);
    if (lang === DATA_LANGUAGE) return list.join(", ");
    return joined(
        list.map((name) => {
            const code = codeFor("language", name);
            return (code && nameIn("language", code, lang)) || name;
        }),
        lang
    );
};

const MONTHS = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];

/* 0-11 for "May", "Sep", "Sept." and "September", -1 for anything else. */
const monthIndex = (word) => {
    const name = word.toLowerCase();
    return name.length < 3 ? -1 : MONTHS.findIndex((month) => month.startsWith(name));
};

/** "May 2026" -> "maj 2026". Dates are read as UTC, so no time zone moves them to another day. */
export const monthYear = (text, lang) => {
    if (lang === DATA_LANGUAGE || !text) return text;
    const match = /^\s*([a-z]{3,9})\.?,?\s+(\d{4})\s*$/i.exec(text);
    const month = match ? monthIndex(match[1]) : -1;
    if (month < 0) return text;
    const format = dateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC" });
    return format?.format(Date.UTC(Number(match[2]), month, 1)) ?? text;
};

/** "March 16, 2025" or "16 March 2025" -> "16 mars 2025". */
export const fullDate = (text, lang) => {
    if (lang === DATA_LANGUAGE || !text) return text;
    let word, day, year;
    const monthFirst = /^\s*([a-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\s*$/i.exec(text);
    const dayFirst = /^\s*(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([a-z]{3,9})\.?,?\s+(\d{4})\s*$/i.exec(
        text
    );
    if (monthFirst) [, word, day, year] = monthFirst;
    else if (dayFirst) [, day, word, year] = dayFirst;
    const month = word ? monthIndex(word) : -1;
    if (month < 0) return text;
    const time = Date.UTC(Number(year), month, Number(day));
    // "February 30" rolls over into March, which is not the date that was typed.
    if (new Date(time).getUTCDate() !== Number(day)) return text;
    return dateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" })?.format(time) ?? text;
};
