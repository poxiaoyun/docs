import type { NavSectionProps } from 'src/components/nav-section';

import matter from 'gray-matter';

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

type FolderMeta = {
  title: string;
  [key: string]: string;
};

// Store for file/folder titles loaded from all md files
// Structure: { 'file/path': { title: 'raw title', ... } }
const fileMetadata: Record<string, FolderMeta> = {};

function loadAllTitles() {
  // Load all markdown files to get their frontmatter
  const allFiles = import.meta.glob('/src/pages/docs/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  });

  Object.entries(allFiles).forEach(([path, content]) => {
    const { data } = matter(content as string);

    // Handle folder metadata (index.md)
    if (path.endsWith('/index.md')) {
      if (data.title) {
        const folderPath = path.replace('/index.md', '');
        const relativeFolderPath = folderPath.replace('/src/pages/docs/', '');

        const storageKey = path.includes('index-en.md')
          ? `${relativeFolderPath}-en`
          : relativeFolderPath;

        fileMetadata[storageKey] = {
          title: data.title,
        };
      }
    }

    // Handle individual file metadata
    // /src/pages/docs/intro.md -> intro
    // /src/pages/docs/intro-en.md -> intro-en
    const relativeFilePath = path.replace('/src/pages/docs/', '').replace('.md', '');
    if (data.title) {
      fileMetadata[relativeFilePath] = {
        title: data.title,
      };
    }
  });
}

// Initialize titles
try {
  loadAllTitles();
} catch (error) {
  console.error('Failed to load titles:', error);
}

function getOrderAndTitle(
  fileName: string,
  fullRelativePath?: string
): { order: number; title: string } {
  // Check metadata using the full path (including lang folder)
  if (fullRelativePath && fileMetadata[fullRelativePath]) {
    const meta = fileMetadata[fullRelativePath];
    const match = fileName.match(/^(\d+)\.(.+)/);
    const order = match ? parseInt(match[1], 10) : 999;
    return { order, title: meta.title };
  }

  // Fallback
  const cleanName = fileName.replace(/-en$/, '');
  const match = cleanName.match(/^(\d+)\.(.+)/);
  if (match) {
    return {
      order: parseInt(match[1], 10),
      title: toTitleCase(match[2]),
    };
  }
  return {
    order: 999,
    title: toTitleCase(cleanName),
  };
}

type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  order?: number;
};

export function generateNavData(currentLang: string): NavSectionProps['data'] {
  const files = import.meta.glob('/src/pages/docs/**/*.md');
  const filePaths = Object.keys(files);

  const rootItems: NavItem[] = [];
  const groups: Record<string, { items: NavItem[]; order: number }> = {};

  // Helper to process a path and add it to nav structure
  const processPath = (path: string, lang: string) => {
    // /src/pages/docs/cn/01.guide.md
    const relativePath = path.replace('/src/pages/docs/', '').replace('.md', '');

    // Filter by language folder
    if (!relativePath.startsWith(`${lang}/`)) return;

    // Remove language prefix for navigation structure
    // cn/01.guide -> 01.guide
    const navRelativePath = relativePath.substring(lang.length + 1);

    // Skip index.md files (they are metadata holders for folders)
    if (navRelativePath.endsWith('/index')) return;

    const parts = navRelativePath.split('/');
    const fileName = parts[parts.length - 1];

    // Get title using the original relative path (including lang) to look up correct metadata
    const { order: fileOrder, title } = getOrderAndTitle(fileName, relativePath);

    // Link path should be the clean path without ordering numbers
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

      // Find title for the group folder
      // We need to look up metadata for `${lang}/${groupNameRaw}`
      const groupMetadataPath = `${lang}/${groupNameRaw}`;
      const { order: groupOrder, title: groupName } = getOrderAndTitle(
        groupNameRaw,
        groupMetadataPath
      );

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
        const subGroupMetadataPath = `${lang}/${groupNameRaw}/${subGroupNameRaw}`;
        const { order: subGroupOrder, title: subGroupName } = getOrderAndTitle(
          subGroupNameRaw,
          subGroupMetadataPath
        );

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
  };

  // Determine language folder
  const targetLang = currentLang === 'en' ? 'en' : 'cn';
  const fallbackLang = 'cn';

  // We iterate files. If we are in English mode, we look for English files.
  // But we also need to find files that ONLY exist in Chinese and show them (fallback).
  // Strategy:
  // 1. Collect all potential logical paths (stripped of lang prefix) from ALL files.
  // 2. For each logical path, try to use targetLang version.
  // 3. If not found, use fallbackLang version.

  const logicalPaths = new Set<string>();

  filePaths.forEach((path) => {
    const rel = path.replace('/src/pages/docs/', '').replace('.md', '');
    if (rel.startsWith('cn/')) logicalPaths.add(rel.substring(3));
    if (rel.startsWith('en/')) logicalPaths.add(rel.substring(3));
  });

  logicalPaths.forEach((logicalPath) => {
    // Check if target lang exists
    const targetPath = `/src/pages/docs/${targetLang}/${logicalPath}.md`;
    if (filePaths.includes(targetPath)) {
      processPath(targetPath, targetLang);
      return;
    }

    // Fallback
    if (targetLang !== fallbackLang) {
      const fallbackPath = `/src/pages/docs/${fallbackLang}/${logicalPath}.md`;
      if (filePaths.includes(fallbackPath)) {
        processPath(fallbackPath, fallbackLang);
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
      subheader: currentLang === 'en' ? 'Getting Started' : '开始使用',
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
