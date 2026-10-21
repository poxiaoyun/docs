import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useLangHref } from 'src/utils/doc-lang';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { resourcesOf, useHomeCopy } from './home-copy';
import { Panel, buttonSx, SectionHead, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 版式取自门户首页的卡片网格：深色面板、左上角标、底部通栏入口。
// 三张卡的文案来自 home-copy.json，图标与色值按入口路径在 home-copy.ts 里补齐。

export function HomeResourcesSection() {
  const copy = useHomeCopy();
  const langHref = useLangHref();
  const resources = resourcesOf(copy);

  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 8, md: 12 } }}>
      <SectionShell component={MotionViewport} sx={{ px: { xs: 3, md: 5 } }}>
        <SectionHead
          align="center"
          label={copy.resources.label}
          title={copy.resources.title}
          copy={copy.resources.copy}
          sx={{ mb: { xs: 5, md: 7 } }}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {resources.map((resource) => (
            <m.div key={resource.title} variants={varFade('inUp')} style={{ display: 'flex' }}>
              <Panel
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: 1,
                  p: 3.5,
                  transition: `border-color .32s ${TOKENS.easeOut}, transform .32s ${TOKENS.easeOut}`,
                  '&:hover': {
                    borderColor: TOKENS.borderDefault,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.4rem',
                    height: '2.4rem',
                    borderRadius: TOKENS.radiusXxs,
                    border: `1px solid ${resource.color}33`,
                    bgcolor: `${resource.color}14`,
                    mb: 3,
                    flexShrink: 0,
                  }}
                >
                  <SvgColor
                    src={`${CONFIG.assetsDir}/assets/icons/navbar/${resource.icon}.svg`}
                    sx={{ width: 18, height: 18, color: resource.color }}
                  />
                </Box>

                <Typography
                  component="h3"
                  sx={{ fontSize: '1.15rem', fontWeight: 600, color: TOKENS.text, mb: 1.5 }}
                >
                  {resource.title}
                </Typography>

                <Typography sx={{ color: TOKENS.textSubtle, fontSize: '.85rem', lineHeight: 1.7, mb: 3 }}>
                  {resource.description}
                </Typography>

                <Box
                  component={RouterLink}
                  to={langHref(resource.to)}
                  sx={{
                    ...buttonSx('secondary'),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto',
                    px: '1rem',
                    py: '.7rem',
                    fontSize: '.8rem',
                    textDecoration: 'none',
                    borderColor: TOKENS.borderFaint,
                    '& .arrow': { transition: `transform .18s ${TOKENS.easeOut}` },
                    '&:hover .arrow': { transform: 'translateX(.25rem)' },
                  }}
                >
                  <span>{resource.action}</span>
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
