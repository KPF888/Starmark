import { message } from 'antd';
import StoreClient from './StoreClient';

class Fofa {
  constructor(apiKey, url) {
    this._url = url;
    this._apiKey = apiKey;
  }

  async _sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async _query(keyWord = '', size = 100) {
    const qbase64 = btoa(keyWord);
    const url = `${this._url}/api/v1/search/all?key=${this._apiKey}&qbase64=${qbase64}&size=${size}`;
    console.log('fofa req: ', url);
    return await fetch(url, {
      method: 'GET'
    }).then((res) => {
      return res.json();
    });
  }

  async _fofaTest() {
    const qbase64 = btoa('domain="baidu.com"');
    const res = await fetch(
      `${this._url}/api/v1/search/all?key=${this._apiKey}&qbase64=${qbase64}&size=10`,
      {
        method: 'GET'
      }
    ).then((res) => {
      return res.json();
    });
    return !!res.error ? false : true;
  }

  async getSubDomain(domainList, setSubDomain) {
    // 判断apikey是否可用
    const fofaTest = await this._fofaTest();
    if (!fofaTest) {
      throw new Error('fofApi无效');
    }

    let allList = [];
    const promiseArr = [];
    for (let i = 0; i < domainList.length; i++) {
      const oneList = [];
      const qPromise = this._query(
        `domain="${domainList[i]}" || cert="${domainList[i]}"`,
        10000
      );
      qPromise
        .then((res) => {
          if (res.error === false) {
            res.results.forEach((item) => {
              oneList.push(
                item[0].replace('http://', '').replace('https://', '')
              );
            });
          } else {
            throw new Error('fofa接口请求失败' + res.errmsg);
            // reject("fofa接口请求失败" + res.errmsg);
          }

          // 更新视图列表
          allList.push(...oneList);
          setSubDomain(oneList);
        })
        .catch((e) => {
          message.error(e.message);
        });

      promiseArr.push(qPromise);
      await this._sleep(800);
    }

    // 等待所有结果完成
    await Promise.all(promiseArr);
    return allList;
  }
}

export default Fofa;
