import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow } from 'electron';
import MainWindow from './window/main.js';

class StarMarks {
  constructor() {
    this.mainWindow = null;
  }

  init() {
    app.whenReady().then(() => {
      electronApp.setAppUserModelId('com.electron');
      app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
      });

      this.createMainWindow();

      /*app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });*/
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  createMainWindow() {
    if (!this.mainWindow) {
      console.log('createMainWindow');
      this.mainWindow = new MainWindow();
    }
  }
}

new StarMarks().init();
