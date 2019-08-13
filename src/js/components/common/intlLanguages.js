import { getReduxKey } from "../../_helpers/store";
import { languageConstants } from "../../constants";

export default {
  endonyms: {
    en: "English",
    es: "Español",
    "es-cl": "Español Chileno",
    "es-419": "Español Latino",
    pt: "Português",
    ru: "русский",
    fr: "Français",
    "fr-ca": "Français canadien",
    de: "Deutsche",
    ja: "日本語 (にほんご)",
    ko: "한국어",
    ms: "Bahasa Melayu",
    th: "ไทย",
    vi: "Tiếng Việt",
    id: "Bahasa Indonesia",
    "zh-cn": "简体中文",
    "zh-tw": "正體中文"
  },
  names: {
    en: "English",
    es: "Spanish",
    "es-cl": "Spanish Chilean",
    "es-419": "Spanish Latin",
    pt: "Portuguese",
    ru: "Russian",
    fr: "French",
    "fr-ca": "Canadian French",
    de: "German",
    ja: "Japanese",
    ko: "Korean",
    ms: "Malay",
    th: "Thai",
    vi: "Vietnamese",
    id: "Indonesian",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)"
  }
};

export const getUserLanguage = () =>
  getReduxKey(
    "authentication.user.prefered_language",
    languageConstants.DEFAULT_LOCALE
  )
    .replace("-", "_")
    .toLowerCase();
