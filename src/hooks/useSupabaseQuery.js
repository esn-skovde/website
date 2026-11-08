import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured, sampleDataEnabled } from "../lib/supabase";

/* A source exists when Supabase is configured, or when the local sample data is
   standing in for it. `run` is handed a null client in the second case, and the
   fetchers in lib/events.js return fixtures for it. */
const hasSource = isSupabaseConfigured || sampleDataEnabled;

/**
 * Runs a Supabase query and reports one of four states:
 * unavailable, loading, error, or data.
 *
 * `unavailable` is a first-class state so a clone without .env.local — or a
 * production outage — renders an honest empty section instead of a blank page.
 *
 * @param {(client: import("@supabase/supabase-js").SupabaseClient) => Promise<any>} run
 * @param {Array} deps
 */
const useSupabaseQuery = (run, deps = []) => {
    const [state, setState] = useState({
        data: null,
        loading: hasSource,
        error: null,
    });

    useEffect(() => {
        if (!hasSource) {
            setState({ data: null, loading: false, error: null });
            return undefined;
        }

        let active = true;
        setState((prev) => ({ ...prev, loading: true, error: null }));

        /* The client is fetched on first use (see getSupabase), and is null
           while the sample data stands in. */
        getSupabase()
            .then((client) => run(client))
            .then((data) => {
                if (active) setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                console.error("Supabase query failed:", error);
                if (active) setState({ data: null, loading: false, error });
            });

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { ...state, available: hasSource };
};

export default useSupabaseQuery;
