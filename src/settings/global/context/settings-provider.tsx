import type { SettingsState, SettingsProviderProps } from '../types';

import { useLocalStorage } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { baseUri } from 'src/global-config';

import { GlobalSettingsContext } from './settings-context';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '../settings-config';

// ----------------------------------------------------------------------

export function GlobalSettingsProvider({
  children,
  storageKey = SETTINGS_STORAGE_KEY,
}: SettingsProviderProps) {
  const { state, setState } = useLocalStorage<SettingsState>(storageKey);

  const checkGlobalSettings = useCallback(async () => {
    let settings = null;

    // 1. Try to fetch from API
    try {
      settings = await fetch('/api/iam/global-config').then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      });
    } catch (apiError) {
      console.warn('API global-config failed, falling back to static file:', apiError);
      
      // 2. Fallback to static JSON file
      try {
        settings = await fetch(baseUri('/global-config.json')).then((res) => {
          if (!res.ok) throw new Error(`Static file error: ${res.status}`);
          return res.json();
        });
      } catch (staticError) {
        console.error('Static global-config.json failed:', staticError);
      }
    }

    if (settings) {
      // 对settings进行过滤，移除为空的key
      const filteredSettings = Object.fromEntries(
        Object.entries(settings || {}).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      );
      setState({ ...defaultSettings, ...(filteredSettings || {}) });
    } else {
      setState(defaultSettings);
    }
  }, [setState]);

  useEffect(() => {
    checkGlobalSettings();
  }, [checkGlobalSettings]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
    }),
    [state, setState]
  );

  return <GlobalSettingsContext value={memoizedValue}>{children}</GlobalSettingsContext>;
}
