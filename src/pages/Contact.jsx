import { useTranslation } from "react-i18next";
import SocialMediaButtons from "../components/contact/SocialMediaButtons";
import ContactDivider from "../components/contact/ContactDivider";
import ContactForm from "../components/contact/ContactForm";
import SEO from "../components/SEO";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("navBar.contactUs")}
        description={t("seo.pages.contactUs.description")}
        keywords={t("seo.pages.contactUs.keywords")}
        url={`/${t.language}/contact`}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            {t("contact.title")}
          </h1>

          <div className="max-w-2xl mx-auto">
            <SocialMediaButtons />
            <ContactDivider />
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
