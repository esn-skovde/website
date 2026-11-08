/**
 * Shares a link with the native sheet, falling back to the clipboard.
 * @returns {Promise<"shared" | "copied">}
 */
export const shareLink = async ({ title, text, url }) => {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            return "shared";
        } catch (error) {
            // The user dismissing the sheet is not a failure worth reporting.
            if (error?.name === "AbortError") return "shared";
        }
    }

    await navigator.clipboard.writeText(url);
    return "copied";
};
