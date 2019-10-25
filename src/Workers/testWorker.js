export default () => {
  self.addEventListener('message', (e) => { // eslint-disable-line no-restricted-globals
    if (!e) return;
      const limit = e.data[0];
      const startTime = performance.now();

      let res = 0;
      for (let i = 0; i < limit; i++) {
          res += 1;
          res += res % 2;
      }
      const time = (performance.now() - startTime);

      postMessage({ res, time });

  }, false);
};
