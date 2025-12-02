import type { NavSectionProps } from 'src/components/nav-section';

import { icon } from './icon';

// ----------------------------------------------------------------------

const ICONS = {
  file: icon('ic-file'),
  folder: icon('ic-folder'),
};

// ----------------------------------------------------------------------

function toTitleCase(str: string) {
  return str
    .split('-')
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

export function generateNavData(): NavSectionProps['data'] {
  const files = import.meta.glob('/src/pages/docs/**/*.md');
  const filePaths = Object.keys(files);

  const rootItems: NavItem[] = [];
  const groups: Record<string, NavItem[]> = {};

  filePaths.forEach((path) => {
    // Remove prefix /src/pages/docs/ and suffix .md
    const relativePath = path.replace('/src/pages/docs/', '').replace('.md', '');
    const parts = relativePath.split('/');
    const fileName = parts[parts.length - 1];
    const title = toTitleCase(fileName);
    const linkPath = `/docs/${relativePath}`;

    if (parts.length === 1) {
      // Root files
      rootItems.push({
        title,
        path: linkPath,
        icon: ICONS.file,
      });
    } else {
      // Grouped files (Level 1 folders)
      const groupName = toTitleCase(parts[0]);

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      if (parts.length === 2) {
        // File directly in group folder
        groups[groupName].push({
          title,
          path: linkPath,
          icon: ICONS.file,
        });
      } else if (parts.length === 3) {
        // Level 2 nested folder (max 3 levels supported as per request)
        // structure: group / subfolder / file
        const subGroupName = toTitleCase(parts[1]);

        let subGroup = groups[groupName].find(
          (item) => item.title === subGroupName && item.children
        );

        if (!subGroup) {
          subGroup = {
            title: subGroupName,
            path: '', // Subgroups don't have direct paths usually, they expand
            icon: ICONS.folder,
            children: [],
          };
          groups[groupName].push(subGroup);
        }

        subGroup.children?.push({
          title,
          path: linkPath,
        });
      }
    }
  });

  // Sort root items
  rootItems.sort((a, b) => a.title.localeCompare(b.title));

  // Construct final nav data
  const navData = [];

  // 1. Root files group (Getting Started)
  if (rootItems.length > 0) {
    navData.push({
      subheader: 'Getting Started',
      items: rootItems,
    });
  }

  // 2. Folder groups
  Object.keys(groups)
    .sort()
    .forEach((groupName) => {
      navData.push({
        subheader: groupName,
        items: groups[groupName].sort((a, b) => a.title.localeCompare(b.title)),
      });
    });

  return navData;
}
