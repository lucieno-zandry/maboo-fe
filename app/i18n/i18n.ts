import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/* 🔹 import translations */
import enHome from "./locales/en/home.json";
import frHome from "./locales/fr/home.json";

import enCommon from "./locales/en/common.json";
import frCommon from "./locales/fr/common.json";

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    debug: import.meta.env.DEV,

    ns: ["common", "home"],
    defaultNS: "common",

    resources: {
      en: {
        common: enCommon,
        home: enHome,
      },
      fr: {
        common: frCommon,
        home: frHome,
      },
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;