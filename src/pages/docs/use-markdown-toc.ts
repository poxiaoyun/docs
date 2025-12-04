import GithubSlugger from 'github-slugger';
import { useState, useEffect } from 'react';

export type TocItem = {
  id: string;
  title: string;
  level: number;
};

export function useMarkdownToc(markdown: string) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const slugger = new GithubSlugger();
    const lines = markdown.split('\n');
    const items: TocItem[] = [];

    // Simple regex to match headings.
    // Note: This assumes standard markdown syntax with space after #
    // Also checking for code blocks to avoid matching # inside code
    let inCodeBlock = false;

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return;
      }

      if (inCodeBlock) return;

      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        // Remove markdown links/images from title if any for display
        // This is a basic cleanup; complex markdown in headers might need more
        const cleanTitle = title
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/`([^`]+)`/g, '$1');

        const id = slugger.slug(cleanTitle);

        items.push({
          id,
          title: cleanTitle,
          level,
        });
      }
    });

    setToc(items);
  }, [markdown]);

  return toc;
}
