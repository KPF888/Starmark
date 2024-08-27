const { ipcRenderer } = window.electron;

export default class StoreClient {
  constructor() {
    this.initialize();
  }

  // 初始化与主进程的通信
  initialize() {
    ipcRenderer.invoke('get-state').then((initialState) => {
      console.log('Initial State:', initialState);
      this.onStateUpdate(initialState);
    });

    ipcRenderer.on('state-updated', (event, updatedState) => {
      // console.log('Updated State:', updatedState);
      this.onStateUpdate(updatedState);
    });

    ipcRenderer.send('register-listener');
  }

  // 状态更新时的回调，可以由用户定义
  onStateUpdate(updatedState) {
    // 用户可以覆盖此方法以响应状态更新
  }

  // 更新状态
  updateState(action) {
    ipcRenderer.send('set-state', action);
  }
}
