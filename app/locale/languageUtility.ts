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

function updateLanguage() {
  const currentLanguage = getCurrentLanguage();

  if (currentLanguage && currentLanguage !== i18n.language) {
    i18n.changeLanguage(currentLanguage).then(() => {
      // Nothing to do because language was changed correctly
    }).catch((error) => {

      console.error('Error changing language:', error);
    });
  }
}

export function useTranslatedText() {
  const { t } = useTranslation();

  updateLanguage()

  // t is the function that allows you to use the translation
  return t;
}
