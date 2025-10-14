import { useTranslation } from "react-i18next";
import { Instagram, Mail, MapPin } from "lucide-react";
import footerData from "../data/footer.json";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-100 dark:bg-gray-800">
            <div className="container mx-auto px-4 py-10">
                {/* Mobile: First two sections side by side, third section centered below
            Desktop: All three sections in a row */}
                <div className="flex flex-wrap">
                    <div className="w-full flex flex-wrap md:flex-nowrap">
                        {/* Address - Left aligned on desktop */}
                        <div className="w-1/2 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0">
                            <div className="px-4 md:px-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                    {t("footer.location")}
                                </h3>
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <p>{footerData.street}</p>
                                        <p>{footerData.city}</p>
                                        <p>{t("footer.country")}</p>
                                        <p>
                                            <b>{t("footer.universityText")}: </b>
                                            <a
                                                href={
                                                    footerData.universityWebsite
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {t("footer.university")}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact - center aligned on desktop */}
                        <div className="w-1/2 md:w-1/3 flex justify-center mb-8 md:mb-0">
                            <div className="px-4 md:px-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 text-center">
                                    {t("footer.contactUs")}
                                </h3>
                                <div className="flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                                    <a
                                        href="mailto:info@studentorg.edu"
                                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        {footerData.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Socials - Right aligned on desktop */}
                        <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
                            <div className="px-4 md:px-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 text-center md:text-right">
                                    {t("footer.followUs")}
                                </h3>
                                <div className="flex space-x-6 items-center justify-center md:justify-end">
                                    {/* Instagram logo */}
                                    <a
                                        href={footerData.instagramLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                                        aria-label="Instagram"
                                    >
                                        <Instagram size={22} />
                                    </a>

                                    {/* WhatsApp logo */}
                                    <a
                                        href={footerData.whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                        aria-label="WhatsApp"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </a>

                                    {/* Discord logo */}
                                    <a
                                        href={footerData.discordLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                        aria-label="Discord"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                        </svg>
                                    </a>

                                    {/* Linktree logo */}
                                    <a
                                        href={footerData.linktreeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                        aria-label="Linktree"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            width="24"
                                            height="24"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M4 10h16"></path>
                                            <path d="M6.5 4.5l11 11"></path>
                                            <path d="M6.5 15.5l11 -11"></path>
                                            <path d="M12 10v-8"></path>
                                            <path d="M12 15v7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
