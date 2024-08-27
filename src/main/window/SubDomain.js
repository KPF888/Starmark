import { BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { CONFIG_PATH, getWindowOrigin } from '../config/index.js';
import fs from 'fs';

export default class SubDomain {
  constructor(params, mainWindow) {
    this.win = null;
    this.mainWinInstance = mainWindow;
    this.isShown = false;
    this.createWindow();
    this.show();
    this.init(params);
    this.initIPC();
    this.handleCloseWindow();
    this.handleClosedWindow();
  }

  init(params) {
    const uri = `#/subdomain/list?params=${JSON.stringify(params)}`;
    const origin = getWindowOrigin();
    const url = origin + uri;
    this.win.loadURL(url);
  }

  destroy() {
    // console.log(this.win);
    this.win.destroy();
    this.clearIPC();
  }

  createWindow() {
    this.win = new BrowserWindow({
      width: 500,
      height: 700,
      resizable: false,
      parent: this.mainWinInstance.mainWindow,
      // 不显示顶部菜单
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.mjs'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false
      }
    });
  }

  show() {
    this.win.on('ready-to-show', () => {
      this.win.show();
      this.isShown = true;
    });
  }

  initIPC() {
    ipcMain.handle('get-dict', this.getDict);
    ipcMain.on('close-subdomain-window', (_ev) => this.destroy());
  }

  clearIPC() {
    ipcMain.removeHandler('get-dict');
    ipcMain.removeAllListeners('close-subdomain-window');
  }

  getDict(_ev) {
    // 子域名字典文件路径
    const subdomainsFile = path.join(CONFIG_PATH, 'subdomain.txt');
    try {
      // 从文件中读取子域名
      return fs.readFileSync(subdomainsFile, 'utf8').trim().split('\r\n');
    } catch (err) {
      throw new Error(`无法读取子域名字典文件: ${subdomainsFile},原因:${err}`);
    }
  }

  handleCloseWindow() {
    this.win.on('close', async (ev) => {
      ev.preventDefault(); // 阻止默认行为，即窗口关闭
      this.win.send('close-subdomain-window');
    });
  }
  handleClosedWindow() {
    this.win.on('closed', () => {
      this.win = null;
      // 通知主渲染进程
      this.mainWinInstance.subDomainWindowClosed();
    });
  }
}
