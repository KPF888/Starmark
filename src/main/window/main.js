import { BrowserWindow, ipcMain, shell } from 'electron';
import icon from '../../../resources/icon.png';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import {
  getAllConfig,
  handleGetConfig,
  handleSetConfig
} from '../config/index.js';
import { regAllApi } from '../api/index.js';
import SubDomain from './SubDomain.js';
import SpiderFinder from '../service/SpiderFinder.js';
import DnsWorker from '../util/DnsWorker.js';

export default class MainWindow {
  constructor() {
    console.log('mainWindow constructor');
    this.mainWindow = null;
    this.subDomainWindow = null;
    this.spiderFinder = null;
    this.dnsWorker = null;
    this.isShown = false;

    this.createWindow();
    this.initWorkerClass();
    this.regIpcEvent();
    this.regIpcHandle();
    this.createSubDomainWindow();
    this.createWorkerThread();
    this.init();
  }

  init() {
    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.mjs'),
        sandbox: false
      }
    });

    // 监听 ready-to-show 事件
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      this.isShown = true;
    });

    /*监听关闭事件*/
    this.mainWindow.on('closed', () => {
      this.isShown = false;
      this.mainWindow = null;
    });
  }

  createSubDomainWindow() {
    ipcMain.on('open-subdomain-window', (_e, params) => {
      this.subDomainWindow = new SubDomain(params, this);
    });
  }

  createWorkerThread() {
    this.dnsWorker = new DnsWorker();
  }

  regIpcEvent() {
    regAllApi();
  }

  regIpcHandle() {
    // ipc事件处理
    ipcMain.handle('setConfig', handleSetConfig);
    ipcMain.handle('getConfig', handleGetConfig);
    ipcMain.handle('getAllConfig', getAllConfig);
    ipcMain.handle('dns-resolve', (...args) => this.resolveDns(...args));
    ipcMain.handle('spider-search', (_ev, ...args) =>
      this.spiderSearch(_ev, ...args)
    );
    ipcMain.handle('spider-count', this.spiderFinder.getCount);
  }

  resolveDns(_ev, domain) {
    return new Promise((resolve) => {
      this.dnsWorker
        .resolve(domain)
        .then((addr) => {
          if (!addr) {
            // 子域名未找到或解析错误
            // console.log('err');
            resolve(null);
          } else {
            // 找到子域名
            console.log(`${domain} : ${addr}`);
            resolve({ domain, addr });
          }
        })
        .catch((error) => {
          console.error(`Error resolving domain ${domain}:`, error);
          resolve(null);
        });
    });
  }

  async spiderSearch(_ev, ...args) {
    console.log('spiderSearch');
    if (!this.spiderFinder) return null;
    this.spiderFinder.init();
    await this.spiderFinder.findAllUrls(...args);

    return {
      result: this.spiderFinder.getSubdomains(),
      count: this.spiderFinder.count
    };
  }

  subDomainWindowClosed() {
    if (!this.mainWindow) return;
    this.mainWindow.send('subdomain-closed');
  }

  initWorkerClass() {
    this.spiderFinder = new SpiderFinder();
  }
}
