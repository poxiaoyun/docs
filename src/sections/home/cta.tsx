import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS, HERO_GRADIENT } from './tokens';
import { Panel, buttonSx, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 版式取自门户首页底部的行动号召：整块圆角面板 + 居中排版 + 底部数据条。

const STATS = [
  { value: '3', label: '产品线' },
  { value: '50+', label: '功能模块' },
  { value: '24/7', label: '社区支持' },
];

export function HomeCtaSection() {
  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 8, md: 12 } }}>
      <SectionShell component={MotionViewport} sx={{ px: { xs: 3, md: 5 } }}>
        <Panel sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 }, overflow: 'hidden' }}>
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: '-40%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(760px, 120%)',
              height: '90%',
              pointerEvents: 'none',
              background: `radial-gradient(closest-side, ${TOKENS.accent}1a, transparent)`,
            }}
          />

          <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" textAlign="center" sx={{ position: 'relative' }}>
            <m.div variants={varFade('inDown')}>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 650,
                  lineHeight: 1.1,
                  fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                  background: HERO_GRADIENT,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                准备好开始了吗？
              </Typography>
            </m.div>

            <m.div variants={varFade('inDown')}>
              <Typography
                sx={{ color: TOKENS.textSubtle, fontSize: 'clamp(1rem, 1.3vw, 1.1rem)', lineHeight: 1.7, maxWidth: '34rem' }}
              >
                立即探索 Rune、Boss 及 魔哈，开启您的 AI 平台之旅
              </Typography>
            </m.div>

            <m.div variants={varFade('inUp')}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button component={RouterLink} to="/rune" sx={{ ...buttonSx('primary'), px: '2rem', py: '.9rem' }}>
                  查看文档
                </Button>
                <Button component={RouterLink} to="/moha" sx={{ ...buttonSx('secondary'), px: '2rem', py: '.9rem' }}>
                  加入社区
                </Button>
              </Stack>
            </m.div>

            <m.div variants={varFade('inUp')} style={{ width: '100%' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 3, sm: 8 }}
                justifyContent="center"
                sx={{ pt: { xs: 4, md: 5 }, mt: { xs: 2, md: 3 }, borderTop: `1px solid ${TOKENS.borderFaint}` }}
              >
                {STATS.map((stat) => (
                  <Stack key={stat.label} spacing={.5} alignItems="center">
                    <Typography sx={{ fontSize: '1.9rem', fontWeight: 700, color: TOKENS.text, lineHeight: 1.1 }}>
                      {stat.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: TOKENS.fontMono,
                        fontSize: '.7rem',
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: TOKENS.textDim,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </m.div>
          </Stack>
        </Panel>
      </SectionShell>
    </Box>
  );
}
