/**
 * 子域名爆破类
 */

import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { CONFIG_PATH } from '../config';
import { promisePool } from '../util/promisePool.js';
import { Worker } from 'worker_threads';

export class SubDomainBrute {
  _domainList = []; // 根域名列表
  _dict = []; // 字典
  _concurrent = 30; // 并发数

  /**
   *
   * @param domainList 根域名列表
   * @param concurrent 并发数
   */
  constructor(domainList, concurrent = 30) {
    this._domainList = domainList;
    this._concurrent = concurrent;
    this._initDict();
  }

  _initDict() {
    // 子域名字典文件路径
    const subdomainsFile = path.join(CONFIG_PATH, 'subdomain.txt');
    try {
      // 从文件中读取子域名
      this._dict = fs.readFileSync(subdomainsFile, 'utf8').trim().split('\r\n');
      // console.log(this._dict);
      // throw new Error('测试错误');
    } catch (err) {
      throw new Error(`无法读取子域名字典文件: ${subdomainsFile},原因:${err}`);
    }
  }

  // 解析子域名的函数
  _resolveSubdomain(subdomain, domain, timeout = 5000) {
    return new Promise((resolve) => {
      const fullDomain = `${subdomain}.${domain}`;
      // console.log(`正在解析子域名: ${fullDomain}`);

      // 创建一个超时的Promise
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(null), timeout);
      });

      // 创建一个DNS解析的Promise
      const dnsPromise = new Promise((resolve) => {
        dns.resolve(fullDomain, (err, addresses) => {
          if (err) {
            // 子域名未找到或解析错误
            // console.log(`${fullDomain} not found`);
            resolve(null);
          } else {
            // 找到子域名
            console.log(`${fullDomain} found`);
            resolve(fullDomain);
          }
        });
      });

      // 使用Promise.race来返回第一个完成的Promise
      Promise.race([dnsPromise, timeoutPromise]).then(resolve);
    });
  }

  // 获得一个任务
  _getTask(subdomain, domain, timeout) {
    return () => {
      return this._resolveSubdomain(subdomain, domain, timeout);
    };
  }

  // 爆破子域名
  /**
   *
   * @param event 渲染进程事件
   * @returns
   */
  bruteForceSubdomains(event, timeout) {
    const taskList = this._domainList
      .map((domain) => {
        const task = [];
        this._dict.forEach((subdomain) => {
          task.push(this._getTask(subdomain, domain, timeout));
        });

        return task;
      })
      .flat(); // 将二维数组转换为一维数组

    // 每个任务完成后的回调函数
    const taskHandle = (res, finished, all) => {
      // 把数据发送给渲染进程,控制发送频率
      event.sender.send('bruteRes', { res, finished, all });
    };

    console.log('concurrent:', this._concurrent);
    return promisePool(taskList, this._concurrent, taskHandle);
  }

  bruteForceSubdomains2(event, timeout) {
    const workerPath = path.join(__dirname, 'bruteWorker.js');
    console.log(workerPath);
    const worker = new Worker(workerPath, {
      domainList: this._domainList,
      concurrent: this._concurrent,
      event,
      timeout
    });
  }
}
