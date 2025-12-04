import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

const RESOURCES = [
  {
    title: '开放 API / SDK',
    description: '标准化的开放接口与 SDK 示例，便于接入控制台、CI/CD、自动化测试。',
    action: '查看 API',
    icon: 'ic-product',
  },
  {
    title: '系统模板与脚本',
    description: '复用官方模板与脚本仓库，快速引导管理员配置集群、网关与自定义镜像。',
    action: '下载模版',
    icon: 'ic-subpaths',
  },
  {
    title: '监控 & 反馈通道',
    description: '通过 Issue、飞书群与在线工单反馈问题，并获取实时更新。',
    action: '加入社区',
    icon: 'ic-chat',
  },
];

export function HomeResourcesSection() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" color="text.secondary">
          生态资源
        </Typography>
        <Typography variant="h3">围绕文档的工具矩阵</Typography>
        <Typography variant="body2" color="text.secondary">
          SDK · 模板 · 反馈渠道，形成闭环，帮助团队协作。
        </Typography>
      </Stack>

      <Card sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {RESOURCES.map((resource, index) => (
          <Stack
            key={resource.title}
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ md: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} flexGrow={1} alignItems="center">
              <SvgColor
                src={`${CONFIG.assetsDir}/assets/icons/navbar/${resource.icon}.svg`}
                sx={{ width: 32, height: 32, color: 'primary.main' }}
              />
              <Stack spacing={0.5}>
                <Typography variant="h6">{resource.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {resource.description}
                </Typography>
              </Stack>
            </Stack>

            <Button variant="contained" color="primary" size="small">
              {resource.action}
            </Button>

            {index < RESOURCES.length - 1 && <Divider sx={{ display: { md: 'none' } }} />}
          </Stack>
        ))}
      </Card>
    </Container>
  );
}
