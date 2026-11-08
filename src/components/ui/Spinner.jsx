import { cn } from "../../lib/cn";

const Spinner = ({ className, label = "Loading" }) => (
    <span
        role="status"
        aria-label={label}
        className={cn(
            "inline-block h-6 w-6 animate-spin-slow rounded-full border-2 border-signal/25 border-t-signal",
            className
        )}
    />
);

export default Spinner;
