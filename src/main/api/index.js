import SubDomainListWindow from '../event/SubDomainListWindow.js';

const listWindow = new SubDomainListWindow();

/* 注册所有业务api */
export const regAllApi = () => {
  listWindow.registerEvents();
};
