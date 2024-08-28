import { parentPort } from 'worker_threads';
import dns from 'dns';

const dnsServers = [
  '223.5.5.5', // 阿里 DNS
  '223.6.6.6', // 阿里 DNS
  '114.114.114.114', // 114 DNS
  '114.114.115.115', // 114 DNS
  '180.76.76.76', // 百度 DNS
  '119.29.29.29', // 腾讯 DNS
  '182.254.116.116', // 腾讯
  '8.8.8.8', // google
  '8.8.4.4', // google
  '208.67.222.222', // Open DNS
  '208.67.220.220' // Open DNS
];

console.log('dnsProcessor');
dns.setServers(dnsServers);

function dnsResolve(domain) {
  return new Promise((resolve) => {
    dns.resolve(domain, (err, addr) => {
      if (err) {
        // console.log(err);
        resolve(null);
      } else {
        resolve(addr);
      }
    });
  });
}

parentPort.on('message', async (task) => {
  dnsResolve(task)
    .then((res) => {
      parentPort.postMessage(res);
    })
    .catch((e) => {
      parentPort.postMessage(null);
    });
});
