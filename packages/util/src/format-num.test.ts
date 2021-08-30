import { formatNum } from './format-num';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

test('formatNum', () => {
  expect(formatNum(getRandomIntInclusive(0, 10000))).toMatch(/^\d+$/);
  expect(formatNum(getRandomIntInclusive(10000, 1000000))).toMatch(/^\d+\.?\dw$/);
  expect(formatNum(getRandomIntInclusive(1000000, 1000000 * 1000))).toMatch(/^99w\+$/);
});