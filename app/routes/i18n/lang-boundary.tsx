import { Outlet, useParams } from "react-router";
import i18n from "~/i18n/i18n";
import { useEffect } from "react";

export async function loader({ params }: { params: { lang?: string } }) {
  const lang = params.lang ?? "en";

  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  return null;
}

export default function LangBoundary() {
  const { lang } = useParams();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <Outlet />;
}