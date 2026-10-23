import assert from 'node:assert/strict';
import test from 'node:test';
import { dayToMs, linePath, linear, niceTicks } from '../src/scale.js';

test('刻度覆盖数据范围且步长整齐', () => {
  assert.deepEqual(niceTicks(0, 10, 5), [0, 2, 4, 6, 8, 10]);
  const ticks = niceTicks(3.2, 97.5, 4);
  assert.ok(ticks[0] <= 3.2 && ticks.at(-1) >= 97.5);
  assert.ok(niceTicks(5, 5).length > 1);
  assert.deepEqual(niceTicks(0.1, 0.9, 4), [0, 0.2, 0.4, 0.6, 0.8, 1]);
});

test('线性比例尺', () => {
  const scale = linear([0, 10], [100, 0]);
  assert.equal(scale(0), 100);
  assert.equal(scale(5), 50);
  assert.equal(linear([3, 3], [0, 10])(3), 0);
});

test('折线遇到缺失值断开', () => {
  const identity = (v) => v;
  const d = linePath(
    [
      { x: 0, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: null },
      { x: 3, y: 4 },
    ],
    identity,
    identity,
  );
  assert.equal(d, 'M0.0 1.0L1.0 2.0M3.0 4.0');
});

test('日期转毫秒', () => {
  assert.equal(dayToMs('1970-01-02'), 86_400_000);
});
