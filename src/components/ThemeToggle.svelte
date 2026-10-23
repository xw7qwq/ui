<script>
  import { onMount } from 'svelte';
  import { applyTheme, readTheme } from '../theme.js';

  const LABELS = { auto: '跟随系统', light: '浅色', dark: '深色' };
  const NEXT = { auto: 'light', light: 'dark', dark: 'auto' };
  let theme = $state('auto');

  onMount(() => {
    theme = readTheme();
  });

  function toggle() {
    theme = applyTheme(NEXT[theme]);
  }
</script>

<button class="toggle" type="button" onclick={toggle} title={`主题：${LABELS[theme]}`} aria-label={`切换主题，当前${LABELS[theme]}`}>
  {#if theme === 'light'}
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></svg>
  {:else if theme === 'dark'}
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
  {:else}
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16Z" class="fill" /></svg>
  {/if}
</button>

<style>
  .toggle {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--surface);
    color: var(--text-2);
    cursor: pointer;
  }

  .toggle:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .fill {
    fill: currentColor;
  }
</style>
