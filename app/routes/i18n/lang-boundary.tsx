import { Outlet, useParams } from "react-router";
import i18n from "~/i18n/i18n";
import { useEffect } from "react";
import useRouterStore from "~/hooks/use-router-store";

export async function loader({ params }: { params: { lang?: string } }) {
  const lang = params.lang ?? "en";

  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  return null;
}

export default function LangBoundary() {
  const { lang } = useParams();
  const { setLang } = useRouterStore();

  useEffect(() => {
    if (lang) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
        setLang(lang);
      }
      
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return <Outlet />;
}