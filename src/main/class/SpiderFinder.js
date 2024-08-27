import axios from 'axios';
import * as https from 'node:https';

const PATH_PATTERN =
  /(?<!https?:\/)((\.\/|\.\.\/|\/)[-A-Za-z0-9+&@#%?=~_|!:,.;]+){2,}\/?/gm;
const URL_PATTERN = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+/gm;

const EXCLUDE_EXT = [
  'jpg', // JPEG image
  'jpeg', // JPEG image
  'png', // Portable Network Graphics
  'gif', // Graphics Interchange Format
  'bmp', // Bitmap Image File
  'tiff', // Tagged Image File Format
  'tif', // Tagged Image File Format
  'webp', // WebP image
  'svg', // Scalable Vector Graphics
  'ico', // Icon file
  'heic', // High Efficiency Image Coding
  'heif', // High Efficiency Image File Format
  'raw', // Raw image format (varies by camera manufacturer)
  'psd', // Adobe Photoshop Document
  'eps', // Encapsulated PostScript
  'ai', // Adobe Illustrator Artwork
  'indd' // Adobe InDesign Document
];

export default class SpiderFinder {
  count = -1;
  visited = new Set();
  subdomains = new Set();

  init() {
    this.count = -1;
    this.visited = new Set();
    this.subdomains = new Set();
  }

  getFileExt(url) {
    const pathname = url.split(/[?#]/)[0]; // 去掉查询参数或片段标识符
    return pathname.split('.').pop(); // 获取最后的文件扩展名
  }

  getUrls(html, url) {
    let resources = [];

    // 补充正则搜集
    const paths = html.match(PATH_PATTERN) || [];
    const urls = html.match(URL_PATTERN) || [];
    resources.push(...urls.concat(paths));

    const urlList = resources
      .map((item) => {
        let resUrl;
        if (item.startsWith('/')) {
          const uri = new URL(url).origin;
          // console.log(uri, item);
          resUrl = uri + item;
        } else if (item.startsWith('../') || item.startsWith('./')) {
          const uri = new URL(url).origin;
          resUrl = uri + '/' + item;
        } else {
          resUrl = item;
        }
        return resUrl;
      })
      .filter((item) => {
        if (item) {
          const fileExt = this.getFileExt(item);
          for (let i = 0; i < EXCLUDE_EXT.length; i++) {
            const ext = EXCLUDE_EXT[i];
            if (fileExt === ext) return false;
          }
        }
        return true;
      });

    return [...new Set(urlList)];
  }

  wait(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  req(config) {
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    return axios.request(config).catch((_e) => {
      /*忽略证书*/
      return instance.request(config);
    });
  }

  getSubdomains() {
    return Array.from(this.subdomains);
  }

  getVisited() {
    return Array.from(this.visited);
  }

  getCount() {
    return this.count;
  }

  async findAllUrls(url, rootDomain, deep = 2, time = 0) {
    console.log(url);
    this.count++;
    if (this.visited.has(url) || deep === 0) return;
    this.visited.add(url);
    console.log('req:', url);

    try {
      // const { data: html, status } = await axios.get(url, { timeout: 1000 });
      const { data: html, status } = await this.req({
        method: 'GET',
        url,
        timeout: 1000
      });
      await this.wait(time);
      if (status !== 200) return;
      // console.log(html);
      const links = this.getUrls(html, url);
      if (links.length === 0) return;
      for (const link of links) {
        if (link.includes(rootDomain)) {
          const domain = new URL(link).hostname;

          if (!this.visited.has(link)) {
            if (domain !== rootDomain && !this.subdomains.has(domain)) {
              this.subdomains.add(domain);
              // console.log(`Found subdomain: ${domain}`);
            }

            await this.findAllUrls(link, rootDomain, deep - 1);
          }
        }
      }
    } catch (e) {
      // console.error(e);
    }
  }
}

/*function printArr(arr) {
  let out = '';
  arr.forEach((item) => {
    out = out + item + '\n';
  });
  out = out.trim();
  console.log(out);
}
// await findAllUrls('http://nsmcjf.ctld.chaoxing.com', 'chaoxing.com', 2);
const flowFinder = new FlowFinder();
await flowFinder.findAllUrls(
  'http://nsmcjf.ctld.chaoxing.com',
  'chaoxing.com',
  2
);

console.log('请求url数量: ', flowFinder.count);
printArr(flowFinder.getResult());*/
