import { parseDate } from "./dates";

/**
 * Trips for the carousel: everything upcoming first, topped up with the most
 * recent past trips so the carousel is never empty mid-semester.
 */
export const fetchTrips = async (client, limit = 10) => {
    const now = new Date().toISOString();

    const { data: upcoming, error: upcomingError } = await client
        .from("trips")
        .select("*")
        .gte("startsAt", now)
        .order("startsAt", { ascending: true })
        .limit(limit);
    if (upcomingError) throw upcomingError;

    const trips = [...(upcoming ?? [])];

    if (trips.length < limit) {
        const { data: past, error: pastError } = await client
            .from("trips")
            .select("*")
            .lt("endsAt", now)
            .order("endsAt", { ascending: false })
            .limit(limit - trips.length);
        if (pastError) throw pastError;

        const seen = new Set(trips.map((trip) => trip.id));
        for (const trip of past ?? []) {
            if (!seen.has(trip.id)) trips.push(trip);
        }
    }

    return trips.filter((trip) => parseDate(trip.startsAt));
};

export const fetchUpcomingEvents = async (client, limit = 24) => {
    const { data, error } = await client
        .from("events")
        .select("*")
        .gte("datetime", new Date().toISOString())
        .order("datetime", { ascending: true })
        .limit(limit);
    if (error) throw error;
    return (data ?? []).filter((event) => parseDate(event.datetime));
};

export const fetchPastEvents = async (client, limit = 12) => {
    const { data, error } = await client
        .from("events")
        .select("*")
        .lt("datetime", new Date().toISOString())
        .order("datetime", { ascending: false })
        .limit(limit);
    if (error) throw error;
    return (data ?? []).filter((event) => parseDate(event.datetime));
};
