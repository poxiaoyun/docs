import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { Panel, buttonSx, SectionHead, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 版式取自门户首页的卡片网格：深色面板、左上角标、底部通栏入口。
// 三张卡的文案沿用文档站原有那一版，只是补上了各自该指向的文档地址。

const RESOURCES = [
  {
    title: '开放 API / SDK',
    description: '标准化的开放接口与 SDK 示例，便于接入控制台、CI/CD、自动化测试。',
    action: '查看 API',
    to: '/reference/api-overview',
    icon: 'ic-product',
    color: '#a2d1ff',
  },
  {
    title: '系统模板与脚本',
    description: '复用官方模板与脚本仓库，快速引导管理员配置集群、网关与自定义镜像。',
    action: '下载模版',
    to: '/rune/resources/templates',
    icon: 'ic-subpaths',
    color: '#8affc1',
  },
  {
    title: '监控 & 反馈通道',
    description: '通过 Issue、飞书群与在线工单反馈问题，并获取实时更新。',
    action: '查看常见问题',
    to: '/reference/faq',
    icon: 'ic-chat',
    color: '#c599ff',
  },
];

export function HomeResourcesSection() {
  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 8, md: 12 } }}>
      <SectionShell component={MotionViewport} sx={{ px: { xs: 3, md: 5 } }}>
        <SectionHead
          align="center"
          label="Ecosystem & Resources"
          title="深入核心体系"
          copy="SDK、模板库与实时交流通道，形成开发者飞轮，助力 AI 业务从实验到生产环境的极速跨越。"
          sx={{ mb: { xs: 5, md: 7 } }}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {RESOURCES.map((resource) => (
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
                  to={resource.to}
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
