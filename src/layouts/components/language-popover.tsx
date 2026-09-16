import type { IconButtonProps } from '@mui/material/IconButton';
import type { LangOption } from 'src/locales';

import { m } from 'framer-motion';
import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import SvgIcon from '@mui/material/SvgIcon';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { allLangs, useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { FlagIcon } from 'src/components/flag-icon';
import { CustomPopover } from 'src/components/custom-popover';
import { varTap, varHover, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

/**
 * 顶栏语言入口用地球而不是国旗 —— 语言不等于国家（同一语言可能是多个国家的），
 * 换成地球后也不用再随语言增减去补旗帜图片。
 */
function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.16" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export type LanguagePopoverProps = IconButtonProps & {
  data?: LangOption[];
};

// data 默认取语言真源 allLangs（含 label / short / countryCode），
// 调用方不必再各自手写一份同样的数组。
export function LanguagePopover({ data = allLangs, sx, ...other }: LanguagePopoverProps) {
  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { onChangeLang, currentLang: translatedLang } = useTranslate();

  const currentLang = data.find((lang) => lang.value === translatedLang.value);

  const handleChangeLang = useCallback(
    (lang: string) => {
      onChangeLang(lang as any);
      onClose();
    },
    [onClose, onChangeLang]
  );

  const renderMenuList = () => (
    <CustomPopover open={open} anchorEl={anchorEl} onClose={onClose}>
      <MenuList sx={{ width: 160, minHeight: 72 }}>
        {data?.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang?.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <FlagIcon code={option.countryCode} />
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Languages button"
        onClick={onOpen}
        sx={[
          {
            p: 0,
            gap: 1,
            px: { xs: 0.75, sm: 1.25 },
            height: 40,
            // IconButton 默认正圆，带文字后要放开宽度、收成圆角矩形。
            width: 'auto',
            borderRadius: 1.25,
            // 不写 color：留默认的 action.active，首页那条深色顶栏才能靠
            // header 上的 .MuiIconButton-root 规则把它改成白色。
            // hover / 展开态用 currentColor 混色而不是主题的 action.*：首页那条顶栏
            // 是深色底但主题仍是 light，action.* 会算成一层黑，压上去看不见；
            // currentColor 跟着文字走（深底白、浅底深灰），两种底都有效。
            ...(open && { bgcolor: 'color-mix(in srgb, currentColor 12%, transparent)' }),
            '&:hover': { bgcolor: 'color-mix(in srgb, currentColor 10%, transparent)' },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <SvgIcon sx={{ fontSize: 22 }}>
          <GlobeIcon />
        </SvgIcon>

        <Typography
          variant="body2"
          sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 500, whiteSpace: 'nowrap' }}
        >
          {currentLang?.label}
        </Typography>

        {/* 短码比 label 轻一档，主次与设计稿的「中文 ZH」一致 */}
        <Typography
          variant="body2"
          sx={{
            ml: { xs: 0, sm: -0.5 },
            display: { xs: 'none', sm: 'inline' },
            fontWeight: 500,
            opacity: 0.55,
            whiteSpace: 'nowrap',
          }}
        >
          {currentLang?.short}
        </Typography>

        <Iconify
          width={16}
          icon="eva:chevron-down-fill"
          sx={{ ml: { xs: 0, sm: -0.5 }, opacity: 0.6 }}
        />
      </IconButton>

      {renderMenuList()}
    </>
  );
}
