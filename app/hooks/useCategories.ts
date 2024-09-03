import { categories } from "~/data/categories";
import { useTranslatedText } from "~/locale/languageUtility";

export function useCategories() {
    const rawCategories = categories;
    const t = useTranslatedText();

    const translatedCategories = rawCategories.map(category => ({
        ...category,
        label: t(category.label)
    }));

    return translatedCategories;
}