<h1 align="center">星痕</h4>

<h4 align="center">一款为红队前期打点赋能的资产信息收集工具</h4>

<p align="center">
  <!-- Node版本 -->
  <img src="https://img.shields.io/badge/Node-v20.10.0-blue"/>
  <img src="https://img.shields.io/badge/Electron-v32.0.0-blue"/>
  <!-- 下载量 -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/badge/%E4%B8%8B%E8%BD%BD%E9%87%8F-88-green"/></a>
  <!-- 贡献者 -->
  <a href="https://github.com/KPF888/Starmark/graphs/contributors">
    <img src="https://img.shields.io/badge/%E8%B4%A1%E7%8C%AE%E8%80%85-2-green"/></a>
  <!-- 内测版本 -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/badge/%E5%8F%91%E8%A1%8C%E7%89%88%E6%9C%AC-v0.0.1-blue"/></a>
  <!-- 问题数量 -->
  <a href="https://github.com/KPF888/Starmark/issues">
    <img src="https://img.shields.io/badge/issue-0-yellow"/></a>
  <!-- 官方群组 -->
  <a href="https://qm.qq.com/q/cHYSFTF4UU">
    <img src="https://img.shields.io/badge/QQ%E7%BE%A4-805411168-yellow"/></a>
</p>

<p align="center">
  <a href="#工作流程">工作流程</a> •
  <a href="#安装Starmark">安装</a> •
  <a href="#对于安全工程师">对于安全工程师</a> •
  <a href="#对于开发和组织">对于开发者</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">文档</a> •
  <a href="#致谢">致谢</a> •
  <a href="">常见问题</a> •
  <a href="https://qm.qq.com/q/cHYSFTF4UU">加入QQ</a>
</p>

<p align="center">
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">中文</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_EN.md">English</a>
</p>

---

星痕目前使用多个空间测绘、DNS爆破、互联网时光机、代码托管平台、vt查杀、证书、爬虫递归7个部分作为数据来源，对域名、IP、敏感信息等进行一键化收集操作，为前期资产收集提供极大便利。

| :exclamation: **免责声明**                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| **这个项目正在积极开发中**。预计发布会带来突破性的更改。更新前请查看版本更改日志。                                                      |
| 这个项目主要是为了做资产收集/信息收集而开创的。 **工具只建议从本项目中下载，从其他途径下载的exe可能会有风险，检测出问题作者概不负责。** |
| **本工具仅供学习使用，由于用户使用该工具造成任何单位个体的任何损失本项目概不负责**                                                      |

# 安装星痕

直接下载项目最新版release即可

git release地址：

```sh
https://github.com/KPF888/Starmark/releases
```

## 星痕不同功能模块介绍

### 空间测绘

```sh
星痕将提供FOFA、VT等多个空间测绘api接口
```

### DNS爆破

```console
DNS爆破功能针对目标域名进行暴力破解，获取与其关联的子域名、IP地址等信息。该功能采用高效的破解算法，支持自定义字典。通过DNS爆破，用户可以挖掘出潜在的重要资产，为资产收集提供有力补充。
```

### 互联网时光机

```sh
互联网时光机功能是利用网络爬虫技术，对目标网站的历史数据进行收集和分析。通过对比不同时间点的数据，用户可以了解目标网站的发展轨迹，发现潜在的安全问题。此外，互联网时光机还能帮助用户挖掘出已删除的敏感信息，提高信息收集的全面性。
```

### 代码托管平台

```sh
代码托管平台功能针对GitHub、GitLab等主流代码托管平台进行信息收集，挖掘目标项目的代码、提交记录、分支、标签等敏感信息。通过分析这些信息，用户可以发现项目中的潜在漏洞，为后续的漏洞挖掘和利用提供依据。
```

### VT在线查杀

```sh
利用VT（VirusTotal）在线查杀进行子域名收集是一种间接的方法。VT可能会显示域名的历史记录，包括曾经解析到的IP地址和与之关联的子域名，这些历史记录可能包含不再活跃但曾经存在的子域名。
```

### 证书搜索

```sh
通过证书检索子域名，它允许用户搜索由证书颁发机构（CA）发布的SSL/TLS证书。这些证书中包含了域名信息，包括主域名和子域名。这些证书历史记录可能包含不再活跃但曾经存在的子域名。
```

### 爬虫递归

```sh
爬虫递归是一种通过自动化递归地爬取网站目录进行无限递归以从流量中发现子域名的方法。爬虫递归流量收集子域名有时会带来意想不到的惊喜。
爬虫递归访问链接的深度。深度越大，爬虫可能发现的子域名越多，但资源消耗和时间也会增加。当资源过多时，建议不超过3层，资源较少时可尝试5层。
```

### 致谢

感谢所有[社区贡献者提供的PR]()，并不断更新此项目:heart:

如果你有想法或某种改进，欢迎你参与该项目，随时发送你的PR。
