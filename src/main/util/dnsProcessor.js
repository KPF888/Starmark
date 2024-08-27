import { parentPort } from 'worker_threads';
import dns from 'dns';

function dnsResolve(domain) {
  return new Promise((resolve) => {
    dns.resolve(domain, (err, addr) => {
      if (err) {
        // 子域名未找到或解析错误
        resolve(null);
      } else {
        // 找到子域名
        // console.log(`${domain} : ${addr}`);
        resolve(addr);
      }
    });
  });
}



parentPort.on('message', (task) => {
  dnsResolve(task).then((res) => {
    console.log('test');
    parentPort.postMessage(res);
  });
});
