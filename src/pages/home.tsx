import { useEffect } from 'react';

import { SimpleLayout } from 'src/layouts/simple';

import { HomeView } from 'src/sections/home';
import { TOKENS } from 'src/sections/home/tokens';

// ----------------------------------------------------------------------

// 必须与 index.html 的 <title> 以及 scripts/ssg.mjs 里为根路径生成的 siteLevelTitle 一致：
// 首页是品牌词与站点级检索的落点，运行时再覆盖一次就会和爬虫看到的不一样。
const metadata = { title: 'RUNE 文档 · 晓石AI智算平台' };

export default function Page() {
  // 首页整屏是深色，而 html/body 用的是主题的白色底：触控板过界回弹、
  // 移动端下拉时会把那条白边露出来。挂载时补上深色，离开首页再还原。
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prev = { html: html.style.backgroundColor, body: body.style.backgroundColor };

    html.style.backgroundColor = TOKENS.bgPage;
    body.style.backgroundColor = TOKENS.bgPage;

    return () => {
      html.style.backgroundColor = prev.html;
      body.style.backgroundColor = prev.body;
    };
  }, []);

  return (
    <>
      <title>{metadata.title}</title>
      <SimpleLayout
        slotProps={{
          header: {
            sx: {
              // 首页整屏深色，顶栏跟着走门户那套「半透明深色 + 背景模糊」。
              // 注意 HeaderSection 的 ::before 是主题给的兜底背景层
              // （浅色模式下是 80% 不透明的白），它压在 AppBar 自己的背景之上，
              // 不覆盖掉的话顶栏会是一条浅色横带。这两处都只作用于首页。
              bgcolor: 'rgba(5, 5, 6, 0.72)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(18px) saturate(130%)',
              '&::before': {
                background: 'rgba(5, 5, 6, 0.88)',
                backdropFilter: 'blur(18px) saturate(130%)',
                WebkitBackdropFilter: 'blur(18px) saturate(130%)',
              },
              // 滚动时那条椭圆投影是为浅色底准备的，深色下只会显出一道脏边
              '&::after': { display: 'none' },
              '& .MuiTypography-root': { color: '#ffffff' },
              '& .MuiButton-root': { color: '#ffffff' },
              '& .MuiIconButton-root': { color: 'rgba(255, 255, 255, 0.8)' },
              // 主题/语言按钮里的文字要跟同一按钮的图标同色。上面那条 Typography
              // 规则是给顶栏标题用的，会把「明亮」「中文 ZH」提亮成纯白、跟图标脱节。
              '& .MuiIconButton-root .MuiTypography-root': { color: 'inherit' },
            },
          },
        }}
      >
        <HomeView />
      </SimpleLayout>
    </>
  );
}
