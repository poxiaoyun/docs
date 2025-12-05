import { m } from 'framer-motion';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';

const EVENTS = [
  {
    title: 'Rune / BOSS 联合工作坊',
    description: '面向平台管理员的线上 Workshop，演示如何以模板配置多租户配额和自动化审核流程。',
    time: '12 月 12 日 · 线上直播',
    color: '#1877F2',
  },
  {
    title: '魔哈仓库模型版本日',
    description: '社区开发者分享多模态模型迭代经验，同时开放数据集治理脚本。',
    time: '12 月 20 日 · 上海',
    color: '#00A76F',
  },
];

export function HomeCommunitySection() {
  const theme = useTheme();

  return (
    <Container component={MotionViewport} maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
        <m.div variants={varFade('inDown')}>
          <Typography variant="overline" color="text.secondary">
            社区 / 活动
          </Typography>
        </m.div>
        <m.div variants={varFade('inDown')}>
          <Typography variant="h3">加入魔哈社区，共建生态</Typography>
        </m.div>
        <m.div variants={varFade('inDown')}>
          <Typography variant="body2" color="text.secondary">
            通过工作坊、版本日与飞书社区，持续同步最新能力。
          </Typography>
        </m.div>
      </Stack>

      <Stack spacing={3}>
        {EVENTS.map((event, index) => (
          <m.div key={event.title} variants={varFade('inUp')}>
            <Card
              sx={{
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '4px',
                  background: event.color,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: `linear-gradient(135deg, ${alpha(event.color, 0.02)} 0%, transparent 50%)`,
                  pointerEvents: 'none',
                },
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: theme.customShadows.z12,
                },
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ md: 'center' }}
                sx={{ position: 'relative' }}
              >
                <Stack flexGrow={1} spacing={1.5}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                  <Chip
                    label={event.time}
                    sx={{
                      alignSelf: 'flex-start',
                      background: alpha(event.color, 0.08),
                      color: event.color,
                      border: `1px solid ${alpha(event.color, 0.24)}`,
                      fontWeight: 500,
                    }}
                  />
                </Stack>

                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    minWidth: 120,
                    background: `linear-gradient(135deg, ${event.color}, ${alpha(event.color, 0.8)})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(event.color, 0.9)}, ${alpha(event.color, 0.7)})`,
                    },
                  }}
                >
                  预约席位
                </Button>
              </Stack>
            </Card>
          </m.div>
        ))}
      </Stack>
    </Container>
  );
}
