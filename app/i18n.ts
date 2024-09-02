import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enJSON from './locale/jsonFiles/en.json'
import esJSON from './locale/jsonFiles/es.json'
import deJSON from './locale/jsonFiles/de.json'
import frJSON from './locale/jsonFiles/fr.json'
import ptJSON from './locale/jsonFiles/pt.json'
import itJSON from './locale/jsonFiles/it.json'
import inJSON from './locale/jsonFiles/in.json'
import zhCnJSON from './locale/jsonFiles/zh_cn.json'
import zhTwJSON from './locale/jsonFiles/zh_tw.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    es: {...esJSON},
    de: {...deJSON},
    fr: {...frJSON},
    pt: {...ptJSON},
    it: {...itJSON},
    in: {...inJSON},
    zhCn: {...zhCnJSON},
    zhTw: {...zhTwJSON},
  },
  lng: "en",
});