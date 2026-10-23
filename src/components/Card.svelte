<script>
  // 统一卡片：标题行（可选“更多”链接和右侧操作）+ 内容。
  let { title = '', subtitle = '', href = '', hrefLabel = '查看全部', tone = 'default', id = undefined, children, actions } = $props();
</script>

<section class="xw7-card" data-tone={tone} {id}>
  {#if title || actions || href}
    <header>
      <div class="titles">
        {#if title}<h2>{title}</h2>{/if}
        {#if subtitle}<p>{subtitle}</p>{/if}
      </div>
      <div class="side">
        {#if actions}{@render actions()}{/if}
        {#if href}<a class="more" {href}>{hrefLabel} →</a>{/if}
      </div>
    </header>
  {/if}
  <div class="body">
    {@render children?.()}
  </div>
</section>

<style>
  .xw7-card {
    min-width: 0;
    padding: var(--space-5);
    border: 1px solid var(--border);
    border-radius: var(--radius-3);
    background: var(--surface);
    box-shadow: var(--shadow-1);
  }

  .xw7-card[data-tone='accent'] {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
    background: linear-gradient(160deg, var(--accent-soft), var(--surface) 55%);
  }

  .xw7-card[data-tone='flat'] {
    box-shadow: none;
    background: var(--surface-2);
  }

  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  h2 {
    font-size: var(--text-lg);
  }

  .titles p {
    margin-top: 2px;
    color: var(--text-3);
    font-size: var(--text-sm);
  }

  .side {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-2);
  }

  .more {
    font-size: var(--text-sm);
    white-space: nowrap;
  }

  @media (max-width: 560px) {
    .xw7-card {
      padding: var(--space-4);
    }
  }
</style>
