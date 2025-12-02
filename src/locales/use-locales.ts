import type { Namespace } from 'i18next';
import type { LangCode } from './locales-config';

import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { fallbackLng, getCurrentLang } from './locales-config';

// ----------------------------------------------------------------------

export function useLocales(namespace?: Namespace) {
  return useTranslation(namespace);
}

export function useTranslate(namespace?: Namespace) {
  const { t, i18n } = useTranslation(namespace);

  const currentLang = getCurrentLang(i18n.resolvedLanguage);

  const updateDayjsLocale = useCallback((lang: LangCode) => {
    const updatedLang = getCurrentLang(lang);
    dayjs.locale(updatedLang.adapterLocale);
  }, []);

  const handleChangeLang = useCallback(
    async (lang: LangCode) => {
      try {
        const changeLangPromise = i18n.changeLanguage(lang);

        await changeLangPromise;

        updateDayjsLocale(lang);
      } catch (error) {
        console.error(error);
      }
    },
    [i18n, updateDayjsLocale]
  );

  const handleResetLang = useCallback(() => {
    handleChangeLang(fallbackLng);
  }, [handleChangeLang]);

  return {
    t,
    i18n,
    currentLang,
    onChangeLang: handleChangeLang,
    onResetLang: handleResetLang,
  };
}

// ----------------------------------------------------------------------
