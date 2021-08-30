import { formatNum } from './format-num';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

describe('util/formatNum', () => {
  test('< 10000', () => {
    expect(formatNum(getRandomIntInclusive(0, 10000))).toMatch(/^\d+$/);
  });

  test('10000 < x < 1000000', () => {
    expect(formatNum(getRandomIntInclusive(10000, 1000000))).toMatch(/^\d+\.?\dw$/);
  });

  test('> 1000000', () => {
    expect(formatNum(getRandomIntInclusive(1000000, 1000000 * 1000))).toMatch(/^99w\+$/);
  });
})
