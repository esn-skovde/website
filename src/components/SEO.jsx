import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  article = null,
  event = null,
  robots = "index, follow",
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Default values
  const defaultTitle = "ESN Skövde - Erasmus Student Network";
  const defaultDescription =
    "ESN Skovde is a section of Erasmus Student Network (ESN) which supports international students. Join our community for events, trips, and unforgettable experiences during your international studies.";
  const defaultKeywords =
    "ESN, Erasmus, Student Network, Skövde, Sweden, International Students, Exchange, University, Events, Trips";
  const defaultImage = "https://esnskovde.org/assets/logo.png";
  const siteUrl = "https://esnskovde.org/";

  const seoTitle = title ? `${title} | ESN Skövde` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ESN Skövde",
      alternateName: "Erasmus Student Network Skövde",
      url: siteUrl,
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
    <Helmet>
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
      <meta
        property="og:locale"
        content={currentLanguage === "sv" ? "sv_SE" : "en_US"}
      />

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
      <link rel="alternate" hrefLang="en" href={`${siteUrl}${url || ""}`} />
      <link rel="alternate" hrefLang="sv" href={`${siteUrl}${url || ""}`} />
      <link rel="alternate" hrefLang="de" href={`${siteUrl}${url || ""}`} />
      <link rel="alternate" hrefLang="es" href={`${siteUrl}${url || ""}`} />
      <link rel="alternate" hrefLang="fr" href={`${siteUrl}${url || ""}`} />
      <link rel="alternate" hrefLang="it" href={`${siteUrl}${url || ""}`} />
      <link rel="alternate" hrefLang="no" href={`${siteUrl}${url || ""}`} />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${siteUrl}${url || ""}`}
      />
    </Helmet>
  );
};

export default SEO;
