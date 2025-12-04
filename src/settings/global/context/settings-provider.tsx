import type { SettingsState, SettingsProviderProps } from '../types';

import { useLocalStorage } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { API_ENDPOINT } from 'src/global-config';

import { GlobalSettingsContext } from './settings-context';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '../settings-config';

// ----------------------------------------------------------------------

export function GlobalSettingsProvider({
  children,
  storageKey = SETTINGS_STORAGE_KEY,
}: SettingsProviderProps) {
  const { state, setState } = useLocalStorage<SettingsState>(storageKey);

  const checkGlobalSettings = useCallback(async () => {
    try {
      const settings = await fetch(`${API_ENDPOINT}/api/iam/global-config`).then((res) => res.json());

      // 对settings进行过滤，移除为空的key
      const filteredSettings = Object.fromEntries(
        Object.entries(settings || {}).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      );

      setState({ ...defaultSettings, ...(filteredSettings || {}) });
    } catch (error) {
      console.error(error);
      setState(defaultSettings);
    }
  }, [setState]);

  useEffect(() => {
    checkGlobalSettings();
  });

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
    }),
    [state, setState]
  );

  return <GlobalSettingsContext value={memoizedValue}>{children}</GlobalSettingsContext>;
}
