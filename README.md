# rap-travel-demo
rap-travel-demo

## RAPとは

RAP（ABAP RESTful Application Programming Model）は、SAPのABAP環境で、ODataサービスやSAP Fioriアプリケーション向けの業務アプリケーションを開発するためのプログラミングモデルです。データ構造、業務処理、サービス公開を分けて定義し、保守しやすいアプリケーションを構築できます。

### 主な構成要素

- **CDS（Core Data Services）**：業務データの構造やエンティティ間の関連を定義します。
- **Behavior Definition / Implementation**：作成・更新・削除、入力検証、値の自動設定、承認などのアクションを定義・実装します。
- **Service Definition / Binding**：公開するエンティティと公開方式を定義し、ODataサービスとして利用できるようにします。

### ManagedとUnmanaged

- **Managed**：標準的な永続化処理をRAPのフレームワークに任せ、開発者は業務固有の処理を中心に実装します。
- **Unmanaged**：開発者が永続化処理などを実装し、既存の業務ロジックやAPIを組み込む場合に利用します。

旅行管理を例にすると、CDSで旅行や予約のデータを表し、Behaviorで旅行の登録・変更や入力チェックを定義し、ODataサービスを通じて画面から操作する構成になります。ドラフトを有効にすれば、編集途中のデータを一時保存することもできます。

なお、現在このリポジトリにはRAPのCDSやBehavior定義は含まれていません。この節はRAPの概要説明です。
