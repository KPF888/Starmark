import { bruteSubDomain } from './subdomain';
import { ipcMain } from 'electron';
import SubDomainListWindow from '../event/SubDomainListWindow.js';
const listWindow = new SubDomainListWindow();

/* 注册所有业务api */
export const regAllApi = () => {
  ipcMain.handle('bruteSubDomain', bruteSubDomain);
  listWindow.registerEvents();
};
