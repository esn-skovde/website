import {
    BusFront,
    Compass,
    GraduationCap,
    Handshake,
    House,
    Luggage,
    Map,
    MapPin,
    ShoppingCart,
    Siren,
    Smartphone,
} from "lucide-react";

/**
 * The guide's table of contents. The section index, the sticky bar and the
 * page all read this, so the anchor ids, the order, the labels and the icons
 * can never drift apart. `icon` is a lucide component, drawn by whoever lists
 * the sections.
 *
 * `urgent` marks the one section that is about an emergency: the index gives
 * it the site's single red. GuideIndex lays its grid out on the assumption
 * that this is the sixth of eleven (see there).
 */
export const SECTIONS = [
    { id: "getting-started", key: "gettingStarted", icon: Compass },
    { id: "city-highlights", key: "cityHighlights", icon: MapPin },
    { id: "places-to-explore", key: "placesToExplore", icon: Map },
    { id: "transport", key: "transport", icon: BusFront },
    { id: "settling-in", key: "settlingIn", icon: Luggage },
    { id: "emergency-contacts", key: "emergencyContacts", icon: Siren, urgent: true },
    { id: "buddy-program", key: "buddyProgram", icon: Handshake },
    { id: "shopping", key: "shopping", icon: ShoppingCart },
    { id: "useful-apps", key: "usefulApps", icon: Smartphone },
    { id: "accommodation", key: "accommodation", icon: House },
    { id: "student-life", key: "studentLife", icon: GraduationCap },
];
