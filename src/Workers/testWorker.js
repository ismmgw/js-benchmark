export default () => {
  // дождаться запроса
  self.addEventListener('message', (e) => { // eslint-disable-line no-restricted-globals
    if (!e) return;

      const startTime = performance.now();
      let res = 0;
      for (let i = 0; i < e.data[0]; i++) {
          res += 1;
          res += res % 2;
      }
      const time = (performance.now() - startTime);

      postMessage({ res, time });

  }, false);
};
