import assert from 'node:assert/strict';
import test from 'node:test';
import {
  dayKey,
  formatDate,
  formatDuration,
  formatMoney,
  formatMonthDay,
  formatNumber,
  formatPercent,
  relativeTime,
  shiftDay,
} from '../src/format.js';

test('日期键按 UTC+8 切日', () => {
  // UTC 15:59 还是当天，16:00 已经是第二天。
  assert.equal(dayKey('2026-10-22T15:59:59Z'), '2026-10-22');
  assert.equal(dayKey('2026-10-22T16:00:00Z'), '2026-10-23');
  // 秒级和毫秒级时间戳都能识别。
  assert.equal(dayKey(1792684800), '2026-10-23');
  assert.equal(dayKey(1792684800000), '2026-10-23');
  assert.equal(dayKey(1792684799), '2026-10-22');
  assert.equal(dayKey('not a date'), null);
});

test('日期加减跨月跨年', () => {
  assert.equal(shiftDay('2026-12-31', 1), '2027-01-01');
  assert.equal(shiftDay('2026-03-01', -1), '2026-02-28');
});

test('数字、金额、百分比', () => {
  assert.equal(formatNumber(12345), '12,345');
  assert.equal(formatNumber(3.14159, 1), '3.1');
  assert.equal(formatNumber(null), '—');
  assert.equal(formatMoney(1234.5), '1,234.50');
  assert.equal(formatMoney(-8, 'CNY'), '-8.00 CNY');
  assert.equal(formatPercent(3.21), '+3.2%');
  assert.equal(formatPercent(-0.5), '-0.5%');
});

test('日期显示', () => {
  assert.equal(formatDate('2026-10-22T16:30:00Z'), '2026-10-23');
  assert.equal(formatDate('2026-10-22T16:30:00Z', true), '2026-10-23 00:30');
  assert.equal(formatMonthDay('2026-03-07'), '3月7日');
});

test('时长', () => {
  assert.equal(formatDuration(452), '7 小时 32 分');
  assert.equal(formatDuration(420), '7 小时');
  assert.equal(formatDuration(45), '45 分');
  assert.equal(formatDuration(undefined), '—');
});

test('相对时间', () => {
  const now = Date.parse('2026-10-23T12:00:00Z');
  assert.equal(relativeTime(now - 10_000, now), '刚刚');
  assert.equal(relativeTime(now - 5 * 60_000, now), '5 分钟前');
  assert.equal(relativeTime(now - 3 * 3_600_000, now), '3 小时前');
  assert.equal(relativeTime(now - 86_400_000, now), '昨天');
  assert.equal(relativeTime(now - 5 * 86_400_000, now), '5 天前');
  assert.equal(relativeTime(now - 60 * 86_400_000, now), '2026-08-24');
});
