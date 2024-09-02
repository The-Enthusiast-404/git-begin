import { useTranslation } from "react-i18next";
import i18n from "~/i18n";

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
  const { t } = useTranslation();

  const currentLanguage = getCurrentLanguage();

  if (currentLanguage && currentLanguage !== i18n.language) {
    i18n.changeLanguage(currentLanguage).then(() => {

    }).catch((error) => {

      console.error('Error changing language:', error);
    });
  }

  // t is the function that allows you to use the translation
  return t;
}
