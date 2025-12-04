// ----------------------------------------------------------------------

export type SettingsState = {
  title: string;
  subTitle: string;
  language: string;
  logo: string;
};

export type SettingsContextValue = {
  state: SettingsState;
  setState: (updateValue: Partial<SettingsState>) => void;
};

export type SettingsProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};
