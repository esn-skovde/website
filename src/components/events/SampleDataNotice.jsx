import { FlaskConical } from "lucide-react";

import { cn } from "../../lib/cn";

/**
 * Says out loud that the events on screen are invented.
 *
 * Sample data now stands in on any build without Supabase credentials, deployed
 * previews included, so this is no longer only seen by developers — a visitor
 * must never be able to mistake a fixture for something they can turn up to.
 *
 * Deliberately untranslated: it is a build-configuration notice, not site copy,
 * and it should read the same to whoever is looking at the deploy.
 */
const SampleDataNotice = ({ className }) => (
    <p
        className={cn(
            "flex items-start gap-2.5 rounded-2xl border border-signal/35 bg-signal/10 px-4 py-3 text-sm text-ink-muted",
            className
        )}
    >
        <FlaskConical className="lead-icon h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2.5} />
        <span>
            <strong className="font-display font-bold text-ink">Sample data.</strong> This build has
            no Supabase connection, so the events and trips shown are made up — they are here to
            show how the page looks, not what is actually on. Set{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">VITE_SAMPLE_DATA=false</code>{" "}
            to turn them off, or add credentials to load the real ones.
        </span>
    </p>
);

export default SampleDataNotice;
