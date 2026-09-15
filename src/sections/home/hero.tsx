import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS, HERO_GRADIENT } from './tokens';
import { Overline, Terminal, buttonSx, SectionShell } from './primitives';

// ----------------------------------------------------------------------

const TERMINAL_LINES = [
  { kind: 'cmd' as const, text: 'pip install xiaoshiai-hub' },
  { kind: 'dim' as const, text: 'Successfully installed xiaoshiai-hub' },
  { kind: 'cmd' as const, text: 'moha login' },
  { kind: 'success' as const, text: '✔ Successfully logged in to Moha Hub' },
  {
    kind: 'cmd' as const,
    text: 'moha upload -t models -e --encryption-password "your-password" -a SM4 deepseek-ai/DeepSeek-V4',
  },
];

export function HomeHeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: TOKENS.bgPage,
        color: TOKENS.text,
      }}
    >
      {/* 背景：门户首页那层 72px 细格线 + 顶部中央的径向微光 */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)`,
          backgroundSize: `${TOKENS.gridSize} ${TOKENS.gridSize}`,
          maskImage: 'linear-gradient(to bottom, #000 0%, #00000055 60%, #0000 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #00000055 60%, #0000 100%)',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1100px, 120%)',
          height: '70%',
          pointerEvents: 'none',
          background: `radial-gradient(closest-side, ${TOKENS.accent}14, transparent), radial-gradient(closest-side, ${TOKENS.rune}12, transparent)`,
          backgroundPosition: '30% 40%, 72% 30%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '60% 100%, 55% 100%',
        }}
      />

      <SectionShell
        component={MotionViewport}
        sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 12 }, pb: { xs: 10, md: 14 } }}
      >
        <Stack alignItems="center" textAlign="center" spacing={{ xs: 3, md: 4 }} sx={{ px: { xs: 3, md: 5 } }}>
          <m.div variants={varFade('inDown')}>
            <Overline>v2.0 Documentation Open Source</Overline>
          </m.div>

          <m.div variants={varFade('inDown')}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 650,
                lineHeight: 1.06,
                letterSpacing: 0,
                fontSize: 'clamp(2.5rem, 5.6vw, 4.6rem)',
                maxWidth: '20ch',
              }}
            >
              连接开发、运营与社区的
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: HERO_GRADIENT,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                AI 平台
              </Box>
            </Typography>
          </m.div>

          <m.div variants={varFade('inDown')}>
            <Typography
              sx={{
                color: TOKENS.textSubtle,
                fontSize: 'clamp(1rem, 1.35vw, 1.15rem)',
                lineHeight: 1.7,
                maxWidth: '46rem',
                mx: 'auto',
              }}
            >
              Rune 智算平台提供模型开发、推理与工作负载管理能力；配合 Boss
              平台实现精细化运营，魔哈仓库打造开放的社区底座，全方位提升 AI 应用构建效能。
            </Typography>
          </m.div>

          <m.div variants={varFade('inUp')}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ pt: { xs: 1, md: 2 } }}
            >
              <Button component={RouterLink} to="/rune" sx={buttonSx('primary')}>
                开始使用
              </Button>
              <Button component={RouterLink} to="/moha" sx={buttonSx('secondary')}>
                探索魔哈模型库
              </Button>
            </Stack>
          </m.div>

          <m.div
            variants={varFade('inUp')}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Terminal path="~/moha" sx={{ width: '100%', maxWidth: 760, mt: { xs: 2, md: 3 } }}>
              {TERMINAL_LINES.map((line, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', minWidth: 0 }}
                >
                  {line.kind === 'cmd' ? (
                    <Box component="span" sx={{ color: TOKENS.termInfo, flexShrink: 0 }}>
                      $
                    </Box>
                  ) : null}
                  <Box
                    component="span"
                    sx={{
                      minWidth: 0,
                      wordBreak: 'break-word',
                      color:
                        line.kind === 'success'
                          ? TOKENS.termSuccess
                          : line.kind === 'dim'
                            ? '#ffffff45'
                            : '#ffffffc2',
                    }}
                  >
                    {/*
                      每个参数包成一个不可断的整体：命令在终端宽度里放不下时，
                      在参数之间折行，而不是把 deepseek-ai/DeepSeek-V4 从中间切开
                      （- 和 / 在浏览器眼里都是断行点）。空格留在 span 外面当断点。
                    */}
                    {line.text.split(' ').flatMap((word, wordIndex, words) => {
                      const node = (
                        <Box key={`w-${wordIndex}`} component="span" sx={{ whiteSpace: 'nowrap' }}>
                          {word}
                        </Box>
                      );
                      return wordIndex < words.length - 1 ? [node, ' '] : [node];
                    })}
                  </Box>
                </Box>
              ))}
            </Terminal>
          </m.div>
        </Stack>
      </SectionShell>
    </Box>
  );
}
