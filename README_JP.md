<h1 align="center">StarMark</h4>

<h4 align="center">レッドチーム初期評価のための資産情報収集ツール</h4>

<p align="center">
  <!-- Node version -->
  <img src="https://img.shields.io/badge/Node-v20.10.0-blue"/>
  <img src="https://img.shields.io/badge/Electron-v32.0.0-blue"/>
  <!-- Downloads -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/github/downloads/KPF888/Starmark/total?label=ダウンロード数&color=green"/></a>
  <!-- Contributors -->
  <a href="https://github.com/KPF888/Starmark/graphs/contributors">
    <img src="https://img.shields.io/badge/貢献者-2-green"/></a>
  <!-- Version -->
  <a href="https://github.com/KPF888/Starmark/releases">
    <img src="https://img.shields.io/github/v/release/KPF888/Starmark?include_prereleases&label=リリース&color=blue"/></a>
  <!-- Issues -->
  <a href="https://github.com/KPF888/Starmark/issues">
    <img src="https://img.shields.io/github/issues/KPF888/Starmark?label=課題&color=yellow"/></a>
  <!-- QQ Group -->
  <a href="https://qm.qq.com/q/cHYSFTF4UU">
    <img src="https://img.shields.io/badge/QQグループ-805411168-yellow"/></a>
</p>

<p align="center">
  <a href="#ワークフロー">ワークフロー</a> •
  <a href="#インストール">インストール</a> •
  <a href="#セキュリティエンジニア向け">セキュリティエンジニア向け</a> •
  <a href="#開発者向け">開発者向け</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">ドキュメント</a> •
  <a href="#謝辞">謝辞</a> •
  <a href="">FAQ</a> •
  <a href="https://qm.qq.com/q/cHYSFTF4UU">QQに参加</a>
</p>

<p align="center">
  <a href="https://github.com/KPF888/Starmark/blob/dist/README.md">中文</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_EN.md">English</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_JP.md">日本語</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_KR.md">한국어</a> •
  <a href="https://github.com/KPF888/Starmark/blob/dist/README_RU.md">Русский</a>
</p>

---

StarMarkは、スペースマッピング、DNSブルートフォース、インターネットタイムマシン、コードホスティングプラットフォーム、VTスキャン、証明書検索、クローラー再帰の7つのデータソースを活用して、ドメイン、IP、機密情報などのワンクリック収集を実行し、初期資産収集を大幅に容易にします。

| :exclamation: **免責事項**                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| **このプロジェクトは活発に開発中です**。今後のリリースで重要な変更が予想されます。更新前にチェンジログを確認してください。 |
| このプロジェクトは資産/情報収集を目的として作成されました。**ツールはこのプロジェクトからのみダウンロードすることを推奨します。他のソースからダウンロードした実行ファイルの問題について、作者は一切の責任を負いません。** |
| **このツールは教育目的でのみ使用してください。ユーザーがこのツールを使用して引き起こした損失について、プロジェクトは一切の責任を負いません。** |

# インストール

プロジェクトの最新リリースバージョンをダウンロードするだけです。

Gitリリースのアドレス：

```sh
https://github.com/KPF888/Starmark/releases
```

## 機能モジュールの紹介

### スペースマッピング

```sh
StarMarkは、FOFA、VTなどの複数のスペースマッピングAPIインターフェースを提供します。
```

### DNSブルートフォース

```console
DNSブルートフォース機能は、ターゲットドメインに対してブルートフォース攻撃を実行し、関連するサブドメインやIPアドレスを取得します。この機能は効率的なクラッキングアルゴリズムを採用し、カスタム辞書をサポートしています。DNSブルートフォースを通じて、ユーザーは潜在的な重要な資産を発見し、資産収集に強力な補完を提供できます。
```

### インターネットタイムマシン

```sh
インターネットタイムマシン機能は、Webクローラー技術を使用してターゲットWebサイトの履歴データを収集・分析します。異なる時点のデータを比較することで、ユーザーはターゲットWebサイトの発展軌跡を理解し、潜在的なセキュリティ問題を発見できます。さらに、削除された機密情報を発見し、情報収集の包括性を向上させることができます。
```

### コードホスティングプラットフォーム

```sh
コードホスティングプラットフォーム機能は、GitHubやGitLabなどの主要プラットフォームから情報を収集し、ターゲットプロジェクトのコード、コミット履歴、ブランチ、タグなどの機密情報を発掘します。この情報を分析することで、ユーザーはプロジェクトの潜在的な脆弱性を発見し、後続の脆弱性発見と活用の基礎を提供できます。
```

### VTオンラインスキャン

```sh
VT（VirusTotal）オンラインスキャンを使用したサブドメイン収集は間接的な方法です。VTはドメインの履歴レコードを表示し、以前に解決されたIPアドレスと関連するサブドメインを含む場合があります。これらの履歴レコードには、現在はアクティブではないが存在していたサブドメインが含まれている可能性があります。
```

### 証明書検索

```sh
サブドメインの証明書検索により、ユーザーは認証局（CA）が発行したSSL/TLS証明書を検索できます。これらの証明書にはドメイン情報が含まれており、メインドメインとサブドメインが含まれています。これらの証明書履歴レコードには、現在はアクティブではないが存在していたサブドメインが含まれている可能性があります。
```

### クローラー再帰

```sh
クローラー再帰は、Webサイトディレクトリを自動的に再帰的にクロールすることでトラフィックからサブドメインを発見する方法です。クローラー再帰トラフィックによるサブドメイン収集は、時として予期せぬ発見をもたらすことがあります。
クローラー再帰リンクアクセスの深さ。深さが大きいほど、より多くのサブドメインを発見できる可能性がありますが、リソース消費と時間も増加します。リソースが豊富な場合は3層を超えないことを推奨し、リソースが少ない場合は5層を試すことができます。
```

### 謝辞

以下の貢献者のサポートに感謝します:heart:：

- コード貢献者：[@KPF888](https://github.com/KPF888)
- コンセプト貢献者：プロジェクトの構想と機能設計において貴重な提案を提供してくださった[@viking](https://github.com/VK2000)に特別な感謝を

アイデアや改善点がありましたら、プロジェクトへの参加とPRの送信をいつでも歓迎します。 