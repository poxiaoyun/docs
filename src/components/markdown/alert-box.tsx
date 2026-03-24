import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type AlertType = 'info' | 'success' | 'warning' | 'error' | 'tip';

interface AlertConfig {
  icon: string;
  label: string;
  lightColor: string;
  darkColor: string;
  lightBg: string;
  darkBg: string;
  lightBorder: string;
  darkBorder: string;
}

const ALERT_CONFIGS: Record<AlertType, AlertConfig> = {
  tip: {
    icon: '💡',
    label: '提示',
    lightColor: '#0d9488',
    darkColor: '#5eead4',
    lightBg: 'rgba(13, 148, 136, 0.06)',
    darkBg: 'rgba(94, 234, 212, 0.08)',
    lightBorder: 'rgba(13, 148, 136, 0.3)',
    darkBorder: 'rgba(94, 234, 212, 0.25)',
  },
  info: {
    icon: 'ℹ️',
    label: '说明',
    lightColor: '#2563eb',
    darkColor: '#93bbfd',
    lightBg: 'rgba(37, 99, 235, 0.06)',
    darkBg: 'rgba(147, 187, 253, 0.08)',
    lightBorder: 'rgba(37, 99, 235, 0.3)',
    darkBorder: 'rgba(147, 187, 253, 0.25)',
  },
  success: {
    icon: '✅',
    label: '成功',
    lightColor: '#16a34a',
    darkColor: '#86efac',
    lightBg: 'rgba(22, 163, 74, 0.06)',
    darkBg: 'rgba(134, 239, 172, 0.08)',
    lightBorder: 'rgba(22, 163, 74, 0.3)',
    darkBorder: 'rgba(134, 239, 172, 0.25)',
  },
  warning: {
    icon: '⚠️',
    label: '注意',
    lightColor: '#d97706',
    darkColor: '#fcd34d',
    lightBg: 'rgba(217, 119, 6, 0.06)',
    darkBg: 'rgba(252, 211, 77, 0.08)',
    lightBorder: 'rgba(217, 119, 6, 0.3)',
    darkBorder: 'rgba(252, 211, 77, 0.25)',
  },
  error: {
    icon: '🚫',
    label: '警告',
    lightColor: '#dc2626',
    darkColor: '#fca5a5',
    lightBg: 'rgba(220, 38, 38, 0.06)',
    darkBg: 'rgba(252, 165, 165, 0.08)',
    lightBorder: 'rgba(220, 38, 38, 0.3)',
    darkBorder: 'rgba(252, 165, 165, 0.25)',
  },
};

// ----------------------------------------------------------------------

export interface AlertBoxProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
}

export function AlertBox({ type = 'info', title, children }: AlertBoxProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const config = ALERT_CONFIGS[type];

  const color = isDark ? config.darkColor : config.lightColor;
  const bg = isDark ? config.darkBg : config.lightBg;
  const border = isDark ? config.darkBorder : config.lightBorder;

  return (
    <Box
      sx={{
        position: 'relative',
        my: 2.5,
        py: 1.5,
        pl: 2,
        pr: 2.5,
        borderLeft: `3px solid ${color}`,
        borderRadius: '6px',
        backgroundColor: bg,
        backdropFilter: 'blur(8px)',
        fontStyle: 'normal',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: `0 2px 12px ${border}`,
        },
        '& p:first-of-type': { marginTop: 0 },
        '& p:last-of-type': { marginBottom: 0 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          mb: children ? 1 : 0,
        }}
      >
        <Box
          component="span"
          sx={{ fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }}
        >
          {config.icon}
        </Box>

        <Box
          component="span"
          sx={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {title || config.label}
        </Box>
      </Box>

      {/* Body */}
      <Box
        component="div"
        sx={{
          fontSize: '0.875rem',
          lineHeight: 1.7,
          color: isDark ? 'grey.300' : 'text.secondary',
          '& code': {
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: '0.8125rem',
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.06)',
          },
          '& a': {
            color,
            textDecoration: 'underline',
            textDecorationColor: border,
            textUnderlineOffset: '2px',
            '&:hover': {
              textDecorationColor: color,
            },
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
