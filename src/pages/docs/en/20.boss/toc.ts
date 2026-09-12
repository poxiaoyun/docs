import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// Item labels follow the real Boss console sidebar
// (src/routes/navs/boss.tsx + locales/langs/*/navbar.json).
// The sections below are the docs-site grouping; real groups are noted inline.
// ----------------------------------------------------------------------

export const BOSS_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    // Real groups: Overview (Home), Account Center (Account / Tenant)
    subheader: 'Boss Operations Platform',
    items: [
      {
        title: 'Overview',
        path: '/boss',
        icon: 'ic-params',
        product: 'boss',
      },
      {
        title: 'Home',
        path: '/boss/dashboard',
        icon: 'ic-dashboard',
        product: 'boss',
      },
      {
        title: 'Account Center',
        path: '/boss/iam',
        icon: 'ic-lock',
        product: 'boss',
        children: [
          { title: 'Account', path: '/boss/iam/users' },
          { title: 'Tenant', path: '/boss/iam/tenants' },
        ],
      },
    ],
  },
  {
    // Real groups: Model Gateway (Dashboard), Model Services (Channel Management /
    // Model Configuration), User Management (Token Management / Call Logs),
    // Security Services (Sensitive Word Management / Policy Management / Hit Records),
    // Platform Settings (Gateway Configuration / Currency Configuration)
    subheader: 'Model Gateway',
    items: [
      {
        title: 'Model Gateway',
        path: '/boss/gateway',
        icon: 'ic-blog',
        product: 'boss',
        children: [
          { title: 'Dashboard', path: '/boss/gateway/operations' },
          { title: 'Channel Management', path: '/boss/gateway/channels' },
          { title: 'Model Configuration', path: '/boss/gateway/model-metadata' },
          { title: 'Token Management', path: '/boss/gateway/api-keys' },
          { title: 'Call Logs', path: '/boss/gateway/audit' },
          { title: 'Content Moderation', path: '/boss/gateway/moderation' },
          { title: 'Hit Records', path: '/boss/gateway/sensitive-hits' },
          { title: 'Gateway Configuration', path: '/boss/gateway/config' },
          { title: 'Currency Configuration', path: '/boss/gateway/currency-settings' },
        ],
      },
    ],
  },
  {
    // Real groups: Asset Management (Models / Datasets / Images / Spaces),
    // Data Sync (Mirror), Security Audit (Audit Logs), System Settings (Announcements / Banners)
    subheader: 'Moha Repository Management',
    items: [
      {
        title: 'Moha Repository Management',
        path: '/boss/moha-admin',
        icon: 'ic-course',
        product: 'boss',
        children: [
          { title: 'Models', path: '/boss/moha-admin/models' },
          { title: 'Datasets', path: '/boss/moha-admin/datasets' },
          { title: 'Images', path: '/boss/moha-admin/images' },
          { title: 'Spaces', path: '/boss/moha-admin/spaces' },
          { title: 'Mirror', path: '/boss/moha-admin/mirrors' },
          { title: 'Audit Logs', path: '/boss/moha-admin/audit' },
          { title: 'Announcements', path: '/boss/moha-admin/announcements' },
          { title: 'Banners', path: '/boss/moha-admin/banners' },
        ],
      },
    ],
  },
  {
    // Real groups: AI Platform (Cluster / Tenant Resource / App Template),
    // Cluster Status + Resource Management + Operations Management
    subheader: 'Rune Admin',
    items: [
      {
        title: 'Rune Admin',
        path: '/boss/rune-admin',
        icon: 'ic-tour',
        product: 'boss',
        children: [
          { title: 'Cluster', path: '/boss/rune-admin/clusters' },
          { title: 'Cluster Status', path: '/boss/rune-admin/cluster-overview' },
          { title: 'Dynamic Dashboard', path: '/boss/rune-admin/dynamic-dashboard' },
          { title: 'Nodes & Accelerators', path: '/boss/rune-admin/nodes-gpu' },
          { title: 'Workloads', path: '/boss/rune-admin/resources' },
          { title: 'Resource Pool', path: '/boss/rune-admin/resource-pools' },
          { title: 'Storage Cluster & Runtime', path: '/boss/rune-admin/storage-runtime' },
          { title: 'Logs & Scheduler', path: '/boss/rune-admin/observability' },
          { title: 'Flavor', path: '/boss/rune-admin/flavors' },
          { title: 'Tenant Quotas', path: '/boss/rune-admin/tenants' },
          { title: 'App Template', path: '/boss/rune-admin/templates' },
          { title: 'System Template Market', path: '/boss/rune-admin/system-market' },
          { title: 'System Apps', path: '/boss/rune-admin/systems' },
        ],
      },
    ],
  },
  {
    // Real group: System Settings (System Member / Platform Settings / AI Platform Settings /
    // Moha Hub Settings / Gateway Settings / AI Assistant Settings / License)
    subheader: 'Platform Management',
    items: [
      {
        title: 'Platform',
        path: '/boss/settings',
        icon: 'ic-params',
        product: 'boss',
        children: [
          { title: 'System Member', path: '/boss/settings/members' },
          { title: 'Platform Settings', path: '/boss/settings/platform' },
          { title: 'AI Platform Settings', path: '/boss/settings/rune' },
          { title: 'Moha Hub Settings', path: '/boss/settings/moha' },
          { title: 'Gateway Settings', path: '/boss/settings/chatapp' },
          { title: 'AI Assistant Settings', path: '/boss/settings/ai-assistant' },
          { title: 'License', path: '/boss/settings/license' },
        ],
      },
    ],
  },
];
