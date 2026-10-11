/**
 * The guide's table of contents. The section index, the sticky bar and the
 * page all read this, so the anchor ids, the order and the labels can never
 * drift apart.
 *
 * `urgent` marks the one section that is about an emergency: the index gives
 * it the site's single red. GuideIndex lays its grid out on the assumption
 * that this is the sixth of eleven (see there).
 */
export const SECTIONS = [
    { id: "getting-started", key: "gettingStarted", emoji: "🧭" },
    { id: "city-highlights", key: "cityHighlights", emoji: "📍" },
    { id: "places-to-explore", key: "placesToExplore", emoji: "🗺️" },
    { id: "transport", key: "transport", emoji: "🚍" },
    { id: "settling-in", key: "settlingIn", emoji: "🧳" },
    { id: "emergency-contacts", key: "emergencyContacts", emoji: "🆘", urgent: true },
    { id: "buddy-program", key: "buddyProgram", emoji: "🤝" },
    { id: "shopping", key: "shopping", emoji: "🛒" },
    { id: "useful-apps", key: "usefulApps", emoji: "📱" },
    { id: "accommodation", key: "accommodation", emoji: "🏡" },
    { id: "student-life", key: "studentLife", emoji: "📚" },
];
