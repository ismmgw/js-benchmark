// класс обертка для веб воркеров в react
export default class WebWorker {
  constructor(workerUrl) {
    const code = workerUrl.toString();
    const blob = new Blob([`(${code})()`]);
    const worker = new Worker(URL.createObjectURL(blob));
    worker.addEventListener('error', this.onError, false);
    return worker;
  }
  
  onError(e) {
    console.log('Line: ' + e.lineno);
    console.log('In: ' + e.filename);
    console.log('Message: ' + e.message);
  }
}
