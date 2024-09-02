import { useTranslatedText } from "~/locale/languageUtility"

export const useCategories = () => {
  const t = useTranslatedText()
  
  return [
    { value: "all", label: t('filters.allCategories') },
    { value: "education", label: t('filters.categories.education') },
    { value: "web-dev", label: t('filters.categories.web_development') },
    { value: "mobile-dev", label: t('filters.categories.mobile_development') },
    { value: "ios-dev", label: t('filters.categories.ios_development') },
    { value: "blockchain-dev", label: t('filters.categories.blockchain_development') },
    { value: "data-science", label: t('filters.categories.data_science') },
    { value: "artificial-intelligence", label: t('filters.categories.artificial_intelligence') },
    { value: "machine-learning", label: t('filters.categories.machine_learning') },
    { value: "devops", label: t('filters.categories.devops') },
    { value: "cybersecurity", label: t('filters.categories.cybersecurity') },
    { value: "operating-system", label: t('filters.categories.operating_system') },
    { value: "documentation", label: t('filters.categories.documentation') }
  ]
}