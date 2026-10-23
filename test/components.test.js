import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { compile } from 'svelte/compiler';

const dir = new URL('../src/components/', import.meta.url);
const files = readdirSync(dir).filter((name) => name.endsWith('.svelte'));

test('组件目录不为空', () => {
  assert.ok(files.length > 0);
});

for (const name of files) {
  test(`${name} 能在客户端和服务端编译，且没有警告`, () => {
    const source = readFileSync(new URL(name, dir), 'utf8');
    for (const generate of ['client', 'server']) {
      const result = compile(source, { filename: name, generate });
      const warnings = result.warnings.map((warning) => `${warning.code}: ${warning.message}`);
      assert.deepEqual(warnings, [], `${name} (${generate})`);
    }
  });
}

test('入口导出了每一个组件', () => {
  const entry = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8');
  for (const name of files) assert.ok(entry.includes(`./components/${name}`), name);
});
