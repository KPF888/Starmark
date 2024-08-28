import { Layout, Menu, message, theme } from 'antd';
import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import './assets/scss/app.scss';
import { initFofaConfig } from './data/userConfigDataSlice.js';
import { initDictPath } from './data/subDomainDataSlice.js';

const { ipcRenderer } = electron;

const { Header, Content, Footer } = Layout;
const items = [
  {
    key: '/subdomain',
    label: '子域名收集'
  },
  {
    key: '/urlUtils',
    label: '工具箱'
  },
  {
    key: '/userConfig',
    label: '配置'
  }
];

const App = () => {
  const navigate = useNavigate();

  // 加载配置
  const dispatch = useDispatch();
  async function loadConfig() {
    function _checkEmptyObj(store) {
      return Object.keys(store).length === 0;
    }

    const store = await window.electron.ipcRenderer.invoke('getAllConfig');
    if (_checkEmptyObj(store)) {
      message.warning(
        '配置文件为空，请先前往配置页配置或编辑配置文件 "config/configration.json"'
      );
      return;
    }

    dispatch(
      initFofaConfig({
        ...store.fofaConfig
      })
    );
    dispatch(initDictPath(store.dictPath));
  }
  useEffect(() => {
    loadConfig();
  }, [dispatch]);

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  function handleMenuChange(e) {
    navigate(e.key);
  }

  return (
    <Layout className="layout">
      <Header
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
        className={'h-12'}
      >
        <Menu
          className={'h-[80%] overflow-y-hidden items-center'}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['/subdomain']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0
          }}
          onClick={(e) => handleMenuChange(e)}
        />
      </Header>

      <Content
        style={{
          padding: '0 48px'
        }}
      >
        <div
          style={{
            background: colorBgContainer,
            height: '100%',
            padding: 24,
            borderRadius: borderRadiusLG
          }}
        >
          <Suspense fallback={<div>loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </Content>
    </Layout>
  );
};
export default App;
