import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { LANGUAGE_CODES, normalizeLanguage } from "../lib/languages";
import footer from "../data/footer.json";

const SITE = "https://esnskovde.org";

/* A build served from anywhere but the domain root is a second copy of the
   site, such as a project page at /<repo>/, and must stay out of search. Its pages
   have to say so themselves: crawlers only read robots.txt at the root of a
   host, which a project page does not own, and Pages cannot send an
   X-Robots-Tag header. VITE_NOINDEX=true marks any other build the same way.
   Neither can turn indexing on, so the 404 page keeps its own noindex. */
const NOINDEX =
    import.meta.env.BASE_URL !== "/" || import.meta.env.VITE_NOINDEX === "true";

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

    /* Every URL here ends in a slash, whatever form the address bar has.
       GitHub Pages serves a page only at /en/events/ and redirects
       /en/events there, so the slashless canonical baked into each page named
       a redirect, and the app then swapped in the slash form it copied from
       the address bar. The page path is whatever follows the language
       segment, and the canonical takes the URL's own language, which i18n
       only catches up with in an effect. */
    const [urlLang, ...pagePath] = pathname.split("/").filter(Boolean);
    const seoPath = pagePath.join("/"); // "/en/events/" -> "events", "/en/" -> ""
    const pageUrl = (code) => (seoPath ? `${SITE}/${code}/${seoPath}/` : `${SITE}/${code}/`);
    const url = pageUrl(LANGUAGE_CODES.includes(urlLang) ? urlLang : lang);
    const alternate = pageUrl;

    const defaultTitle = "ESN Skövde - Erasmus Student Network";
    const defaultDescription = t("seo.default.description");
    /* public/og-image.jpg, copied through by Vite so the URL is stable and
       unhashed. The old value was `${SITE}/assets/logo.png`, which no build has
       ever produced — everything under src/assets is hashed and re-encoded — so
       every share rendered with no preview image. Regenerate with
       `node scripts/generate-og-image.js`. */
    const defaultImage = `${SITE}/og-image.jpg`;
    const defaultImageAlt = "ESN Skövde — Erasmus Student Network";

    /* public/logo.png, not the sharing card: schema.org logo has to be the mark
       itself, and Google wants it square-ish and at least 112px. */
    const logoUrl = `${SITE}/logo.png`;

    const seoTitle = title ? `ESN Skövde - ${title}` : defaultTitle;
    const seoDescription = description || defaultDescription;
    const seoKeywords = keywords || t("seo.default.keywords");
    const seoImage = image || defaultImage;

    const home = `${SITE}/${lang}/`;

    const organization = {
        "@type": "Organization",
        // Stable node id so the other nodes below can point at this one rather
        // than restating the whole organisation.
        "@id": `${SITE}/#organization`,
        name: "ESN Skövde",
        alternateName: "Erasmus Student Network Skövde",
        url: home,
        logo: logoUrl,
        description: defaultDescription,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Skövde",
            addressCountry: "Sweden",
        },
        /* Read from footer.json so there is one source of truth for the
           section's links. These had already drifted: this list said
           instagram.com/esn.skovde while the footer link said
           instagram.com/esnskovde. */
        sameAs: [footer.instagramLink, footer.linktreeLink].filter(Boolean),
        contactPoint: {
            "@type": "ContactPoint",
            email: footer.email,
            contactType: "General Inquiries",
        },
    };

    const graph = [organization];

    /* Every page used to emit the identical Organization block and nothing else.
       The home page now also describes the site, and every inner page carries a
       breadcrumb trail, which is what search results render as a path instead of
       a bare URL. */
    if (!seoPath) {
        graph.push({
            "@type": "WebSite",
            "@id": `${home}#website`,
            name: "ESN Skövde",
            url: home,
            inLanguage: lang,
            publisher: { "@id": `${SITE}/#organization` },
        });
    } else if (title) {
        graph.push({
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: t("navBar.home"), item: home },
                { "@type": "ListItem", position: 2, name: title, item: url },
            ],
        });
    }

    if (event) {
        graph.push({
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
            organizer: { "@id": `${SITE}/#organization` },
            image: event.image || seoImage,
        });
    } else if (article) {
        graph.push({
            "@type": "Article",
            headline: article.title,
            description: article.description,
            author: { "@id": `${SITE}/#organization` },
            publisher: { "@id": `${SITE}/#organization` },
            datePublished: article.publishedDate,
            dateModified: article.modifiedDate,
            image: article.image || seoImage,
        });
    }

    const structuredData = { "@context": "https://schema.org", "@graph": graph };

    const tags = [
        { tag: "meta", name: "description", content: seoDescription },
        { tag: "meta", name: "keywords", content: seoKeywords },
        { tag: "meta", name: "author", content: "ESN Skövde" },
        { tag: "meta", name: "robots", content: NOINDEX ? "noindex, nofollow" : robots },

        { tag: "link", rel: "canonical", href: url },

        { tag: "meta", property: "og:type", content: type },
        { tag: "meta", property: "og:title", content: seoTitle },
        { tag: "meta", property: "og:description", content: seoDescription },
        { tag: "meta", property: "og:image", content: seoImage },
        // Crawlers that get these do not have to fetch the image to lay the card
        // out, and the alt is read aloud when the card is announced.
        { tag: "meta", property: "og:image:width", content: "1200" },
        { tag: "meta", property: "og:image:height", content: "630" },
        { tag: "meta", property: "og:image:alt", content: defaultImageAlt },
        { tag: "meta", property: "og:url", content: url },
        { tag: "meta", property: "og:site_name", content: "ESN Skövde" },
        { tag: "meta", property: "og:locale", content: ogLocale },
        ...LANGUAGE_CODES.filter((code) => code !== lang).map((code) => ({
            tag: "meta",
            property: "og:locale:alternate",
            content: OG_LOCALE[code] ?? OG_LOCALE.en,
        })),

        { tag: "meta", name: "twitter:card", content: "summary_large_image" },
        { tag: "meta", name: "twitter:title", content: seoTitle },
        { tag: "meta", name: "twitter:description", content: seoDescription },
        { tag: "meta", name: "twitter:image", content: seoImage },
        { tag: "meta", name: "twitter:image:alt", content: defaultImageAlt },
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
