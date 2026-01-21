export type Locale = "en" | "bn";

export interface Translations {
  common: {
    home: string;
    services: string;
    about: string;
    portfolio: string;
    contact: string;
    blog: string;
    pricing: string;
    faqs: string;
    privacy: string;
    terms: string;
    letsTalk: string;
    readMore: string;
    back: string;
    loading: string;
    error: string;
    success: string;
  };
  footer: {
    description: string;
    services: string;
    company: string;
    resources: string;
    social: string;
    copyright: string;
  };
  home: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    sendMessage: string;
    sending: string;
    success: string;
  };
}
