import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Available languages
    const languages = [
        { code: "en", name: "English" },
        { code: "sv", name: "Svenska" },
        { code: "es", name: "Español" },
        { code: "de", name: "Deutsch" },
        { code: "no", name: "Norsk" },
        { code: "fr", name: "Français" },
        { code: "it", name: "Italiano" }
    ];

    // Get current language
    const currentLanguage =
        languages.find((lang) => lang.code === i18n.language) || languages[0];

    // Change language handler
    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    // Handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Globe size={20} />
                <span className="hidden md:inline">{currentLanguage.name}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => changeLanguage(language.code)}
                                className={`${
                                    currentLanguage.code === language.code
                                        ? "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                                        : "text-gray-700 dark:text-gray-300"
                                } group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700`}
                                role="menuitem"
                            >
                                {language.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
