import { Component } from "react";

/**
 * Catches render errors so a single failing page can't blank the whole site.
 *
 * Before this existed, an unconfigured Supabase client threw at module scope
 * and /events rendered as a white screen with nothing in the UI to explain it.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("Unhandled render error:", error, info?.componentStack);
    }

    render() {
        if (!this.state.error) return this.props.children;

        return (
            <div className="signal-magenta flex min-h-[70vh] items-center justify-center bg-ground px-5 py-20">
                <div className="panel w-full max-w-lg p-8 text-center">
                    <span className="eyebrow justify-center">Something broke</span>
                    <h1 className="mt-4 text-display text-3xl text-ink">
                        This page didn&apos;t load
                    </h1>
                    <p className="mt-3 text-ink-muted">
                        Something on our side failed while rendering. Reloading usually
                        fixes it — if it doesn&apos;t, let the board know.
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-signal-ink px-6 py-3 font-display font-bold text-on-signal transition hover:brightness-110"
                        >
                            Reload the page
                        </button>
                        <a
                            /* Not "/" — on a project page that leaves the site. */
                            href={import.meta.env.BASE_URL}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline/[var(--hairline-opacity)] px-6 py-3 font-display font-bold text-ink transition hover:border-signal"
                        >
                            Go to the homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
