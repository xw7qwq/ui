<script>
  import { SITES } from '../nav.js';
  let { children } = $props();
</script>

<footer class="xw7-footer">
  <div class="inner">
    <span>xw7 · by Lucius7</span>
    <nav aria-label="站点">
      <a href={SITES.blog}>博客</a>
      <a href={SITES.panel}>面板</a>
      <a href={SITES.github}>GitHub</a>
    </nav>
    {#if children}
      <span class="extra">{@render children()}</span>
    {/if}
  </div>
</footer>

<style>
  .xw7-footer {
    margin-top: var(--space-8);
    padding: var(--space-5) 0 var(--space-6);
    border-top: 1px solid var(--border);
    color: var(--text-3);
    font-size: var(--text-sm);
  }

  .inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3) var(--space-5);
    width: min(100% - 2 * var(--space-4), var(--content-width));
    margin-inline: auto;
  }

  nav {
    display: flex;
    gap: var(--space-4);
  }

  a {
    color: var(--text-2);
  }

  .extra {
    margin-left: auto;
  }
</style>
