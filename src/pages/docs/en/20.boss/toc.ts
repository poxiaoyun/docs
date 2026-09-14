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
//      filteredSections silently drops the whole section.
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
        deepMatch: false,
        product: 'boss',
      },
      {
        title: 'Home',
        path: '/boss/dashboard',
        icon: 'ic-dashboard',
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
  {
    // Real groups: Asset Management (Models / Datasets / Images / Spaces),
    // Data Sync (Mirror), Security Audit (Audit Logs), System Settings (Announcements / Banners)
    subheader: 'Moha Repository Management',
    items: [
      {
        title: 'Repository Overview',
        path: '/boss/moha-admin',
        icon: 'ic-course',
        deepMatch: false,
        product: 'boss',
      },
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
  {
    // Real group: AI Platform (Cluster / Tenant Resource / App Template); the tenant resource
    // shares a page with Tenant Quotas and is listed under Resource Management below.
    subheader: 'Rune Admin',
    items: [
      {
        title: 'Admin Overview',
        path: '/boss/rune-admin',
        icon: 'ic-tour',
        deepMatch: false,
        product: 'boss',
      },
      { title: 'Cluster', path: '/boss/rune-admin/clusters' },
      { title: 'App Template', path: '/boss/rune-admin/templates' },
      { title: 'System Template Market', path: '/boss/rune-admin/system-market' },
    ],
  },
  {
    // Cluster detail sub-menu 1: Cluster Status (Cluster / Node / Accelerator dashboards)
    subheader: 'Rune Admin · Cluster Status',
    items: [
      {
        title: 'Cluster Overview',
        path: '/boss/rune-admin/cluster-overview',
        product: 'boss',
      },
      { title: 'Dynamic dashboard', path: '/boss/rune-admin/dynamic-dashboard' },
      { title: 'Nodes & Accelerators', path: '/boss/rune-admin/nodes-gpu' },
    ],
  },
  {
    // Cluster detail sub-menu 2: Resource Management (Resource Pool / Flavor / Tenant Quotas)
    subheader: 'Rune Admin · Resource Management',
    items: [
      { title: 'Resource Pool', path: '/boss/rune-admin/resource-pools', product: 'boss' },
      { title: 'Flavor', path: '/boss/rune-admin/flavors' },
      { title: 'Tenant Quotas', path: '/boss/rune-admin/tenants' },
    ],
  },
  {
    // Cluster detail sub-menu 3: Operations Management (Workloads / Storage Cluster /
    // System Apps / Scheduler / Logs)
    subheader: 'Rune Admin · Operations Management',
    items: [
      { title: 'Workloads', path: '/boss/rune-admin/resources', product: 'boss' },
      { title: 'Storage Cluster & Runtime', path: '/boss/rune-admin/storage-runtime' },
      { title: 'System Apps', path: '/boss/rune-admin/systems' },
      { title: 'Logs & Scheduler', path: '/boss/rune-admin/observability' },
    ],
  },
  {
    // Real group: System Settings (System Member / Platform Settings / AI Platform Settings /
    // Moha Hub Settings / Gateway Settings / AI Assistant Settings / License)
    subheader: 'Platform Management',
    items: [
      {
        title: 'Platform Overview',
        path: '/boss/settings',
        icon: 'ic-params',
        deepMatch: false,
        product: 'boss',
      },
      { title: 'System Member', path: '/boss/settings/members' },
      { title: 'Platform Settings', path: '/boss/settings/platform' },
      { title: 'AI Platform Settings', path: '/boss/settings/rune' },
      { title: 'Moha Hub Settings', path: '/boss/settings/moha' },
      { title: 'Gateway Settings', path: '/boss/settings/chatapp' },
      { title: 'AI Assistant Settings', path: '/boss/settings/ai-assistant' },
      { title: 'License', path: '/boss/settings/license' },
    ],
  },
];
