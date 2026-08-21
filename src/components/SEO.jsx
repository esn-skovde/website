import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { LANGUAGE_CODES, normalizeLanguage } from "../lib/languages";

const SITE = "https://esnskovde.org";

/* Every element this component owns is stamped with this attribute, so a later
   render can find and replace exactly its own tags and nothing else.

   This is deliberately imperative rather than React 19's native <title>/<meta>
   hoisting: native metadata *appends* to <head> and never claims tags that are
   already sitting there. Our pages are prerendered by puppeteer, so the shipped
   HTML already contains a full set of meta tags — native hoisting would hydrate
   into a second <title> and a second canonical on every page. Stamping lets us
   reclaim the prerendered tags and update them in place. It also sets <html lang>,
   which native metadata cannot express at all. */
const MARK = "data-seo";

/* og:locale wants the underscored POSIX form; <html lang> wants BCP-47. The old
   version used the underscored form for both, which is not a valid lang value. */
const OG_LOCALE = {
    en: "en_US",
    sv: "sv_SE",
    es: "es_ES",
    de: "de_DE",
    no: "no_NO",
    fr: "fr_FR",
    it: "it_IT",
};

/* Identity of a managed tag, so an equivalent one already in the document can be
   reclaimed rather than duplicated. index.html ships a static description as a
   no-JS floor, and without this it would survive alongside the rendered one. */
const selectorFor = ({ tag, name, property, rel, hreflang, type }) => {
    if (tag === "meta" && name) return `meta[name="${name}"]`;
    if (tag === "meta" && property) return `meta[property="${property}"]`;
    if (tag === "link" && rel === "alternate") {
        return `link[rel="alternate"][hreflang="${hreflang}"]`;
    }
    if (tag === "link" && rel) return `link[rel="${rel}"]`;
    if (tag === "script" && type) return `script[type="${type}"]`;
    return null;
};

/** Replaces the previously rendered SEO tags with a fresh set. */
const syncHead = (tags) => {
    document.head.querySelectorAll(`[${MARK}]`).forEach((el) => el.remove());

    const frag = document.createDocumentFragment();
    for (const spec of tags) {
        const selector = selectorFor(spec);
        if (selector) document.head.querySelectorAll(selector).forEach((el) => el.remove());

        const { tag, text, ...attrs } = spec;
        const el = document.createElement(tag);
        for (const [name, value] of Object.entries(attrs)) {
            if (value != null) el.setAttribute(name, value);
        }
        // ld+json is data, not script — the browser never executes it.
        if (text != null) el.textContent = text;
        el.setAttribute(MARK, "");
        frag.appendChild(el);
    }
    document.head.appendChild(frag);
};

const SEO = ({
    title,
    description,
    keywords,
    image,
    type = "website",
    article = null,
    event = null,
    robots = "index, follow",
}) => {
    const { i18n, t } = useTranslation();
    const { pathname } = useLocation();

    const lang = normalizeLanguage(i18n.language);
    const ogLocale = OG_LOCALE[lang] ?? OG_LOCALE.en;

    // "/en/events" -> "events", "/en/" -> ""
    const seoPath = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), "").replace(/^\/+/, "");
    const url = `${SITE}/${lang}/${seoPath}`;
    const alternate = (code) => `${SITE}/${code}/${seoPath}`;

    const defaultTitle = "ESN Skövde - Erasmus Student Network";
    const defaultDescription = t("seo.default.description");
    const defaultImage = `${SITE}/assets/logo.png`;

    const seoTitle = title ? `ESN Skövde - ${title}` : defaultTitle;
    const seoDescription = description || defaultDescription;
    const seoKeywords = keywords || t("seo.default.keywords");
    const seoImage = image || defaultImage;

    const organization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ESN Skövde",
        alternateName: "Erasmus Student Network Skövde",
        url,
        logo: defaultImage,
        description: defaultDescription,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Skövde",
            addressCountry: "Sweden",
        },
        sameAs: ["https://www.instagram.com/esn.skovde"],
        contactPoint: {
            "@type": "ContactPoint",
            email: "board@esnskovde.org",
            contactType: "General Inquiries",
        },
    };

    let structuredData = organization;
    if (event) {
        structuredData = {
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location
                ? {
                      "@type": "Place",
                      name: event.location,
                      address: {
                          "@type": "PostalAddress",
                          addressLocality: "Skövde",
                          addressCountry: "Sweden",
                      },
                  }
                : undefined,
            organizer: organization,
            image: event.image || seoImage,
        };
    } else if (article) {
        structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            author: { "@type": "Organization", name: "ESN Skövde" },
            publisher: organization,
            datePublished: article.publishedDate,
            dateModified: article.modifiedDate,
            image: article.image || seoImage,
        };
    }

    const tags = [
        { tag: "meta", name: "description", content: seoDescription },
        { tag: "meta", name: "keywords", content: seoKeywords },
        { tag: "meta", name: "author", content: "ESN Skövde" },
        { tag: "meta", name: "robots", content: robots },

        { tag: "link", rel: "canonical", href: url },

        { tag: "meta", property: "og:type", content: type },
        { tag: "meta", property: "og:title", content: seoTitle },
        { tag: "meta", property: "og:description", content: seoDescription },
        { tag: "meta", property: "og:image", content: seoImage },
        { tag: "meta", property: "og:url", content: url },
        { tag: "meta", property: "og:site_name", content: "ESN Skövde" },
        { tag: "meta", property: "og:locale", content: ogLocale },

        { tag: "meta", name: "twitter:card", content: "summary_large_image" },
        { tag: "meta", name: "twitter:title", content: seoTitle },
        { tag: "meta", name: "twitter:description", content: seoDescription },
        { tag: "meta", name: "twitter:image", content: seoImage },
        { tag: "meta", name: "twitter:site", content: "@esnskovde" },

        ...LANGUAGE_CODES.map((code) => ({
            tag: "link",
            rel: "alternate",
            hreflang: code,
            href: alternate(code),
        })),
        { tag: "link", rel: "alternate", hreflang: "x-default", href: alternate("en") },

        {
            tag: "script",
            type: "application/ld+json",
            text: JSON.stringify(structuredData),
        },
    ];

    // Serialised so the effect re-runs on a genuine content change rather than
    // on every render, which a fresh array literal would otherwise force.
    const serialized = JSON.stringify(tags);

    useEffect(() => {
        document.title = seoTitle;
        document.documentElement.lang = lang;
        syncHead(JSON.parse(serialized));
    }, [serialized, seoTitle, lang]);

    return null;
};

export default SEO;
