import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

const BASE =
    "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold " +
    "tracking-tight transition-[transform,background-color,border-color,color,box-shadow] " +
    "duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-55";

// Solid fills use --signal-ink rather than the raw brand hue: ESN cyan behind
// white text is 2.6:1, while the ink variant clears 4.5:1 in both themes.
const VARIANTS = {
    primary:
        "bg-signal-ink text-on-signal shadow-[0_8px_22px_-10px_rgb(var(--signal-ink)/0.85)] " +
        "hover:brightness-110 hover:-translate-y-0.5",
    secondary:
        "bg-surface text-ink border border-hairline/[var(--hairline-opacity)] " +
        "hover:border-signal hover:text-signal-ink hover:-translate-y-0.5",
    outline:
        "border border-signal/50 text-signal-ink hover:bg-signal/10 hover:-translate-y-0.5",
    onImage:
        "bg-white/12 text-white border border-white/25 backdrop-blur-md " +
        "hover:bg-white/20 hover:-translate-y-0.5",
    ghost: "text-ink-muted hover:text-signal-ink",
};

const SIZES = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-[0.9375rem]",
    lg: "px-7 py-3.5 text-base",
};

const Button = ({ to, href, variant = "primary", size = "md", className, children, ...rest }) => {
    const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

    if (to) {
        return (
            <Link to={to} className={classes} {...rest}>
                {children}
            </Link>
        );
    }

    if (href) {
        const external = /^https?:/.test(href);
        return (
            <a
                href={href}
                className={classes}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...rest}
            >
                {children}
            </a>
        );
    }

    return (
        <button type="button" className={classes} {...rest}>
            {children}
        </button>
    );
};

export default Button;
