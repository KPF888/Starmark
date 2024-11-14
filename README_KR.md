<h1 align="center">StarMark</h4>

<h4 align="center">레드팀 초기 평가를 위한 자산 정보 수집 도구</h4>

<p align="center">
  <!-- Node 버전 -->
  <img src="https://img.shields.io/badge/Node-v20.10.0-blue"/>
  <img src="https://img.shields.io/badge/Electron-v32.0.0-blue"/>
  <!-- 다운로드 -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/github/downloads/KPF888/Starmark/total?label=다운로드&color=green"/></a>
  <!-- 기여자 -->
  <a href="https://github.com/KPF888/Starmark/graphs/contributors">
    <img src="https://img.shields.io/badge/기여자-2-green"/></a>
  <!-- 버전 -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/github/v/release/KPF888/Starmark?include_prereleases&label=릴리스&color=blue"/></a>
  <!-- Issues -->
  <a href="https://github.com/KPF888/Starmark/issues">
    <img src="https://img.shields.io/github/issues/KPF888/Starmark?label=이슈&color=yellow"/></a>
  <!-- QQ Group -->
  <a href="https://qm.qq.com/q/cHYSFTF4UU">
    <img src="https://img.shields.io/badge/QQ그룹-805411168-yellow"/></a>
</p>

<p align="center">
  <a href="#워크플로우">워크플로우</a> •
  <a href="#설치">설치</a> •
  <a href="#보안-엔지니어를-위한">보안 엔지니어를 위한</a> •
  <a href="#개발자를-위한">개발자를 위한</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">문서</a> •
  <a href="#감사의-말">감사의 말</a> •
  <a href="">FAQ</a> •
  <a href="https://qm.qq.com/q/cHYSFTF4UU">QQ 참여</a>
</p>

<p align="center">
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">中文</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_EN.md">English</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_JP.md">日本語</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_KR.md">한국어</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_RU.md">Русский</a>
</p>

---

StarMark는 현재 스페이스 매핑, DNS 브루트포스, 인터넷 타임머신, 코드 호스팅 플랫폼, VT 스캔, 인증서 검색, 크롤러 재귀 등 7가지 데이터 소스를 활용하여 도메인, IP, 민감한 정보 등을 원클릭으로 수집하여 초기 자산 수집을 크게 용이하게 합니다.

| :exclamation: **면책 조항**                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| **이 프로젝트는 활발히 개발 중입니다**. 향후 릴리스에서 중요한 변경이 예상됩니다. 업데이트 전 변경 로그를 확인해 주세요. |
| 이 프로젝트는 자산/정보 수집을 목적으로 만들어졌습니다. **도구는 이 프로젝트에서만 다운로드할 것을 권장합니다. 다른 소스에서 다운로드한 실행 파일의 문제에 대해 작성자는 책임을 지지 않습니다.** |
| **이 도구는 교육 목적으로만 사용하십시오. 사용자가 이 도구를 사용하여 발생한 손실에 대해 프로젝트는 책임을 지지 않습니다.** |

# 설치

프로젝트의 최신 릴리스 버전을 다운로드하면 됩니다.

Git 릴리스 주소:

```sh
https://github.com/KPF888/Starmark/releases
```

## 기능 모듈 소개

### 스페이스 매핑

```sh
StarMark는 FOFA, VT 등 여러 스페이스 매핑 API 인터페이스를 제공합니다.
```

### DNS 브루트포스

```console
DNS 브루트포스 기능은 대상 도메인에 대해 브루트포스 공격을 수행하여 관련 서브도메인과 IP 주소를 획득합니다. 이 기능은 효율적인 크래킹 알고리즘을 채택하고 사용자 정의 사전을 지원합니다. DNS 브루트포스를 통해 사용자는 잠재적인 중요 자산을 발견하여 자산 수집을 강력하게 보완할 수 있습니다.
```

### 인터넷 타임머신

```sh
인터넷 타임머신 기능은 웹 크롤러 기술을 사용하여 대상 웹사이트의 이력 데이터를 수집하고 분석합니다. 서로 다른 시점의 데이터를 비교함으로써 사용자는 대상 웹사이트의 발전 궤적을 이해하고 잠재적인 보안 문제를 발견할 수 있습니다. 또한 삭제된 민감한 정보를 발견하여 정보 수집의 포괄성을 향상시킬 수 있습니다.
```

### 코드 호스팅 플랫폼

```sh
코드 호스팅 플랫폼 기능은 GitHub, GitLab 등 주요 플랫폼에서 정보를 수집하여 대상 프로젝트의 코드, 커밋 이력, 브랜치, 태그 등 민감한 정보를 발굴합니다. 이 정보를 분석함으로써 사용자는 프로젝트의 잠재적인 취약점을 발견하여 후속 취약점 발견과 활용의 기초를 제공할 수 있습니다.
```

### VT 온라인 스캔

```sh
VT(VirusTotal) 온라인 스캔을 사용한 서브도메인 수집은 간접적인 방법입니다. VT는 도메인의 이력 레코드를 표시하며, 이전에 해석된 IP 주소와 관련 서브도메인을 포함할 수 있습니다. 이러한 이력 레코드에는 현재는 활성화되지 않았지만 존재했던 서브도메인이 포함될 수 있습니다.
```

### 인증서 검색

```sh
서브도메인의 인증서 검색을 통해 사용자는 인증 기관(CA)이 발행한 SSL/TLS 인증서를 검색할 수 있습니다. 이러한 인증서에는 도메인 정보가 포함되어 있으며, 메인 도메인과 서브도메인이 포함됩니다. 이러한 인증서 이력 레코드에는 현재는 활성화되지 않았지만 존재했던 서브도메인이 포함될 수 있습니다.
```

### 크롤러 재귀

```sh
크롤러 재귀는 웹사이트 디렉토리를 자동으로 재귀적으로 크롤링하여 트래픽에서 서브도메인을 발견하는 방법입니다. 크롤러 재귀 트래픽을 통한 서브도메인 수집은 때때로 예상치 못한 발견을 가져올 수 있습니다.
크롤러 재귀 링크 접근의 깊이. 깊이가 클수록 더 많은 서브도메인을 발견할 수 있지만, 리소스 소비와 시간도 증가합니다. 리소스가 풍부한 경우 3계층을 초과하지 않는 것을 권장하며, 리소스가 적은 경우 5계층을 시도할 수 있습니다.
```

### 감사의 말

다음 기여자들의 지원에 감사드립니다:heart::

- 코드 기여자: [@KPF888](https://github.com/KPF888)
- 컨셉 기여자: 프로젝트 구상과 기능 설계에 귀중한 제안을 해주신 [@viking](https://github.com/VK2000)님께 특별한 감사를 드립니다

아이디어나 개선사항이 있으시다면 프로젝트 참여와 PR 제출을 언제든지 환영합니다. 