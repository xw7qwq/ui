// 全站导航。博客和面板的顶栏都从这里生成，保证入口、顺序和名字一致。
export const SITES = Object.freeze({
  blog: 'https://blog.lucius7.cn/',
  panel: 'https://lucius7.dev/',
  github: 'https://github.com/xw7qwq',
});

export const PANEL_SECTIONS = Object.freeze([
  { id: 'home', label: '首页', path: '/' },
  { id: 'oj', label: '刷题', path: '/oj/' },
  { id: 'now', label: '状态', path: '/now/' },
  { id: 'health', label: '健康', path: '/health/' },
  { id: 'ledger', label: '记账', path: '/me/ledger/', private: true },
]);

// 面板内部用相对路径；其他站点（博客）传入面板地址得到绝对链接。
export function panelNav(base = '') {
  const root = base.replace(/\/+$/, '');
  return PANEL_SECTIONS.map((item) => ({ ...item, href: `${root}${item.path}` }));
}

// 当前路径属于哪个栏目：最长前缀优先，/me/health/ 归到健康。
export function sectionFor(pathname) {
  const path = (pathname || '/').replace(/\/?$/, '/');
  if (path.startsWith('/me/ledger/')) return 'ledger';
  if (path.startsWith('/me/health/') || path.startsWith('/health/')) return 'health';
  if (path.startsWith('/me/now/') || path.startsWith('/now/')) return 'now';
  if (path.startsWith('/oj/')) return 'oj';
  return 'home';
}
