import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: { pageLanguage: string; autoDisplay: boolean }, elementId: string) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ko", label: "한국어" },
  { code: "zh-CN", label: "简体中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
];

const getCurrentLanguage = () => {
  const match = document.cookie.match(/(?:^|; )googtrans=[^/]*\/([^;]+)/);
  return match?.[1] || "en";
};

const LanguageSelector = ({ light = false }: { light?: boolean }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setLanguage(getCurrentLanguage());

    window.googleTranslateElementInit = () => {
      if (!document.getElementById("google_translate_element") && window.google?.translate) return;
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  const changeLanguage = (code: string) => {
    setLanguage(code);
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!select) return;

    select.value = code;
    select.dispatchEvent(new Event("change"));
  };

  const textColor = light ? "text-white/80" : "text-muted-foreground";

  return (
    <div className="relative flex items-center gap-1.5">
      <Globe2 className={`h-3.5 w-3.5 ${textColor}`} aria-hidden="true" />
      <label htmlFor="site-language" className="sr-only">Choose language</label>
      <select
        id="site-language"
        value={language}
        onChange={(event) => changeLanguage(event.target.value)}
        className={`cursor-pointer appearance-none bg-transparent pr-1 text-xs outline-none ${textColor}`}
        aria-label="Choose language"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code} className="bg-background text-foreground">
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;