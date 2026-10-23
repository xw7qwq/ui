import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../src/tokens.css', import.meta.url), 'utf8');

// 取出某个选择器块里的 --变量。
function block(selector) {
  const start = css.indexOf(selector);
  assert.notEqual(start, -1, selector);
  const open = css.indexOf('{', start + selector.length - 1);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) return declarations(css.slice(open + 1, i));
  }
  throw new Error(`unclosed ${selector}`);
}

function declarations(text) {
  const result = new Map();
  for (const match of text.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) result.set(match[1], match[2].trim());
  return result;
}

const light = block(':root {');
const darkMedia = block(':root:not([data-theme="light"]) {');
const darkForced = block(':root[data-theme="dark"] {');
const dark = new Map([...light, ...darkMedia]);

function resolve(map, value) {
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  return ref ? resolve(map, map.get(ref[1])) : value;
}

function luminance(hex) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(map, fg, bg) {
  const a = luminance(resolve(map, map.get(fg)));
  const b = luminance(resolve(map, map.get(bg)));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test('两种深色写法完全一致', () => {
  assert.deepEqual([...darkForced], [...darkMedia]);
});

test('深色只覆盖浅色里已有的变量', () => {
  for (const name of darkMedia.keys()) assert.ok(light.has(name), name);
});

test('组件和样式引用的变量都有定义', () => {
  const sources = [
    readFileSync(new URL('../src/base.css', import.meta.url), 'utf8'),
    readFileSync(new URL('../src/platforms.js', import.meta.url), 'utf8'),
  ];
  const dir = new URL('../src/components/', import.meta.url);
  for (const name of readdirSync(dir)) sources.push(readFileSync(new URL(name, dir), 'utf8'));
  for (const source of sources) {
    const local = new Set([...source.matchAll(/(?:style:)?(--[\w-]+)\s*[:=]/g)].map((m) => m[1]));
    for (const match of source.matchAll(/var\((--[\w-]+)/g)) {
      const name = match[1];
      // var(--heat-${level}) 这类拼接出来的名字，只要求有同前缀的变量。
      const known = name.endsWith('-') ? [...light.keys()].some((key) => key.startsWith(name)) : light.has(name) || local.has(name);
      assert.ok(known, name);
    }
  }
});

for (const [name, map] of [
  ['浅色', light],
  ['深色', dark],
]) {
  test(`${name}文字对比度达到 WCAG AA`, () => {
    const pairs = [
      ['--text', '--bg'],
      ['--text', '--surface'],
      ['--text-2', '--bg'],
      ['--text-2', '--surface-2'],
      ['--text-3', '--bg'],
      ['--text-3', '--surface'],
      ['--accent', '--bg'],
      ['--accent', '--surface'],
      ['--accent-strong', '--accent-soft'],
      ['--accent-ink', '--accent'],
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrast(map, fg, bg);
      assert.ok(ratio >= 4.5, `${fg} on ${bg}: ${ratio.toFixed(2)}`);
    }
  });
}
