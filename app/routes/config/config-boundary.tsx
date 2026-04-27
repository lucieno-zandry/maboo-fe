import { Outlet, useLoaderData, useParams, type ClientLoaderFunctionArgs, type LoaderFunctionArgs } from "react-router";
import i18n from "~/i18n/i18n";
import { useEffect } from "react";
import { defaultPreference, usePreferencesStore } from "~/hooks/use-user-preference-store";
import defaultSettings from "~/lib/default-settings";
import { fetchUserPreferences, getSettings } from "~/api/http-requests";
import useSettingsStore from "~/hooks/use-settings-store";
import { useUpdatePreferences } from "~/hooks/use-update-preferences";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { RouteProgress } from "~/components/layout/route-progress";

export async function loader({ params, request }: LoaderFunctionArgs) {
  try {
    const cookie = request.headers.get('Cookie');
    const headers: HeadersInit = {};

    if (cookie)
      headers['Cookie'] = cookie;

    const [settingsResponse, preferencesResponse] = await Promise.all([
      getSettings({ headers }),
      fetchUserPreferences({ headers })
    ]);

    return {
      settings: settingsResponse.data!,
      preferences: preferencesResponse.data!
    }
  } catch (e) {
    return {
      settings: defaultSettings,
      preferences: defaultPreference
    }
  }
}

export async function clientLoader({ serverLoader, params }: ClientLoaderFunctionArgs) {
  const loaderData = await serverLoader<typeof loader>();

  const { lang = 'en' } = params;

  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  usePreferencesStore.setState({ preferences: loaderData.preferences });
  useSettingsStore.setState({ settings: loaderData.settings });

  return loaderData;
}

clientLoader.hydrate = true;

export default function ConfigBoundary() {
  const loaderData = useLoaderData<typeof clientLoader>();

  return <>
    <ThemeProvider theme={loaderData.preferences.theme}>
      <RouteProgress />
      <Outlet />
    </ThemeProvider>
  </>;
}