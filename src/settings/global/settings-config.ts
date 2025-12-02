import type { SettingsState } from './types';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY: string = 'global-settings';

export const defaultSettings: SettingsState = {
  title: 'RUNE',
  subTitle: '晓石AI智算平台',
  language: 'cn',
  logo: '/api/iam/avatars/logo/logo',
  enableBossSignup: false,
};
