import MapLink from "./MapLink";

/**
 * A sentence in which the places it names are links. `places` maps a name, as it
 * is written in the sentence, to what a maps app is asked to look up.
 *
 * Names are matched as they stand, so it does not depend on the language: a
 * proper noun such as IKEA is spelled the same in every translation, and a
 * translation that leaves one out simply has no link.
 */
const PlaceText = ({ children, places }) => {
    const names = Object.keys(places);
    if (typeof children !== "string" || names.length === 0) return children;

    const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    // One capture group: split() keeps what it matched, at the odd positions.
    const parts = children.split(new RegExp(`(${escaped.join("|")})`));

    return parts.map((part, index) =>
        index % 2 === 1 ? (
            <MapLink key={index} query={places[part]}>
                {part}
            </MapLink>
        ) : (
            part
        )
    );
};

export default PlaceText;
