import type { TocItem } from './use-markdown-toc';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

type Props = {
  toc: TocItem[];
};

export function Toc({ toc }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // Simple active state detection based on scroll position
      // Find the last header that is above the viewport center
      let currentId = '';
      const offset = 100; 

      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (element && window.scrollY + offset >= element.offsetTop) {
          currentId = item.id;
        }
      }

      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  if (!toc.length) return null;

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 80, // Adjust based on header height
        width: '100%',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        pl: 2,
      }}
    >

      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {toc.map((item) => (
          <Box component="li" key={item.id} sx={{ mb: 1 }}>
            <Link
              href={`#${item.id}`}
              color="inherit"
              underline="none"
              sx={{
                display: 'block',
                fontSize: '0.875rem',
                color: activeId === item.id ? 'primary.main' : 'text.secondary',
                fontWeight: activeId === item.id ? 'fontWeightBold' : 'fontWeightMedium',
                pl: (item.level - 1) * 2,
                borderLeft: (theme) => `2px solid ${activeId === item.id ? theme.palette.primary.main : 'transparent'}`,
                ml: -2,
                paddingLeft: (theme) => `calc(${theme.spacing((item.level - 1) * 2)} + ${theme.spacing(2)} - 2px)`,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  const offset = 80; // Header offset
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = element.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                  window.history.pushState(null, '', `#${item.id}`);
                }
              }}
            >
              {item.title}
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

