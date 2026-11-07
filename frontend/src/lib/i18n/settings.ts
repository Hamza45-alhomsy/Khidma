export const i18n = {
  defaultLocal: "ar",
  locales: ["ar", "en"],
} as const;

export type Locale = (typeof i18n.locales)[number]; //This dynamically evaluates to: type Locale = "ar" | "en";

export const getDirection = (locale: Locale): "rtl" | "ltr" => {
  return locale === "ar" ? "rtl" : "ltr";
};
