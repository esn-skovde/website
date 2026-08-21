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
 * On by default in `npm run dev` when there are no credentials, so a fresh clone
 * has a populated Events page to develop against instead of an empty one. Set
 * VITE_SAMPLE_DATA to "true" or "false" to decide explicitly.
 *
 * Real credentials always win: sample data never masks a live table, and it is
 * off in any production build — the deployed site must never show invented
 * events as if they were real.
 */
const flag = import.meta.env.VITE_SAMPLE_DATA;

export const sampleDataEnabled =
    !isSupabaseConfigured && (flag === "true" || (flag !== "false" && import.meta.env.DEV));
