import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import uz from '../locales/uz.json';
import ru from '../locales/ru.json';

const resources = {
  en: { translation: en },
  uz: { translation: uz },
  ru: { translation: ru },
};

const LANGUAGE_KEY = 'user-language';

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

  if (!savedLanguage) {
    const deviceLanguage = Localization.getLocales()[0].languageCode;
    savedLanguage =
      deviceLanguage && resources[deviceLanguage as keyof typeof resources] ? deviceLanguage : 'uz'; // Default to Uzbek if not found
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
};

initI18n();

export default i18n;
