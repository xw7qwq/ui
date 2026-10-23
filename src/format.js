// 数字、日期和时长的统一格式。时区固定为 UTC+8，和刷题数据的日界一致。
export const TIMEZONE = 'Asia/Taipei';
const OFFSET_MS = 8 * 3600 * 1000;

const integer = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 });
const money = new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatNumber(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const number = Number(value);
  if (digits === 0) return integer.format(number);
  if (digits === 1) return decimal.format(number);
  return number.toLocaleString('zh-CN', { maximumFractionDigits: digits });
}

export function formatMoney(value, currency = '') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const text = money.format(Number(value));
  return currency ? `${text} ${currency}` : text;
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const number = Number(value);
  const sign = number > 0 ? '+' : '';
  return `${sign}${number.toFixed(digits)}%`;
}

// 以 UTC+8 计算日期键（YYYY-MM-DD）。参数可以是秒级时间戳、毫秒时间戳、ISO 字符串或 Date。
export function dayKey(value = Date.now()) {
  const ms = toMillis(value);
  if (ms === null) return null;
  return new Date(ms + OFFSET_MS).toISOString().slice(0, 10);
}

export function shiftDay(day, amount) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function formatDate(value, withTime = false) {
  const ms = toMillis(value);
  if (ms === null) return '—';
  const iso = new Date(ms + OFFSET_MS).toISOString();
  return withTime ? `${iso.slice(0, 10)} ${iso.slice(11, 16)}` : iso.slice(0, 10);
}

export function formatMonthDay(day) {
  if (typeof day !== 'string' || day.length < 10) return '—';
  return `${Number(day.slice(5, 7))}月${Number(day.slice(8, 10))}日`;
}

// “3 分钟前”“昨天”这类相对时间，超过 30 天退回到日期。
export function relativeTime(value, now = Date.now()) {
  const ms = toMillis(value);
  if (ms === null) return '—';
  const seconds = Math.round((now - ms) / 1000);
  if (seconds < 0) return formatDate(ms, true);
  if (seconds < 45) return '刚刚';
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))} 分钟前`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} 小时前`;
  const days = Math.round(seconds / 86400);
  if (days === 1) return '昨天';
  if (days < 30) return `${days} 天前`;
  return formatDate(ms);
}

// 分钟数 → “7 小时 32 分”。
export function formatDuration(minutes) {
  if (minutes === null || minutes === undefined || Number.isNaN(Number(minutes))) return '—';
  const total = Math.round(Number(minutes));
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (hours === 0) return `${rest} 分`;
  return rest === 0 ? `${hours} 小时` : `${hours} 小时 ${rest} 分`;
}

function toMillis(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number' && Number.isFinite(value)) return value < 1e11 ? value * 1000 : value;
  if (typeof value === 'string' && value) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}
