import mermaid from 'mermaid';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from '../iconify';

// Unique ID counter for mermaid diagrams
let mermaidCounter = 0;

export type MermaidBlockProps = {
  chart: string;
};

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      fontFamily: 'inherit',
      securityLevel: 'strict',
      themeVariables: isDark
        ? {
            primaryColor: '#3b82f6',
            primaryTextColor: '#f1f5f9',
            primaryBorderColor: '#60a5fa',
            secondaryColor: '#1e293b',
            tertiaryColor: '#334155',
            lineColor: '#94a3b8',
            textColor: '#e2e8f0',
            mainBkg: '#1e293b',
            nodeBorder: '#60a5fa',
            clusterBkg: '#1e293b',
            clusterBorder: '#475569',
            titleColor: '#f1f5f9',
            edgeLabelBackground: '#1e293b',
          }
        : {
            primaryColor: '#3b82f6',
            primaryTextColor: '#1e293b',
            primaryBorderColor: '#93c5fd',
            secondaryColor: '#eff6ff',
            tertiaryColor: '#dbeafe',
            lineColor: '#64748b',
            textColor: '#334155',
            mainBkg: '#eff6ff',
            nodeBorder: '#93c5fd',
            clusterBkg: '#f8fafc',
            clusterBorder: '#cbd5e1',
            titleColor: '#1e293b',
            edgeLabelBackground: '#ffffff',
          },
    });

    const id = `mermaid-${Date.now()}-${mermaidCounter++}`;

    mermaid
      .render(id, chart.trim())
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
        setError('');
      })
      .catch((err) => {
        setError(String(err?.message || err));
        setSvg('');
      });
  }, [chart, isDark]);

  const handleDownloadSvg = useCallback(() => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [svg]);

  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          my: 2,
          borderRadius: 1.5,
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          color: 'error.main',
          bgcolor: (theme) => theme.vars.palette.error.lighter,
          border: (theme) => `1px solid ${theme.vars.palette.error.light}`,
        }}
      >
        Mermaid 语法错误: {error}
      </Box>
    );
  }

  if (!svg) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          my: 3,
          py: 6,
          borderRadius: 2,
          bgcolor: 'background.neutral',
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '3px solid',
            borderColor: 'primary.main',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
            '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      className="mermaid-diagram"
      sx={{
        position: 'relative',
        my: 3,
        p: 3,
        borderRadius: 2,
        overflow: 'hidden',
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        bgcolor: isDark ? 'grey.900' : 'background.paper',
        transition: 'border-color 0.2s, background-color 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          '& .mermaid-actions': { opacity: 1 },
        },
        // Make SVG responsive and centered
        '& svg': {
          display: 'block',
          mx: 'auto',
          maxWidth: '100%',
          height: 'auto',
        },
      }}
    >
      {/* Action buttons */}
      <Box
        className="mermaid-actions"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          display: 'flex',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        <Tooltip title="下载 SVG" placement="top">
          <IconButton
            onClick={handleDownloadSvg}
            size="small"
            sx={{
              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              color: 'text.secondary',
              backdropFilter: 'blur(6px)',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)',
                color: 'primary.main',
              },
            }}
          >
            <Iconify icon="solar:download-bold" width={16} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Rendered diagram */}
      <Box ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />
    </Box>
  );
}
