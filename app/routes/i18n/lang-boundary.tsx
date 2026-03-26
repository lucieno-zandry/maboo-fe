import { Outlet, useParams } from "react-router";
import i18n from "~/i18n/i18n";
import { useEffect } from "react";
import useRouterStore from "~/hooks/use-router-store";
import { usePreferencesStore } from "~/hooks/use-user-preference-store";

export async function loader({ params }: { params: { lang?: string } }) {
  const lang = params.lang ?? "en";

  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  return null;
}

export default function LangBoundary() {
  const { lang } = useParams();
  const { setLanguage } = usePreferencesStore();

  useEffect(() => {
    if (lang) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
        setLanguage(lang);
      }

      document.documentElement.lang = lang;
    }
  }, [lang]);

  return <Outlet />;
}