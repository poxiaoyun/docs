import type { DocsSidebarSection } from '../../toc';

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune AI Platform',
    items: [
      {
        title: 'Home',
        path: '/docs/rune',
        icon: 'ic-tour',
        product: 'rune',
      },
      {
        title: 'Getting Started',
        path: '/docs/rune/guide',
        icon: 'ic-analytics',
        product: 'rune',
        children: [
          { title: 'Prerequisites', path: '/docs/rune/guide/prerequisites' },
          { title: 'Create Workloads', path: '/docs/rune/guide/workloads' },
          { title: 'Inference Hosting', path: '/docs/rune/guide/inference' },
        ],
      },
      {
        title: 'Console',
        path: '/docs/rune/console',
        icon: 'ic-dashboard',
        product: 'rune',
        children: [
          { title: 'Dashboard', path: '/docs/rune/console/dashboard' },
          { title: 'Workspaces', path: '/docs/rune/console/workspace' },
          { title: 'Dev Environments', path: '/docs/rune/console/devenv' },
          { title: 'Fine-tuning', path: '/docs/rune/console/finetune' },
          { title: 'Experiments', path: '/docs/rune/console/experiment' },
          { title: 'Inference Services', path: '/docs/rune/console/inference' },
          { title: 'Applications', path: '/docs/rune/console/app' },
          { title: 'App Market', path: '/docs/rune/console/app-market' },
          { title: 'Evaluations', path: '/docs/rune/console/evaluation' },
          { title: 'Run Logs', path: '/docs/rune/console/logging' },
          { title: 'Storage Volumes', path: '/docs/rune/console/storage' },
          { title: 'Quota Management', path: '/docs/rune/console/quota' },
          { title: 'Flavors', path: '/docs/rune/console/flavor' },
        ],
      },
      {
        title: 'ChatApp',
        path: '/docs/rune/chatapp',
        icon: 'ic-chat',
        product: 'rune',
        children: [
          { title: 'Model Experience', path: '/docs/rune/chatapp/experience' },
          { title: 'Model Comparison', path: '/docs/rune/chatapp/compare' },
          { title: 'Parameter Debugging', path: '/docs/rune/chatapp/debug' },
          { title: 'Token Calculator', path: '/docs/rune/chatapp/token' },
        ],
      },
      {
        title: 'Resource Management',
        path: '/docs/rune/resources',
        icon: 'ic-file',
        product: 'rune',
        children: [
          { title: 'Instance Templates', path: '/docs/rune/resources/templates' },
          { title: 'Quotas & Policies', path: '/docs/rune/resources/quotas' },
          { title: 'Compute Flavors', path: '/docs/rune/resources/flavors' },
        ],
      },
    ],
  },
];
