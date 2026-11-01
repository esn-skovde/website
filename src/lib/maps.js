/* Opening a place in a maps app.

   Every place is a search, never a coordinate: a search finds the place the map
   itself has, and for a chain such as ICA it lists every branch near the reader.
   A hard-coded coordinate that was a few streets off would send a student to the
   wrong spot with nobody here able to check it.

   The link in the page is always the Google Maps address. It works everywhere:
   with scripting off, on a right-click or a copied link, and on the prerendered
   page, which cannot know what device will open it. Only when the link is
   clicked does it look at the device and, on a phone, hand the place to the
   maps app instead. */

import footerData from "../data/footer.json";

const GOOGLE = "https://www.google.com/maps/search/?api=1&query=";
const APPLE = "https://maps.apple.com/?q=";

export const googleMapsUrl = (query) => GOOGLE + encodeURIComponent(query);
export const appleMapsUrl = (query) => APPLE + encodeURIComponent(query);
// A geo: link goes to whichever maps app the phone is set to use.
export const geoUrl = (query) => `geo:0,0?q=${encodeURIComponent(query)}`;

/** "ios", "android", or "other" for everything a web map suits. */
export const deviceKind = (nav = typeof navigator === "undefined" ? null : navigator) => {
    if (!nav) return "other";
    const ua = nav.userAgent || "";
    if (/Android/i.test(ua)) return "android";
    // An iPad asks for the desktop site, and then calls itself a Mac with a touch screen.
    if (/iPhone|iPad|iPod/i.test(ua) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1)) {
        return "ios";
    }
    return "other";
};

// How long Android is given to open a maps app before the web map is used instead.
const GEO_WAIT = 1500;

/* Hands the place to the phone's maps app. If no app takes a geo: link the page
   stays put, so after a moment the web map opens instead. Leaving the page for
   an app (or for the app chooser) cancels that: otherwise the web map would pop
   up when the reader came back. */
const openGeo = (query) => {
    let timer = null;
    const cancel = () => {
        window.clearTimeout(timer);
        document.removeEventListener("visibilitychange", cancel);
        window.removeEventListener("pagehide", cancel);
        window.removeEventListener("blur", cancel);
    };
    timer = window.setTimeout(() => {
        cancel();
        window.location.assign(googleMapsUrl(query));
    }, GEO_WAIT);
    document.addEventListener("visibilitychange", cancel);
    window.addEventListener("pagehide", cancel);
    window.addEventListener("blur", cancel);
    window.location.assign(geoUrl(query));
};

/**
 * The click handler for a place link. Leaves the click alone, for the link's
 * own new tab, on a desktop and whenever the reader asked for something else
 * (middle click, ctrl, cmd, shift).
 */
export const openInMaps = (event, query) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const kind = deviceKind();
    if (kind === "ios") {
        event.preventDefault();
        window.location.assign(appleMapsUrl(query));
    } else if (kind === "android") {
        event.preventDefault();
        openGeo(query);
    }
};

/* Locations that are free text from the events table. Not every one is a place:
   an online event has nothing to look up. */
const NOT_A_PLACE = /^(online|virtual|remote|zoom|teams|discord|webinar|tba|tbc|tbd|to be (announced|decided|confirmed))\b/i;

const placeText = (location) => {
    const text = typeof location === "string" ? location.trim() : "";
    return text && !NOT_A_PLACE.test(text) ? text : null;
};

/** The search for an event's location, or null when it is not a place. Events
 *  are in Skövde unless the text names a city, so that is what a bare name gets. */
export const eventPlaceQuery = (location) => {
    const text = placeText(location);
    if (!text) return null;
    return /,|sk[öo]vde/i.test(text) ? text : `${text}, Skövde`;
};

/** A trip goes wherever it goes, so its location is searched as it is written. */
export const tripPlaceQuery = placeText;

/** ESN Skövde's own address, as the contact page and the footer both show it. */
export const OFFICE_QUERY = `${footerData.street}, ${footerData.city}, Sweden`;
