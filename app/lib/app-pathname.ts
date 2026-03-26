import { usePreferencesStore } from "~/hooks/use-user-preference-store";

export default function (pathname: string) {
    const { language } = usePreferencesStore.getState().preferences;

    return `/${language}${pathname}`;
}