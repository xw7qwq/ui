<script>
  // 分段选择：options = [{ value, label }]，value 可双向绑定。
  let { options = [], value = $bindable(), label = '选择', size = 'md' } = $props();
</script>

<div class="xw7-segmented" role="radiogroup" aria-label={label} data-size={size}>
  {#each options as option (option.value)}
    <button
      type="button"
      role="radio"
      aria-checked={value === option.value}
      class:active={value === option.value}
      onclick={() => (value = option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .xw7-segmented {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 2px;
    padding: 3px;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--surface-2);
  }

  button {
    padding: 0.2rem 0.75rem;
    border: 0;
    border-radius: var(--radius-pill);
    background: transparent;
    color: var(--text-2);
    font-size: var(--text-sm);
    cursor: pointer;
    white-space: nowrap;
  }

  [data-size='sm'] button {
    padding: 0.1rem 0.6rem;
    font-size: var(--text-xs);
  }

  button:hover {
    color: var(--text);
  }

  button.active {
    background: var(--surface);
    color: var(--accent-strong);
    font-weight: 600;
    box-shadow: var(--shadow-1);
  }
</style>
