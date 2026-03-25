import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  assetsDir: string;
  auth: {
    skip: boolean;
    redirectPath: string;
  };
};

// ----------------------------------------------------------------------

export const BASE_URL = import.meta.env.BASE_URL;

export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

export const baseUri = (path: string) => `${BASE_PATH}/${path.replace(/^\/+/, '')}`;

export const CONFIG: ConfigValue = {
  appName: 'docs',
  appVersion: packageJson.version,
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? BASE_PATH,
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    skip: true,
    redirectPath: '/introduction',
  },
};

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT ?? '';
