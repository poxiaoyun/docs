import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const METRICS = [
  { label: '已发布模型版本', value: '2.3K+' },
  { label: '累计推理调用', value: '48M+' },
  { label: '企业租户', value: '320+' },
];

const CTA_BUTTONS = [
  { label: '立即体验', href: '/docs/rune', variant: 'contained' as const },
  { label: '查看文档', href: '/docs/introduction', variant: 'outlined' as const },
];

// ----------------------------------------------------------------------

export function HomeHeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: 'common.white',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.grey[900]} 60%)`,
        py: { xs: 10, md: 16 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.72 }}>
            Rune Docs · ModelScope Inspired
          </Typography>

          <Typography variant="h2" sx={{ maxWidth: 800, fontWeight: 700 }}>
            统一的 AI 平台文档，连接
            <Box component="span" sx={{ color: 'success.light' }}>
              开发、运营与社区
            </Box>
          </Typography>

          <Typography variant="body1" sx={{ maxWidth: 720, opacity: 0.8 }}>
            从模型研发到平台治理，再到社区协作，一站式查阅 Rune · BOSS ·
            魔哈仓库的产品能力与最佳实践。
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {CTA_BUTTONS.map((button) => (
              <Button
                key={button.label}
                component={RouterLink}
                to={button.href}
                size="large"
                variant={button.variant}
                color="inherit"
                sx={{ color: button.variant === 'outlined' ? 'common.white' : undefined }}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          }}
        >
          {METRICS.map((metric) => (
            <Paper
              key={metric.label}
              sx={{
                px: 3,
                py: 4,
                height: '100%',
                bgcolor: 'rgba(255,255,255,0.08)',
                borderColor: 'rgba(255,255,255,0.16)',
                borderWidth: 1,
                borderStyle: 'solid',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Typography variant="h3" sx={{ fontFamily: 'Barlow, sans-serif' }}>
                {metric.value}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.72 }}>
                {metric.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      <SvgColor
        src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-blank.svg`}
        sx={{
          position: 'absolute',
          width: 320,
          height: 320,
          opacity: 0.08,
          right: -40,
          bottom: -40,
        }}
      />
    </Box>
  );
}
