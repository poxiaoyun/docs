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

function getOrderAndTitle(fileName: string) {
  const match = fileName.match(/^(\d+)\.(.+)/);
  if (match) {
    return {
      order: parseInt(match[1], 10),
      title: toTitleCase(match[2]),
    };
  }
  return {
    order: 999, // Default order for files without prefix
    title: toTitleCase(fileName),
  };
}

type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  order?: number;
};

export function generateNavData(): NavSectionProps['data'] {
  const files = import.meta.glob('/src/pages/docs/**/*.md');
  const filePaths = Object.keys(files);

  const rootItems: NavItem[] = [];
  const groups: Record<string, { items: NavItem[]; order: number }> = {};

  filePaths.forEach((path) => {
    // Remove prefix /src/pages/docs/ and suffix .md
    const relativePath = path.replace('/src/pages/docs/', '').replace('.md', '');
    const parts = relativePath.split('/');
    const fileName = parts[parts.length - 1];
    const { order: fileOrder, title } = getOrderAndTitle(fileName);

    // Clean up the path for linking (remove ordering prefixes from the URL path parts if desired,
    // OR keep them. Usually cleaner URLs are preferred, so let's strip prefixes for the path)
    const cleanRelativePath = parts.map((part) => part.replace(/^\d+\./, '')).join('/');

    const linkPath = `/docs/${cleanRelativePath}`;

    if (parts.length === 1) {
      // Root files
      rootItems.push({
        title,
        path: linkPath,
        icon: ICONS.file,
        order: fileOrder,
      });
    } else {
      // Grouped files (Level 1 folders)
      const groupNameRaw = parts[0];
      const { order: groupOrder, title: groupName } = getOrderAndTitle(groupNameRaw);

      if (!groups[groupName]) {
        groups[groupName] = { items: [], order: groupOrder };
      }

      if (parts.length === 2) {
        // File directly in group folder
        groups[groupName].items.push({
          title,
          path: linkPath,
          icon: ICONS.file,
          order: fileOrder,
        });
      } else if (parts.length === 3) {
        // Level 2 nested folder
        const subGroupNameRaw = parts[1];
        const { order: subGroupOrder, title: subGroupName } = getOrderAndTitle(subGroupNameRaw);

        let subGroup = groups[groupName].items.find(
          (item) => item.title === subGroupName && item.children
        );

        if (!subGroup) {
          subGroup = {
            title: subGroupName,
            path: '',
            icon: ICONS.folder,
            children: [],
            order: subGroupOrder,
          };
          groups[groupName].items.push(subGroup);
        }

        subGroup.children?.push({
          title,
          path: linkPath,
          order: fileOrder,
        });
      }
    }
  });

  // Helper to sort items by order then title
  const sortItems = (a: NavItem, b: NavItem) => {
    if (a.order !== b.order) {
      return (a.order ?? 999) - (b.order ?? 999);
    }
    return a.title.localeCompare(b.title);
  };

  // Sort root items
  rootItems.sort(sortItems);

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
  const sortedGroups = Object.keys(groups).sort((a, b) => {
    const orderA = groups[a].order;
    const orderB = groups[b].order;
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b);
  });

  sortedGroups.forEach((groupName) => {
    // Sort items within group
    groups[groupName].items.sort(sortItems);

    // Sort children of subgroups
    groups[groupName].items.forEach((item) => {
      if (item.children) {
        item.children.sort(sortItems);
      }
    });

    navData.push({
      subheader: groupName,
      items: groups[groupName].items,
    });
  });

  return navData;
}
