import packageJson from '../package.json';

export const test = 'test';

export const testFn = () => {
  console.log('test');
};

// export const testPeerModule = () => {
//   console.log(Vue);
// }

export const testES6 = () => {
  const obj = {
    time: Date.now(),
  };
  const payload = {
    name: 'test'
  };

  console.log({
    ...obj,
    ...payload,
  });
}

export interface TSOptions {
  name: string;
  age: string;
}
export const testTs = (options: TSOptions) => {
  console.log(options);
}

export const version = packageJson.version;