# ui

xw7 的共享界面：一套设计令牌、主题切换、导航和 Svelte 组件，[博客](https://blog.lucius7.cn/)和[面板](https://lucius7.dev/)都从这里取样式。

[面板](https://lucius7.dev/) · [博客](https://blog.lucius7.cn/) · [组织](https://github.com/xw7qwq)

## 内容

| 文件 | 作用 |
| --- | --- |
| `src/tokens.css` | 颜色、字体、字号、圆角、间距。浅色和深色两套，深色跟随系统，也可以用 `data-theme` 强制 |
| `src/base.css` | 基础排版、链接、焦点环、按钮、输入框、表格 |
| `src/nav.js` | 站点地址和面板栏目，顶栏和页脚都从这里生成 |
| `src/platforms.js` | 刷题平台的名字、简称和颜色 |
| `src/format.js` | 数字、金额、日期、相对时间、时长；日界固定为 UTC+8 |
| `src/scale.js` | 图表刻度和比例尺 |
| `src/theme.js` | 主题读写和防闪烁的内联脚本 |
| `src/components/` | 顶栏、页脚、卡片、指标、热力图、折线图、柱状图、迷你趋势线等组件 |

规则只有三条：

- 颜色只在 `tokens.css` 里定义，页面只用变量。
- 同一个平台在所有页面都是同一个颜色。
- 图表全部用这里的组件，不再引入第三方图表库。

主色取自组织字标的粉色和黑色。`pnpm check` 会检查浅色和深色下正文、次要文字和链接的对比度都达到 WCAG AA。

## 使用

在 Svelte 5 项目里用 Git 依赖安装，版本用标签固定：

```sh
pnpm add github:xw7qwq/ui#v0.1.0
```

```js
import '@xw7/ui/tokens.css';
import '@xw7/ui/base.css';
import { Card, Heatmap, Stat, formatNumber } from '@xw7/ui';
```

页面 `<head>` 里先放主题脚本，避免刷新时闪一下浅色：

```astro
---
import { themeScript } from '@xw7/ui/theme';
---
<script is:inline set:html={themeScript} />
```

## 开发

```sh
pnpm install
pnpm check
```

`pnpm check` 会编译每个组件（客户端和服务端各一次，不允许出现警告），检查组件引用的变量都有定义，并跑工具函数的单元测试。改动发版时更新 `package.json` 的版本号，合入后打同名标签，例如 `v0.2.0`。

## 目录结构

```text
src/
  tokens.css  base.css
  format.js  nav.js  platforms.js  scale.js  theme.js
  index.js
  components/*.svelte
test/
```

## 许可证

[MIT](LICENSE)
