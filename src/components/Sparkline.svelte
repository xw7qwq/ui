<script>
  import { linear, linePath } from '../scale.js';

  // 迷你趋势线：values 为数字数组（可含 null），只表达走势，不带坐标轴。
  let { values = [], width = 120, height = 32, color = 'var(--accent)', ariaLabel = '近期走势' } = $props();

  const path = $derived.by(() => {
    const valid = values.filter((v) => v !== null && v !== undefined && !Number.isNaN(v));
    if (valid.length < 2) return '';
    const min = Math.min(...valid);
    const max = Math.max(...valid);
    const x = linear([0, values.length - 1], [2, width - 2]);
    const y = linear([min, max === min ? min + 1 : max], [height - 3, 3]);
    return linePath(values.map((v, i) => ({ x: i, y: v })), x, y);
  });
</script>

<svg class="xw7-spark" viewBox={`0 0 ${width} ${height}`} {width} {height} role="img" aria-label={ariaLabel}>
  {#if path}
    <path d={path} fill="none" stroke={color} stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
  {/if}
</svg>

<style>
  .xw7-spark {
    display: block;
    max-width: 100%;
    overflow: visible;
  }
</style>
