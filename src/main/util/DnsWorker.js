import { Worker } from 'worker_threads';
import path from 'path';
import dns from 'dns';

export default class DnsWorker {
  constructor() {
    this.taskQueue = [];
    this.resQueue = [];
    this.worker = new Worker(path.join(__dirname, 'dnsProcessor.js'));
    this.resolvePromise = null;
    this.initEvent();
  }

  initEvent() {
    this.worker.on('message', (result) => {
      // console.log(result);
      this.resQueue.push(result);
      if (this.resolvePromise) {
        const resolve = this.resolvePromise;
        try {
          this.resolvePromise = null;
          const res = this.resQueue.shift();
          // console.log(res);
          resolve(res);
        } catch (e) {
          resolve(null);
        }
      }
    });
  }

  destroy() {
    this.worker.terminate();
  }

  resolve(domain) {
    this.taskQueue.push(domain);
    this.worker.postMessage(domain);

    return new Promise((resolve) => {
      try {
        if (this.resQueue.length > 0) {
          const res = this.resQueue.shift();
          // console.log(res);
          resolve(res);
        } else {
          this.resolvePromise = resolve;
        }
      } catch (e) {
        resolve(null);
      }
    });
  }
}
