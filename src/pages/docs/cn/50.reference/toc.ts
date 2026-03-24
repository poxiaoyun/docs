import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const REFERENCE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '参考文档',
    items: [
      {
        title: 'API 概览',
        path: '/docs/reference/api-overview',
        icon: 'ic-file',
        product: 'faq',
      },
      {
        title: '权限设计',
        path: '/docs/reference/permissions',
        icon: 'ic-lock',
        product: 'faq',
      },
      {
        title: '常见问题',
        path: '/docs/reference/faq',
        icon: 'ic-chat',
        product: 'faq',
      },
    ],
  },
];
