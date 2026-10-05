import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, Send } from "lucide-react";

import Button from "../ui/Button";
import footerData from "../../data/footer.json";

/* No ring of its own: focus shows the global :focus-visible outline in signal
   ink, over 6:1 against the panel. The 40% signal ring that used to replace it
   changed the field by less than 2:1 in the light theme. */
const FIELD =
    "w-full rounded-2xl border border-hairline/[var(--hairline-opacity)] bg-surface-2 px-4 py-3 " +
    "text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-signal";

const LABEL = "block font-display text-[0.8125rem] font-bold text-ink-muted";

const EMPTY = { name: "", email: "", subject: "", message: "" };

const ContactForm = () => {
    const { t } = useTranslation();
    const [values, setValues] = useState(EMPTY);
    const [opening, setOpening] = useState(false);

    const update = (event) => {
        const { name, value } = event.target;
        setValues((previous) => ({ ...previous, [name]: value }));
    };

    const submit = (event) => {
        event.preventDefault();
        setOpening(true);

        /* The sender's address used to be collected and then dropped: only name,
           subject and message reached the mailto, so a reply had nowhere to go
           unless the client's own From happened to be right. It is in the body
           now, where a reply-to can actually be read off it. */
        const body = [
            `Name: ${values.name}`,
            `Email: ${values.email}`,
            "",
            values.message,
        ].join("\n");

        window.location.href =
            `mailto:${footerData.email}` +
            `?subject=${encodeURIComponent(values.subject)}` +
            `&body=${encodeURIComponent(body)}`;

        setTimeout(() => setOpening(false), 2000);
    };

    const fields = [
        { name: "name", type: "text", label: "contact.form.name", autoComplete: "name" },
        { name: "email", type: "email", label: "contact.form.email", autoComplete: "email" },
        { name: "subject", type: "text", label: "contact.form.subject" },
    ];

    return (
        <div className="panel p-6 sm:p-8">
            <h2 className="text-display text-xl text-ink sm:text-2xl">
                {t("contact.form.emailTitle")}
            </h2>

            {/* This never posts anywhere — it hands the draft to the visitor's own
                mail client. Saying so up front beats a silent no-reply. */}
            <p className="mt-3 flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-ink-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2.2} aria-hidden="true" />
                {t("contact.form.mailtoNote", {
                    defaultValue:
                        "This opens a draft in your own email app so you can check it before sending.",
                })}
            </p>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
                {fields.map(({ name, type, label, autoComplete }) => (
                    <div key={name} className="flex flex-col gap-2">
                        <label htmlFor={name} className={LABEL}>
                            {t(label)}
                        </label>
                        <input
                            id={name}
                            name={name}
                            type={type}
                            autoComplete={autoComplete}
                            value={values[name]}
                            onChange={update}
                            required
                            className={FIELD}
                        />
                    </div>
                ))}

                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className={LABEL}>
                        {t("contact.form.message")}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={values.message}
                        onChange={update}
                        required
                        className={`${FIELD} resize-y`}
                    />
                </div>

                <Button type="submit" size="lg" disabled={opening} className="w-full">
                    {opening ? (
                        <>
                            {/* Inline rather than <Spinner>, whose ring is drawn in
                                the signal colour — invisible on a signal-filled
                                button. It takes the button's label colour instead,
                                by token: Tailwind cannot put an alpha on
                                currentColor, so border-current/30 drew nothing. */}
                            <span
                                className="h-4 w-4 animate-spin rounded-full border-2 border-on-signal/30 border-t-on-signal"
                                aria-hidden="true"
                            />
                            {t("contact.form.openingEmail")}
                        </>
                    ) : (
                        <>
                            {t("contact.form.submit")}
                            <Send className="h-4 w-4" strokeWidth={2.5} />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default ContactForm;
