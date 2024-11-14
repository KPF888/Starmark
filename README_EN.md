<h1 align="center">StarMark</h4>

<h4 align="center">An Asset Information Collection Tool for Red Team Initial Assessment</h4>

<p align="center">
  <!-- Node version -->
  <img src="https://img.shields.io/badge/Node-v20.10.0-blue"/>
  <img src="https://img.shields.io/badge/Electron-v32.0.0-blue"/>
  <!-- Downloads -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/github/downloads/KPF888/Starmark/total?label=Downloads&color=green"/></a>
  <!-- Contributors -->
  <a href="https://github.com/KPF888/Starmark/graphs/contributors">
    <img src="https://img.shields.io/badge/Contributors-2-green"/></a>
  <!-- Version -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/github/v/release/KPF888/Starmark?include_prereleases&label=Release&color=blue"/></a>
  <!-- Issues -->
  <a href="https://github.com/KPF888/Starmark/issues">
    <img src="https://img.shields.io/github/issues/KPF888/Starmark?label=Issues&color=yellow"/></a>
  <!-- QQ Group -->
  <a href="https://qm.qq.com/q/cHYSFTF4UU">
    <img src="https://img.shields.io/badge/QQ%20Group-805411168-yellow"/></a>
</p>

<p align="center">
  <a href="#workflow">Workflow</a> •
  <a href="#installation">Installation</a> •
  <a href="#for-security-engineers">For Security Engineers</a> •
  <a href="#for-developers">For Developers</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">Documentation</a> •
  <a href="#acknowledgments">Acknowledgments</a> •
  <a href="">FAQ</a> •
  <a href="https://qm.qq.com/q/cHYSFTF4UU">Join QQ</a>
</p>

<p align="center">
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">中文</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_EN.md">English</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_JP.md">日本語</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_KR.md">한국어</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_RU.md">Русский</a>
</p>

---

StarMark currently utilizes 7 different data sources including Space Mapping, DNS Brute Force, Internet Time Machine, Code Hosting Platforms, VT Scanning, Certificate Search, and Crawler Recursion to perform one-click collection of domains, IPs, and sensitive information, greatly facilitating initial asset collection.

| :exclamation: **Disclaimer**                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| **This project is under active development**. Breaking changes are expected in future releases. Please check the changelog before updating. |
| This project is created for asset/information collection purposes. **It is recommended to download the tool only from this project. The author takes no responsibility for any issues with executables downloaded from other sources.** |
| **This tool is for educational purposes only. The project takes no responsibility for any losses caused by users using this tool.** |

# Installation

Simply download the latest release version of the project.

Git release URL:

```sh
https://github.com/KPF888/Starmark/releases
```

## Feature Modules Introduction

### Space Mapping

```sh
StarMark provides multiple space mapping API interfaces including FOFA, VT, etc.
```

### DNS Brute Force

```console
The DNS brute force feature performs brute force attacks on target domains to obtain associated subdomains and IP addresses. This feature employs efficient cracking algorithms and supports custom dictionaries. Through DNS brute force, users can discover potential important assets, providing powerful supplements for asset collection.
```

### Internet Time Machine

```sh
The Internet Time Machine feature uses web crawler technology to collect and analyze historical data of target websites. By comparing data from different time points, users can understand the development trajectory of target websites and discover potential security issues. Additionally, the Internet Time Machine can help users uncover deleted sensitive information, improving the comprehensiveness of information collection.
```

### Code Hosting Platforms

```sh
The code hosting platform feature collects information from mainstream platforms like GitHub and GitLab, mining sensitive information such as target project code, commit records, branches, and tags. By analyzing this information, users can discover potential vulnerabilities in projects, providing basis for subsequent vulnerability discovery and exploitation.
```

### VT Online Scanning

```sh
Using VT (VirusTotal) online scanning for subdomain collection is an indirect method. VT may display domain historical records, including previously resolved IP addresses and associated subdomains. These historical records may contain subdomains that are no longer active but once existed.
```

### Certificate Search

```sh
Certificate searching for subdomains allows users to search SSL/TLS certificates issued by Certificate Authorities (CAs). These certificates contain domain information, including main domains and subdomains. These certificate historical records may contain subdomains that are no longer active but once existed.
```

### Crawler Recursion

```sh
Crawler recursion is a method of discovering subdomains from traffic by automatically recursively crawling website directories. Crawler recursion traffic collection of subdomains sometimes brings unexpected surprises.
The depth of crawler recursion link access. Greater depth may discover more subdomains, but resource consumption and time also increase. When resources are abundant, it's recommended not to exceed 3 layers; with fewer resources, 5 layers can be attempted.
```

### Acknowledgments

Thanks to the following contributors for their support:heart::

- Code Contributor: [@KPF888](https://github.com/KPF888)
- Concept Contributor: Special thanks to [@viking](https://github.com/VK2000) for providing valuable suggestions in project conception and feature design

If you have any ideas or improvements, you're welcome to participate in the project and submit your PR at any time. 