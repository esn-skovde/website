import React from "react";
import { useTranslation } from "react-i18next";

const NewToCityNavigation = () => {
    const { t } = useTranslation();

    const navigationItems = [
        {
            href: "#getting-started",
            icon: "🧭",
            label: t("newToCity.sections.gettingStarted.title")
        },
        {
            href: "#city-highlights",
            icon: "📍",
            label: t("newToCity.sections.cityHighlights.title")
        },
        {
            href: "#places-to-explore",
            icon: "🗺️",
            label: t("newToCity.sections.placesToExplore.title")
        },
        {
            href: "#transport",
            icon: "🚍",
            label: t("newToCity.sections.transport.title")
        },
        {
            href: "#settling-in",
            icon: "🧳",
            label: t("newToCity.sections.settlingIn.title")
        },
        {
            href: "#emergency-contacts",
            icon: "🆘",
            label: t("newToCity.sections.emergencyContacts.title")
        },
        {
            href: "#buddy-program",
            icon: "🤝",
            label: t("newToCity.sections.buddyProgram.title")
        },
        {
            href: "#shopping",
            icon: "🛒",
            label: t("newToCity.sections.shopping.title")
        },
        {
            href: "#useful-apps",
            icon: "📱",
            label: t("newToCity.sections.usefulApps.title")
        },
        {
            href: "#accommodation",
            icon: "🏡",
            label: t("newToCity.sections.accommodation.title")
        },
        {
            href: "#student-life",
            icon: "📚",
            label: t("newToCity.sections.studentLife.title")
        }
    ];

    return (
        <div className="sticky top-16 z-30 bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-3 overflow-x-auto">
                <div className="flex space-x-4 md:space-x-6 min-w-max">
                    {navigationItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
                        >
                            {item.icon} {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewToCityNavigation;
