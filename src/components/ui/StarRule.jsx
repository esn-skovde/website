/**
 * The ESN star as a five-segment rule along the bottom edge of a hero or page
 * header. It positions itself against the nearest relatively positioned
 * ancestor, so that ancestor has to be `relative`, and the content above it
 * needs bottom padding of its own.
 */
const StarRule = () => (
    <div className="absolute inset-x-0 bottom-0 flex h-1.5" aria-hidden="true">
        <span className="flex-1 bg-esn-cyan" />
        <span className="flex-1 bg-esn-magenta" />
        <span className="flex-1 bg-esn-green" />
        <span className="flex-1 bg-esn-orange" />
        <span className="flex-1 bg-esn-indigo" />
    </div>
);

export default StarRule;
