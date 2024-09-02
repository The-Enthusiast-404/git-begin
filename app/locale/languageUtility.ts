import { useTranslation } from "react-i18next";

const LOCAL_STORAGE_KEY = 'language';

export function storeLanguage(languageToStore: string) {
    localStorage.setItem(LOCAL_STORAGE_KEY, languageToStore);
}

export function getCurrentLanguage() {
    const cachedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);
    let currentLanguage: string;

    if (cachedLanguage === null) {
        // Default value
        currentLanguage = "en"
    } else {
        currentLanguage = cachedLanguage;
    }

    return currentLanguage;
}

export function useTranslatedText() {
    const { t, i18n } = useTranslation();

    const currentLanguage = getCurrentLanguage();

    if (currentLanguage && currentLanguage !== i18n.language) {
        i18n.changeLanguage(currentLanguage);
    }

    // t is the function that allows you to use the translation
    return t;
}
