const { ipcRenderer } = electron;
export default class MessageClient {
  static RECEIVE_CHANNEL = 'server-send-channel'; // 接收主进程的消息
  static SEND_CHANNEL = 'server-receive-channel'; // 发送消息给主进程

  onMessage() {
    // 用户自己注册函数
  }

  sendMessage(action) {
    ipcRenderer.send(MessageClient.SEND_CHANNEL, action);
  }

  registerEvents() {
    ipcRenderer.on(MessageClient.RECEIVE_CHANNEL, (event, message) =>
      this.onMessage(message)
    );
  }
}
