import { Button, Card, message, Modal, Progress, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CopyOutlined } from '@ant-design/icons';
import SubDomainFinder from '../../../util/SubDomainFinder.js';
import SubDomainListWindow from '../../../event/SubDomainListWindow.js';
import _ from 'lodash';

const SubDomainList = () => {
  const { ipcRenderer } = electron;
  const [sdList, setSdList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [finishCount, setFinishCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const {
    domainList,
    deep,
    waitTime,
    fileName,
    concurrent,
    fofaConfig,
    timeout,
    action
  } = JSON.parse(searchParams.get('params'));
  const [sFinder, setSFinder] = useState(
    new SubDomainFinder({
      domainList,
      setSubDomain: updateSdList,
      fofaConfig,
      concurrent,
      updateBruteFinishCount: setFinishCount,
      updateBruteTotalCount: setTotal
    })
  );
  const [modal, contextHolder] = Modal.useModal();

  /*modal config*/
  const config = {
    title: '警告',
    content: (
      <>
        <p>确定要关闭窗口吗,数据不会保存?</p>
      </>
    )
  };

  /*useEffect*/
  useEffect(() => {
    /*修改窗口标题*/
    document.title = `${fileName}文件子域名收集数据展示`;
    /*注册窗口*/
    ipcRenderer.send(SubDomainListWindow.REGISTER_SUBLIST_WIN);

    doAction();

    return () => {};
  }, []);
  useEffect(() => {
    /*窗口关闭事件*/
    ipcRenderer.on('close-subdomain-window', handleCloseWindow);
    ipcRenderer.on(SubDomainListWindow.START_FOFA_CHANNEL, handleFofaSearch);
    ipcRenderer.on(SubDomainListWindow.START_BRUTE_CHANNEL, handleBruteSearch);
    ipcRenderer.on(SubDomainListWindow.START_FLOW_CHANNEL, handleSpiderSearch);
    return () => {
      ipcRenderer.removeAllListeners('close-subdomain-window');
      ipcRenderer.removeAllListeners(SubDomainListWindow.START_FOFA_CHANNEL);
      ipcRenderer.removeAllListeners(SubDomainListWindow.START_BRUTE_CHANNEL);
      ipcRenderer.removeAllListeners(SubDomainListWindow.START_FLOW_CHANNEL);
    };
  }, [sdList]);

  function doAction() {
    /*判断启动操作*/
    switch (action) {
      case 'fofa':
        handleFofaSearch(sFinder);
        break;
      case 'brute':
        handleBruteSearch();
        break;
      case 'spider':
        handleSpiderSearch();
        break;
      default:
        break;
    }
  }

  /*state setter*/
  function updateSdList(newSubDomain) {
    if (_.isArray(newSubDomain)) {
      setSdList((list) => [...new Set([...list, ...newSubDomain])]);
    } else if (_.isString(newSubDomain)) {
      setSdList((list) => [...new Set([...list, newSubDomain])]);
    }
  }

  /*计算数据*/
  const percent = Math.round((finishCount / total) * 100);

  /*视图组件数据*/
  const subColumns = [
    {
      title: '子域名',
      dataIndex: 'domain',
      key: 'domain'
    }
  ];
  const subIpColumns = [
    {
      title: 'IP地址',
      dataIndex: 'domain',
      key: 'domain'
    }
  ];
  const domainReg =
    /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;
  const ipv4Reg =
    /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/;
  const ipv6Reg =
    /(^(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$)|(^\[(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))](?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$)/i;
  const allList = sdList?.map((item) => ({ domain: item }));
  const viewSubList = allList?.filter((item) => domainReg.test(item.domain));
  const viewIpList = allList?.filter(
    (item) => ipv4Reg.test(item.domain) || ipv6Reg.test(item.domain)
  );

  /*事件处理函数*/
  async function handleFofaSearch(sFinder) {
    try {
      message.info('开始Fofa收集');
      setSearchText('Fofa收集中');
      await sFinder.getByFofa();
      message.success('Fofa收集完成!');
    } catch (e) {
      message.error(e.message);
    } finally {
      ipcRenderer.send(SubDomainListWindow.FINISH_FOFA_CHANNEL);
      setSearchText('');
    }
  }

  async function handleBruteSearch() {
    try {
      message.info('开始爆破收集');
      setSearchText('爆破收集中');
      console.log('timeout: ', timeout);
      await sFinder.getByBrute2(timeout);
      message.success('爆破收集完成!');
    } catch (e) {
      message.error(e.message);
    } finally {
      ipcRenderer.send(SubDomainListWindow.FINISH_BRUTE_CHANNEL);
      setSearchText('');
    }
  }
  async function handleSpiderSearch() {
    try {
      message.info('开始爬虫收集');
      setSearchText('爬虫收集中');
      const subDomainList = viewSubList.map((item) => item.domain);
      const originAll = subDomainList.concat(domainList)
      for (let i = 0; i < originAll.length; i++) {
        const subdomain = originAll[i];
        let rootDomain;
        domainList.forEach((domain) => {
          if (subdomain.includes(domain)) {
            rootDomain = domain;
          }
        });
        const httpUrl = `http://${subdomain}`;
        const httpsUrl = `https://${subdomain}`;
        const { result: result1, count: count1 } = await sFinder.getBySpider(
          httpUrl,
          rootDomain,
          deep,
          waitTime
        );
        const { result: result2, count: count2 } = await sFinder.getBySpider(
          httpsUrl,
          rootDomain,
          deep,
          waitTime
        );
        const result = [...new Set(result1.concat(result2))];
        // console.log(result);
        const count = count1 + count2;
        const length = result.length;
        updateSdList(result);
        message.success(
          `${subdomain}收集完成,共访问${count}个链接,收集到${length}个子域名`
        );
      }

      message.success('爬虫收集完成!');
    } catch (e) {
      message.error(e.message);
    } finally {
      ipcRenderer.send(SubDomainListWindow.FINISH_FLOW_CHANNEL);
      setSearchText('');
    }
  }

  const handleCopySubList = async () => {
    if (viewSubList.length === 0) return message.warning('子域名列表为空');
    const subDomainList = viewSubList.map((item) => item.domain);
    console.log(subDomainList);
    try {
      // 使用 navigator.clipboard.writeText 复制文本
      const subListText = subDomainList.join('\n');
      await navigator.clipboard.writeText(subListText);
      message.success('子域名列表已复制到剪贴板');
    } catch (err) {
      // 如果复制失败（例如，用户拒绝了权限），则显示错误消息
      message.warning('无法复制文本: ', err);
    }
  };
  const handleCopySubIpList = async () => {
    if (viewIpList.length === 0) return message.warning('IP列表为空');
    const ipList = viewIpList.map((item) => item.domain);
    try {
      // 使用 navigator.clipboard.writeText 复制文本
      const subListText = ipList.join('\n');
      await navigator.clipboard.writeText(subListText);
      message.success('IP列表已复制到剪贴板');
    } catch (err) {
      // 如果复制失败（例如，用户拒绝了权限），则显示错误消息
      message.warning('无法复制文本: ', err);
    }
  };

  async function handleCloseWindow() {
    if (sdList.length === 0) {
      ipcRenderer.send('close-subdomain-window');
    } else {
      const confirmed = await modal.confirm(config);
      if (confirmed) {
        ipcRenderer.send('close-subdomain-window');
      }
    }
  }

  return (
    <>
      {contextHolder}
      <Card
        title={'收集信息展示:' + searchText}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <div
          className="subdomain-list"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: '350px',
            width: '100%'
          }}
        >
          <Table
            style={{
              flex: 1
            }}
            virtual
            scroll={{
              y: 300
            }}
            size="small"
            loading={false}
            columns={subColumns}
            rowKey="domain"
            dataSource={viewSubList}
            pagination={false}
          />

          <Table
            style={{
              flex: 1
            }}
            scroll={{
              y: 300
            }}
            virtual
            size="small"
            loading={false}
            columns={subIpColumns}
            rowKey="domain"
            dataSource={viewIpList}
            pagination={false}
          />
        </div>

        <div className="brute">
          {total === 0 ? (
            ''
          ) : (
            <>
              <p>爆破进度:</p>
              <Progress percent={percent} status="active" />
            </>
          )}
          <div />
        </div>

        <div>
          <Button
            style={{ marginRight: 10 }}
            onClick={handleCopySubList}
            type="primary"
            icon={<CopyOutlined />}
          >
            一键复制子域名
          </Button>
          <Button
            onClick={handleCopySubIpList}
            type="primary"
            icon={<CopyOutlined />}
          >
            一键复制IP
          </Button>
        </div>
        <div className={'font-bold text-base'} style={{ marginRight: 20 }}>
          <h3>子域名数量(已去重): {viewSubList?.length}</h3>

          <h3>IP数量(已去重): {viewIpList?.length}</h3>

          {total === 0 ? (
            ''
          ) : (
            <h3>子域名爆破进度:{`${finishCount}/${total}`}</h3>
          )}
        </div>
      </Card>
    </>
  );
};

export default SubDomainList;
