import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useLangHref } from 'src/utils/doc-lang';

import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { platformsOf, useHomeCopy } from './home-copy';
import { Panel, buttonSx, SectionHead, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 版式取自门户首页的四产品卡片区（四列深色面板 + 底部通栏入口）。
// 文案（含四条产品线）来自 home-copy.json，中英共用同一套版式。

// ----------------------------------------------------------------------

export function HomeCapabilitiesSection() {
  const copy = useHomeCopy();
  const langHref = useLangHref();
  const platforms = platformsOf(copy);

  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 8, md: 12 } }}>
      <SectionShell component={MotionViewport} sx={{ px: { xs: 3, md: 5 } }}>
        <SectionHead
          label={copy.capabilities.label}
          title={copy.capabilities.title}
          copy={copy.capabilities.copy}
          sx={{ mb: { xs: 5, md: 7 } }}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
          }}
        >
          {platforms.map((platform) => (
            <m.div key={platform.name} variants={varFade('inUp')} style={{ display: 'flex' }}>
              <Panel sx={{ display: 'flex', flexDirection: 'column', p: 3, width: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: '.5rem',
                      height: '.5rem',
                      borderRadius: '50%',
                      bgcolor: platform.color,
                      boxShadow: `0 0 12px ${platform.color}`,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: TOKENS.fontMono,
                      fontSize: '.78rem',
                      fontWeight: 600,
                      letterSpacing: '.08em',
                      color: TOKENS.text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {platform.name}
                  </Typography>
                </Stack>

                <Typography sx={{ color: TOKENS.textSubtle, fontSize: '.82rem', lineHeight: 1.7, mb: 3 }}>
                  {platform.tagline}
                </Typography>

                <Stack sx={{ mt: 'auto' }}>
                  {platform.entries.map((entry, index) => (
                    <Box
                      key={entry.to}
                      component={RouterLink}
                      to={langHref(entry.to)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        py: '.7rem',
                        borderTop: `1px solid ${TOKENS.borderFaint}`,
                        textDecoration: 'none',
                        color: TOKENS.textDefault,
                        transition: `color .18s ${TOKENS.easeStandard}`,
                        '&:hover': { color: TOKENS.text, '& .entry-index': { color: platform.color } },
                      }}
                    >
                      <Typography sx={{ fontSize: '.8rem', color: 'inherit', minWidth: 0 }}>
                        {entry.title}
                      </Typography>
                      <Typography
                        className="entry-index"
                        sx={{
                          fontFamily: TOKENS.fontMono,
                          fontSize: '.68rem',
                          color: TOKENS.textDim,
                          flexShrink: 0,
                          transition: `color .18s ${TOKENS.easeStandard}`,
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Box
                  component={RouterLink}
                  to={langHref(platform.to)}
                  sx={{
                    ...buttonSx('secondary'),
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                    px: '1rem',
                    py: '.7rem',
                    fontSize: '.8rem',
                    textDecoration: 'none',
                    '& .arrow': { transition: `transform .18s ${TOKENS.easeOut}` },
                    '&:hover .arrow': { transform: 'translateX(.25rem)' },
                  }}
                >
                  <span>{platform.cta}</span>
                  <span className="arrow" aria-hidden>
                    →
                  </span>
                </Box>
              </Panel>
            </m.div>
          ))}
        </Box>
      </SectionShell>
    </Box>
  );
}
