import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Routers keep the scroll position across navigations; users expect a new page
 * to start at the top. In-page anchors are left alone so #section links work.
 */
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) return;
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
