import type { InitOptions } from 'i18next';
import type { LangCode } from './locales-config';

import i18next from 'i18next';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import { detectDocLang } from 'src/utils/doc-lang';

import { i18nOptions, i18nResourceLoader } from './locales-config';

// ----------------------------------------------------------------------

/**
 * 初始语言取自 **URL**，不再读 localStorage。
 *
 * 加了 `/en` 前缀之后，URL 与页面语言必须是同一件事：若启动时还读本地偏好，
 * 一个选过英文的用户打开中文地址 `/rune/console` 会先按英文渲染 —— 与预渲染出的
 * 中文 HTML、canonical 全都对不上（首屏闪一次英文，爬虫看到的是另一份）。
 * 现在「地址决定语言」，切语言就是切地址，两边永远一致。
 */
const i18nextLng = detectDocLang(window.location.pathname) as LangCode;

/**
 * Initialize i18next
 */
const initOptions: InitOptions = {
  ...i18nOptions(i18nextLng),
};

i18next.use(initReactI18next).use(i18nResourceLoader).init(initOptions);

// ----------------------------------------------------------------------

type I18nProviderProps = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  return <Provider i18n={i18next}>{children}</Provider>;
}
