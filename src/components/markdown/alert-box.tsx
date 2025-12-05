import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type AlertType = 'info' | 'success' | 'warning' | 'error' | 'tip';

interface AlertConfig {
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}

const ALERT_CONFIGS: Record<AlertType, AlertConfig> = {
  info: {
    emoji: 'ℹ️',
    label: '说明',
    color: '#1890ff',
    bgColor: '#e6f7ff',
  },
  success: {
    emoji: '✅',
    label: '成功',
    color: '#52c41a',
    bgColor: '#f6ffed',
  },
  warning: {
    emoji: '⚠️',
    label: '警告',
    color: '#faad14',
    bgColor: '#fffbe6',
  },
  error: {
    emoji: '❌',
    label: '错误',
    color: '#ff4d4f',
    bgColor: '#fff2f0',
  },
  tip: {
    emoji: '💡',
    label: '提示',
    color: '#13c2c2',
    bgColor: '#e6fffb',
  },
};

// ----------------------------------------------------------------------

export interface AlertBoxProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
}

export function AlertBox({ type = 'info', title, children }: AlertBoxProps) {
  const config = ALERT_CONFIGS[type];

  return (
    <Box
      sx={{
        margin: '1em 0',
        padding: '1em 1.5em',
        borderLeft: `4px solid ${config.color}`,
        backgroundColor: config.bgColor,
        borderRadius: 1,
        fontStyle: 'normal',
        '& p:first-of-type': {
          marginTop: 0,
        },
        '& p:last-of-type': {
          marginBottom: 0,
        },
      }}
    >
      <Box
        component="strong"
        sx={{
          color: config.color,
          display: 'block',
          marginBottom: title || children ? '0.5em' : 0,
        }}
      >
        {config.emoji} {title || config.label}：
      </Box>
      <Box component="div">{children}</Box>
    </Box>
  );
}
