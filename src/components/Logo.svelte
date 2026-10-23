<script>
  // 组织字标里的心形挂坠，作为各站点统一的小图标。
  let { size = 22, title = 'xw7' } = $props();
</script>

<svg class="xw7-logo" width={size} height={size} viewBox="-42 -46 84 84" role="img" aria-label={title}>
  <path
    d="M0 32C-9 22-36 6-36-12C-36-36-10-42 0-24C10-42 36-36 36-12C36 6 9 22 0 32Z"
    fill="var(--accent)"
    stroke="var(--text)"
    stroke-width="4"
  />
  <path d="M-18-16C-18-24-10-27-6-22" fill="none" stroke="var(--surface)" stroke-width="5" stroke-linecap="round" opacity="0.7" />
</svg>

<style>
  .xw7-logo {
    flex: none;
  }
</style>
