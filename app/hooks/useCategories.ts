import { categories } from "~/data/categories";
import { useTranslatedText } from "~/locale/languageUtility";

export function useCategories(){
    const rawCategories = categories
    const t = useTranslatedText()

    let translateCategories: typeof categories = []

    for (let category of rawCategories) {
        let realLabel = t(category.label)
        category.label = realLabel
        translateCategories.push(category)
    }

    return translateCategories
}