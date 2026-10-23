<script>
  // 提示条：info / good / warn / bad。
  let { tone = 'info', children } = $props();
</script>

<div class="xw7-notice" data-tone={tone} role={tone === 'bad' ? 'alert' : 'status'}>
  {@render children?.()}
</div>

<style>
  .xw7-notice {
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--border);
    border-radius: var(--radius-2);
    background: var(--surface-2);
    color: var(--text-2);
    font-size: var(--text-sm);
  }

  [data-tone='good'] {
    border-color: color-mix(in srgb, var(--good) 35%, var(--border));
    background: var(--good-soft);
  }

  [data-tone='warn'] {
    border-color: color-mix(in srgb, var(--warn) 35%, var(--border));
    background: var(--warn-soft);
  }

  [data-tone='bad'] {
    border-color: color-mix(in srgb, var(--bad) 35%, var(--border));
    background: var(--bad-soft);
  }
</style>
