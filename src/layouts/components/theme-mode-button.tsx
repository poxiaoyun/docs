import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { varAlpha } from 'minimal-shared/utils';

import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';
import { settingIcons } from 'src/components/settings/drawer/icons';
import { varTap, varHover, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

function SunIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.4"
        d="M12 17.25C14.8995 17.25 17.25 14.8995 17.25 12C17.25 9.1005 14.8995 6.75 12 6.75C9.1005 6.75 6.75 9.1005 6.75 12C6.75 14.8995 9.1005 17.25 12 17.25Z"
        fill="currentColor"
      />
      <path
        d="M11.25 2.75C11.25 2.33579 11.5858 2 12 2C12.4142 2 12.75 2.33579 12.75 2.75V4.25C12.75 4.66421 12.4142 5 12 5C11.5858 5 11.25 4.66421 11.25 4.25V2.75ZM11.25 19.75C11.25 19.3358 11.5858 19 12 19C12.4142 19 12.75 19.3358 12.75 19.75V21.25C12.75 21.6642 12.4142 22 12 22C11.5858 22 11.25 21.6642 11.25 21.25V19.75ZM4.25 11.25C4.66421 11.25 5 11.5858 5 12C5 12.4142 4.66421 12.75 4.25 12.75H2.75C2.33579 12.75 2 12.4142 2 12C2 11.5858 2.33579 11.25 2.75 11.25H4.25ZM19 12C19 11.5858 19.3358 11.25 19.75 11.25H21.25C21.6642 11.25 22 11.5858 22 12C22 12.4142 21.6642 12.75 21.25 12.75H19.75C19.3358 12.75 19 12.4142 19 12ZM6.34314 5.28249C6.63596 4.9896 7.11084 4.98957 7.40369 5.28242C7.69658 5.57524 7.6966 6.05012 7.40376 6.34297L6.3431 7.40366C6.05028 7.69655 5.5754 7.69657 5.28255 7.40374C4.98966 7.11092 4.98964 6.63604 5.28247 6.34319L6.34314 5.28249ZM16.5963 15.5356C16.8892 15.2427 17.364 15.2427 17.6569 15.5355C17.9498 15.8283 17.9498 16.3032 17.657 16.5961L16.5963 17.6568C16.3035 17.9497 15.8286 17.9497 15.5357 17.6569C15.2428 17.3641 15.2428 16.8892 15.5356 16.5963L16.5963 15.5356ZM17.657 7.40366C17.3641 7.69649 16.8892 7.69649 16.5963 7.40366L15.5356 6.34297C15.2428 6.05012 15.2428 5.57524 15.5357 5.28242C15.8286 4.9896 16.3034 4.9896 16.5963 5.28242L17.657 6.3431C17.9498 6.63595 17.9498 7.11083 17.657 7.40366ZM7.40376 17.657C7.11091 17.9498 6.63603 17.9498 6.34318 17.657L5.28252 16.5963C4.98968 16.3034 4.98968 15.8286 5.28252 15.5357C5.57537 15.2429 6.05025 15.2429 6.3431 15.5357L7.40376 16.5964C7.6966 16.8893 7.6966 17.3641 7.40376 17.657Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ThemeModeButton({ sx, ...other }: IconButtonProps) {
  const settings = useSettingsContext();
  const { i18n } = useTranslation();
  const { colorScheme, setMode } = useColorScheme();

  const locale = i18n.language.startsWith('en') ? 'en' : 'cn';
  const isDark = colorScheme === 'dark';
  const nextMode = isDark ? 'light' : 'dark';
  const tooltip = locale === 'en'
    ? isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode'
    : isDark
      ? '切换到浅色模式'
      : '切换到暗黑模式';

  return (
    <Tooltip title={tooltip}>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label={tooltip}
        onClick={() => {
          setMode(nextMode);
          settings.setState({ mode: nextMode });
        }}
        sx={[
          (theme) => ({
            p: 0,
            width: 40,
            height: 40,
            color: isDark ? theme.vars.palette.warning.main : theme.vars.palette.text.secondary,
            bgcolor: isDark
              ? varAlpha(theme.vars.palette.warning.mainChannel, 0.16)
              : varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: `1px solid ${theme.vars.palette.divider}`,
            '&:hover': {
              bgcolor: isDark
                ? varAlpha(theme.vars.palette.warning.mainChannel, 0.24)
                : varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <SvgIcon>{isDark ? <SunIcon /> : settingIcons.moon}</SvgIcon>
      </IconButton>
    </Tooltip>
  );
}
