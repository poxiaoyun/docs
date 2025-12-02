import type { SettingsContextValue } from '../types';

import { createContext } from 'react';

// ----------------------------------------------------------------------

export const GlobalSettingsContext = createContext<SettingsContextValue | undefined>(undefined);
