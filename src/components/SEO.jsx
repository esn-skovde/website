import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

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
  const currentLanguage = i18n.language === "en" ? "en_US" : i18n.language === "sv" ? "sv_SE" : i18n.language === "es" ? "es_ES" : i18n.language === "de" ? "de_DE" : i18n.language === "no" ? "no_NO" : i18n.language === "fr" ? "fr_FR" : i18n.language === "it" ? "it_IT" : "en_US";

  // Extract the path without language prefix (e.g., "/en/events" -> "events", "/en/" -> "")
  const seoPath = pathname.replace(`/${i18n.language}`, "").replace(/^\/+/, "") || "";
  const seoUrl = seoPath ? `https://esnskovde.org/${i18n.language}/${seoPath}` : `https://esnskovde.org/${i18n.language}/`;

  // Helper function to generate alternate language URLs
  const getAlternateUrl = (lang) => {
    if (!seoPath) {
      return `https://esnskovde.org/${lang}/`;
    }
    return `https://esnskovde.org/${lang}/${seoPath}`;
  };

  // Default values
  const defaultTitle = "ESN Skövde - Erasmus Student Network";
  const defaultDescription =
    t("seo.default.description");
  const defaultKeywords =
    t("seo.default.keywords");
  const defaultImage = "https://esnskovde.org/assets/logo.png";

  const seoTitle = title ? `ESN Skövde - ${title}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;


  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ESN Skövde",
      alternateName: "Erasmus Student Network Skövde",
      url: seoUrl,
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

    if (event) {
      return {
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
        organizer: baseData,
        image: event.image || seoImage,
      };
    }

    if (article) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        author: {
          "@type": "Organization",
          name: "ESN Skövde",
        },
        publisher: baseData,
        datePublished: article.publishedDate,
        dateModified: article.modifiedDate,
        image: article.image || seoImage,
      };
    }

    return baseData;
  };

  return (
    <Helmet key={pathname} prioritizeSeoTags>
      {/* Basic Meta Tags */}
      <html lang={currentLanguage} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="ESN Skövde" />
      <meta name="robots" content={robots} />
      <meta name="language" content={currentLanguage} />

          {/* Canonical URL */}
          <link rel="canonical" href={seoUrl} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content={type} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:image" content={seoImage} />
          <meta property="og:url" content={seoUrl} />
          <meta property="og:site_name" content="ESN Skövde" />
          <meta property="og:locale" content={currentLanguage} />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={seoImage} />
          <meta name="twitter:site" content="@esnskovde" />

          {/* Additional Meta Tags */}
          <meta name="theme-color" content="#2563eb" />
          <meta name="msapplication-TileColor" content="#2563eb" />

          {/* Structured Data */}
          <script type="application/ld+json">
              {JSON.stringify(generateStructuredData())}
          </script>

      {/* Alternate Language Links */}
      <link rel="alternate" hrefLang="en" href={getAlternateUrl("en")} />
      <link rel="alternate" hrefLang="sv" href={getAlternateUrl("sv")} />
      <link rel="alternate" hrefLang="de" href={getAlternateUrl("de")} />
      <link rel="alternate" hrefLang="es" href={getAlternateUrl("es")} />
      <link rel="alternate" hrefLang="fr" href={getAlternateUrl("fr")} />
      <link rel="alternate" hrefLang="it" href={getAlternateUrl("it")} />
      <link rel="alternate" hrefLang="no" href={getAlternateUrl("no")} />
      <link rel="alternate" hrefLang="x-default" href={getAlternateUrl("en")} />
    </Helmet>
  );
};

export default SEO;
