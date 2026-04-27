import { useParams, useSearchParams, type LoaderFunctionArgs } from "react-router";
import { defaultPreference, usePreferencesStore, type StorePreference } from "~/hooks/use-user-preference-store";
import i18n from "~/i18n/i18n";

export function getPreferencesFromLoaderFunctionArgs(loaderFunctionArgs: LoaderFunctionArgs): StorePreference {
    const { params, request } = loaderFunctionArgs;

    const url = new URL(request.url);

    const language = params.lang || 'en';
    const currency = url.searchParams.get('currency') || defaultPreference.currency;
    const theme = url.searchParams.get('theme') || defaultPreference.theme;
    const timezone = defaultPreference.timezone;

    return {
        language,
        currency,
        theme,
        timezone
    } as StorePreference
}

export default function appPathname(pathname: string) {
    const language = i18n.language;
    return `/${language}${pathname}`;
}

export function useAppPathname() {
    const { lang = 'en' } = useParams();

    const getPathname = (pathname: string) => `/${lang}${pathname}`;
    return getPathname;
}

export function pathnameWithPreference({ pathname, preferences }: { pathname: string, preferences: StorePreference }) {
    const to = `${pathname}${pathname.includes('?') ? '&' : '?'}currency=${preferences.currency}&theme=${preferences.theme}`;
    return to;
}