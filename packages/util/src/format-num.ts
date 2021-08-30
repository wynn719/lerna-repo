export function formatNum(num: number): string {
  const tempNum = Number(num);

  if (tempNum >= 10000 && tempNum < 1000000) return `${Math.floor(tempNum / 1000) / 10}w`;
  if (tempNum >= 1000000) return `99w+`;

  return String(tempNum);
}
