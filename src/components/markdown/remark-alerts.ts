import type { Root, Text, Paragraph } from 'mdast';

import { visit } from 'unist-util-visit';

// ----------------------------------------------------------------------

/**
 * Remark plugin to transform custom alert syntax to HTML
 * 
 * Syntax:
 * :::info
 * Content here
 * :::
 * 
 * :::warning 自定义标题
 * Content here
 * :::
 */
export function remarkAlerts() {
  return (tree: Root) => {
    const alertBlocks: any[] = [];

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (!parent || index === undefined || !Array.isArray(parent.children)) return;

      const firstChild = node.children[0];
      if (firstChild?.type !== 'text') return;

      const text = (firstChild as Text).value;
      const startMatch = text.match(/^:::(info|success|warning|error|tip)(\s+(.+))?$/);

      if (startMatch) {
        const type = startMatch[1];
        const title = startMatch[3] || '';
        
        // Find the closing :::
        let endIndex = index + 1;
        const contentNodes: any[] = [];

        while (endIndex < parent.children.length) {
          const currentNode = parent.children[endIndex];
          
          if (currentNode.type === 'paragraph') {
            const firstText = currentNode.children?.[0];
            if (firstText?.type === 'text' && firstText.value.trim() === ':::') {
              break;
            }
          }
          
          contentNodes.push(currentNode);
          endIndex++;
        }

        if (endIndex < parent.children.length) {
          alertBlocks.push({
            parent,
            startIndex: index,
            endIndex,
            type,
            title,
            contentNodes,
          });
        }
      }
    });

    // Process in reverse order to avoid index shifting
    alertBlocks.reverse().forEach(({ parent, startIndex, endIndex, type, title, contentNodes }) => {
      // Create HTML node
      const htmlNode = {
        type: 'html',
        value: `<div data-alert="${type}" data-alert-title="${title || ''}">`,
      };

      const closeNode = {
        type: 'html',
        value: '</div>',
      };

      // Replace nodes
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
