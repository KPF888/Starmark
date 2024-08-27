import { BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
function createNewWindow(path) {
  let newWindow = new BrowserWindow({
    width: 500,
    height: 700,
    resizable: false,
    // 不显示顶部菜单
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  newWindow.loadURL(join(__dirname, '../renderer/index.html') + '#' + path);

  newWindow.on('closed', () => {
    newWindow = null;
  });
  newWindow.on('ready-to-show', () => {
    newWindow.show();
  });

  return newWindow;
}

/**注册window事件 */
export function registerWindowEvents() {
  ipcMain.on('open-new-window', (_e, ...args) => {
    createNewWindow(...args);
  });
}
