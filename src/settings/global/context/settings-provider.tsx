import type { SettingsState, SettingsProviderProps } from '../types';

import { useLocalStorage } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { baseUri } from 'src/global-config';

import { GlobalSettingsContext } from './settings-context';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '../settings-config';

// ----------------------------------------------------------------------

/**
 * 站点级配置（标题、副标题、logo）。
 *
 * 唯一来源是 `public/global-config.json` —— 文档站是纯静态站点，构建产物和容器部署
 * 都会把它一起发出去（路径经 `baseUri()` 补 BASE_URL，`/` 与 `/docs` 两种 base 都对）。
 *
 * 这里以前还有一步：先请求 `/api/iam/public-configurations/global`，失败才回落到静态
 * 文件。那段逻辑是从 console 搬过来的 —— console 与 IAM 同源，生产环境确实有这条接口；
 * 文档站没有 IAM，在 docs.poxiaoshi.cn 上它必然是 404，于是每次打开页面都先白跑一次
 * 失败请求，控制台里常年挂一条红字。接口返回的四个字段里，代码实际只用到 `logo`
 * （见 components/logo 与 app.tsx 的 FaviconUpdater），用静态文件完全够。
 *
 * 真需要接动态配置时，改这一个文件即可：在 fetch 静态文件之前插一段接口请求。
 */
export function GlobalSettingsProvider({
  children,
  storageKey = SETTINGS_STORAGE_KEY,
}: SettingsProviderProps) {
  const { state, setState } = useLocalStorage<SettingsState>(storageKey);

  const loadSettings = useCallback(async () => {
    let settings: Partial<SettingsState> | null = null;

    try {
      settings = await fetch(baseUri('/global-config.json')).then((res) => {
        if (!res.ok) throw new Error(`global-config.json: ${res.status}`);
        return res.json();
      });
    } catch (error) {
      console.error('加载 global-config.json 失败，回落到内置默认值：', error);
    }

    if (settings) {
      // 空值（未配置的字段）不覆盖默认值，避免把 title 变成空字符串。
      const filtered = Object.fromEntries(
        Object.entries(settings).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      );

      setState({ ...defaultSettings, ...filtered });
    } else {
      setState(defaultSettings);
    }
  }, [setState]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
    }),
    [state, setState]
  );

  return <GlobalSettingsContext value={memoizedValue}>{children}</GlobalSettingsContext>;
}
