import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const langMenuRef = useRef(null);
    const aboutMenuRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const langPrefix = `/${i18n.language}`;

    const stripLangFromPath = (fullPath) => {
        const parts = fullPath.split("/").filter(Boolean);
        if (parts.length === 0) return "/";
        // remove first segment as language code
        const [, ...rest] = parts;
        return rest.length === 0 ? "/" : `/${rest.join("/")}`;
    };

    const languages = [
        { code: "en", name: "English" },
        { code: "sv", name: "Svenska" },
        { code: "es", name: "Español" },
        { code: "de", name: "Deutsch" },
        { code: "no", name: "Norsk" },
        { code: "fr", name: "Français" },
        { code: "it", name: "Italiano" }
    ];

    // Get current language display name or fallback to English
    const currentLang =
        languages.find((lang) => lang.code === i18n.language)?.name ||
        "English";

    const changeLanguage = (langCode) => {
        const currentParts = pathname.split("/").filter(Boolean);
        const rest = currentParts.slice(1); // drop current lang
        const newPath = `/${langCode}/${rest.join("/")}`.replace(/\/$/, "");
        i18n.changeLanguage(langCode);
        navigate(newPath || `/${langCode}/`, { replace: true });
        setIsLangMenuOpen(false);
    };

    // Check if a path is active or is a parent of the current path
    const isActive = (path) => {
        const withoutLang = stripLangFromPath(pathname);
        if (path === "/") {
            return withoutLang === "/";
        }
        return withoutLang.startsWith(path);
    };

    // Handle clicks outside of language menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                langMenuRef.current &&
                !langMenuRef.current.contains(event.target)
            ) {
                setIsLangMenuOpen(false);
            }

            if (
                aboutMenuRef.current &&
                !aboutMenuRef.current.contains(event.target)
            ) {
                setIsAboutMenuOpen(false);
            }
        };

        // Add event listener when any menu is open
        if (isLangMenuOpen || isAboutMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLangMenuOpen, isAboutMenuOpen]);

    // Check if any of the about routes are active
    const isAboutActive = ["/", "/board", "/contact"].some((path) =>
        isActive(path)
    );

    // Get the current about section label based on active path
    const getCurrentAboutLabel = () => {
        if (isActive("/board")) {
            return t("navBar.meetBoard") || "Meet Board";
        } else if (isActive("/contact")) {
            return t("navBar.contactUs") || "Contact Us";
        } else {
            return t("navBar.home") || "Home";
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center">
                        <Link to={`${langPrefix}/`} className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                                <img src={logo} alt="esn-logo" />
                            </div>

                            <div className="ml-3">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                    ESN
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Skövde
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {/* About Us Dropdown */}
                        <div className="relative" ref={aboutMenuRef}>
                            <button
                                onClick={() =>
                                    setIsAboutMenuOpen(!isAboutMenuOpen)
                                }
                                className={`flex items-center ${
                                    isAboutActive
                                        ? "text-blue-600 dark:text-blue-400 font-medium"
                                        : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                                }`}
                            >
                                {getCurrentAboutLabel()}
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            {/* About Us Dropdown Menu*/}
                            {isAboutMenuOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to={`${langPrefix}/`}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                            isActive("/")
                                                ? "text-blue-600 dark:text-blue-400 font-medium bg-gray-50 dark:bg-gray-600"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        }`}
                                        onClick={() =>
                                            setIsAboutMenuOpen(false)
                                        }
                                    >
                                        {t("navBar.home") || "Home"}
                                    </Link>
                                    <Link
                                        to={`${langPrefix}/board`}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                            isActive("/board")
                                                ? "text-blue-600 dark:text-blue-400 font-medium bg-gray-50 dark:bg-gray-600"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        }`}
                                        onClick={() =>
                                            setIsAboutMenuOpen(false)
                                        }
                                    >
                                        {t("navBar.meetBoard") || "Meet Board"}
                                    </Link>
                                    <Link
                                        to={`${langPrefix}/contact`}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                            isActive("/contact")
                                                ? "text-blue-600 dark:text-blue-400 font-medium bg-gray-50 dark:bg-gray-600"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        }`}
                                        onClick={() =>
                                            setIsAboutMenuOpen(false)
                                        }
                                    >
                                        {t("navBar.contactUs") || "Contact Us"}
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            to={`${langPrefix}/events`}
                            className={`${
                                isActive("/events")
                                    ? "text-blue-600 dark:text-blue-400 font-medium"
                                    : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                            }`}
                        >
                            {t("navBar.events")}
                        </Link>

                        <Link
                            to={`${langPrefix}/new-to-skovde`}
                            className={`${
                                isActive("/new-to-skovde")
                                    ? "text-blue-600 dark:text-blue-400 font-medium"
                                    : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                            }`}
                        >
                            {t("navBar.newToCity")}
                        </Link>

                        <Link
                            to={`${langPrefix}/esn-card`}
                            className={`inline-block px-4 py-2 rounded-md border border-blue-600 transition-colors duration-200 ${
                                isActive("/esn-card")
                                    ? "bg-blue-700 hover:bg-blue-800 text-white font-medium"
                                    : "bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            }`}
                        >
                            {t("navBar.esnCard")}
                        </Link>

                        {/* Language Switcher */}
                        <div className="relative" ref={langMenuRef}>
                            <button
                                onClick={() =>
                                    setIsLangMenuOpen(!isLangMenuOpen)
                                }
                                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                            >
                                {currentLang}
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            {/* Language options Dropdown */}
                            {isLangMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            changeLanguage(lang.code);
                                        }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Light/Dark Mode Toggle */}
                        <ThemeToggle />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {/* Light/Dark Mode Toggle */}
                        <ThemeToggle />

                        {/* Menu Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* About Us section in mobile */}
                        <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t("navBar.aboutUs") || "About Us"}
                            </p>
                            <div className="mt-2 space-y-1 ml-2">
                                <Link
                                    to={`${langPrefix}/`}
                                    className={`block w-full text-left ${
                                        isActive("/")
                                            ? "text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t("navBar.home") || "Home"}
                                </Link>
                                <Link
                                    to={`${langPrefix}/board`}
                                    className={`block w-full text-left ${
                                        isActive("/board")
                                            ? "text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t("navBar.meetBoard") || "Meet Board"}
                                </Link>
                                <Link
                                    to={`${langPrefix}/contact`}
                                    className={`block w-full text-left ${
                                        isActive("/contact")
                                            ? "text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t("navBar.contactUs") || "Contact Us"}
                                </Link>
                            </div>
                        </div>

                        <Link
                            to={`${langPrefix}/events`}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive("/events")
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {t("navBar.events")}
                        </Link>
                        <Link
                            to={`${langPrefix}/new-to-skovde`}
                            className={`block w-fit px-3 py-2 ml-3 rounded-md text-base font-medium border mb-4 ${
                                isActive("/new-to-skovde")
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500"
                                    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {t("navBar.newToCity") || "New to Skövde"}
                        </Link>

                        <Link
                            to={`${langPrefix}/esn-card`}
                            className={`block w-fit px-3 py-2 ml-3 rounded-md text-base font-medium ${
                                isActive("/esn-card")
                                    ? "bg-blue-700 text-white hover:bg-blue-800"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {t("navBar.esnCard")}
                        </Link>

                        {/* Language Options  */}
                        <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t("navBar.changeLanguage")}
                            </p>
                            <div className="mt-2 space-y-1 ml-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            changeLanguage(lang.code);
                                            setIsOpen(false);
                                        }}
                                        className={`block w-full text-left hover:text-blue-500 dark:hover:text-blue-400 ${
                                            i18n.language === lang.code
                                                ? "text-blue-500 dark:text-blue-400 "
                                                : "text-gray-700 dark:text-gray-200 "
                                        }`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
