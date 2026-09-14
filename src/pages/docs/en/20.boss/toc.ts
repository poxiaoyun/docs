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
      { title: 'Dashboard', path: '/boss/gateway/operations', icon: 'ic-analytics' },
      { title: 'Channel Management', path: '/boss/gateway/channels', icon: 'ic-external' },
      { title: 'Model Configuration', path: '/boss/gateway/model-metadata', icon: 'ic-product' },
      { title: 'Token Management', path: '/boss/gateway/api-keys', icon: 'ic-lock' },
      { title: 'Call Logs', path: '/boss/gateway/audit', icon: 'ic-file' },
      { title: 'Content Moderation', path: '/boss/gateway/moderation', icon: 'ic-label' },
      { title: 'Hit Records', path: '/boss/gateway/sensitive-hits', icon: 'ic-order' },
      { title: 'Gateway Configuration', path: '/boss/gateway/config', icon: 'ic-params' },
      {
        title: 'Currency Configuration',
        path: '/boss/gateway/currency-settings',
        icon: 'ic-banking',
      },
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
      { title: 'Models', path: '/boss/moha-admin/models', icon: 'ic-product' },
      { title: 'Datasets', path: '/boss/moha-admin/datasets', icon: 'ic-folder' },
      { title: 'Images', path: '/boss/moha-admin/images', icon: 'ic-menu-item' },
      { title: 'Spaces', path: '/boss/moha-admin/spaces', icon: 'ic-subpaths' },
      { title: 'Mirror', path: '/boss/moha-admin/mirrors', icon: 'ic-external' },
      { title: 'Audit Logs', path: '/boss/moha-admin/audit', icon: 'ic-file' },
      { title: 'Announcements', path: '/boss/moha-admin/announcements', icon: 'ic-mail' },
      { title: 'Banners', path: '/boss/moha-admin/banners', icon: 'ic-blog' },
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
      { title: 'Cluster', path: '/boss/rune-admin/clusters', icon: 'ic-subpaths' },
      { title: 'App Template', path: '/boss/rune-admin/templates', icon: 'ic-label' },
      {
        title: 'System Template Market',
        path: '/boss/rune-admin/system-market',
        icon: 'ic-ecommerce',
      },
    ],
  },
  {
    // Cluster detail sub-menu 1: Cluster Status (Cluster / Node / Accelerator dashboards)
    subheader: 'Rune Admin · Cluster Status',
    items: [
      {
        title: 'Cluster Overview',
        path: '/boss/rune-admin/cluster-overview',
        icon: 'ic-tour',
        product: 'boss',
      },
      {
        title: 'Dynamic dashboard',
        path: '/boss/rune-admin/dynamic-dashboard',
        icon: 'ic-analytics',
      },
      { title: 'Nodes & Accelerators', path: '/boss/rune-admin/nodes-gpu', icon: 'ic-product' },
    ],
  },
  {
    // Cluster detail sub-menu 2: Resource Management (Resource Pool / Flavor / Tenant Quotas)
    subheader: 'Rune Admin · Resource Management',
    items: [
      {
        title: 'Resource Pool',
        path: '/boss/rune-admin/resource-pools',
        icon: 'ic-folder',
        product: 'boss',
      },
      { title: 'Flavor', path: '/boss/rune-admin/flavors', icon: 'ic-params' },
      { title: 'Tenant Quotas', path: '/boss/rune-admin/tenants', icon: 'ic-invoice' },
    ],
  },
  {
    // Cluster detail sub-menu 3: Operations Management (Workloads / Storage Cluster /
    // System Apps / Scheduler / Logs)
    subheader: 'Rune Admin · Operations Management',
    items: [
      { title: 'Workloads', path: '/boss/rune-admin/resources', icon: 'ic-job', product: 'boss' },
      {
        title: 'Storage Cluster & Runtime',
        path: '/boss/rune-admin/storage-runtime',
        icon: 'ic-folder',
      },
      { title: 'System Apps', path: '/boss/rune-admin/systems', icon: 'ic-product' },
      { title: 'Logs & Scheduler', path: '/boss/rune-admin/observability', icon: 'ic-menu-item' },
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
      { title: 'System Member', path: '/boss/settings/members', icon: 'ic-user' },
      { title: 'Platform Settings', path: '/boss/settings/platform', icon: 'ic-menu-item' },
      { title: 'AI Platform Settings', path: '/boss/settings/rune', icon: 'ic-tour' },
      { title: 'Moha Hub Settings', path: '/boss/settings/moha', icon: 'ic-course' },
      { title: 'Gateway Settings', path: '/boss/settings/chatapp', icon: 'ic-blog' },
      { title: 'AI Assistant Settings', path: '/boss/settings/ai-assistant', icon: 'ic-chat' },
      { title: 'License', path: '/boss/settings/license', icon: 'ic-lock' },
    ],
  },
];
