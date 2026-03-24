import type { Root, Text, Paragraph } from 'mdast';

import { visit } from 'unist-util-visit';

// ----------------------------------------------------------------------

const ALERT_RE = /^:::(info|success|warning|error|tip)(?:\s+([^\n]+))?\n/;

/**
 * Remark plugin to transform custom alert syntax to HTML
 *
 * Supports two forms:
 *
 * 1. Inline (no blank lines — most common):
 *    :::tip
 *    Content here
 *    :::
 *
 * 2. Multi-paragraph (blank lines around content):
 *    :::warning 自定义标题
 *
 *    Content here
 *
 *    :::
 */
export function remarkAlerts() {
  return (tree: Root) => {
    const alertBlocks: any[] = [];

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (!parent || index === undefined || !Array.isArray(parent.children)) return;

      const firstChild = node.children[0];
      if (firstChild?.type !== 'text') return;

      const text = (firstChild as Text).value;

      // --- Case 1: self-contained block inside a single paragraph ---
      // When :::type, content, and ::: are on consecutive lines WITHOUT blank
      // lines, remark merges them into one paragraph text node.
      const inlineMatch = text.match(ALERT_RE);
      if (inlineMatch) {
        const lastChild = node.children[node.children.length - 1];
        if (lastChild?.type === 'text' && /\n:::[ \t]*$/.test((lastChild as Text).value)) {
          const type = inlineMatch[1];
          const title = inlineMatch[2] || '';

          // Clone children, strip the opening / closing markers
          const contentChildren: any[] = node.children.map((c) => ({ ...c }));

          // Strip :::type line from first child
          (contentChildren[0] as Text).value = (contentChildren[0] as Text).value.slice(
            inlineMatch[0].length
          );

          // Strip \n::: from last child (may be the same node when there is only one)
          const lastIdx = contentChildren.length - 1;
          (contentChildren[lastIdx] as Text).value = (
            contentChildren[lastIdx] as Text
          ).value.replace(/\n:::[ \t]*$/, '');

          // Drop empty text nodes that may result from stripping
          const filtered = contentChildren.filter(
            (c: any) => c.type !== 'text' || (c as Text).value !== ''
          );

          alertBlocks.push({
            parent,
            startIndex: index,
            endIndex: index,
            type,
            title,
            contentNodes: [
              { type: 'paragraph', children: filtered.length ? filtered : [{ type: 'text', value: '' }] },
            ],
          });
          return;
        }
      }

      // --- Case 2: multi-paragraph block (blank lines separate them) ---
      const startMatch = text.match(/^:::(info|success|warning|error|tip)(\s+(.+))?$/);
      if (startMatch) {
        const type = startMatch[1];
        const title = startMatch[3] || '';

        let endIndex = index + 1;
        const contentNodes: any[] = [];

        while (endIndex < parent.children.length) {
          const currentNode = parent.children[endIndex];
          if (
            currentNode.type === 'paragraph' &&
            (currentNode as Paragraph).children?.[0]?.type === 'text' &&
            ((currentNode as Paragraph).children[0] as Text).value.trim() === ':::'
          ) {
            break;
          }
          contentNodes.push(currentNode);
          endIndex++;
        }

        if (endIndex < parent.children.length) {
          alertBlocks.push({ parent, startIndex: index, endIndex, type, title, contentNodes });
        }
      }
    });

    // Process in reverse order to avoid index shifting
    alertBlocks.reverse().forEach(({ parent, startIndex, endIndex, type, title, contentNodes }) => {
      const htmlNode = {
        type: 'html',
        value: `<div data-alert="${type}" data-alert-title="${title || ''}">`,
      };
      const closeNode = {
        type: 'html',
        value: '</div>',
      };

      parent.children.splice(
        startIndex,
        endIndex - startIndex + 1,
        htmlNode,
        ...contentNodes,
        closeNode
      );
    });
  };
}
