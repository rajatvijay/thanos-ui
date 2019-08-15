import { getUserLanguage } from "../components/common/intlLanguages";

/**
 * This is to deal with keys such as name, name_es, name_en, name_en_gb
 * so any JSON that has several of those, just provide the JSON here with
 * whatever base key is (in this case "name") and it'll get the appropriate
 * key's value according to user's language
 *
 * @param {object} data JSON structure that may contain the baseKey
 * @param {string} baseKey defaults to "body"
 */
export function getIntlBody(data, baseKey = "body") {
  const locale = getUserLanguage();
  let [language] = locale.split("_");
  if (!!data[`${baseKey}_${locale}`]) return data[`${baseKey}_${locale}`];
  if (!!data[`${baseKey}_${language}`]) return data[`${baseKey}_${language}`];
  return data[baseKey];
}
