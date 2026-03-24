import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

const RESOURCES = [
  {
    title: '开放 API / SDK',
    description: '标准化的开放接口与 SDK 示例，便于接入控制台、CI/CD、自动化测试。',
    action: '查看 API',
    icon: 'ic-product',
    color: '#1877F2',
  },
  {
    title: '系统模板与脚本',
    description: '复用官方模板与脚本仓库，快速引导管理员配置集群、网关与自定义镜像。',
    action: '下载模版',
    icon: 'ic-subpaths',
    color: '#00A76F',
  },
  {
    title: '监控 & 反馈通道',
    description: '通过 Issue、飞书群与在线工单反馈问题，并获取实时更新。',
    action: '加入社区',
    icon: 'ic-chat',
    color: '#7635DC',
  },
];

export function HomeResourcesSection() {
  return (
    <Box sx={{ bgcolor: '#000000', color: 'common.white', py: { xs: 8, md: 15 } }}>
      <Container component={MotionViewport} maxWidth="lg">
        <Stack spacing={2} sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <m.div variants={varFade('inDown')}>
            <Typography variant="overline" sx={{ color: alpha('#ffffff', 0.5), letterSpacing: 2 }}>
              ECOSYSTEM & RESOURCES
            </Typography>
          </m.div>
          <m.div variants={varFade('inDown')}>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>深入核心体系</Typography>
          </m.div>
          <m.div variants={varFade('inDown')}>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.6), maxWidth: 640, mx: 'auto' }}>
              SDK、模板库与实时交流通道，形成开发者飞轮，助力 AI 业务从实验到生产环境的极速跨越。
            </Typography>
          </m.div>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {RESOURCES.map((resource, index) => (
            <m.div key={resource.title} variants={varFade('inUp')}>
              <Box
                sx={{
                  bgcolor: '#0a0a0a',
                  border: `1px solid ${alpha('#ffffff', 0.1)}`,
                  borderRadius: 3,
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 3,
                    padding: '1px',
                    background: `linear-gradient(45deg, transparent, ${alpha(resource.color, 0.5)}, transparent)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 10px 30px -10px ${alpha(resource.color, 0.4)}`,
                    '&::before': { opacity: 1 },
                  }
                }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(resource.color, 0.1),
                    }}
                  >
                    <SvgColor
                      src={`${CONFIG.assetsDir}/assets/icons/navbar/${resource.icon}.svg`}
                      sx={{ width: 24, height: 24, color: resource.color }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6), lineHeight: 1.6 }}>
                    {resource.description}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    mt: 4,
                    color: resource.color,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {resource.action}
                  <Box component="span" sx={{ ml: 1, transition: 'transform 0.2s', '.MuiBox-root:hover &': { transform: 'translateX(4px)' } }}>
                    &rarr;
                  </Box>
                </Box>
              </Box>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
