import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Check, Globe } from "lucide-react";

import ThemeToggle from "../ThemeToggle";
import Container from "../ui/Container";
import useLang from "../../hooks/useLang";
import { SUPPORTED_LANGUAGES } from "../../lib/languages";
import { getImage } from "../../lib/images";
import { cn } from "../../lib/cn";

const logo = getImage("logo");

// A flat set of destinations. The old header hid Home, Board and Contact
// behind an "About us" dropdown whose label changed to match the current page,
// which made it impossible to tell where you were or where the menu went.
const NAV_ITEMS = [
    { to: "events", key: "navBar.events" },
    { to: "new-to-skovde", key: "navBar.newToCity" },
    { to: "board", key: "navBar.meetBoard" },
    { to: "contact", key: "navBar.contactUs" },
];

const Navbar = () => {
    const { t } = useTranslation();
    const { lang, path } = useLang();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef(null);
    const menuButtonRef = useRef(null);
    const sheetRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                setScrolled(window.scrollY > 12);
                frame = 0;
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    // Close menus on navigation.
    useEffect(() => {
        setMobileOpen(false);
        setLangOpen(false);
    }, [pathname]);

    // Language dropdown: click-outside and Escape.
    useEffect(() => {
        if (!langOpen) return undefined;
        const onPointerDown = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
        };
        const onKeyDown = (event) => event.key === "Escape" && setLangOpen(false);
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [langOpen]);

    /* Lock background scrolling while the mobile sheet is open. overflow:hidden
       on the body alone does not hold on iOS Safari — touch scrolling goes
       straight through it — so the body is pinned and the offset restored on
       close, which is the version that actually works there. */
    useEffect(() => {
        if (!mobileOpen) return undefined;

        const { scrollY } = window;
        const lockedPath = window.location.pathname;
        const { style } = document.body;
        const previous = {
            position: style.position,
            top: style.top,
            left: style.left,
            right: style.right,
            width: style.width,
            overflow: style.overflow,
        };

        style.position = "fixed";
        style.top = `-${scrollY}px`;
        style.left = "0";
        style.right = "0";
        style.width = "100%";
        style.overflow = "hidden";

        const onKeyDown = (event) => event.key === "Escape" && setMobileOpen(false);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            Object.assign(style, previous);
            /* Only put the reader back if they are still on the same page. A tap
               on a link inside the sheet closes it *and* navigates, and by the
               time this runs ScrollToTop has already moved to the top of the new
               page — restoring here would drag that page down to the old one's
               offset. html also has scroll-behavior:smooth, hence "instant". */
            if (window.location.pathname === lockedPath) {
                window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
            }
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [mobileOpen]);

    /* The sheet is lg:hidden. If the viewport crosses that breakpoint while it
       is open — rotating a tablet — CSS would hide it while the scroll lock
       above stayed applied, freezing the page. Close it for real instead. */
    useEffect(() => {
        if (!mobileOpen) return undefined;
        const query = window.matchMedia("(min-width: 1024px)");
        const onChange = (event) => event.matches && setMobileOpen(false);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, [mobileOpen]);

    // Focus moves into the sheet, stays inside it, and returns to the button
    // that opened it — what aria-modal on the sheet promises.
    useEffect(() => {
        if (!mobileOpen) return undefined;
        const opener = menuButtonRef.current;
        closeButtonRef.current?.focus({ preventScroll: true });

        const onKeyDown = (event) => {
            if (event.key !== "Tab" || !sheetRef.current) return;
            const items = [...sheetRef.current.querySelectorAll("a[href], button")].filter(
                (el) => !el.hasAttribute("disabled")
            );
            if (!items.length) return;
            const edge = event.shiftKey ? items[0] : items[items.length - 1];
            if (document.activeElement === edge) {
                event.preventDefault();
                (event.shiftKey ? items[items.length - 1] : items[0]).focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            // .focus() scrolls its target into view, which would undo the
            // scroll position the lock above has just restored.
            opener?.focus({ preventScroll: true });
        };
    }, [mobileOpen]);

    const changeLanguage = (code) => {
        const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
        setLangOpen(false);
        navigate(rest ? `/${code}/${rest}/` : `/${code}/`);
    };

    const linkClass = ({ isActive }) =>
        cn(
            "relative rounded-full px-3.5 py-2 text-[0.9375rem] font-display font-bold tracking-tight transition-colors duration-200",
            isActive ? "text-signal-ink" : "text-ink-muted hover:text-ink"
        );

    return (
        <>
            {/* Fixed, not sticky. Chrome scrolls a newly focused element into
                view when it lies inside the page's scroll padding, and it
                counts a sticky header as part of the page: every Tab along
                these links pulled the page up by half a screen. A fixed
                element is never scrolled into view. The spacer after it keeps
                its place in the layout, and print gets it back in the flow. */}
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 print:static",
                    scrolled
                        ? "glass border-b shadow-[0_1px_20px_-12px_rgb(var(--shadow-color)/0.6)]"
                        : "border-b border-transparent bg-ground"
                )}
                style={{ height: "var(--nav-height)" }}
            >
                <Container width="wide" className="flex h-full items-center justify-between gap-4">
                    <Link
                        to={path()}
                        className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
                    >
                        <img
                            src={logo?.src}
                            alt=""
                            width="36"
                            height="36"
                            className="h-9 w-9"
                            decoding="async"
                        />
                        <span className="flex flex-col leading-none">
                            <span className="font-display text-lg font-bold tracking-tight text-ink">
                                ESN
                            </span>
                            <span className="font-display text-[0.7rem] font-normal uppercase tracking-[0.18em] text-ink-faint">
                                Skövde
                            </span>
                        </span>
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                        {NAV_ITEMS.map((item) => (
                            <NavLink key={item.to} to={path(item.to)} className={linkClass} end={false}>
                                {({ isActive }) => (
                                    <>
                                        {t(item.key)}
                                        <span
                                            className={cn(
                                                "absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-signal transition-transform duration-300",
                                                isActive ? "scale-x-100" : "scale-x-0"
                                            )}
                                            aria-hidden="true"
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        {/* Language menu */}
                        <div className="relative hidden sm:block" ref={langRef}>
                            <button
                                type="button"
                                onClick={() => setLangOpen((open) => !open)}
                                aria-expanded={langOpen}
                                aria-haspopup="menu"
                                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline/[var(--hairline-opacity)] px-3 text-sm font-display font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-signal hover:text-signal-ink"
                            >
                                <Globe className="h-4 w-4" strokeWidth={2} />
                                {lang}
                            </button>

                            {langOpen && (
                                <div
                                    role="menu"
                                    className="panel absolute right-0 z-50 mt-2 w-48 overflow-hidden p-1.5 animate-fade-in"
                                >
                                    {SUPPORTED_LANGUAGES.map((language) => (
                                        <button
                                            key={language.code}
                                            type="button"
                                            role="menuitem"
                                            onClick={() => changeLanguage(language.code)}
                                            className={cn(
                                                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                                                language.code === lang
                                                    ? "bg-signal/10 font-bold text-signal-ink"
                                                    : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                                            )}
                                        >
                                            <span aria-hidden="true">{language.flag}</span>
                                            <span className="flex-1">{language.name}</span>
                                            {language.code === lang && <Check className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <ThemeToggle />

                        <Link
                            to={path("esn-card")}
                            className="hidden shrink-0 rounded-full bg-signal-ink px-5 py-2.5 font-display text-[0.9375rem] font-bold tracking-tight text-on-signal shadow-[0_8px_22px_-10px_rgb(var(--signal-ink)/0.85)] transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:inline-flex"
                        >
                            {t("navBar.esnCard")}
                        </Link>

                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            aria-label={t("navBar.openMenu", { defaultValue: "Open menu" })}
                            aria-expanded={mobileOpen}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline/[var(--hairline-opacity)] text-ink-muted transition-colors hover:border-signal hover:text-signal-ink lg:hidden"
                        >
                            <Menu className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                        </button>
                    </div>
                </Container>

                {/* Mobile sheet.

                    Portalled to <body> rather than left inside <header>. Once the
                    page scrolls past 12px the header gains .glass, and a non-none
                    backdrop-filter makes an element the containing block for its
                    fixed-position descendants — so `inset-0` stopped resolving to
                    the viewport and started resolving to the 4.5rem header box,
                    collapsing the open sheet into the bar. Measured: 390x844 at
                    the top of the page, 388x70 after scrolling. */}
                {mobileOpen &&
                    createPortal(
                        <div
                            ref={sheetRef}
                            role="dialog"
                            aria-modal="true"
                            aria-label={t("navBar.menu", { defaultValue: "Menu" })}
                            className="fixed inset-0 z-[60] lg:hidden"
                        >
                            <button
                                type="button"
                                aria-label={t("navBar.closeMenu", { defaultValue: "Close menu" })}
                                onClick={() => setMobileOpen(false)}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            />

                            <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto overscroll-contain border-l border-hairline/[var(--hairline-opacity)] bg-ground px-6 pb-10 pt-5 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <span className="eyebrow">ESN Skövde</span>
                                    <button
                                        ref={closeButtonRef}
                                        type="button"
                                        onClick={() => setMobileOpen(false)}
                                        aria-label={t("navBar.closeMenu", { defaultValue: "Close menu" })}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline/[var(--hairline-opacity)] text-ink-muted"
                                    >
                                        <X className="h-5 w-5" strokeWidth={2} />
                                    </button>
                                </div>

                                <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
                                    <NavLink
                                        to={path()}
                                        end
                                        className={({ isActive }) =>
                                            cn(
                                                "rounded-2xl px-4 py-3.5 font-display text-lg font-bold tracking-tight transition-colors",
                                                isActive
                                                    ? "bg-signal/10 text-signal-ink"
                                                    : "text-ink hover:bg-surface-2"
                                            )
                                        }
                                    >
                                        {t("navBar.home")}
                                    </NavLink>

                                    {NAV_ITEMS.map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={path(item.to)}
                                            className={({ isActive }) =>
                                                cn(
                                                    "rounded-2xl px-4 py-3.5 font-display text-lg font-bold tracking-tight transition-colors",
                                                    isActive
                                                        ? "bg-signal/10 text-signal-ink"
                                                        : "text-ink hover:bg-surface-2"
                                                )
                                            }
                                        >
                                            {t(item.key)}
                                        </NavLink>
                                    ))}
                                </nav>

                                <Link
                                    to={path("esn-card")}
                                    className="mt-6 inline-flex items-center justify-center rounded-full bg-signal-ink px-6 py-3.5 font-display font-bold text-on-signal"
                                >
                                    {t("navBar.esnCard")}
                                </Link>

                                <div className="mt-10">
                                    <p className="eyebrow">{t("navBar.changeLanguage")}</p>
                                    <div className="mt-4 grid grid-cols-2 gap-1.5">
                                        {SUPPORTED_LANGUAGES.map((language) => (
                                            <button
                                                key={language.code}
                                                type="button"
                                                onClick={() => changeLanguage(language.code)}
                                                className={cn(
                                                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                                                    language.code === lang
                                                        ? "bg-signal/10 font-bold text-signal-ink"
                                                        : "text-ink-muted hover:bg-surface-2"
                                                )}
                                            >
                                                <span aria-hidden="true">{language.flag}</span>
                                                {language.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
            </header>
            <div aria-hidden="true" className="h-nav shrink-0 print:hidden" />
        </>
    );
};

export default Navbar;
