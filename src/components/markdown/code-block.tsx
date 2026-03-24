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

  const handleCopy = useCallback(async () => {
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

    // Remember current scroll position to avoid focus/selection causing a jump
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Try modern clipboard API first, then fallback to execCommand for older/insecure contexts
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: create a temporary textarea, focus/select and copy
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);

        // Try focusing without scrolling when supported
        try {
          (textarea as any).focus({ preventScroll: true });
        } catch {
          textarea.focus();
        }

        textarea.select();
        try {
          textarea.setSelectionRange(0, textarea.value.length);
        } catch {
          // Some browsers may throw on setSelectionRange for readonly inputs; ignore
        }

        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!ok) {
          throw new Error('execCommand copy returned false');
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Silently fail but keep UX stable — could add telemetry or toast here
      console.warn('copy to clipboard failed', err);
    } finally {
      // Restore scroll position in case focus/select caused a jump
      try {
        window.scrollTo(scrollX, scrollY);
      } catch {
        // ignore
      }
    }
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
