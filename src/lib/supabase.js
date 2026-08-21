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
 * On whenever there are no credentials — in `npm run dev`, and in a build
 * deployed without secrets, such as a preview. Without it those builds show an
 * empty Events page, which says nothing about whether the page works.
 *
 * Real credentials always win. Set VITE_SAMPLE_DATA=false to turn it off and get
 * the honest empty state back; the production deploy should do exactly that, so
 * that a lost secret surfaces as an empty page rather than as invented events.
 * Whenever it is on, the page says so in a banner — see SampleDataNotice.
 */
export const sampleDataEnabled =
    !isSupabaseConfigured && import.meta.env.VITE_SAMPLE_DATA !== "false";
