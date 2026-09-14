import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// AIRouter: a top-level entry split out of the former "ChatApp" section
// (which used to live under 10.rune).
//
// Conventions (same as the 10.rune / 20.boss / 30.moha toc files):
//   1. subheader = the top-level group name, taken from the product UI; it must not
//      repeat any item title in the same section, or the sidebar shows the same
//      words on two consecutive lines;
//   2. the group's landing index page comes first, labelled "…Overview" so it does
//      not clash with the subheader;
//   3. use nested children only when the parent path is a prefix of each child path —
//      the sidebar decides the active item and auto-expansion by path prefix, so a
//      non-prefix parent collapses and the current page disappears from the sidebar.
//      Every page here sits on the same level with no prefix relation, so no children;
//   4. a landing page whose path prefixes its siblings must set deepMatch: false
//      (that is /airouter here), otherwise it stays highlighted on every child page;
//   5. each subheader needs at least one top-level item carrying `product`, or the
//      layout's filteredSections drops the whole section silently.
//
// Item labels are the real top-navigation wording of this subsystem (Models /
// Playground / Comparison / API Keys / Usage analysis). Parameter Settings is an
// in-page dialog with no top entry, but it has its own page, so it is listed too.
// ----------------------------------------------------------------------

export const AIROUTER_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'AIRouter',
    items: [
      {
        title: 'Overview',
        path: '/airouter',
        icon: 'ic-chat',
        deepMatch: false,
        product: 'airouter',
      },
      { title: 'Models', path: '/airouter/marketplace' },
      { title: 'Playground', path: '/airouter/experience' },
      { title: 'Comparison', path: '/airouter/compare' },
      { title: 'API Keys', path: '/airouter/token' },
      { title: 'Usage analysis', path: '/airouter/usage-statistics' },
      { title: 'Parameter Settings', path: '/airouter/debug' },
    ],
  },
];
