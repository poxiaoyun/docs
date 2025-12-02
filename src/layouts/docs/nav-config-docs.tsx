import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  dashboard: icon('ic-dashboard'),
  file: icon('ic-file'),
  user: icon('ic-user'),
  analytics: icon('ic-analytics'),
};

// ----------------------------------------------------------------------

export const docsNavData: NavSectionProps['data'] = [
  {
    subheader: 'Getting Started',
    items: [
      { title: 'Introduction', path: paths.docs.introduction, icon: ICONS.dashboard },
      { title: 'Quick start', path: paths.docs.quickStart, icon: ICONS.file },
      { title: 'Mock server', path: paths.docs.mockServer, icon: ICONS.file },
      { title: 'Deployment', path: paths.docs.deployment, icon: ICONS.file },
      { title: 'Package & license', path: paths.docs.packageLicense, icon: ICONS.file },
      { title: 'Setup', path: paths.docs.setup, icon: ICONS.file },
      { title: 'Figma', path: paths.docs.figma, icon: ICONS.file },
    ],
  },
  {
    subheader: 'Theme UI',
    items: [
      { title: 'Colors', path: paths.docs.theme.colors, icon: ICONS.file },
      { title: 'Typography', path: paths.docs.theme.typography, icon: ICONS.file },
      {
        title: 'Icons',
        path: paths.docs.theme.icons,
        icon: ICONS.file,
        info: <Label color="info">NEW</Label>,
      },
      { title: 'Shadows', path: paths.docs.theme.shadows, icon: ICONS.file },
      { title: 'Css vars', path: paths.docs.theme.cssVars, icon: ICONS.file },
      { title: 'Logo', path: paths.docs.theme.logo, icon: ICONS.file },
      { title: 'Layout', path: paths.docs.theme.layout, icon: ICONS.file },
      { title: 'Navigation', path: paths.docs.theme.navigation, icon: ICONS.file },
      { title: 'Settings', path: paths.docs.theme.settings, icon: ICONS.file },
    ],
  },
  {
    subheader: 'Global',
    items: [
      { title: 'Styles', path: paths.docs.global.styles, icon: ICONS.file },
      { title: 'Config', path: paths.docs.global.config, icon: ICONS.file },
      {
        title: 'Components overrides',
        path: paths.docs.global.componentsOverrides,
        icon: ICONS.file,
      },
    ],
  },
  {
    subheader: 'Development',
    items: [{ title: 'Routing', path: paths.docs.development.routing, icon: ICONS.file }],
  },
];
