import { useTranslation } from "react-i18next";

/**
 * Scopes translation lookups to one guide section, so components read
 * `at("title")` rather than repeating the full dotted path every line.
 */
const useSection = (key) => {
    const { t } = useTranslation();

    const at = (path, options) => t(`newToCity.sections.${key}.${path}`, options);

    /* i18next returns the key itself when a path is missing, which would make
       .map() throw. Seven translation files drift, so this always hands back
       an array and a missing list renders as nothing. */
    const list = (path) => {
        const value = t(`newToCity.sections.${key}.${path}`, { returnObjects: true });
        return Array.isArray(value) ? value : [];
    };

    return { at, list };
};

export default useSection;
