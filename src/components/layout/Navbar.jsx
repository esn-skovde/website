import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Check, Globe } from "lucide-react";

import ThemeToggle from "../ThemeToggle";
import Container from "../ui/Container";
import useLang from "../../hooks/useLang";
import { SUPPORTED_LANGUAGES, languageName } from "../../lib/languages";
import { languageHref, pageKeyFor } from "../../lib/routes";
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

// How long after it opens the sheet ignores a tap on its close button or backdrop.
const SHEET_GRACE_MS = 350;

// The page the browser is on, whatever its language.
const currentPage = () => pageKeyFor(window.location.pathname, import.meta.env.BASE_URL);

const Navbar = () => {
    const { t } = useTranslation();
    const { lang, path } = useLang();
    const location = useLocation();
    const { pathname, search, hash } = location;

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef(null);
    const langButtonRef = useRef(null);
    const menuButtonRef = useRef(null);
    const openedAt = useRef(0);
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

    /* Close menus on navigation. Keyed on the location, not the pathname: a
       tap on the page you are already on is a navigation to the same URL, which
       keeps the pathname and gets a new key. Back and Forward change it too. */
    useEffect(() => {
        setMobileOpen(false);
        setLangOpen(false);
    }, [location.key]);

    // Closes the language panel and puts focus back on its button, not on the page.
    const closeLangMenu = useCallback(() => {
        setLangOpen(false);
        langButtonRef.current?.focus({ preventScroll: true });
    }, []);

    // Language panel: click-outside and Escape. Focus leaving it is handled on the wrapper.
    useEffect(() => {
        if (!langOpen) return undefined;
        const onPointerDown = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
        };
        const onKeyDown = (event) => event.key === "Escape" && closeLangMenu();
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [langOpen, closeLangMenu]);

    /* Lock background scrolling while the mobile sheet is open. overflow:hidden
       on the body alone does not hold on iOS Safari — touch scrolling goes
       straight through it — so the body is pinned and the offset restored on
       close, which is the version that actually works there. */
    useEffect(() => {
        if (!mobileOpen) return undefined;

        const { scrollY } = window;
        const lockedPage = currentPage();
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
            /* Only put the reader back if they are still on the same page, which
               includes the same page in another language: a language switch keeps
               their place. A tap on a link inside the sheet closes it *and*
               navigates, and by the time this runs ScrollToTop has already moved
               to the top of the new page — restoring here would drag that page
               down to the old one's offset. html also has scroll-behavior:smooth,
               hence "instant". */
            if (currentPage() === lockedPage) {
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

        /* What Tab can reach inside the sheet. The backdrop is a button too, but
           tabindex -1 keeps it out of the sequence: it fills the screen, so a ring
           drawn on it falls outside the viewport and focus would seem to vanish. */
        const onKeyDown = (event) => {
            if (event.key !== "Tab" || !sheetRef.current) return;
            const items = [
                ...sheetRef.current.querySelectorAll("a[href], button:not([tabindex='-1'])"),
            ].filter((el) => !el.hasAttribute("disabled"));
            if (!items.length) return;
            /* -1 is focus on something the trap does not list: <body> after a tap
               on a blank part of the panel, or the backdrop. Tab from there would
               leave the dialog, so it re-enters at the end the reader is heading for. */
            const index = items.indexOf(document.activeElement);
            const atEdge = event.shiftKey ? index === 0 : index === items.length - 1;
            if (index === -1 || atEdge) {
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

    // The same page in another language, keeping the reader's ?query and #fragment.
    const languageTo = (code) => `${languageHref(code, pathname)}${search}${hash}`;

    const openSheet = () => {
        openedAt.current = performance.now();
        setMobileOpen(true);
    };

    /* The close button sits right under the menu button and the sheet fades in
       over it, so the second tap of a double tap on the menu button landed on it
       and shut the sheet it had just opened. */
    const dismissSheet = () => {
        if (performance.now() - openedAt.current > SHEET_GRACE_MS) setMobileOpen(false);
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
                    <nav className="hidden items-center gap-1 lg:flex" aria-label={t("navBar.mainNav")}>
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
                        {/* Language switcher. A disclosure of links rather than an
                            ARIA menu: every choice goes to another URL, and a menu
                            would promise arrow keys and a focus that moves into it.
                            Focus leaving the wrapper closes it, as Escape does. The
                            button's name keeps its visible code (EN). */}
                        <div
                            className="relative hidden sm:block"
                            ref={langRef}
                            onBlur={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget)) setLangOpen(false);
                            }}
                        >
                            <button
                                ref={langButtonRef}
                                type="button"
                                onClick={() => setLangOpen((open) => !open)}
                                aria-expanded={langOpen}
                                aria-controls={langOpen ? "lang-panel" : undefined}
                                aria-label={`${t("navBar.changeLanguage")} — ${languageName(lang)} (${lang.toUpperCase()})`}
                                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline/[var(--hairline-opacity)] px-3 text-sm font-display font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-signal hover:text-signal-ink"
                            >
                                <Globe className="h-4 w-4" strokeWidth={2} />
                                {lang}
                            </button>

                            {langOpen && (
                                <div
                                    id="lang-panel"
                                    className="panel absolute right-0 z-50 mt-2 w-48 overflow-hidden p-1.5 animate-fade-in"
                                >
                                    <ul>
                                        {SUPPORTED_LANGUAGES.map((language) => (
                                            <li key={language.code}>
                                                <Link
                                                    to={languageTo(language.code)}
                                                    replace={language.code === lang}
                                                    hrefLang={language.code}
                                                    lang={language.code}
                                                    aria-current={language.code === lang ? "true" : undefined}
                                                    onClick={closeLangMenu}
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
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
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
                            onClick={openSheet}
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
                            {/* A tap target only. The close button in the panel is the
                                labelled control, so this one stays out of the tab order
                                and the accessibility tree: it was a second "Close menu",
                                and the first stop for Shift+Tab with a ring nobody could see. */}
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-hidden="true"
                                onClick={dismissSheet}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            />

                            <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto overscroll-contain border-l border-hairline/[var(--hairline-opacity)] bg-ground px-6 pb-10 pt-5 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <span className="eyebrow">ESN Skövde</span>
                                    <button
                                        ref={closeButtonRef}
                                        type="button"
                                        onClick={dismissSheet}
                                        aria-label={t("navBar.closeMenu", { defaultValue: "Close menu" })}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline/[var(--hairline-opacity)] text-ink-muted"
                                    >
                                        <X className="h-5 w-5" strokeWidth={2} />
                                    </button>
                                </div>

                                <nav className="mt-8 flex flex-col gap-1" aria-label={t("navBar.mainNav")}>
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
                                    {/* Each link shuts the sheet itself rather than waiting for
                                        the navigation to do it: the page has to be unlocked, and
                                        put back where it was, before the new language's text
                                        arrives. Reflowed under the lock, the text left the reader
                                        at an offset it had moved away from. */}
                                    <div className="mt-4 grid grid-cols-2 gap-1.5">
                                        {SUPPORTED_LANGUAGES.map((language) => (
                                            <Link
                                                key={language.code}
                                                to={languageTo(language.code)}
                                                replace={language.code === lang}
                                                hrefLang={language.code}
                                                lang={language.code}
                                                aria-current={language.code === lang ? "true" : undefined}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                                                    language.code === lang
                                                        ? "bg-signal/10 font-bold text-signal-ink"
                                                        : "text-ink-muted hover:bg-surface-2"
                                                )}
                                            >
                                                <span aria-hidden="true">{language.flag}</span>
                                                {language.name}
                                            </Link>
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
