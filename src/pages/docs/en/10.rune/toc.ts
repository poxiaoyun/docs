import type { DocsSidebarSection } from '../../toc';

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune AI Platform',
    items: [
      {
        title: 'Home',
        path: '/rune',
        icon: 'ic-tour',
        product: 'rune',
      },
      {
        title: 'Getting Started',
        path: '/rune/guide',
        icon: 'ic-analytics',
        product: 'rune',
        children: [
          { title: 'Prerequisites', path: '/rune/guide/prerequisites' },
          { title: 'Create Workloads', path: '/rune/guide/workloads' },
          { title: 'Inference Hosting', path: '/rune/guide/inference' },
        ],
      },
      {
        title: 'Console',
        path: '/rune/console',
        icon: 'ic-dashboard',
        product: 'rune',
        children: [
          { title: 'Dashboard', path: '/rune/console/dashboard' },
          { title: 'Workspaces', path: '/rune/console/workspace' },
          { title: 'Dev Environments', path: '/rune/console/devenv' },
          { title: 'Fine-tuning', path: '/rune/console/finetune' },
          { title: 'Experiments', path: '/rune/console/experiment' },
          { title: 'Inference Services', path: '/rune/console/inference' },
          { title: 'Applications', path: '/rune/console/app' },
          { title: 'App Market', path: '/rune/console/app-market' },
          { title: 'Evaluations', path: '/rune/console/evaluation' },
          { title: 'Run Logs', path: '/rune/console/logging' },
          { title: 'Storage Volumes', path: '/rune/console/storage' },
          { title: 'Quota Management', path: '/rune/console/quota' },
          { title: 'Flavors', path: '/rune/console/flavor' },
        ],
      },
      {
        title: 'ChatApp',
        path: '/rune/chatapp',
        icon: 'ic-chat',
        product: 'rune',
        children: [
          { title: 'Model Experience', path: '/rune/chatapp/experience' },
          { title: 'Model Comparison', path: '/rune/chatapp/compare' },
          { title: 'Parameter Debugging', path: '/rune/chatapp/debug' },
          { title: 'Token Calculator', path: '/rune/chatapp/token' },
        ],
      },
      {
        title: 'Resource Management',
        path: '/rune/resources',
        icon: 'ic-file',
        product: 'rune',
        children: [
          { title: 'Instance Templates', path: '/rune/resources/templates' },
          { title: 'Quotas & Policies', path: '/rune/resources/quotas' },
          { title: 'Compute Flavors', path: '/rune/resources/flavors' },
        ],
      },
    ],
  },
];
