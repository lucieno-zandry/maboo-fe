import { defaultPreference, type StorePreference } from "~/stores/use-user-preference-store";

export default function (preferences: StorePreference): boolean {
    return preferences.currency === defaultPreference.currency &&
        preferences.language === defaultPreference.language &&
        preferences.theme === defaultPreference.theme &&
        preferences.timezone === defaultPreference.timezone;
}