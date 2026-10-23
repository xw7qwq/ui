<script>
  import { platform as lookup } from '../platforms.js';

  let { platform, short = false } = $props();
  const info = $derived(lookup(platform));
</script>

<span class="xw7-platform" style:--platform-color={info.color} title={info.name}>
  <span class="dot"></span>{short ? info.short : info.name}
</span>

<style>
  .xw7-platform {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-2);
    font-size: var(--text-xs);
    font-weight: 600;
    white-space: nowrap;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--platform-color);
  }
</style>
