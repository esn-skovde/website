import { useTranslation } from "react-i18next";

const ContactDivider = () => {
    const { t } = useTranslation();

    return (
        <div className="text-center mb-8">
            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                {/* Or */}
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                        {t("contact.or")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ContactDivider;
