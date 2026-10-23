// 刷题平台的统一元数据：名字、简称和颜色变量。面板、博客和各数据仓库都用这一份。
export const PLATFORMS = Object.freeze({
  atcoder: { id: 'atcoder', name: 'AtCoder', short: 'At', color: 'var(--platform-atcoder)', home: 'https://atcoder.jp/' },
  codeforces: { id: 'codeforces', name: 'Codeforces', short: 'CF', color: 'var(--platform-codeforces)', home: 'https://codeforces.com/' },
  qoj: { id: 'qoj', name: 'QOJ', short: 'Q', color: 'var(--platform-qoj)', home: 'https://qoj.ac/' },
  nowcoder: { id: 'nowcoder', name: '牛客', short: '牛', color: 'var(--platform-nowcoder)', home: 'https://ac.nowcoder.com/' },
  luogu: { id: 'luogu', name: '洛谷', short: '洛', color: 'var(--platform-luogu)', home: 'https://www.luogu.com.cn/' },
});

const ALIASES = {
  atcoder: 'atcoder',
  codeforces: 'codeforces',
  cf: 'codeforces',
  qoj: 'qoj',
  nowcoder: 'nowcoder',
  luogu: 'luogu',
};

// 把 "AtCoder"、"Codeforces" 这类目录名或展示名归一成平台 id；认不出的返回 null。
export function platformId(value) {
  if (typeof value !== 'string') return null;
  return ALIASES[value.trim().toLowerCase()] ?? null;
}

export function platform(value) {
  const id = platformId(value);
  if (id) return PLATFORMS[id];
  const name = typeof value === 'string' && value.trim() ? value.trim() : '其他';
  return { id: 'other', name, short: name.slice(0, 2), color: 'var(--platform-other)', home: null };
}
