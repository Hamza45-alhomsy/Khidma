import { getRequestConfig } from "next-intl/server";

// Can be configured to list all supported languages
const locales = ["en", "ar"];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as string)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`../../dictionaries/${locale}.json`)).default,
  };
});
