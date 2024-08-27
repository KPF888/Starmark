import { ipcMain } from 'electron';

export default class SubDomainListWindow {
  /**
   * 每个channel对应一个业务
   */
  static REGISTER_SUBLIST_WIN = 'register-sublist-win';
  static REGISTER_MAIN_WIN = 'register-main-win';
  static START_FOFA_CHANNEL = 'start-fofa-channel';
  static START_BRUTE_CHANNEL = 'start-brute-channel';
  static START_FLOW_CHANNEL = 'start-flow-channel';
  static FINISH_FOFA_CHANNEL = 'finish-fofa-channel';
  static FINISH_BRUTE_CHANNEL = 'finish-brute-channel';
  static FINISH_FLOW_CHANNEL = 'finish-flow-channel';

  constructor() {}
  /*注册窗口*/
  _register(event) {
    this._subListWin = event.sender;
    // console.log(this._subListWin);
  }
  _registerMainWin(event) {
    this._mainWin = event.sender;
  }

  /*启动任务函数*/
  async _fofaSearch(event) {
    for (let i = 0; i < 10; i++) {
      try {
        this._subListWin.send(SubDomainListWindow.START_FOFA_CHANNEL);
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.error('window not exist: ', e.message);
      }
    }
  }
  _bruteSearch(event) {
    this._subListWin.send(SubDomainListWindow.START_BRUTE_CHANNEL);
  }
  _flowSearch(event) {
    this._subListWin.send(SubDomainListWindow.START_FLOW_CHANNEL);
  }

  /*任务完成函数*/
  _finishFofa(event) {
    this._mainWin.send(SubDomainListWindow.FINISH_FOFA_CHANNEL);
  }

  _finishBrute(event) {
    this._mainWin.send(SubDomainListWindow.FINISH_BRUTE_CHANNEL);
  }

  _finishSpider(_ev) {
    this._mainWin.send(SubDomainListWindow.FINISH_FLOW_CHANNEL);
  }

  registerEvents() {
    ipcMain.on(SubDomainListWindow.REGISTER_SUBLIST_WIN, this._register);
    ipcMain.on(SubDomainListWindow.REGISTER_MAIN_WIN, this._registerMainWin);
    ipcMain.on(SubDomainListWindow.START_FOFA_CHANNEL, this._fofaSearch);
    ipcMain.on(SubDomainListWindow.START_BRUTE_CHANNEL, this._bruteSearch);
    ipcMain.on(SubDomainListWindow.START_FLOW_CHANNEL, this._flowSearch);
    ipcMain.on(SubDomainListWindow.FINISH_FOFA_CHANNEL, this._finishFofa);
    ipcMain.on(SubDomainListWindow.FINISH_BRUTE_CHANNEL, this._finishBrute);
    ipcMain.on(SubDomainListWindow.FINISH_FLOW_CHANNEL, this._finishSpider);
  }
}
