import 'src/global.css';

import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { usePathname } from 'src/routes/hooks';

import { themeConfig, ThemeProvider } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { I18nProvider } from './locales';
import { setFavicon } from './utils/favicon';
import { GlobalSettingsProvider, useGlobalSettingsContext } from './settings/global';


// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  return (
    <I18nProvider>
      <GlobalSettingsProvider>
        <HelmetProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.defaultMode}
            >
              <MotionLazy>
                <FaviconUpdater />
                <ProgressBar />
                <SettingsDrawer defaultSettings={defaultSettings} />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </HelmetProvider>
      </GlobalSettingsProvider>
    </I18nProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// ----------------------------------------------------------------------

function FaviconUpdater() {
  const { state } = useGlobalSettingsContext();

  useEffect(() => {
    setFavicon(state?.logo);
  }, [state?.logo]);

  return null;
}
