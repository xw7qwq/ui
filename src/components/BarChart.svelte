<script>
  import { linear, niceTicks } from '../scale.js';

  // labels: ['2026-01', ...]；series: [{ label, color, values: [number | null] }]
  // stacked 为 true 时同一类目的正值向上叠、负值向下叠。
  let {
    labels = [],
    series = [],
    stacked = false,
    height = 220,
    yFormat = (value) => String(value),
    xFormat = (label) => label,
    ariaLabel = '柱状图',
  } = $props();

  let width = $state(640);
  let hover = $state(null);
  const PAD = { top: 12, right: 8, bottom: 26, left: 52 };

  const extent = $derived.by(() => {
    let min = 0;
    let max = 0;
    labels.forEach((_, i) => {
      if (stacked) {
        let pos = 0;
        let neg = 0;
        for (const s of series) {
          const v = Number(s.values[i] ?? 0);
          if (v >= 0) pos += v;
          else neg += v;
        }
        max = Math.max(max, pos);
        min = Math.min(min, neg);
      } else {
        for (const s of series) {
          const v = Number(s.values[i] ?? 0);
          max = Math.max(max, v);
          min = Math.min(min, v);
        }
      }
    });
    return [min, max === min ? min + 1 : max];
  });

  const ticks = $derived(niceTicks(extent[0], extent[1], 4));
  const y = $derived(linear([ticks[0], ticks.at(-1)], [height - PAD.bottom, PAD.top]));
  const band = $derived(labels.length ? (width - PAD.left - PAD.right) / labels.length : 0);

  const bars = $derived.by(() => {
    const result = [];
    labels.forEach((label, i) => {
      const x0 = PAD.left + i * band + band * 0.15;
      const inner = band * 0.7;
      if (stacked) {
        let pos = 0;
        let neg = 0;
        for (const s of series) {
          const v = Number(s.values[i] ?? 0);
          if (!v) continue;
          const from = v >= 0 ? pos : neg;
          const to = from + v;
          if (v >= 0) pos = to;
          else neg = to;
          result.push({ i, x: x0, w: inner, y: y(Math.max(from, to)), h: Math.abs(y(from) - y(to)), color: s.color });
        }
      } else {
        const w = inner / Math.max(1, series.length);
        series.forEach((s, k) => {
          const v = Number(s.values[i] ?? 0);
          result.push({ i, x: x0 + k * w, w: Math.max(1, w - 1), y: y(Math.max(0, v)), h: Math.abs(y(0) - y(v)), color: s.color });
        });
      }
    });
    return result;
  });

  const step = $derived(Math.max(1, Math.ceil(labels.length / Math.max(2, Math.floor(width / 64)))));
</script>

<div class="xw7-bars" bind:clientWidth={width}>
  {#if !labels.length}
    <div class="empty" style:height={`${height}px`}>暂无数据</div>
  {:else}
    <svg viewBox={`0 0 ${width} ${height}`} {width} {height} role="img" aria-label={ariaLabel} onpointerleave={() => (hover = null)}>
      {#each ticks as tick (tick)}
        <line class="grid" class:zero={tick === 0} x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} />
        <text class="ylabel" x={PAD.left - 6} y={y(tick) + 4}>{yFormat(tick)}</text>
      {/each}
      {#each labels as label, i (label)}
        <rect class="hit" x={PAD.left + i * band} y={PAD.top} width={band} height={height - PAD.top - PAD.bottom} onpointerenter={() => (hover = i)} role="presentation" />
        {#if i % step === 0}
          <text class="xlabel" x={PAD.left + i * band + band / 2} y={height - 8}>{xFormat(label)}</text>
        {/if}
      {/each}
      {#each bars as bar, index (index)}
        <rect x={bar.x} y={bar.y} width={bar.w} height={Math.max(0.5, bar.h)} rx="2" fill={bar.color} opacity={hover === null || hover === bar.i ? 1 : 0.45} pointer-events="none" />
      {/each}
    </svg>
    {#if hover !== null}
      <div class="tip" style:left={`${Math.min(Math.max(PAD.left + hover * band + band / 2, 80), width - 80)}px`}>
        <div class="tip-day">{labels[hover]}</div>
        {#each series as s, index (index)}
          <div class="tip-row"><span class="dot" style:background={s.color}></span>{s.label}<b>{s.values[hover] === null || s.values[hover] === undefined ? '—' : yFormat(s.values[hover])}</b></div>
        {/each}
      </div>
    {/if}
    {#if series.length > 1}
      <div class="legend">
        {#each series as s, index (index)}<span><i style:background={s.color}></i>{s.label}</span>{/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .xw7-bars {
    position: relative;
    width: 100%;
  }

  svg {
    display: block;
    max-width: 100%;
  }

  .grid {
    stroke: var(--chart-grid);
  }

  .grid.zero {
    stroke: var(--chart-axis);
  }

  .hit {
    fill: transparent;
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
    text-anchor: middle;
  }

  .tip {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    min-width: 140px;
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
    border-radius: 2px;
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
