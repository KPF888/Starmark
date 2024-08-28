import { message } from 'antd';
import Fofa from './Fofa';
import { SubDomainBrute } from './SubDomainBrute.js';

const { ipcRenderer } = electron;

class SubDomainFinder {
  /**
   * 构造函数
   * @param domainList 根域名列表
   * @param setSubDomain 子域名列表的setter
   * @param fofaConfig fofa的配置
   * @param concurrent
   * @param updateBruteTotalCount
   * @param updateBruteFinishCount
   */
  constructor({
    domainList,
    setSubDomain,
    fofaConfig,
    concurrent,
    updateBruteTotalCount,
    updateBruteFinishCount
  }) {
    this._domainList = domainList;
    this._setSubDomain = setSubDomain;
    this._fofaKey = fofaConfig.fofaKey;
    this._fofaUrl = fofaConfig.fofaUrl;
    this._concurrent = concurrent;
    this._updateBruteTotalCount = updateBruteTotalCount;
    this._updateBruteFinishCount = updateBruteFinishCount;
  }

  getByFofa() {
    const fofa = new Fofa(this._fofaKey, this._fofaUrl);
    return fofa.getSubDomain(this._domainList, this._setSubDomain);
  }

  getBySpider(...args) {
    return ipcRenderer.invoke('spider-search', ...args);
  }

  getByBrute(timeout, dictPath) {
    const brute = new SubDomainBrute(
      this._domainList,
      this._setSubDomain,
      this._concurrent
    );
    return brute.bruteForceSubdomains(
      timeout,
      this._updateBruteTotalCount,
      this._updateBruteFinishCount,
      dictPath
    );
  }
}

export default SubDomainFinder;
