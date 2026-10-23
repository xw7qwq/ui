<script>
  import { onMount } from 'svelte';
  import { SITES, panelNav } from '../nav.js';
  import Logo from './Logo.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  // base：面板地址。面板内部留空用相对路径；博客等外部站点传 https://lucius7.dev。
  let { current = 'home', base = '', blogHref = SITES.blog, external = false } = $props();
  let signedIn = $state(false);
  // 私有栏目（记账）对访客完全不显示，登录后才出现在导航里。
  const items = $derived(panelNav(base).filter((item) => !item.private || signedIn));

  onMount(() => {
    // 只是界面提示；真正的权限由服务端会话决定。
    signedIn = !external && document.cookie.split('; ').includes('xw7_signed_in=1');
  });
</script>

<header class="xw7-topbar">
  <div class="inner">
    <a class="brand" href={base ? `${base.replace(/\/+$/, '')}/` : '/'} aria-label="xw7 面板首页">
      <Logo size={24} />
      <span class="word">xw7</span>
    </a>
    <nav class="sections" aria-label="面板栏目">
      {#each items as item (item.id)}
        <a href={item.href} class:active={current === item.id} aria-current={current === item.id ? 'page' : undefined}>
          {item.label}
          {#if item.private}
            <svg class="lock" viewBox="0 0 24 24" aria-label="仅自己可见"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          {/if}
        </a>
      {/each}
    </nav>
    <div class="actions">
      <a class="blog" class:active={current === 'blog'} href={blogHref}>博客</a>
      <ThemeToggle />
      {#if !external}
        {#if signedIn}
          <a class="account" href="/me/">我的</a>
        {:else}
          <a class="account" href="/login/">登录</a>
        {/if}
      {/if}
    </div>
  </div>
</header>

<style>
  .xw7-topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    height: var(--topbar-height);
    border-bottom: 1px solid var(--border);
    background: var(--overlay);
    backdrop-filter: saturate(160%) blur(12px);
    -webkit-backdrop-filter: saturate(160%) blur(12px);
  }

  .inner {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    width: min(100% - 2 * var(--space-4), var(--content-width));
    height: 100%;
    margin-inline: auto;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text);
    text-decoration: none;
  }

  .brand:hover {
    text-decoration: none;
    color: var(--accent);
  }

  .word {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .sections {
    display: flex;
    gap: var(--space-1);
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .sections::-webkit-scrollbar {
    display: none;
  }

  .sections a,
  .blog,
  .account {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.3rem 0.7rem;
    border-radius: var(--radius-pill);
    color: var(--text-2);
    font-size: var(--text-sm);
    font-weight: 550;
    white-space: nowrap;
    text-decoration: none;
  }

  .sections a:hover,
  .blog:hover,
  .account:hover {
    background: var(--surface-2);
    color: var(--text);
    text-decoration: none;
  }

  .sections a.active,
  .blog.active {
    background: var(--accent-soft);
    color: var(--accent-strong);
  }

  .lock {
    width: 12px;
    height: 12px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    opacity: 0.7;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-left: auto;
  }

  .account {
    border: 1px solid var(--border);
  }

  @media (max-width: 720px) {
    .word {
      display: none;
    }

    .inner {
      gap: var(--space-2);
    }

    .blog {
      display: none;
    }
  }
</style>
