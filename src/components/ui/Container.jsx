import { cn } from "../../lib/cn";

const WIDTHS = {
    default: "max-w-6xl",
    wide: "max-w-7xl",
    narrow: "max-w-3xl",
};

const Container = ({ children, width = "default", className }) => (
    <div className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", WIDTHS[width], className)}>
        {children}
    </div>
);

export default Container;
