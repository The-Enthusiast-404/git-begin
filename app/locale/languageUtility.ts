import { useEffect } from "react";
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

async function updateLanguage() {
  const currentLanguage = getCurrentLanguage();

  if (!currentLanguage || currentLanguage === i18n.language) {
    return;
  }

  try {
    await i18n.changeLanguage(currentLanguage);
    // Language was changed successfully
  } catch (error) {
    console.error(`Error changing language to ${currentLanguage}:`, error);
  }
}

export function useTranslatedText() {
  const { t } = useTranslation();

  useEffect(() => {
    updateLanguage();
  }, []);

  return t;
}

