<script>
  // 加载占位：lines 行，或者一个固定高度的块。
  let { lines = 3, height = 0 } = $props();
</script>

<div class="xw7-skeleton" aria-busy="true" aria-label="加载中">
  {#if height}
    <span class="block" style:height={`${height}px`}></span>
  {:else}
    {#each Array.from({ length: lines }) as _, index (index)}
      <span class="line" style:width={`${index === lines - 1 ? 60 : 100}%`}></span>
    {/each}
  {/if}
</div>

<style>
  .xw7-skeleton {
    display: grid;
    gap: 10px;
  }

  .line,
  .block {
    display: block;
    border-radius: var(--radius-1);
    background: linear-gradient(90deg, var(--surface-2), var(--surface-3), var(--surface-2));
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  .line {
    height: 12px;
  }

  @keyframes shimmer {
    from {
      background-position: 100% 0;
    }

    to {
      background-position: -100% 0;
    }
  }
</style>
