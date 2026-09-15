import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { Panel, buttonSx, SectionHead, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 版式取自门户首页的四产品卡片区（四列深色面板 + 底部通栏入口）。
// 内容仍是文档站自己的四条产品线入口 —— 门户有四块，文档站原先只写了三块，
// 这里把缺的「聚合网关」补上。

type Platform = {
  name: string;
  tagline: string;
  color: string;
  to: string;
  cta: string;
  entries: { title: string; to: string }[];
};

const PLATFORMS: Platform[] = [
  {
    name: 'Rune 智算平台',
    tagline: '大规模 AI 推理与工作负载调度。无缝管理实例、镜像与存储计算一体化配额资源。',
    color: TOKENS.rune,
    to: '/rune',
    cta: '进入 Rune 文档',
    entries: [
      { title: '开始使用', to: '/rune/guide' },
      { title: 'Rune 控制台', to: '/rune/console' },
      { title: '资源与配额', to: '/rune/resources' },
    ],
  },
  {
    name: '魔哈仓库',
    tagline: '模型与数据集的社区仓库体系。实现优雅的版本流转与开源协作。',
    color: TOKENS.moha,
    to: '/moha',
    cta: '进入魔哈文档',
    entries: [
      { title: '模型仓库', to: '/moha/models' },
      { title: '数据集', to: '/moha/datasets' },
      { title: 'SDK 教程', to: '/moha/sdk-tutorial' },
    ],
  },
  {
    name: '聚合网关',
    tagline:
      '平台内置的网页版对话与模型调用入口。不用写代码就能和模型对话，也能为外部程序签发密钥，统一查看调用量与费用。',
    color: TOKENS.airouter,
    to: '/airouter',
    cta: '进入聚合网关文档',
    entries: [
      { title: '模型体验', to: '/airouter/experience' },
      { title: 'API 密钥', to: '/airouter/token' },
      { title: '调用分析', to: '/airouter/usage-statistics' },
    ],
  },
  {
    name: 'Boss 运营平台',
    tagline: '专为平台管理员设计，实现跨集群治理、租户网关审核和强效策略分发。',
    color: TOKENS.boss,
    to: '/boss',
    cta: '进入 BOSS 文档',
    entries: [
      { title: '首页', to: '/boss/dashboard' },
      { title: '大模型网关', to: '/boss/gateway' },
      { title: '账户管理', to: '/boss/iam' },
    ],
  },
];

// ----------------------------------------------------------------------

export function HomeCapabilitiesSection() {
  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 8, md: 12 } }}>
      <SectionShell component={MotionViewport} sx={{ px: { xs: 3, md: 5 } }}>
        <SectionHead
          label="CORE PLATFORM"
          title="一切皆为现代化 AI 服务"
          copy="强大的基座服务协同生态管理与高效运营，提供面向未来生产的算力、模型和集群管理体验。"
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
          {PLATFORMS.map((platform) => (
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
                      to={entry.to}
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
                  to={platform.to}
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
