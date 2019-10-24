export default () => {
  // дождаться запроса
  self.addEventListener('message', (e) => { // eslint-disable-line no-restricted-globals
    if (!e) return;

      const a = performance.now();
      console.log('start');
      let res = 0;
      for (let i = 0; i < e.data[0]; i++) {
        res += 1;
        res += res % 2;
      }
      const endTime = (performance.now() - a) / 1000;
      console.log('end ', endTime);

      postMessage({ res, time: endTime });

  }, false);
};
