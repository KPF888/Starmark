import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import path from 'node:path';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

// 对主线程传入的任务的封装，继承 AsyncResource 使得任务可以被 async_hook 捕捉
class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result); // result 为通过 worker 计算出的结果
    this.emitDestroy(); // `TaskInfo`s are used only once.
  }
}

// 继承 EventEmitter ，使得具有 发布-订阅 功能
export default class WorkerPool extends EventEmitter {
  constructor(numThreads, processorPath) {
    super();
    this.numThreads = numThreads; // 开启的线程数量
    this.processorPath = processorPath;
    this.workers = []; // 保存创建的worker
    this.freeWorkers = []; // 保存空闲的worker
    this.tasks = []; // 保存要执行的任务

    for (let i = 0; i < numThreads; i++) {
      this.addNewWorker(); // 根据线程数量添加 woker
    }

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    // 触发 worker 执行任务
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.join(__dirname, this.processorPath));
    worker.on('message', (result) => {
      worker[kTaskInfo].done(null, result); // worker 计算出的结果返回给到 WorkerPoolTaskInfo 中去执行回调
      worker[kTaskInfo] = null; // 执行完任务清除当前 worker 绑定的内容
      this.freeWorkers.push(worker); // 标识为空闲 worker
      this.emit(kWorkerFreedEvent); // 通知空闲 worker 执行下一个任务
    });
    worker.on('error', (err) => {
      // 错误处理
      if (worker[kTaskInfo]) worker[kTaskInfo].done(err, null);
      else this.emit('error', err);
      // 删除该worker，重新创建一个worker
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent); // 为了 worker 出错时，让新增加的 worker 执行任务
  }

  runTask(task, callback) {
    // 如果没有空闲 worker，缓存任务到任务队列中
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }
    // 获取空闲 worker
    const worker = this.freeWorkers.pop();
    // 封装主线程传递的回调，通过 runInAsyncScope 使得回调执行可以被追踪
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    // 通知 worker 执行任务
    worker.postMessage(task);
  }

  close() {
    //
    for (const worker of this.workers) worker.terminate(); // 终止工作线程释放资源
  }
}
