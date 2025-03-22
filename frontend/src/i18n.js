import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./i18n/en.json";
import es from "./i18n/es.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
  lng: "en", // 默认语言
  fallbackLng: "en", // 备用语言
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
