import { useState, useEffect } from "react";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "tanglish", name: "Tanglish", nativeName: "Tamil (English Script)", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
];

export const STORAGE_KEY = "medsimplify_language";

export function getAppLanguage(): string {
  if (typeof window !== "undefined" && window.localStorage) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
  }
  return "en";
}

export function setAppLanguage(langCode: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem(STORAGE_KEY, langCode);
    window.dispatchEvent(new CustomEvent("medsimplify_language_changed", { detail: langCode }));
  }
}

export function useAppLanguage(): [string, (lang: string) => void] {
  const [lang, setLangState] = useState<string>(() => getAppLanguage());

  useEffect(() => {
    const handleLangChange = (e: any) => {
      const newLang = e.detail || getAppLanguage();
      setLangState(newLang);
    };

    window.addEventListener("medsimplify_language_changed", handleLangChange);
    window.addEventListener("storage", handleLangChange);

    return () => {
      window.removeEventListener("medsimplify_language_changed", handleLangChange);
      window.removeEventListener("storage", handleLangChange);
    };
  }, []);

  const changeLang = (newLang: string) => {
    setAppLanguage(newLang);
    setLangState(newLang);
  };

  return [lang, changeLang];
}
