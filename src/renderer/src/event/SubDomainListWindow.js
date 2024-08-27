const { ipcRenderer } = electron;

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
  static FINISH_FLOW_CHANNEL = 'finish-flow-channel'
}
