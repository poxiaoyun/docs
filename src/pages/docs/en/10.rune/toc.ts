import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// Categories mirror the real console sidebar
// (XiaoShi-Rune-Console/src/routes/navs/rune.tsx + locales/langs/en/navbar.json):
// Home (navbar.dashboard) / Workbench (navbar.pai) / Observability (navbar.observability).
// Each group is a separate section so the category label stays visible.
//
// Conventions (kept in sync with 20.boss/toc.ts):
//   1. subheader = the product's own group name, taken from the UI source strings; it never
//      repeats an item title in the same section (otherwise the sidebar shows the same word twice);
//   2. a group's landing page comes first inside the group, labelled "<Group> Overview" so it
//      differs from the section label;
//   3. `children` is only used when the group node's path is a path prefix of its children —
//      the sidebar decides "active" and auto-expands by path prefix, so a non-prefix parent
//      collapses on refresh and hides the current page. Only "Getting Started" qualifies here;
//      the console groups are carried by subheaders instead;
//   4. landing pages whose path prefixes sibling items must set deepMatch: false
//      (/rune, /rune/console, /rune/resources), otherwise they stay highlighted everywhere;
//   5. every section needs at least one top-level item with `product`, otherwise the layout's
//      filteredSections silently drops the whole section;
//   6. every top-level item carries an `icon` — depth=1 rows are laid out with an icon gutter,
//      so a missing icon shifts that title 34px left and makes one list look ragged. Names come
//      from the 27 two-tone glyphs in public/assets/icons/navbar; an icon is not repeated inside
//      one subheader section (they are compared on a single screen) but may be reused across them.
// ----------------------------------------------------------------------

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune AI Platform',
    items: [
      {
        title: 'Overview',
        path: '/rune',
        icon: 'ic-tour',
        deepMatch: false,
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
    // First console group: Home (navbar.dashboard) = Home + App Market
    subheader: 'Rune Console',
    items: [
      {
        title: 'Console Overview',
        path: '/rune/console',
        icon: 'ic-dashboard',
        deepMatch: false,
        product: 'rune',
      },
      { title: 'Home', path: '/rune/console/dashboard', icon: 'ic-kanban' },
      { title: 'App Market', path: '/rune/console/app-market', icon: 'ic-ecommerce' },
    ],
  },
  {
    // Second console group: Workbench (navbar.pai)
    // Presets (navbar.instance_preset) also sits under this group in the product.
    subheader: 'Rune Console · Workbench',
    items: [
      {
        title: 'Inference Services',
        path: '/rune/console/inference',
        icon: 'ic-chat',
        product: 'rune',
      },
      { title: 'Batch inference', path: '/rune/console/batch-inference', icon: 'ic-order' },
      { title: 'Training & Fine-tuning', path: '/rune/console/finetune', icon: 'ic-job' },
      { title: 'Development', path: '/rune/console/devenv', icon: 'ic-subpaths' },
      { title: 'Apps', path: '/rune/console/app', icon: 'ic-product' },
      { title: 'Presets', path: '/rune/resources/presets', icon: 'ic-label' },
      { title: 'Storage', path: '/rune/console/storage', icon: 'ic-folder' },
    ],
  },
  {
    // Third console group: Observability (navbar.observability)
    // Alerts live behind the bell in the top bar, not in the sidebar; grouped here because
    // they are another "go back and inspect the data" entry point.
    subheader: 'Rune Console · Observability',
    items: [
      { title: 'Metrics', path: '/rune/console/experiment', icon: 'ic-analytics', product: 'rune' },
      { title: 'Logs', path: '/rune/console/logging', icon: 'ic-menu-item' },
      { title: 'Evaluations', path: '/rune/console/evaluation', icon: 'ic-order' },
      { title: 'Alerts', path: '/rune/console/alerting', icon: 'ic-invoice' },
    ],
  },
  {
    // Tenant management: tenant clusters plus quota / flavor / workspace
    subheader: 'Rune Console · Tenant Management',
    items: [
      {
        title: 'Tenant Clusters',
        path: '/rune/console/tenant-clusters',
        icon: 'ic-dashboard',
        product: 'rune',
      },
      {
        title: 'Resources & Quotas Overview',
        path: '/rune/resources',
        icon: 'ic-file',
        deepMatch: false,
      },
      { title: 'Quota', path: '/rune/console/quota', icon: 'ic-invoice' },
      { title: 'Flavor', path: '/rune/console/flavor', icon: 'ic-params' },
      { title: 'Workspace Management', path: '/rune/console/workspace', icon: 'ic-subpaths' },
    ],
  },
];
