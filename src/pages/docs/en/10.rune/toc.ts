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
//      filteredSections silently drops the whole section.
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
      { title: 'Home', path: '/rune/console/dashboard' },
      { title: 'App Market', path: '/rune/console/app-market' },
    ],
  },
  {
    // Second console group: Workbench (navbar.pai)
    // Templates (navbar.instance_template) also sits under this group in the product.
    subheader: 'Rune Console · Workbench',
    items: [
      { title: 'Inference Services', path: '/rune/console/inference', product: 'rune' },
      { title: 'Training & Fine-tuning', path: '/rune/console/finetune' },
      { title: 'Development', path: '/rune/console/devenv' },
      { title: 'Apps', path: '/rune/console/app' },
      { title: 'Templates', path: '/rune/resources/templates' },
      { title: 'Storage', path: '/rune/console/storage' },
    ],
  },
  {
    // Third console group: Observability (navbar.observability)
    // The AI Diagnostics Assistant is a floating helper in the console (not a sidebar entry);
    // it is grouped here because it is another "go back and inspect the data" entry point.
    subheader: 'Rune Console · Observability',
    items: [
      { title: 'Metrics', path: '/rune/console/experiment', product: 'rune' },
      { title: 'Logs', path: '/rune/console/logging' },
      { title: 'Evaluations', path: '/rune/console/evaluation' },
      { title: 'AI Diagnostics Assistant', path: '/rune/console/diagnostics' },
    ],
  },
  {
    // Tenant-side resource entries: Quota / Flavor (resource spec) / Workspace
    subheader: 'Rune Console · Resources & Quotas',
    items: [
      {
        title: 'Resources & Quotas Overview',
        path: '/rune/resources',
        icon: 'ic-file',
        deepMatch: false,
        product: 'rune',
      },
      { title: 'Quota', path: '/rune/console/quota' },
      { title: 'Flavor', path: '/rune/console/flavor' },
      { title: 'Workspace Management', path: '/rune/console/workspace' },
    ],
  },
];
