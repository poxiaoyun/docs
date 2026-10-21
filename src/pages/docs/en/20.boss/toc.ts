import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// Categories mirror the real Boss console sidebar
// (XiaoShi-Rune-Console/src/routes/navs/boss.tsx + locales/langs/*/navbar.json).
//
// Conventions (kept in sync with 10.rune/toc.ts):
//   1. subheader = the product's own group name, taken from the UI source strings; it never
//      repeats an item title in the same section — before this change the sections
//      "Model Gateway / Moha Repository Management / Rune Admin" each held a single item
//      with the very same title, so the sidebar showed the same word twice;
//   2. each board's landing page comes first, labelled "<Board> Overview" so it differs
//      from the section label;
//   3. `children` is only used when the group node's path is a path prefix of its children —
//      the sidebar decides "active" and auto-expands by path prefix, so a non-prefix parent
//      collapses on refresh and hides the current page. Only "Account Center" qualifies here;
//   4. Cluster Status / Resource Management / Operations Management are the three sub-menus of
//      the cluster detail page (getClusterNavData). Their pages sit in the same directory and
//      none of their paths is a prefix of another, so the grouping is carried by subheaders
//      with a "Rune Admin ·" prefix marking the parent;
//   5. landing pages whose path prefixes sibling items must set deepMatch: false
//      (/boss, /boss/gateway, /boss/moha-admin, /boss/rune-admin, /boss/settings),
//      otherwise they stay highlighted everywhere;
//   6. every section needs at least one top-level item with `product`, otherwise the layout's
//      filteredSections silently drops the whole section;
//   7. every top-level item carries an `icon` — depth=1 rows are laid out with an icon gutter,
//      so a missing icon shifts that title 34px left and makes one list look ragged. Names come
//      from the 27 two-tone glyphs in public/assets/icons/navbar; an icon is not repeated inside
//      one subheader section (they are compared on a single screen) but may be reused across them.
// ----------------------------------------------------------------------

export const BOSS_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    // Real group: Overview (Overview / Home)
    subheader: 'BOSS Console',
    items: [
      {
        title: 'Overview',
        path: '/boss',
        icon: 'ic-params',
        deepMatch: false,
        product: 'boss',
      },
      {
        title: 'Home',
        path: '/boss/dashboard',
        icon: 'ic-dashboard',
      },
    ],
  },
  {
    // Real group: Account Center (Users / Tenants)
    subheader: 'Account Center',
    items: [
      {
        title: 'Account Center',
        path: '/boss/iam',
        icon: 'ic-lock',
        deepMatch: false,
        product: 'boss',
        children: [
          { title: 'User Management', path: '/boss/iam/users' },
          { title: 'Tenant Management', path: '/boss/iam/tenants' },
        ],
      },
    ],
  },
  {
    // Real group: System Management (Authentication Policy / Third-party Authentication /
    // Email Providers / SMS Providers); the product shows it only under /boss/iam paths
    subheader: 'System Management',
    items: [
      {
        title: 'Authentication Policy',
        path: '/boss/iam/authentication-policy',
        icon: 'ic-lock',
        product: 'boss',
      },
      {
        title: 'Third-party Authentication',
        path: '/boss/iam/identity-providers',
        icon: 'ic-external',
      },
      { title: 'Email Providers', path: '/boss/iam/email-providers', icon: 'ic-mail' },
      { title: 'SMS Providers', path: '/boss/iam/sms-providers', icon: 'ic-chat' },
    ],
  },
  {
    // Real groups: Model Gateway (Dashboard), Model Services (Channel Management /
    // Model Configuration), User Management (Token Management / Call Logs),
    // Security Services (Content Moderation / Hit Records),
    // Platform Settings (Gateway Configuration / Currency Configuration).
    // All of their pages sit flat under /boss/gateway, so the grouping cannot be expressed with
    // `children` (no path prefix) and the items are listed in product order instead.
    subheader: 'Model Gateway',
    items: [
      {
        title: 'Gateway Overview',
        path: '/boss/gateway',
        icon: 'ic-blog',
        deepMatch: false,
        product: 'boss',
      },
      { title: 'Dashboard', path: '/boss/gateway/operations', icon: 'ic-analytics' },
      { title: 'Channel Management', path: '/boss/gateway/channels', icon: 'ic-external' },
      { title: 'Model Configuration', path: '/boss/gateway/model-metadata', icon: 'ic-product' },
      { title: 'Rate Plans', path: '/boss/gateway/rate-plans', icon: 'ic-invoice' },
      { title: 'Billing Accounts', path: '/boss/gateway/billing-accounts', icon: 'ic-banking' },
      { title: 'Plan Catalog', path: '/boss/gateway/billing-plans', icon: 'ic-ecommerce' },
      { title: 'Subscriptions', path: '/boss/gateway/billing-subscriptions', icon: 'ic-calendar' },
      { title: 'Pricing Exceptions', path: '/boss/gateway/usage-events', icon: 'ic-kanban' },
      { title: 'Quota Plans', path: '/boss/gateway/quota-plans', icon: 'ic-params' },
      { title: 'API Keys', path: '/boss/gateway/api-keys', icon: 'ic-lock' },
      { title: 'Call Logs', path: '/boss/gateway/audit', icon: 'ic-file' },
      { title: 'Sensitive Words', path: '/boss/gateway/moderation-lexicon', icon: 'ic-label' },
      { title: 'Moderation Policies', path: '/boss/gateway/moderation-policies', icon: 'ic-job' },
      { title: 'Hit Records', path: '/boss/gateway/sensitive-hits', icon: 'ic-order' },
      { title: 'Gateway Configuration', path: '/boss/gateway/config', icon: 'ic-menu-item' },
      {
        title: 'Currency Configuration',
        path: '/boss/gateway/currency-settings',
        icon: 'ic-dashboard',
      },
    ],
  },
  {
    // Real group: Asset Management (Models / Datasets / Images / Spaces)
    subheader: 'Asset Management',
    items: [
      {
        title: 'Repository Overview',
        path: '/boss/moha-admin',
        icon: 'ic-course',
        deepMatch: false,
        product: 'boss',
      },
      { title: 'Models', path: '/boss/moha-admin/models', icon: 'ic-product' },
      { title: 'Datasets', path: '/boss/moha-admin/datasets', icon: 'ic-folder' },
      { title: 'Images', path: '/boss/moha-admin/images', icon: 'ic-menu-item' },
      { title: 'Spaces', path: '/boss/moha-admin/spaces', icon: 'ic-subpaths' },
    ],
  },
  {
    // Real group: Data Sync (Mirror Site)
    subheader: 'Data Sync',
    items: [
      {
        title: 'Mirror Site',
        path: '/boss/moha-admin/mirrors',
        icon: 'ic-external',
        product: 'boss',
      },
    ],
  },
  {
    // Real group: Security Audit (Audit Logs)
    subheader: 'Security Audit',
    items: [
      { title: 'Audit Logs', path: '/boss/moha-admin/audit', icon: 'ic-file', product: 'boss' },
    ],
  },
  {
    // Real group: System Settings (Announcements / Banners)
    subheader: 'System Settings',
    items: [
      {
        title: 'Announcements',
        path: '/boss/moha-admin/announcements',
        icon: 'ic-mail',
        product: 'boss',
      },
      { title: 'Banners', path: '/boss/moha-admin/banners', icon: 'ic-blog' },
    ],
  },
  {
    // Real group: AI Platform (Cluster Management / Tenant Clusters / Application)
    subheader: 'AI Platform',
    items: [
      {
        title: 'AI Platform Administration',
        path: '/boss/rune-admin',
        icon: 'ic-tour',
        deepMatch: false,
        product: 'boss',
      },
      { title: 'Cluster Management', path: '/boss/rune-admin/clusters', icon: 'ic-subpaths' },
      {
        title: 'Tenant Clusters',
        path: '/boss/rune-admin/tenant-clusters',
        icon: 'ic-dashboard',
      },
      { title: 'Application', path: '/boss/rune-admin/applications', icon: 'ic-label' },
    ],
  },
  {
    // Cluster detail sub-menu 1: Cluster Status (Cluster / Node / Accelerator dashboards)
    subheader: 'AI Platform · Cluster Status',
    items: [
      {
        title: 'Cluster Status',
        path: '/boss/rune-admin/cluster-overview',
        icon: 'ic-tour',
        product: 'boss',
      },
      { title: 'Node Status', path: '/boss/rune-admin/node-status', icon: 'ic-dashboard' },
      {
        title: 'Accelerator Status',
        path: '/boss/rune-admin/accelerator-status',
        icon: 'ic-product',
      },
      // No product menu entry; kept as a docs-only page for the cluster metrics YAML editor
      {
        title: 'Dynamic Dashboard',
        path: '/boss/rune-admin/dynamic-dashboard',
        icon: 'ic-analytics',
      },
    ],
  },
  {
    // Cluster detail sub-menu 2: Resource Management (Resource Pool / Flavor / Tenant Resources)
    subheader: 'AI Platform · Resource Management',
    items: [
      {
        title: 'Resource Pool',
        path: '/boss/rune-admin/resource-pools',
        icon: 'ic-folder',
        product: 'boss',
      },
      { title: 'Flavor', path: '/boss/rune-admin/flavors', icon: 'ic-params' },
      { title: 'Tenant Resources', path: '/boss/rune-admin/tenants', icon: 'ic-invoice' },
    ],
  },
  {
    // Cluster detail sub-menu 3: Operations Management (Workloads / Storage Cluster /
    // System Apps / Scheduling / Scheduler Management / Log Management / Alerts)
    subheader: 'AI Platform · Operations Management',
    items: [
      { title: 'Workloads', path: '/boss/rune-admin/resources', icon: 'ic-job', product: 'boss' },
      { title: 'Storage Cluster', path: '/boss/rune-admin/storage-cluster', icon: 'ic-folder' },
      { title: 'System Apps', path: '/boss/rune-admin/systems', icon: 'ic-product' },
      { title: 'Scheduling', path: '/boss/rune-admin/scheduling', icon: 'ic-kanban' },
      { title: 'Scheduler Management', path: '/boss/rune-admin/schedulers', icon: 'ic-menu-item' },
      { title: 'Log Management', path: '/boss/rune-admin/logs', icon: 'ic-file' },
      { title: 'Alerts', path: '/boss/rune-admin/alerts', icon: 'ic-invoice' },
    ],
  },
  {
    // Real group: Platform (System Members / Platform Settings / AI Platform Settings /
    // Moha Hub Settings / Gateway Settings / License) plus the two entries that only exist in
    // the top bar (Alert Channels / Digital Twin)
    subheader: 'Platform',
    items: [
      {
        title: 'Platform Overview',
        path: '/boss/settings',
        icon: 'ic-params',
        deepMatch: false,
        product: 'boss',
      },
      { title: 'System Members', path: '/boss/settings/members', icon: 'ic-user' },
      { title: 'Platform Settings', path: '/boss/settings/platform', icon: 'ic-menu-item' },
      { title: 'AI Platform Settings', path: '/boss/settings/rune', icon: 'ic-tour' },
      { title: 'Moha Hub Settings', path: '/boss/settings/moha', icon: 'ic-course' },
      { title: 'Gateway Settings', path: '/boss/settings/chatapp', icon: 'ic-blog' },
      { title: 'License', path: '/boss/settings/license', icon: 'ic-lock' },
      { title: 'Platform Audit', path: '/boss/settings/platform-audit', icon: 'ic-file' },
      { title: 'Alert Channels', path: '/boss/settings/alert-channels', icon: 'ic-mail' },
      { title: 'Digital Twin', path: '/boss/digital-twin', icon: 'ic-subpaths' },
    ],
  },
];
