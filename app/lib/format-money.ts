import { usePreferencesStore } from "~/hooks/use-user-preference-store";

/**
 * Formats a number as a currency string using the user's preferred currency and language.
 */
export default (n?: number, fractionDigits: number = 2) => {
    const { currency, language } = usePreferencesStore.getState().preferences;

    if (n === undefined || n === null) return "-";

    try {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: currency, // Dynamically uses 'USD', 'EUR', 'MGA', etc.
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(n);
    } catch (error) {
        // Fallback to a basic format if the currency code is unsupported
        return `${currency} ${Number(n).toFixed(fractionDigits)}`;
    }
};