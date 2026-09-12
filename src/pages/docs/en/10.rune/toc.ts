import type { DocsSidebarSection } from '../../toc';

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune AI Platform',
    items: [
      {
        title: 'Overview',
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
    ],
  },
  {
    // Order and labels follow the real console sidebar (src/routes/navs/rune.tsx):
    // Home → Marketplace / Workbench (Inference, Training & Fine-tuning, Runebox, Apps,
    // Templates, Storage) / Observability (Metrics, Logs, Evaluations)
    subheader: 'Rune Console',
    items: [
      {
        title: 'Console Overview',
        path: '/rune/console',
        icon: 'ic-dashboard',
        product: 'rune',
      },
      { title: 'Home', path: '/rune/console/dashboard' },
      { title: 'Marketplace', path: '/rune/console/app-market' },
      { title: 'Inference', path: '/rune/console/inference' },
      { title: 'Training & Fine-tuning', path: '/rune/console/finetune' },
      { title: 'Development', path: '/rune/console/devenv' },
      { title: 'Apps', path: '/rune/console/app' },
      { title: 'Storage', path: '/rune/console/storage' },
      { title: 'Metrics', path: '/rune/console/experiment' },
      { title: 'Logs', path: '/rune/console/logging' },
      { title: 'Evaluations', path: '/rune/console/evaluation' },
      { title: 'AI Diagnostics Assistant', path: '/rune/console/diagnostics' },
    ],
  },
  {
    // Maps to the "Templates" menu and the tenant tabs (Overview / Members / Quota / Flavor / Workspace)
    subheader: 'Resources & Quotas',
    items: [
      {
        title: 'Resources Overview',
        path: '/rune/resources',
        icon: 'ic-file',
        product: 'rune',
      },
      { title: 'Templates', path: '/rune/resources/templates' },
      { title: 'Quota', path: '/rune/console/quota' },
      { title: 'Flavor', path: '/rune/console/flavor' },
      { title: 'Workspaces', path: '/rune/console/workspace' },
    ],
  },
  {
    // Header links: Models / Playground / Comparison / API Keys / Usage analysis
    subheader: 'ChatApp',
    items: [
      {
        title: 'Overview',
        path: '/rune/chatapp',
        icon: 'ic-chat',
        product: 'rune',
      },
      { title: 'Models', path: '/rune/chatapp/marketplace' },
      { title: 'Playground', path: '/rune/chatapp/experience' },
      { title: 'Comparison', path: '/rune/chatapp/compare' },
      { title: 'API Keys', path: '/rune/chatapp/token' },
      { title: 'Usage analysis', path: '/rune/chatapp/usage-statistics' },
      { title: 'Parameter Settings', path: '/rune/chatapp/debug' },
    ],
  },
];
