import { usePreferencesStore } from "~/hooks/use-user-preference-store";

export default function (pathname: string) {
    const { language, currency } = usePreferencesStore.getState().preferences;
    const to = pathnameWithCurrency({ pathname, currency });

    return `/${language}${to}`;
}

export function pathnameWithCurrency({ pathname, currency }: { pathname: string, currency: string }) {
    const to = `${pathname}${pathname.includes('?') ? '&' : '?'}currency=${currency}`;
    return to;
}