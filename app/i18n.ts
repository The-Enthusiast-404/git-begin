import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enJSON from './locale/jsonFiles/en.json'
import esJSON from './locale/jsonFiles/es.json'
import deJSON from './locale/jsonFiles/de.json'
import frJSON from './locale/jsonFiles/fr.json'
import ptJSON from './locale/jsonFiles/pt.json'
import itJSON from './locale/jsonFiles/it.json'
import inJSON from './locale/jsonFiles/in.json'
import zhCNJSON from './locale/jsonFiles/zh-CN.json'
import zhTwJSON from './locale/jsonFiles/zh-TW.json'

i18n.use(initReactI18next).init({
  resources: {
    'en': { ...enJSON },
    'es': {...esJSON},
    'de': {...deJSON},
    'fr': {...frJSON},
    'pt': {...ptJSON},
    'it': {...itJSON},
    'in': {...inJSON},
    'zh-CN': {...zhCNJSON},
    'zh-TW': {...zhTwJSON},
  },
  lng: "en",
});

export default i18n;