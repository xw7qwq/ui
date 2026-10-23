// 图表用的刻度与比例尺，不依赖第三方图表库。

// 返回覆盖 [min, max] 的“好看”刻度（1、2、5 × 10^n 步长）。
export function niceTicks(min, max, count = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) {
    const pad = Math.abs(min) || 1;
    min -= pad / 2;
    max += pad / 2;
  }
  const span = max - min;
  const raw = span / Math.max(1, count);
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => span / s <= count) ?? 10 * power;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  for (let value = start; value <= end + step / 2; value += step) ticks.push(roundTo(value, step));
  return ticks;
}

export function linear(domain, range) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  return (value) => r0 + (value - d0) * k;
}

// 带缺口的折线：null 断开，返回 SVG path 的 d。
export function linePath(points, x, y) {
  let d = '';
  let pen = false;
  for (const point of points) {
    if (point.y === null || point.y === undefined || Number.isNaN(point.y)) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${x(point.x).toFixed(1)} ${y(point.y).toFixed(1)}`;
    pen = true;
  }
  return d;
}

export function dayToMs(day) {
  return Date.parse(`${day}T00:00:00Z`);
}

function roundTo(value, step) {
  const digits = Math.max(0, -Math.floor(Math.log10(step)) + 1);
  return Number(value.toFixed(digits));
}
