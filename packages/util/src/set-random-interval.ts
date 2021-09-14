/**
 * 随机数计时器，可用于散点上报的情况，分散到服务器的请求
 */
export const setRandomInterval = (intervalFunction: () => void, minDelay: number, maxDelay: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  const runInterval = () => {
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() {
      clearTimeout(timeout);
    },
  };
};

