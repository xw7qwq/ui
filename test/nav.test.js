import assert from 'node:assert/strict';
import test from 'node:test';
import { PANEL_SECTIONS, panelNav, sectionFor } from '../src/nav.js';
import { PLATFORMS, platform, platformId } from '../src/platforms.js';

test('面板导航：内部相对路径，外部绝对路径', () => {
  assert.equal(panelNav()[1].href, '/oj/');
  assert.equal(panelNav('https://lucius7.dev/')[1].href, 'https://lucius7.dev/oj/');
  assert.equal(PANEL_SECTIONS.filter((item) => item.private).map((item) => item.id).join(), 'ledger');
});

test('路径归属栏目', () => {
  assert.equal(sectionFor('/'), 'home');
  assert.equal(sectionFor('/oj/code/'), 'oj');
  assert.equal(sectionFor('/me/health'), 'health');
  assert.equal(sectionFor('/me/ledger/'), 'ledger');
  assert.equal(sectionFor('/me/'), 'home');
});

test('平台名归一', () => {
  assert.equal(platformId('AtCoder'), 'atcoder');
  assert.equal(platformId(' CF '), 'codeforces');
  assert.equal(platformId('unknown'), null);
  assert.equal(platform('qoj'), PLATFORMS.qoj);
  assert.equal(platform('Kattis').id, 'other');
  assert.equal(platform('Kattis').name, 'Kattis');
});
