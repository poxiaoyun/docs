import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function HomeHeroSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 10, md: 15 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#000000',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // A modern grid background overlaid on black
          backgroundImage: `linear-gradient(${alpha('#ffffff', 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha('#ffffff', 0.05)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          maskImage: 'linear-gradient(to bottom, #000000, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000000, transparent)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg" component={MotionViewport} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={8} alignItems="center" textAlign="center">
          {/* Text Content */}
          <Stack spacing={3} alignItems="center">
            <m.div variants={varFade('inDown')}>
              <Box
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  color: theme.palette.primary.light,
                  typography: 'caption',
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                v2.0 Documentation Open Source
              </Box>
            </m.div>

            <m.div variants={varFade('inDown')}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  maxWidth: 900,
                  fontSize: { xs: '3rem', md: '4.5rem', lg: '5.5rem' },
                  lineHeight: 1.1,
                  background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.5) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                连接开发、运营与社区的 AI 平台
              </Typography>
            </m.div>

            <m.div variants={varFade('inDown')}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: alpha('#ffffff', 0.6), 
                  maxWidth: 680, 
                  fontWeight: 400,
                  lineHeight: 1.6 
                }}
              >
                Rune 智算平台提供模型开发、推理与工作负载管理能力；配合 Boss 平台实现精细化运营，魔哈仓库打造开放的社区底座，全方位提升 AI 应用构建效能。
              </Typography>
            </m.div>

            <m.div variants={varFade('inUp')}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/rune"
                  sx={{
                    bgcolor: 'common.white',
                    color: 'common.black',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.8),
                    },
                  }}
                >
                  开始使用
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/moha"
                  sx={{ 
                    color: 'common.white',
                    borderColor: alpha('#ffffff', 0.2),
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1.125rem',
                    borderRadius: 1.5,
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.05),
                      borderColor: '#ffffff',
                    }
                  }}
                >
                  探索魔哈模型库
                </Button>
              </Stack>
            </m.div>
          </Stack>

          {/* Terminal Mockup */}
          <m.div variants={varFade('inUp')} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 800,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#0a0a0a',
                border: `1px solid ${alpha('#ffffff', 0.1)}`,
                boxShadow: `0 20px 40px -10px ${alpha('#000', 0.5)}, 0 0 40px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
                textAlign: 'left',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: `1px solid ${alpha('#ffffff', 0.05)}`, bgcolor: '#111111' }}>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5F56' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27C93F' }} />
                </Stack>
                <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.3), ml: 2, flexGrow: 1, textAlign: 'center', mr: 5 }}>
                  ~ /rune-ai
                </Typography>
              </Box>
              <Box sx={{ p: 3, fontFamily: 'monospace', color: alpha('#ffffff', 0.8), fontSize: '0.875rem', lineHeight: 1.6 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <span style={{ color: theme.palette.primary.light }}>$</span>
                  <span style={{ color: '#fff' }}>pip install xiaoshiai-hub</span>
                </Box>
                <Box sx={{ color: alpha('#ffffff', 0.4), mt: 1, mb: 2 }}>
                  Successfully installed xiaoshiai-hub
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <span style={{ color: theme.palette.primary.light }}>$</span>
                  <span style={{ color: '#fff' }}>moha login</span>
                </Box>
                <Box sx={{ color: '#27C93F', mt: 1 }}>
                  ✔ Successfully logged in to Moha Hub
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <span style={{ color: theme.palette.primary.light }}>$</span>
                  <Box component="span" sx={{ 
                    color: '#fff', 
                    borderRight: '2px solid transparent', 
                    animation: 'blink 1s step-end infinite',
                    '@keyframes blink': { '50%': { borderColor: '#fff' } }
                  }}>
                    moha upload -t models -e --encryption-password &quot;your-password&quot; -a SM4  deepseek-ai/DeepSeek-V3
                  </Box>
                </Box>
              </Box>
            </Box>
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}
