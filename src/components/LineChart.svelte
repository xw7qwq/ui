<script>
  import { dayToMs, linePath, linear, niceTicks } from '../scale.js';

  // series: [{ id, label, color, points: [{ x: 'YYYY-MM-DD', y: number | null }] }]
  // 横轴按日期等距；缺失值断线，不当作 0。
  let {
    series = [],
    height = 220,
    yFormat = (value) => String(value),
    xFormat = (day) => day.slice(5),
    yZero = false,
    area = false,
    ariaLabel = '趋势图',
  } = $props();

  let width = $state(640);
  let hover = $state(null);
  const PAD = { top: 12, right: 12, bottom: 26, left: 44 };

  const days = $derived.by(() => {
    const set = new Set();
    for (const s of series) for (const p of s.points) set.add(p.x);
    return [...set].sort();
  });

  const extent = $derived.by(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const s of series) {
      for (const p of s.points) {
        if (p.y === null || p.y === undefined || Number.isNaN(p.y)) continue;
        min = Math.min(min, p.y);
        max = Math.max(max, p.y);
      }
    }
    if (!Number.isFinite(min)) return [0, 1];
    if (yZero) min = Math.min(0, min);
    return [min, max];
  });

  const ticks = $derived(niceTicks(extent[0], extent[1], 4));
  const x = $derived.by(() => {
    if (days.length < 2) return () => PAD.left + (width - PAD.left - PAD.right) / 2;
    return linear([dayToMs(days[0]), dayToMs(days.at(-1))], [PAD.left, width - PAD.right]);
  });
  const xOf = $derived((day) => x(dayToMs(day)));
  const y = $derived(linear([ticks[0], ticks.at(-1)], [height - PAD.bottom, PAD.top]));

  // 首尾两个刻度总是显示；末尾离上一个刻度太近时替换掉上一个，避免文字重叠。
  const xTicks = $derived.by(() => {
    if (!days.length) return [];
    const count = Math.max(2, Math.min(6, Math.floor(width / 110)));
    const step = Math.max(1, Math.round((days.length - 1) / (count - 1)));
    const picked = [];
    for (let i = 0; i < days.length; i += step) picked.push(i);
    const last = days.length - 1;
    if (picked.at(-1) !== last) {
      if (picked.length > 1 && last - picked.at(-1) < step / 2) picked.pop();
      picked.push(last);
    }
    return picked.map((i) => days[i]);
  });

  function anchor(day) {
    if (xTicks.length < 2) return 'middle';
    if (day === xTicks[0]) return 'start';
    if (day === xTicks.at(-1)) return 'end';
    return 'middle';
  }

  function areaPath(points) {
    const valid = points.filter((p) => p.y !== null && p.y !== undefined && !Number.isNaN(p.y));
    if (valid.length < 2) return '';
    const base = y(Math.max(ticks[0], 0));
    const line = valid.map((p, i) => `${i ? 'L' : 'M'}${xOf(p.x).toFixed(1)} ${y(p.y).toFixed(1)}`).join('');
    return `${line}L${xOf(valid.at(-1).x).toFixed(1)} ${base}L${xOf(valid[0].x).toFixed(1)} ${base}Z`;
  }

  function onmove(event) {
    if (!days.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    let best = days[0];
    let bestDistance = Infinity;
    for (const day of days) {
      const distance = Math.abs(xOf(day) - px);
      if (distance < bestDistance) {
        best = day;
        bestDistance = distance;
      }
    }
    hover = best;
  }

  const hoverRows = $derived(
    hover
      ? series.map((s) => ({ label: s.label, color: s.color, value: s.points.find((p) => p.x === hover)?.y ?? null }))
      : [],
  );
</script>

<div class="xw7-line" bind:clientWidth={width}>
  {#if !days.length}
    <div class="empty" style:height={`${height}px`}>暂无数据</div>
  {:else}
    <svg
      viewBox={`0 0 ${width} ${height}`}
      {width}
      {height}
      role="img"
      aria-label={ariaLabel}
      onpointermove={onmove}
      onpointerleave={() => (hover = null)}
    >
      {#each ticks as tick (tick)}
        <line class="grid" x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} />
        <text class="ylabel" x={PAD.left - 6} y={y(tick) + 4}>{yFormat(tick)}</text>
      {/each}
      {#each xTicks as day (day)}
        <text class="xlabel" x={xOf(day)} y={height - 8} text-anchor={anchor(day)}>{xFormat(day)}</text>
      {/each}
      {#each series as s, index (s.id ?? index)}
        {#if area && index === 0}
          <path d={areaPath(s.points)} fill={s.color} opacity="0.12" />
        {/if}
        <path d={linePath(s.points.map((p) => ({ x: dayToMs(p.x), y: p.y })), x, y)} fill="none" stroke={s.color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
      {/each}
      {#if hover}
        <line class="cursor" x1={xOf(hover)} x2={xOf(hover)} y1={PAD.top} y2={height - PAD.bottom} />
        {#each hoverRows as row, index (index)}
          {#if row.value !== null}
            <circle cx={xOf(hover)} cy={y(row.value)} r="3.5" fill={row.color} stroke="var(--surface)" stroke-width="1.5" />
          {/if}
        {/each}
      {/if}
    </svg>
    {#if hover}
      <div class="tip" style:left={`${Math.min(Math.max(xOf(hover), 70), width - 70)}px`}>
        <div class="tip-day">{hover}</div>
        {#each hoverRows as row, index (index)}
          <div class="tip-row"><span class="dot" style:background={row.color}></span>{row.label}<b>{row.value === null ? '—' : yFormat(row.value)}</b></div>
        {/each}
      </div>
    {/if}
    {#if series.length > 1}
      <div class="legend">
        {#each series as s, index (s.id ?? index)}<span><i style:background={s.color}></i>{s.label}</span>{/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .xw7-line {
    position: relative;
    width: 100%;
  }

  svg {
    display: block;
    max-width: 100%;
    touch-action: pan-y;
  }

  .grid {
    stroke: var(--chart-grid);
    stroke-width: 1;
  }

  .ylabel {
    fill: var(--text-3);
    font-size: 10.5px;
    text-anchor: end;
    font-variant-numeric: tabular-nums;
  }

  .xlabel {
    fill: var(--text-3);
    font-size: 10.5px;
  }

  .cursor {
    stroke: var(--chart-axis);
    stroke-dasharray: 3 3;
  }

  .tip {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    min-width: 120px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-2);
    background: var(--surface);
    box-shadow: var(--shadow-2);
    font-size: var(--text-xs);
    pointer-events: none;
  }

  .tip-day {
    color: var(--text-3);
  }

  .tip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  .tip-row b {
    margin-left: auto;
    padding-left: 8px;
    font-variant-numeric: tabular-nums;
  }

  .dot,
  .legend i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    margin-top: 4px;
    color: var(--text-2);
    font-size: var(--text-xs);
  }

  .legend span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .empty {
    display: grid;
    place-items: center;
    color: var(--text-3);
    font-size: var(--text-sm);
  }
</style>
