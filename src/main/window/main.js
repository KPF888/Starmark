import { BrowserWindow, ipcMain, shell } from 'electron';
import icon from '../../../resources/icon.png';
import path, { join } from 'path';
import { is } from '@electron-toolkit/utils';
import os from 'os';
import {
  getAllConfig,
  handleGetConfig,
  handleSetConfig
} from '../config/index.js';
import { regAllApi } from '../api/index.js';
import SubDomain from './SubDomain.js';
import SpiderFinder from '../class/SpiderFinder.js';
import WorkerPool from '../util/WorkerPool.js';
import { Worker } from 'worker_threads';

export default class MainWindow {
  constructor() {
    console.log('mainWindow constructor');
    this.mainWindow = null;
    this.subDomainWindow = null;
    this.spiderFinder = null;
    this.dnsTPool = null;
    this.worker = null;
    this.isShown = false;
    this.createWindow();
    this.initWorkerClass();
    this.regIpcEvent();
    this.regIpcHandle();
    this.createSubDomainWindow();
    this.createWorkerThread();
    this.createThreadPool();
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

  createThreadPool() {
    const threadNumbers = os.cpus().length;
    this.dnsTPool = new WorkerPool(threadNumbers, 'dnsProcessor.js');
  }

  createWorkerThread() {
    this.worker = new Worker(path.join(__dirname, 'dnsProcessor.js'));
  }

  regIpcEvent() {
    regAllApi();
  }

  regIpcHandle() {
    // ipc事件处理
    ipcMain.handle('setConfig', handleSetConfig);
    ipcMain.handle('getConfig', handleGetConfig);
    ipcMain.handle('getAllConfig', getAllConfig);
    ipcMain.handle('dns-resolve', (...args) => this.resolveDns2(...args));
    ipcMain.handle('spider-search', (_ev, ...args) =>
      this.spiderSearch(_ev, ...args)
    );
    ipcMain.handle('spider-count', this.spiderFinder.getCount);
  }

  resolveDns(_ev, domain) {
    return new Promise((resolve) => {
      this.dnsTPool.runTask(domain, (err, addr) => {
        if (err || !addr) {
          // 子域名未找到或解析错误
          // console.log('err');
          resolve(null);
        } else {
          // 找到子域名
          console.log(`${domain} : ${addr}`);
          resolve({ domain, addr });
        }
      });
    });
  }

  resolveDns2(_ev, domain) {
    this.worker.postMessage(domain);
    return new Promise((resolve) => {
      this.worker.on('message', (addr) => {
        if (!addr) {
          // 子域名未找到或解析错误
          resolve(null);
        } else {
          // 找到子域名
          console.log(`${domain} : ${addr}`);
          resolve({ domain, addr });
        }
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
