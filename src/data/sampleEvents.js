/**
 * Stand-in events and trips for local development.
 *
 * Events and trips normally come from Supabase, so a fresh clone without
 * credentials sees an empty Events page and cannot tell a working layout from a
 * broken one. These fixtures fill that gap. They are only ever used when
 * `sampleDataEnabled` is true — never in a production build. See src/lib/supabase.js.
 *
 * Shapes match the Supabase tables exactly (see the README), including the
 * quoted camelCase column names.
 */
import { getImage } from "../lib/images";

/* Dates are generated relative to now rather than hard-coded, so the upcoming /
   past split still makes sense whenever someone clones the repo. The titles are
   kept season-neutral for the same reason — a fixture called "Halloween Party"
   lands in July about as often as it lands in October. */
const at = (days, hour = 18, minute = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
};

/* Real files from src/assets/images, so nothing is fetched from the network and
   the images look like photographs rather than grey boxes. A few entries leave
   the thumbnail null on purpose, which is what exercises Img's placeholder. */
const photo = (name) => getImage(name)?.src ?? null;

const UPCOMING = [
    {
        id: "sample-ev-01",
        title: "Meeple Monday",
        subtitle:
            "A cosy board game night every Monday — the easiest way to meet people when you have just arrived.",
        datetime: at(2, 18),
        location: "Kårhuset Boulogner",
        ticketPurchaseLink: null,
        thumbnail: photo("section1"),
        imageCredit: null,
    },
    {
        id: "sample-ev-02",
        title: "Language Café",
        subtitle:
            "Swedish, English, Spanish and whatever else turns up. No level required, fika included.",
        datetime: at(4, 17, 30),
        location: "Stadsbiblioteket Skövde",
        ticketPurchaseLink: null,
        thumbnail: null,
        imageCredit: null,
    },
    {
        id: "sample-ev-03",
        title: "Karaoke Night",
        subtitle: "Everyone is welcome, from shower singers to superstars.",
        datetime: at(6, 20),
        location: "Rådhuscaféet",
        ticketPurchaseLink: null,
        thumbnail: photo("section2"),
        imageCredit: "Photo: ESN Skövde",
    },
    {
        id: "sample-ev-04",
        title: "International Dinner",
        subtitle:
            "Cook something from home, bring it, and eat your way around thirty countries in one evening.",
        datetime: at(9, 18),
        location: "Kårhuset Boulogner",
        ticketPurchaseLink: "https://example.com/tickets/international-dinner",
        thumbnail: photo("skovde-city"),
        imageCredit: null,
    },
    {
        id: "sample-ev-05",
        title: "Ice Skating at Billingehov",
        subtitle: "Skates can be rented at the rink. Falling over is part of the experience.",
        datetime: at(13, 19),
        location: "Billingehov Arena",
        ticketPurchaseLink: null,
        thumbnail: null,
        imageCredit: null,
    },
    {
        id: "sample-ev-06",
        title: "Pub Crawl",
        subtitle: "Four stops, one city, and a group that grows at every one of them.",
        datetime: at(16, 20),
        location: "Meet at Sankt Sigfrids Torg",
        ticketPurchaseLink: "https://example.com/tickets/pub-crawl",
        thumbnail: photo("trip-placeholder"),
        imageCredit: null,
    },
    {
        id: "sample-ev-07",
        title: "Movie Night: Swedish Classics",
        subtitle: "Subtitled, so you can follow along while you pick up the language.",
        datetime: at(21, 19),
        location: "Högskolan i Skövde, G-building",
        ticketPurchaseLink: null,
        thumbnail: null,
        imageCredit: null,
    },
    {
        id: "sample-ev-08",
        title: "The ESN Ball",
        subtitle: "The big one. Three courses, a live band, and a dress code nobody follows exactly.",
        datetime: at(28, 18),
        location: "Kårhuset Boulogner",
        ticketPurchaseLink: "https://example.com/tickets/spring-ball",
        thumbnail: photo("hero"),
        imageCredit: "Photo: ESN Skövde",
    },
];

const PAST = [
    {
        id: "sample-ev-p1",
        title: "Fika Friday",
        subtitle: "Cinnamon buns and introductions, every other Friday.",
        datetime: at(-3, 15),
        location: "Rådhuscaféet",
        ticketPurchaseLink: null,
        thumbnail: photo("section2"),
        imageCredit: null,
    },
    {
        id: "sample-ev-p2",
        title: "Welcome Fair",
        subtitle: "Where most of this semester's group met each other for the first time.",
        datetime: at(-8, 12),
        location: "Högskolan i Skövde, main hall",
        ticketPurchaseLink: null,
        thumbnail: photo("skovde-city"),
        imageCredit: null,
    },
    {
        id: "sample-ev-p3",
        title: "Bowling Night",
        subtitle: "Two hours of lanes, and a scoreboard nobody wants to talk about.",
        datetime: at(-15, 19),
        location: "Skövde Bowlinghall",
        ticketPurchaseLink: null,
        thumbnail: null,
        imageCredit: null,
    },
    {
        id: "sample-ev-p4",
        title: "Hike up Billingen",
        subtitle: "An easy climb, a very good view, and coffee at the top.",
        datetime: at(-22, 10),
        location: "Billingen",
        ticketPurchaseLink: null,
        thumbnail: photo("section1"),
        imageCredit: null,
    },
    {
        id: "sample-ev-p5",
        title: "Costume Party",
        subtitle: "Costumes strongly encouraged, judged loudly.",
        datetime: at(-30, 21),
        location: "Kårhuset Boulogner",
        ticketPurchaseLink: null,
        thumbnail: null,
        imageCredit: null,
    },
    {
        id: "sample-ev-p6",
        title: "Semester Kick-off",
        subtitle: "The first event of the semester, in the park behind the campus.",
        datetime: at(-45, 17),
        location: "Boulognerskogen",
        ticketPurchaseLink: null,
        thumbnail: photo("trip-placeholder"),
        imageCredit: null,
    },
];

const TRIPS = [
    {
        id: "sample-tr-01",
        title: "Gothenburg Day Trip",
        subtitle: "Ninety minutes on the train, a whole day by the sea.",
        location: "Gothenburg",
        startsAt: at(11, 7),
        endsAt: at(11, 22),
        thumbnail: photo("skovde-city"),
        detailsLink: "https://example.com/trips/gothenburg",
        imageCredit: null,
    },
    {
        id: "sample-tr-02",
        title: "Stockholm Weekend",
        subtitle: "Gamla Stan, the Vasa Museum, and a hostel full of people you already know.",
        location: "Stockholm",
        startsAt: at(18, 8),
        endsAt: at(20, 20),
        thumbnail: photo("section1"),
        detailsLink: "https://example.com/trips/stockholm",
        imageCredit: null,
    },
    {
        id: "sample-tr-03",
        title: "Lapland",
        subtitle: "Sixteen hours north by train, for a landscape nothing here prepares you for.",
        location: "Abisko",
        startsAt: at(40, 6),
        endsAt: at(45, 22),
        thumbnail: photo("hero"),
        detailsLink: "https://example.com/trips/lapland",
        imageCredit: "Photo: ESN Skövde",
    },
    {
        id: "sample-tr-04",
        title: "Copenhagen City Break",
        subtitle: "Two countries in one weekend, and the bridge in between.",
        location: "Copenhagen",
        startsAt: at(55, 7),
        endsAt: at(57, 21),
        thumbnail: null,
        detailsLink: null,
        imageCredit: null,
    },
    {
        id: "sample-tr-p1",
        title: "Liseberg",
        subtitle: "Roller coasters, and the long quiet train ride home afterwards.",
        location: "Gothenburg",
        startsAt: at(-12, 8),
        endsAt: at(-12, 23),
        thumbnail: photo("section2"),
        detailsLink: null,
        imageCredit: null,
    },
    {
        id: "sample-tr-p2",
        title: "Norwegian Fjords",
        subtitle: "Four days, one bus, and more waterfalls than anyone counted.",
        location: "Bergen",
        startsAt: at(-35, 6),
        endsAt: at(-32, 22),
        thumbnail: photo("trip-placeholder"),
        detailsLink: null,
        imageCredit: null,
    },
];

/* Each of these mirrors the ordering and limits of the Supabase query it stands
   in for, so the components see data shaped exactly as it would be in production. */

export const sampleUpcomingEvents = (limit = 24) =>
    [...UPCOMING].sort((a, b) => a.datetime.localeCompare(b.datetime)).slice(0, limit);

export const samplePastEvents = (limit = 12) =>
    [...PAST].sort((a, b) => b.datetime.localeCompare(a.datetime)).slice(0, limit);

export const sampleTrips = (limit = 10) => {
    const now = new Date().toISOString();
    const upcoming = TRIPS.filter((trip) => trip.startsAt >= now).sort((a, b) =>
        a.startsAt.localeCompare(b.startsAt)
    );
    const past = TRIPS.filter((trip) => trip.endsAt < now).sort((a, b) =>
        b.endsAt.localeCompare(a.endsAt)
    );
    return [...upcoming, ...past].slice(0, limit);
};
