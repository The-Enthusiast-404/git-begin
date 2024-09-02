import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { languages } from "~/data/languages";
import { getCurrentLanguage, storeLanguage } from "~/locale/languageUtility";

function findLanguageLabel(currentLanguageCode: string) {
    for (let language of languages) {
        if (language.value === currentLanguageCode) {
            return language.label;
        }
    }
}

function ChangeLanguage() {
    const currentLanguageCode = getCurrentLanguage();
    const currentLanguage = findLanguageLabel(currentLanguageCode);

    const handleLanguageChange = (value: string) => {
        storeLanguage(value);
        window.location.reload()
    };

    return (
        <div className="space-y-2">
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white px-2 light:border-transparent dark:border-transparent focus-within:border-blue-500 focus-within:outline-none rounded-md transition-colors duration-200">
                <Select onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={currentLanguage} />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent rounded-md shadow-lg w-full">
                        {languages.map((cat) => (
                            <SelectItem
                                key={cat.value}
                                value={cat.value}
                                className="my-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                            >
                                {cat.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default ChangeLanguage;