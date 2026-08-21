import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

/**
 * Runs a Supabase query and reports one of four states:
 * unconfigured, loading, error, or data.
 *
 * `unconfigured` is a first-class state so a clone without .env.local — or a
 * production outage — renders an honest empty section instead of a blank page.
 *
 * @param {(client: import("@supabase/supabase-js").SupabaseClient) => Promise<any>} run
 * @param {Array} deps
 */
const useSupabaseQuery = (run, deps = []) => {
    const [state, setState] = useState({
        data: null,
        loading: isSupabaseConfigured,
        error: null,
    });

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setState({ data: null, loading: false, error: null });
            return undefined;
        }

        let active = true;
        setState((prev) => ({ ...prev, loading: true, error: null }));

        run(supabase)
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

    return { ...state, configured: isSupabaseConfigured };
};

export default useSupabaseQuery;
