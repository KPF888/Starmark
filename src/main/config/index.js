import Store from 'electron-store';
import fs from 'fs';
import { app } from 'electron';
import path from 'path';
import { is } from '@electron-toolkit/utils';

const IS_DEV = !app.isPackaged;
const CONFIG_NAME = 'configration';
const CONFIG_DIR_DEV = path.join(app.getAppPath(), 'config');
const CONFIG_DIR_PRO = path.join(path.dirname(app.getPath('exe')), 'config');
const CONFIG_PATH = getConfigPath();
console.log('CONFIG_DIR_PRO', CONFIG_DIR_PRO);
console.log('CONFIG_DIR_DEV', CONFIG_DIR_DEV);
console.log('CONFIG_PATH', CONFIG_PATH);

const store = new Store({
  cwd: CONFIG_PATH,
  name: CONFIG_NAME
});

function getConfigPath() {
  return IS_DEV ? CONFIG_DIR_DEV : CONFIG_DIR_PRO;
}

function initConfigFile() {
  // 判断是否有该文件夹，不存在则创建
  if (!fs.existsSync(CONFIG_DIR_PRO)) {
    fs.mkdirSync(CONFIG_DIR_PRO);
    console.log('创建config文件夹成功');
  }
}

const handleGetConfig = (event, key) => {
  initConfigFile();
  // 从store中获取配置
  return store.get(key);
};

const handleSetConfig = (event, key, value) => {
  initConfigFile();
  // 向store中设置配置
  console.log('set config:', key, value);
  store.set(key, value);
};

const getAllConfig = () => {
  initConfigFile();
  // 获取所有配置项
  return store.store;
};

/**
 * 获取窗口的url origin路径
 * @returns {string}
 */
const getWindowOrigin = () => {
  const fileOrigin = path.join(__dirname, '../renderer/index.html');
  const hmrOrigin = process.env['ELECTRON_RENDERER_URL'];
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    return hmrOrigin;
  } else {
    return fileOrigin;
  }
};

export {
  getAllConfig,
  handleGetConfig,
  handleSetConfig,
  initConfigFile,
  CONFIG_PATH,
  IS_DEV,
  getWindowOrigin
};
