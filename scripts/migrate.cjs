const fs = require('fs');
const path = require('path');

function migrateFile(sourcePath, destPath, options = {}) {
  let content = fs.readFileSync(sourcePath, 'utf-8');
  const { titlePrefix = '' } = options;

  // 1. Process Frontmatter
  let title = '';
  // Check if it already has frontmatter
  if (content.startsWith('---')) {
    const parts = content.split('---');
    if (parts.length >= 3) {
      const fm = parts[1];
      const titleMatch = fm.match(/title:\s*(.+)/);
      if (titleMatch) title = titleMatch[1].replace(/['"]/g, '');
    }
  } else {
    // Try to extract H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      title = h1Match[1];
      // remove H1 from content
      content = content.replace(/^#\s+(.+)$/m, '');
    } else {
      title = path.basename(sourcePath, '.md');
    }
    
    // Add frontmatter
    const date = new Date().toISOString().split('T')[0];
    const frontmatter = `---
title: '${titlePrefix}${title}'
updated: '${date}'
---

`;
    content = frontmatter + content.trimStart();
  }

  // 2. Convert VitePress containers :::tip, :::info, etc to remark-alerts
  content = content.replace(/:::(\w+)\s*(.*?)\n([\s\S]*?):::/g, (match, type, title, body) => {
    let alertType = type.toUpperCase();
    if (alertType === 'INFO' || alertType === 'TIP' || alertType === 'WARNING' || alertType === 'ERROR' || alertType === 'SUCCESS') {
      const lines = body.trim().split('\n');
      const prefix = `> [!${alertType}]${title ? ` ${title}` : ''}\n`;
      return prefix + lines.map(line => `> ${line}`).join('\n') + '\n';
    }
    return match;
  });

  // 3. Fix image paths
  // Vitepress: ![](/screenshots/...) or !(./screenshots/...)
  // We want to map them to `/assets/screenshots/...`
  content = content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
    let newUrl = url;
    if (url.includes('screenshots/')) {
        let base = url.substring(url.indexOf('screenshots/'));
        newUrl = `/assets/${base}`;
    }
    return `![${alt}](${newUrl})`;
  });

  // 4. Update relative links? (This is hard to do perfectly via regex, might need manual tweaks or basic replace)
  // Let's rely on basic markdown href replace for now
  content = content.replace(/\]\((.*?\.md)\)/g, (match, url) => {
    if (url.startsWith('http')) return match;
    // VERY simple assumption: convert relative md path to /docs/...
    // Let's skip automatic rewrite for now to avoid breaking things, we'll manually fix or leave it as is 
    // unless they specifically refer to cross-module. Actually, Vite Router or React Router needs it.
    // It's better to clean .md extension but relative path might be ok for React Markdown?
    // Let's strip .md from the end:
    return `](${url.replace(/\.md$/, '')})`;
  });

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content, 'utf-8');
  console.log(`Migrated: ${sourcePath} -> ${destPath}`);
}

module.exports = { migrateFile };
