import { parentPort } from 'worker_threads';
import dgram from 'dgram';
import dnsPacket from 'dns-packet';

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

let currentDnsIndex = 0;

function getNextDnsServer() {
  const dnsServer = dnsServers[currentDnsIndex];
  currentDnsIndex = (currentDnsIndex + 1) % dnsServers.length;
  return dnsServer;
}

function resolveDomain(domain) {
  return new Promise((resolve, reject) => {
    const dnsServer = getNextDnsServer();
    const socket = dgram.createSocket('udp4');

    const query = dnsPacket.encode({
      type: 'query',
      id: Math.floor(Math.random() * 65535),
      flags: dnsPacket.RECURSION_DESIRED,
      questions: [
        {
          type: 'A',
          name: domain
        }
      ]
    });

    socket.send(query, 0, query.length, 53, dnsServer, (err) => {
      if (err) reject(`Failed to send DNS query: ${err.message}`);
    });

    socket.on('message', (msg) => {
      const response = dnsPacket.decode(msg);
      const addr = response.answers
        .filter((answer) => answer.type === 'A')
        .map((answer) => answer.data);

      socket.close();
      if (addr.length > 0) {
        const res = { domain, addr };
        // console.log(res);
        resolve(res);
      } else {
        reject(`No A records found for ${domain}`);
      }
    });

    socket.on('error', (err) => {
      socket.close();
      reject(`DNS resolution error: ${err.message}`);
    });
  });
}

parentPort.on('message', async (domain) => {
  try {
    const result = await resolveDomain(domain);
    parentPort.postMessage(result);
  } catch (error) {
    // console.log(error);
    parentPort.postMessage(null);
  }
});
