import { Outlet, redirect, useLoaderData, useParams, type ClientLoaderFunctionArgs, type LoaderFunctionArgs } from "react-router";
import i18n from "~/i18n/i18n";
import { useEffect } from "react";
import { defaultPreference, usePreferencesStore } from "~/hooks/use-user-preference-store";
import defaultSettings from "~/lib/default-settings";
import { fetchUserPreferences, getSettings } from "~/api/http-requests";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { RouteProgress } from "~/components/layout/route-progress";
import { ALLOWED_LANGUAGES, langIsValid } from "~/lib/lang-helpers";
import { I18nextProvider } from "react-i18next";

export async function loader({ params, request }: LoaderFunctionArgs) {
  let lang = params.lang;

  if (lang) {
    if (!langIsValid(lang)) {
      return redirect(`/${ALLOWED_LANGUAGES[0]}`);
    }

    if (i18n.language !== lang) {
      await i18n.changeLanguage(lang);
    }
  }

  const data = {
    settings: defaultSettings,
    preferences: defaultPreference,
    i18n: {
      language: i18n.language,
      store: i18n.services.resourceStore.data,
    },
  }

  try {
    const cookie = request.headers.get('Cookie');
    const headers: HeadersInit = {};

    if (cookie)
      headers['Cookie'] = cookie;

    const [settingsResponse, preferencesResponse] = await Promise.all([
      getSettings({ headers }),
      fetchUserPreferences({ headers })
    ]);

    if (settingsResponse.data) data.settings = settingsResponse.data;
    if (preferencesResponse.data) data.preferences = preferencesResponse.data;
  } catch (e) { }

  return data;
}

export async function clientLoader({ serverLoader, params }: ClientLoaderFunctionArgs) {
  const loaderData = await serverLoader<typeof loader>();
  usePreferencesStore.setState({ preferences: loaderData.preferences });

  return loaderData;
}

clientLoader.hydrate = true;

export default function ConfigBoundary() {
  const loaderData = useLoaderData<typeof clientLoader>();

  if (loaderData.i18n) {
    const { language, store } = loaderData.i18n;

    Object.keys(store).forEach((lng) => {
      Object.keys(store[lng]).forEach((ns) => {
        if (!i18n.hasResourceBundle(lng, ns)) {
          i18n.addResourceBundle(
            lng,
            ns,
            store[lng][ns],
            true,
            true
          );
        }
      });
    });

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={loaderData.preferences.theme}>
        <RouteProgress />
        <Outlet />
      </ThemeProvider>
    </I18nextProvider>
  );
}