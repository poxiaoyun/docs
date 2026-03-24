import type { DocsSidebarSection } from '../../toc';

export const REFERENCE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Reference',
    items: [
      {
        title: 'API Overview',
        path: '/docs/reference/api-overview',
        icon: 'ic-file',
        product: 'faq',
      },
      {
        title: 'Permission Model',
        path: '/docs/reference/permissions',
        icon: 'ic-lock',
        product: 'faq',
      },
      {
        title: 'FAQ',
        path: '/docs/reference/faq',
        icon: 'ic-chat',
        product: 'faq',
      },
    ],
  },
];
