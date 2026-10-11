import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Compass, CreditCard, Home, Mail, Users } from "lucide-react";

import SEO from "../components/SEO";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import StarRule from "../components/ui/StarRule";
import useLang from "../hooks/useLang";
import useBootMount from "../hooks/useBootMount";
import { cn } from "../lib/cn";

/* Everywhere the site actually goes, so a dead link ends at a menu rather than
   at a dead end. Labels reuse the nav keys — they are already translated. */
const DESTINATIONS = [
    { to: "", label: "navBar.home", icon: Home },
    { to: "events", label: "navBar.events", icon: CalendarDays },
    { to: "new-to-skovde", label: "navBar.newToCity", icon: Compass },
    { to: "esn-card", label: "navBar.esnCard", icon: CreditCard },
    { to: "board", label: "navBar.meetBoard", icon: Users },
    { to: "contact", label: "navBar.contactUs", icon: Mail },
];

/* Every locale writes the title as "404 - <phrase>". The numeral is already
   set six times larger right above the heading, so the heading drops it and
   keeps the words. A locale without the prefix is left untouched. */
const headline = (title) => title.replace(/^\s*404\s*[-–—:]\s*/, "");

const NotFoundPage = () => {
    const { t } = useTranslation();
    const { path } = useLang();
    // The prerendered page already played the entrance; the boot render only repaints it.
    const rise = !useBootMount() && "animate-rise-in";

    return (
        <div className="signal-cyan relative isolate flex min-h-[80svh] items-center overflow-hidden bg-ground">
            <SEO
                title={t("seo.pages.notFound.title")}
                description={t("seo.pages.notFound.description")}
                keywords={t("seo.pages.notFound.keywords")}
                robots="noindex, nofollow"
            />

            <div className="starfield opacity-80" aria-hidden="true" />

            <Container className="relative py-20">
                <div className="flex flex-col items-center text-center">
                    {/* The number is the one thing worth setting large here; it tells
                        you what happened before you have read a word. */}
                    <p
                        className={cn(
                            "text-display text-[6rem] leading-none tracking-tight text-transparent sm:text-[9rem] bg-gradient-to-br from-esn-cyan via-esn-magenta to-esn-orange bg-clip-text",
                            rise
                        )}
                        aria-hidden="true"
                    >
                        404
                    </p>

                    <h1
                        className={cn("mt-4 text-display text-3xl text-ink sm:text-4xl", rise)}
                        style={{ animationDelay: "120ms" }}
                    >
                        {headline(t("notFound.title"))}
                    </h1>

                    <p
                        className={cn("measure mt-4 text-lg leading-relaxed text-ink-muted", rise)}
                        style={{ animationDelay: "200ms" }}
                    >
                        {t("notFound.message")}
                    </p>

                    <div
                        className={cn("mt-8", rise)}
                        style={{ animationDelay: "280ms" }}
                    >
                        {/* Was an unconditional five-second jump to "/", which dropped
                            the language and moved the page out from under anyone still
                            reading. Going home is now the reader's decision. */}
                        <Button to={path("")} size="lg">
                            {t("notFound.goBackHomeNow")}
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </Button>
                    </div>

                    <nav
                        aria-label={t("navBar.menu", { defaultValue: "Menu" })}
                        className={cn("mt-14 w-full", rise)}
                        style={{ animationDelay: "360ms" }}
                    >
                        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {DESTINATIONS.map(({ to, label, icon: Icon }) => (
                                <li key={to || "home"}>
                                    <Link
                                        to={path(to)}
                                        className="panel group flex items-center gap-3 p-4 text-left transition-transform duration-200 hover:-translate-y-0.5"
                                    >
                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-signal/[0.12] text-signal-ink">
                                            <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2.2} />
                                        </span>
                                        <span className="font-display font-bold text-ink">
                                            {t(label)}
                                        </span>
                                        <ArrowRight
                                            className="ml-auto h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-signal-ink"
                                            strokeWidth={2.4}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </Container>

            <StarRule />
        </div>
    );
};

export default NotFoundPage;
