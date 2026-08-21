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
