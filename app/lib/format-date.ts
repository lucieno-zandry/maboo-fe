import { usePreferencesStore } from "~/hooks/use-user-preference-store";
import { ALLOWED_LANGUAGES, extractLang } from "./lang-helpers";
import isCsr from "./is-csr";

/**
 * Formats a date string based on the user's stored language and timezone preferences.
 */
export default (dateString: string | Date) => {
    const { timezone } = usePreferencesStore.getState().preferences;
    const language = isCsr() ? extractLang(location.href) : ALLOWED_LANGUAGES[0]
    const locale = language === "fr" ? "fr-FR" : "en-US";

    // Handle invalid dates gracefully
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    try {
        return date.toLocaleDateString(locale, {
            dateStyle: "full", timeZone: timezone
        })
    } catch (error) {
        // Fallback to standard formatting if timezone/language is invalid
        return date.toLocaleDateString();
    }
};