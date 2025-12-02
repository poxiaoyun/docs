export function setFavicon(href: string) {
  if (typeof document === 'undefined') return;

  const ensureLink = (rel: string) => {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    return link;
  };

  const normalizedHref = href || '';

  const iconLink = ensureLink('icon');
  iconLink.setAttribute('href', normalizedHref);

  const shortcutIconLink = ensureLink('shortcut icon');
  shortcutIconLink.setAttribute('href', normalizedHref);
}

export function getCurrentFavicon(): string | null {
  if (typeof document === 'undefined') return null;
  const link = document.querySelector<HTMLLinkElement>(
    'link[rel="icon"], link[rel="shortcut icon"]'
  );
  return link ? link.getAttribute('href') : null;
}
