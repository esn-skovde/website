// Trimmed: a secret pasted with its trailing newline is a URL no client accepts.
const url = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

/**
 * True only when there is an http(s) URL and a key.
 *
 * createClient throws if the URL is missing or is anything else, which
 * previously took the whole app down to a blank page on /events for anyone who
 * cloned the repo without a .env.local, and for anyone who copied
 * .env.sample, whose placeholders were not empty. Callers check this flag and
 * render an empty state; a value that cannot be a URL counts as not set.
 */
export const isSupabaseConfigured = /^https?:\/\//i.test(url) && anonKey !== "";

let clientPromise = null;

/**
 * The Supabase client, or null when Supabase is not configured.
 *
 * The library is 220 kB, and a build without credentials never calls it, so
 * it is fetched on first use: imported at the top of this module it was the
 * last chunk the Home and Events routes waited for. The promise is cached, not
 * the client, because /events asks for three queries at once and each would
 * start its own import. A failure (a dropped connection, a URL createClient
 * rejects) is not kept, so the next query tries again.
 */
export const getSupabase = () => {
    if (!isSupabaseConfigured) return Promise.resolve(null);

    clientPromise ??= import("@supabase/supabase-js")
        .then(({ createClient }) => createClient(url, anonKey))
        .catch((error) => {
            clientPromise = null;
            throw error;
        });
    return clientPromise;
};

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
