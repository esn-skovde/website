import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True only when both env vars are present.
 *
 * createClient throws at module scope if the URL is missing, which previously
 * took the whole app down to a blank page on /events for anyone who cloned the
 * repo without a .env.local. Callers check this flag and render an empty state.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

/**
 * Whether the sample events and trips in src/data/sampleEvents.js stand in for
 * Supabase.
 *
 * On in `npm run dev` when there are no credentials, so a fresh clone has a
 * populated Events page to develop against instead of an empty one. Set
 * VITE_SAMPLE_DATA=false to turn it off and see the real empty state.
 *
 * Real credentials always win, and DEV comes first in the expression on purpose:
 * a production build folds the whole thing to false, which is what lets Rollup
 * drop the fixtures from the bundle entirely. The deployed site must never carry
 * invented events, let alone show them.
 */
export const sampleDataEnabled =
    import.meta.env.DEV &&
    !isSupabaseConfigured &&
    import.meta.env.VITE_SAMPLE_DATA !== "false";
