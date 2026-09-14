import type { DocsSidebarSection } from '../../toc';

export const REFERENCE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Reference',
    items: [
      {
        title: 'Reference Overview',
        path: '/reference',
        icon: 'ic-file',
        product: 'faq',
      },
      {
        title: 'API Overview',
        path: '/reference/api-overview',
        icon: 'ic-external',
        product: 'faq',
      },
      {
        title: 'Permission Model',
        path: '/reference/permissions',
        icon: 'ic-lock',
        product: 'faq',
      },
      {
        title: 'Build & Environment',
        path: '/reference/build-and-env',
        icon: 'ic-params',
        product: 'faq',
      },
      {
        title: 'FAQ',
        path: '/reference/faq',
        icon: 'ic-chat',
        product: 'faq',
      },
    ],
  },
];
