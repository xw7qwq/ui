<script>
  import { onMount } from 'svelte';
  import { shiftDay } from '../format.js';

  // values: { 'YYYY-MM-DD': number }；start/end 为闭区间。周一开头，和刷题日历一致。
  let {
    values = {},
    start,
    end,
    levels = [1, 2, 4, 7],
    selected = null,
    label = (day, count) => `${day}：${count}`,
    onselect = null,
    ariaLabel = '每日热力图',
  } = $props();

  const CELL = 12;
  const GAP = 3;
  const LEFT = 22;
  const TOP = 18;
  const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const layout = $derived.by(() => {
    const cells = [];
    if (!start || !end || start > end) return { cells, weeks: 0, months: [] };
    const firstWeekday = (new Date(`${start}T00:00:00Z`).getUTCDay() + 6) % 7;
    let index = firstWeekday;
    const months = [];
    for (let day = start; day <= end; day = shiftDay(day, 1)) {
      const week = Math.floor(index / 7);
      const weekday = index % 7;
      if (day.endsWith('-01') || day === start) {
        const month = Number(day.slice(5, 7)) - 1;
        // 开头不满一个月时，下个月的标签离得太近就让给下个月。
        if (months.length === 1 && months[0].partial && week - months[0].week < 3) months.pop();
        if (!months.length || months.at(-1).week !== week) months.push({ week, label: MONTHS[month], partial: day === start && !day.endsWith('-01') });
      }
      cells.push({ day, week, weekday, count: Number(values?.[day] ?? 0) });
      index++;
    }
    return { cells, weeks: Math.floor((index - 1) / 7) + 1, months };
  });

  const width = $derived(LEFT + layout.weeks * (CELL + GAP));
  const height = TOP + 7 * (CELL + GAP);
  let scroller = $state(null);

  // 键盘焦点所在的日期：默认选中日，否则最后一天。
  let focused = $state(null);
  const focusDay = $derived(focused && focused >= start && focused <= end ? focused : (selected ?? end));

  const KEYS = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };

  function choose(day) {
    focused = day;
    onselect?.(day);
  }

  function onkey(event, day) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(day);
      return;
    }
    if (!(event.key in KEYS)) return;
    event.preventDefault();
    const next = shiftDay(day, KEYS[event.key]);
    if (next < start || next > end) return;
    focused = next;
    scroller?.querySelector(`[data-day="${next}"]`)?.focus();
  }

  function level(count) {
    let result = 0;
    for (const threshold of levels) if (count >= threshold) result++;
    return result;
  }

  onMount(() => {
    // 窄屏默认看到最近的日期。
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  });
</script>

<div class="xw7-heatmap" bind:this={scroller}>
  <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={ariaLabel}>
    {#each layout.months as month (month.week)}
      <text class="month" x={LEFT + month.week * (CELL + GAP)} y={11}>{month.label}</text>
    {/each}
    <text class="weekday" x="0" y={TOP + 0 * (CELL + GAP) + 10}>一</text>
    <text class="weekday" x="0" y={TOP + 2 * (CELL + GAP) + 10}>三</text>
    <text class="weekday" x="0" y={TOP + 4 * (CELL + GAP) + 10}>五</text>
    {#if onselect}
      <!-- 可点选时整张图只占一个 Tab 位，方向键按日/周移动，回车选中。 -->
      {#each layout.cells as cell (cell.day)}
        <rect
          x={LEFT + cell.week * (CELL + GAP)}
          y={TOP + cell.weekday * (CELL + GAP)}
          width={CELL}
          height={CELL}
          rx="2.5"
          class="cell clickable"
          class:selected={selected === cell.day}
          style:fill={`var(--heat-${level(cell.count)})`}
          data-day={cell.day}
          role="button"
          tabindex={cell.day === focusDay ? 0 : -1}
          aria-label={label(cell.day, cell.count)}
          aria-pressed={selected === cell.day}
          onclick={() => choose(cell.day)}
          onkeydown={(event) => onkey(event, cell.day)}
        >
          <title>{label(cell.day, cell.count)}</title>
        </rect>
      {/each}
    {:else}
      {#each layout.cells as cell (cell.day)}
        <rect
          x={LEFT + cell.week * (CELL + GAP)}
          y={TOP + cell.weekday * (CELL + GAP)}
          width={CELL}
          height={CELL}
          rx="2.5"
          class="cell"
          class:selected={selected === cell.day}
          style:fill={`var(--heat-${level(cell.count)})`}
        >
          <title>{label(cell.day, cell.count)}</title>
        </rect>
      {/each}
    {/if}
  </svg>
  <div class="legend" aria-hidden="true">
    少
    {#each [0, 1, 2, 3, 4] as step}<span style:background={`var(--heat-${step})`}></span>{/each}
    多
  </div>
</div>

<style>
  .xw7-heatmap {
    overflow-x: auto;
    padding-bottom: 4px;
  }

  svg {
    max-width: none;
  }

  .month,
  .weekday {
    fill: var(--text-3);
    font-size: 10px;
  }

  .cell {
    stroke: color-mix(in srgb, var(--text) 6%, transparent);
    stroke-width: 0.5;
  }

  .cell.clickable {
    cursor: pointer;
  }

  .cell.clickable:focus-visible {
    outline: none;
    stroke: var(--accent);
    stroke-width: 2;
  }

  .cell.clickable:hover {
    stroke: var(--text-2);
    stroke-width: 1;
  }

  .cell.selected {
    stroke: var(--text);
    stroke-width: 1.5;
  }

  .legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
    margin-top: 6px;
    color: var(--text-3);
    font-size: var(--text-xs);
  }

  .legend span {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }
</style>
