import { useTranslation } from "react-i18next";

import PageShell from "../components/ui/PageShell";
import Container from "../components/ui/Container";
import Reveal from "../components/ui/Reveal";
import ContactChannels from "../components/contact/ContactChannels";
import ContactForm from "../components/contact/ContactForm";

const Contact = () => {
    const { t } = useTranslation();

    return (
        <PageShell
            signal="cyan"
            eyebrow={t("navBar.contactUs")}
            title={t("contact.pageTitle", { defaultValue: "Get in touch" })}
            lead={t("contact.pageLead", {
                defaultValue:
                    "Questions about an event, the ESNcard, or settling into Skövde? Pick whichever way suits you — a real board member reads all of them.",
            })}
            seo={{
                title: t("navBar.contactUs"),
                description: t("seo.pages.contactUs.description"),
                keywords: t("seo.pages.contactUs.keywords"),
            }}
        >
            <section className="py-14 sm:py-20">
                <Container>
                    {/* Channels first on a phone: most visitors want the Instagram
                        DM, not a five-field form. */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr] lg:gap-8">
                        <Reveal>
                            <ContactChannels />
                        </Reveal>
                        <Reveal delay={100}>
                            <ContactForm />
                        </Reveal>
                    </div>
                </Container>
            </section>
        </PageShell>
    );
};

export default Contact;
