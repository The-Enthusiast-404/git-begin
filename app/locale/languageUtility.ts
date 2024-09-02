import { useState } from "react";
import { useTranslation } from "react-i18next";

const languages = ["en"] as const;
type LanguageCode = typeof languages[number];

const LOCAL_STORAGE_KEY = 'detectedLanguage';

function useTranslatedText() {
    const { t } = useTranslation();
    return t;
}

function setLanguage(code: LanguageCode) {
    let cachedLanguage: LanguageCode | null = null;
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);


    if (storedValue && languages.includes(storedValue as LanguageCode)) {
        cachedLanguage = storedValue as LanguageCode;
    }

    function setCurrentLanguage(languageValue: LanguageCode) {
        const { i18n: { changeLanguage, language } } = useTranslation();
        const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(language as LanguageCode);

        {/* TODO: Continue to implement setCurrentLanguage */}
    }
}

export default useTranslatedText