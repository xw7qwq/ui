// 主题偏好：auto（跟随系统）/ light / dark，保存在 localStorage。
export const THEME_KEY = 'xw7-theme';
export const THEMES = ['auto', 'light', 'dark'];

// 放进 <head> 的内联脚本，页面渲染前就套上主题，避免闪烁。
export const themeScript = `(()=>{try{const t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}})();`;

export function readTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return THEMES.includes(value) ? value : 'auto';
  } catch {
    return 'auto';
  }
}

export function applyTheme(value) {
  const theme = THEMES.includes(value) ? value : 'auto';
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try {
    if (theme === 'auto') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch {
    // 隐私模式下不能写入时，只在当前页面生效。
  }
  return theme;
}
