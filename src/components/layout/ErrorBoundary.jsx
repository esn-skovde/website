import { Component } from "react";
import { useTranslation } from "react-i18next";

/* A class cannot call useTranslation, so the screen is a component of its own.
   The language is the one the page was opened in, which main.jsx sets before
   anything renders. */
const ErrorScreen = () => {
    const { t } = useTranslation();

    return (
        <div
            /* Lets scripts/prerender.js recognise this fallback without
               matching on its copy, and refuse to ship it as the page. */
            data-error-boundary=""
            className="signal-magenta flex min-h-[70vh] items-center justify-center bg-ground px-5 py-20"
        >
            <div className="panel w-full max-w-lg p-8 text-center">
                <span className="eyebrow justify-center">{t("errorBoundary.eyebrow")}</span>
                <h1 className="mt-4 text-display text-3xl text-ink">{t("errorBoundary.title")}</h1>
                <p className="mt-3 text-ink-muted">{t("errorBoundary.body")}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-signal-ink px-6 py-3 font-display font-bold text-on-signal transition hover:brightness-110"
                    >
                        {t("errorBoundary.reload")}
                    </button>
                    <a
                        /* Not "/" — on a project page that leaves the site. */
                        href={import.meta.env.BASE_URL}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline/[var(--hairline-opacity)] px-6 py-3 font-display font-bold text-ink transition hover:border-signal"
                    >
                        {t("errorBoundary.home")}
                    </a>
                </div>
            </div>
        </div>
    );
};

/**
 * Catches render errors so a single failing page can't blank the whole site.
 *
 * Before this existed, an unconfigured Supabase client threw at module scope
 * and /events rendered as a white screen with nothing in the UI to explain it.
 *
 * A change of `resetKey` clears the error. Nothing ever did before, so one
 * page that failed (a chunk gone after a deploy) left every page after it,
 * whatever the URL said, showing this fallback until a full reload.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, resetKey: props.resetKey };
    }

    static getDerivedStateFromProps(props, state) {
        return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("Unhandled render error:", error, info?.componentStack);
    }

    render() {
        return this.state.error ? <ErrorScreen /> : this.props.children;
    }
}

export default ErrorBoundary;
