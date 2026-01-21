import type { Locale } from "@/types/i18n";
import enMessages from "@/messages/en.json";
import bnMessages from "@/messages/bn.json";

export const locales: Locale[] = ["en", "bn"];
export const defaultLocale: Locale = "en";

const messages = {
  en: enMessages,
  bn: bnMessages,
};

export function getMessages(locale: Locale) {
  return messages[locale] || messages[defaultLocale];
}

export function getLocaleFromStorage(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  
  try {
    const stored = localStorage.getItem("locale");
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch (error) {
    console.error("Error reading locale from storage", error);
  }
  
  return defaultLocale;
}

export function setLocaleInStorage(locale: Locale) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("locale", locale);
  } catch (error) {
    console.error("Error saving locale to storage", error);
  }
}

// Helper function to get nested translation value
export function getNestedTranslation(obj: any, path: string): string {
  return path.split(".").reduce((current, key) => current?.[key], obj) || path;
}
