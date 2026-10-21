export function setFavicon(href: string) {
  if (typeof document === 'undefined') return;

  // 没配 logo 就直接返回，保持 index.html 里声明的默认图标 /favicon.ico。
  // 这里以前会把 href 写成空字符串 —— 空 href 按规范解析成「当前文档地址」，
  // 浏览器于是拿整个 HTML 当图标，结果就是站点图标直接没了。
  if (!href) return;

  const ensureLink = (rel: string) => {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    return link;
  };

  const iconLink = ensureLink('icon');
  iconLink.setAttribute('href', href);

  const shortcutIconLink = ensureLink('shortcut icon');
  shortcutIconLink.setAttribute('href', href);
}
