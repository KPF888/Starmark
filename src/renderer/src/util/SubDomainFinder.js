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

  async getByBrute(timeout) {
    // 接收数据更新视图的回调函数
    function _updateSubDomainList({
      setSubDomain,
      setBruteTotalCount,
      setBruteFinishCount
    }) {
      let lastAll = 0;
      let lastFinish = 0;
      window.electron.ipcRenderer.on(
        'bruteRes',
        (event, { res, finished, all }) => {
          if (finished - lastFinish > 50) {
            setBruteFinishCount(finished);
            lastFinish = finished;
          } else if (all === finished) {
            setBruteFinishCount(finished);
          }
          if (all !== lastAll) {
            setBruteTotalCount(all);
            lastAll = all;
          }

          if (res) {
            console.log('bruteRes', res);
            message.success(
              `${res}存在,已爆破${finished}个子域名，总共${all}个`
            );
            setSubDomain(res);
          }
        }
      );
    }

    _updateSubDomainList({
      setSubDomain: this._setSubDomain,
      setBruteTotalCount: this._updateBruteTotalCount,
      setBruteFinishCount: this._updateBruteFinishCount
    });

    const options = {
      domainList: this._domainList,
      concurrent: this._concurrent,
      timeout
    };
    console.log('_getByBrute', options);

    return ipcRenderer.invoke('bruteSubDomain', options);
  }

  getByBrute2(timeout) {
    const brute = new SubDomainBrute(
      this._domainList,
      this._setSubDomain,
      this._concurrent
    );
    return brute.bruteForceSubdomains(
      timeout,
      this._updateBruteTotalCount,
      this._updateBruteFinishCount
    );
  }
}

export default SubDomainFinder;
