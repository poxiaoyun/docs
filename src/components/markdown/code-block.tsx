import { useState, Children, useCallback, cloneElement, isValidElement } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { Iconify } from '../iconify';
import { markdownClasses } from './classes';

// ----------------------------------------------------------------------

type CodeBlockProps = {
  children: React.ReactNode;
};

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    // Extract text content from children
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (!node) return '';
      
      if (Array.isArray(node)) {
        return node.map(extractText).join('');
      }
      
      if (isValidElement(node)) {
        return extractText((node.props as any).children);
      }
      
      return '';
    };

    const text = extractText(children);
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  return (
    <Box
      className={markdownClasses.content.codeBlock}
      sx={{
        position: 'relative',
        '&:hover .copy-button': {
          opacity: 1,
        },
      }}
    >
      <Tooltip title={copied ? '已复制!' : '复制代码'} placement="top">
        <IconButton
          className="copy-button"
          onClick={handleCopy}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            opacity: 0,
            transition: 'opacity 0.2s',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            color: 'grey.400',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'grey.300',
            },
          }}
        >
          <Iconify 
            icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'} 
            width={18} 
          />
        </IconButton>
      </Tooltip>
      <pre>
        {Children.map(children, (child) =>
          isValidElement(child) ? cloneElement(child as any, { isBlock: true }) : child
        )}
      </pre>
    </Box>
  );
}
