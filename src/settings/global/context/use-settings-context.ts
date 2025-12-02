import { use } from 'react';

import { GlobalSettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function useGlobalSettingsContext() {
  const context = use(GlobalSettingsContext);

  if (!context) throw new Error('useUserSettingsContext must be use inside SettingsProvider');

  return context;
}
