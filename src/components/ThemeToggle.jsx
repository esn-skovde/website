import { Sun, Moon, MonitorSmartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/ThemeContext";
import { cn } from "../lib/cn";

const ICONS = {
    system: MonitorSmartphone,
    light: Sun,
    dark: Moon,
};

/** Cycles system → light → dark. The current mode is named in the tooltip. */
const ThemeToggle = ({ className }) => {
    const { theme, cycleTheme } = useTheme();
    const { t } = useTranslation();
    const Icon = ICONS[theme] ?? MonitorSmartphone;
    const label = t(`theme.${theme}`, { defaultValue: theme });

    return (
        <button
            type="button"
            onClick={cycleTheme}
            title={t("theme.toggle", { defaultValue: "Change theme" })}
            aria-label={`${t("theme.toggle", { defaultValue: "Change theme" })} — ${label}`}
            className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border",
                "border-hairline/[var(--hairline-opacity)] text-ink-muted",
                "transition-colors duration-200 hover:border-signal hover:text-signal-ink",
                className
            )}
        >
            <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
        </button>
    );
};

export default ThemeToggle;
