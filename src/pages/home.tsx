import { useEffect } from 'react';

import { useDocHead } from 'src/utils/doc-head';
import { useDocLang, withLangPath } from 'src/utils/doc-lang';

import { SimpleLayout } from 'src/layouts/simple';

import { HomeView } from 'src/sections/home';
import { TOKENS } from 'src/sections/home/tokens';
import { useHomeCopy } from 'src/sections/home/home-copy';

// ----------------------------------------------------------------------

/**
 * 首页落地页，中英各一个地址：
 *   · `/`    中文（站点主入口，品牌词与站点级检索的落点）
 *   · `/en`  英文
 *
 * 语言只认 URL（与文档正文同一套 `doc-lang` 规则），文案来自
 * `src/sections/home/home-copy.json` —— 那里同时是 `scripts/ssg.mjs`
 * 生成首页静态正文的真源，改文案只要改那一个文件。
 *
 * 标题必须与 SSG 写进静态 HTML 的一致：爬虫看的是静态那份，运行时再改一次
 * 就等于给出两套标题。
 */
export default function Page() {
  const lang = useDocLang();
  const copy = useHomeCopy();
  const canonicalPath = withLangPath('/', lang);

  useDocHead(lang, canonicalPath);

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
      <title>{copy.meta.title}</title>
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
