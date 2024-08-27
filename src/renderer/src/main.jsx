import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/scss/base.scss';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import store from './data/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ConfigProvider>
);
