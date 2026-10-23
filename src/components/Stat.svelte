<script>
  // 一个指标：标签、数值、单位，可选说明和趋势。
  // trend: { assessment: 'improving' | 'worsening' | 'stable', text: '+3.2%' }
  let { label, value = '—', unit = '', hint = '', trend = null, size = 'md', color = '' } = $props();
  const tone = $derived(trend?.assessment === 'improving' ? 'good' : trend?.assessment === 'worsening' ? 'bad' : 'flat');
</script>

<div class="xw7-stat" data-size={size}>
  <div class="label">
    {#if color}<span class="dot" style:background={color}></span>{/if}
    {label}
  </div>
  <div class="value xw7-num">
    {value}{#if unit}<span class="unit">{unit}</span>{/if}
  </div>
  {#if trend?.text || hint}
    <div class="meta">
      {#if trend?.text}<span class="trend" data-tone={tone}>{trend.text}</span>{/if}
      {#if hint}<span class="hint">{hint}</span>{/if}
    </div>
  {/if}
</div>

<style>
  .xw7-stat {
    min-width: 0;
  }

  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-2);
    font-size: var(--text-sm);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
  }

  .value {
    margin-top: 2px;
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [data-size='lg'] .value {
    font-size: var(--text-3xl);
  }

  [data-size='sm'] .value {
    font-size: var(--text-xl);
  }

  .unit {
    margin-left: 4px;
    color: var(--text-3);
    font-size: var(--text-sm);
    font-weight: 500;
    letter-spacing: 0;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
    margin-top: 4px;
    font-size: var(--text-xs);
  }

  .trend {
    padding: 0 6px;
    border-radius: var(--radius-pill);
    background: var(--surface-2);
    color: var(--text-2);
    font-weight: 600;
  }

  .trend[data-tone='good'] {
    background: var(--good-soft);
    color: var(--good);
  }

  .trend[data-tone='bad'] {
    background: var(--bad-soft);
    color: var(--bad);
  }

  .hint {
    color: var(--text-3);
  }
</style>
