/**
 * 子域名爆破类
 */
import { message } from 'antd';

const { ipcRenderer } = electron;
import { promisePool } from './promisePool.js';

export class SubDomainBrute {
  _domainList = []; // 根域名列表
  _dict = []; // 字典
  _concurrent = 30; // 并发数

  /**
   *
   * @param domainList 根域名列表
   * @param setSubDomain subDomain的setter
   * @param concurrent 并发数
   */
  constructor(domainList, setSubDomain, concurrent = 30) {
    this._domainList = domainList;
    this._concurrent = concurrent;
    this.setSubDomain = setSubDomain;
  }

  async _initDict() {
    this._dict = await ipcRenderer.invoke('get-dict');
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
      const dnsPromise = new Promise(async (resolve) => {
        const resolveRes = await ipcRenderer.invoke('dns-resolve', fullDomain);
        resolve(resolveRes);
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
   * @param timeout 超时时间
   * @param setTotal
   * @param setFinished
   * @returns
   */
  async bruteForceSubdomains(timeout, setTotal, setFinished) {
    await this._initDict();
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
      if (res) {
        const { domain, addr } = res;
        this.setSubDomain([...addr, domain]);
        message.success(`${res.domain}存在`);
      }
      setFinished(finished);
      setTotal(all);
    };

    console.log('concurrent:', this._concurrent);
    return promisePool(taskList, this._concurrent, taskHandle);
  }
}
