import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const EVENTS = [
  {
    title: 'Rune / BOSS 联合工作坊',
    description: '面向平台管理员的线上 Workshop，演示如何以模板配置多租户配额和自动化审核流程。',
    time: '12 月 12 日 · 线上直播',
  },
  {
    title: '魔哈广场模型版本日',
    description: '社区开发者分享多模态模型迭代经验，同时开放数据集治理脚本。',
    time: '12 月 20 日 · 上海',
  },
];

export function HomeCommunitySection() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" color="text.secondary">
          社区 / 活动
        </Typography>
        <Typography variant="h3">加入魔哈社区，共建生态</Typography>
        <Typography variant="body2" color="text.secondary">
          通过工作坊、版本日与飞书社区，持续同步最新能力。
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {EVENTS.map((event) => (
          <Card
            key={event.title}
            sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <Stack flexGrow={1} spacing={1}>
                <Typography variant="h5">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Chip label={event.time} color="secondary" variant="outlined" />
              </Stack>

              <Button variant="outlined" color="secondary" size="small">
                预约席位
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
