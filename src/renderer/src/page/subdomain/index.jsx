import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, InputNumber, List, message, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../assets/scss/subdomain.scss';
import FileUtil from '../../util/FileUtil';

import {
  resetState,
  setBruteLoading,
  setBruteTimeout,
  setConcurrent,
  setDeep,
  setDList,
  setFlowLoading,
  setFofaLoading,
  setSearchText,
  setSubWinOpened,
  setWaitTime
} from '../../data/subDomainDataSlice';
import SubDomainListWindow from '../../event/SubDomainListWindow.js';
import FileSelector from '../../component/FileSelector.jsx';

const SubDomain = () => {
  const { ipcRenderer } = electron;

  const {
    subWinOpened,
    dList: domainList,
    searchText,
    concurrent,
    fofaLoading,
    bruteLoading,
    flowLoading,
    timeout,
    deep,
    waitTime,
    dictPath
  } = useSelector((state) => state.subDomainData);
  const dispatch = useDispatch();
  const { fofaApiKey: fofaKey, fofaUri: fofaUrl } = useSelector(
    (state) => state.userConfigData
  );
  const fofaConfig = {
    fofaKey,
    fofaUrl
  };
  const [currentName, setCurrentName] = useState('选择根域名列表');

  /*条件渲染组件*/
  let spin = null;
  if (searchText !== '') {
    spin = <Spin indicator={<LoadingOutlined spin />}>{searchText}</Spin>;
  }

  /** redux setter */
  const setDomainList = (domains) => dispatch(setDList(domains));

  /*hook*/
  useEffect(() => {
    /* 清除旧的监听器 */
    ipcRenderer.removeAllListeners(SubDomainListWindow.FINISH_FOFA_CHANNEL);
    ipcRenderer.removeAllListeners(SubDomainListWindow.FINISH_BRUTE_CHANNEL);
    ipcRenderer.removeAllListeners(SubDomainListWindow.FINISH_FLOW_CHANNEL);
    ipcRenderer.removeAllListeners('subdomain-closed');

    /*监听子窗口关闭*/
    ipcRenderer.on('subdomain-closed', handleCloseSubDomainWindow);
    /*注册主窗口*/
    ipcRenderer.send(SubDomainListWindow.REGISTER_MAIN_WIN);
    /*监听fofa搜索完成事件*/
    ipcRenderer.on(SubDomainListWindow.FINISH_FOFA_CHANNEL, fofaFinish);
    /*监听brute搜索完成*/
    ipcRenderer.on(SubDomainListWindow.FINISH_BRUTE_CHANNEL, bruteFinish);
    /*监听爬虫收集完成事件*/
    ipcRenderer.on(SubDomainListWindow.FINISH_FLOW_CHANNEL, spiderFinish);
  }, []);

  /** 事件处理函数 */
  async function fileHandleClick() {
    const fileUtil = new FileUtil('.file-input');
    await fileUtil.build();
    try {
      const content = await fileUtil.getFileText();
      const newDL = content.trim().split('\r\n');
      message.success('根域名文件读取成功');

      setCurrentName(await fileUtil.getFileName());
      setDomainList(newDL);
    } catch (e) {
      message.warning(e);
    }
  }

  const handleConcurrentChange = (value) => {
    // console.log(value);
    dispatch(setConcurrent(value));
  };

  /*收集动作相关*/
  async function openSubWin(action) {
    const params = {
      domainList,
      fileName: currentName,
      concurrent,
      fofaConfig,
      timeout,
      deep,
      waitTime,
      action,
      dictPath
    };

    try {
      ipcRenderer.send('open-subdomain-window', params);
      dispatch(setSubWinOpened(true));
      return true;
    } catch (e) {
      message.error(e.message);
      return false;
    }
  }

  function domainValid() {
    if (domainList.length === 0) {
      message.warning('请选择根域名文件');
      return false;
    }
    return true;
  }

  function fofaValid() {
    function _validFofaConfig(fofaConfig) {
      const urlReg =
        /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;

      if (fofaConfig.fofaUrl === '') {
        message.warning('fofa接口地址不可为空');
        return false;
      } else if (!urlReg.test(fofaConfig.fofaUrl)) {
        message.warning('fofaURL不是url,请重新填写');
        return false;
      } else if (fofaConfig.fofaKey === '') {
        message.warning('fofaAPI Key不可为空，请前往配置页配置');
        return false;
      }

      return true;
    }

    return _validFofaConfig(fofaConfig);
  }

  async function handleFofaSearch() {
    if (!fofaValid()) return;
    if (!domainValid()) return;
    dispatch(setFofaLoading(true));
    dispatch(setSearchText('Fofa收集中'));
    if (subWinOpened) {
      ipcRenderer.send(SubDomainListWindow.START_FOFA_CHANNEL);
    } else {
      await openSubWin('fofa');
    }
  }

  async function fofaFinish(_e) {
    console.log('Fofa finish event triggered');
    dispatch(setFofaLoading(false));
    message.success('Fofa收集完成!');
    dispatch(setSearchText(''));
  }

  async function handleBruteSearch() {
    if (!domainValid()) return;
    dispatch(setBruteLoading(true));
    dispatch(setSearchText('爆破收集中'));
    if (subWinOpened) {
      ipcRenderer.send(SubDomainListWindow.START_BRUTE_CHANNEL);
    } else {
      await openSubWin('brute');
    }
  }

  async function bruteFinish(_e) {
    dispatch(setBruteLoading(false));
    message.success('爆破收集完成!');
    dispatch(setSearchText(''));
  }

  async function handleSpiderSearch() {
    if (!domainValid()) return;
    dispatch(setFlowLoading(true));
    dispatch(setSearchText('爬虫收集中'));
    if (subWinOpened) {
      ipcRenderer.send(SubDomainListWindow.START_FLOW_CHANNEL);
    } else {
      await openSubWin('spider');
    }
  }

  async function spiderFinish(_e) {
    dispatch(setFlowLoading(false));
    message.success('爬虫收集完成!');
    dispatch(setSearchText(''));
  }

  async function handleCloseSubDomainWindow() {
    // message.info('子窗口关闭');
    dispatch(resetState());
  }

  return (
    <>
      <Space className="action-search flex pl-1">
        <div className="file-selector">
          <FileSelector
            fileClassName={'file-input'}
            onClick={fileHandleClick}
            currentName={currentName}
          />
        </div>

        <Button
          type={'primary'}
          onClick={handleFofaSearch}
          loading={fofaLoading}
          icon={<SearchOutlined />}
        >
          fofa收集
        </Button>

        <Button
          type={'primary'}
          onClick={handleBruteSearch}
          loading={bruteLoading}
          icon={<SearchOutlined />}
        >
          爆破收集
        </Button>

        <Button
          type={'primary'}
          onClick={handleSpiderSearch}
          loading={flowLoading}
          icon={<SearchOutlined />}
        >
          爬虫收集
        </Button>

        {spin}
      </Space>

      <Space className={'pl-1 mt-5 flex justify-items-center'} size="large">
        <div className="brute-concurrent flex justify-start items-center">
          <p className={'text-center mr-1'}>爆破并发数:</p>
          <InputNumber
            value={concurrent}
            min={1}
            onChange={handleConcurrentChange}
          />
          <p className={'ml-1'}>(根据网络情况自行调节,建议不高于200)</p>
        </div>

        <div className="brute-timeout flex justify-start items-center">
          <p className={'mr-1'}>爆破超时时间(ms):</p>
          <InputNumber
            value={timeout}
            min={10}
            onChange={(value) => dispatch(setBruteTimeout(value))}
          />
          <p className={'ml-1'}>(建议不低于1000ms)</p>
        </div>
      </Space>

      <Space className={'pl-1 mt-5 flex justify-items-center'}>
        <Space>
          <p>爬虫深度:</p>
          <InputNumber
            value={deep}
            min={1}
            onChange={(value) => {
              dispatch(setDeep(value));
            }}
          />
          层(建议最多5层)
        </Space>
        <Space>
          <p>爬虫收集延迟:</p>
          <InputNumber
            value={waitTime}
            min={0}
            onChange={(value) => {
              dispatch(setWaitTime(value));
            }}
          />
          ms(如果没有waf可以直接填0，否则建议500)
        </Space>
      </Space>

      <div className="domain-list mt-5 h-[70%]">
        <div className="domain-list-root">
          <List
            header={<div>根域名列表:</div>}
            size="small"
            dataSource={domainList}
            renderItem={(item) => {
              return <List.Item>{item}</List.Item>;
            }}
          />
        </div>
      </div>

      <div
        className="tips"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          marginTop: 10
        }}
      >
        <p style={{ marginRight: 20 }}>
          本工具采用FoFa、爬虫收集、爆破三种方式收集子域名
        </p>
      </div>
    </>
  );
};

export default SubDomain;
