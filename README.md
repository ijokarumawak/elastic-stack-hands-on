# Elastic Stack Hands On

このプロジェクトは手軽に Elastic Stack の色々な機能を試せるように作成されたハンズオン教材です。

## 対象 Elastic Stack version
7.11.x で動作確認をしています。

## 必要スペック
- 2 CPU cores
- 2 GB RAM
- 30 GB Storage (Docker イメージの保存に結構な量が必要)

<div id="how-to-use" />

## 使い方

プロジェクトをクローン。
```
git clone https://github.com/ijokarumawak/elastic-stack-hands-on.git
cd elastic-stack-hands-on
```

環境設定ファイルをコピーして作成、ハンズオン中に編集します。
```
cp env.sh.template env.sh
```

ハンズオン環境を起動:
```
bin/start-hands-on.sh
```

ポート 80 でハンズオンの UI アプリが起動します。
マシンの IP アドレスをブラウザに入力してアクセス。

Cloud 9 の場合、 `bin/check-ec2-public-ip.sh ` で IP アドレス取得できます。


ハンズオン画面ベーシック認証のユーザ名パスワード:
- username: `es-hands-on`
- password: `Password!123`

### Cloud 9 を利用する場合

1. Create Environment をクリック
2. Environment type: Create a new EC2 instance for environment (direct access)
3. インスタンスタイプ: t3.small (2 GiB RAM + 2 vCPU)
4. あとはデフォルトで次へで、 Create environment
5. 10 GB しかないので、ストレージサイズを増やすため、一度 EC2 を停止 `sudo poweroff`
6. EC2 画面からインスタンスのストレージをたどり、 10GB から 30GB へ
7. EC2 を再起動する
8. Cloud 9 画面に戻り、上記の [使い方](#how-to-use) から続ける


# 著者メモ

以下、開発時のメモです。

## 開発時の実行方法

このプロジェクトをクローン。
ハンズオン画面用の React アプリを起動:

```
cd app/ui
npm install
npm start
```

localhost:3000 でアプリが利用可能となる。この状態でフロントのコンテンツを実装。 React の仕組みでリアルタイム更新できるので便利。

API を使う場合、 API サーバを起動:
```
cd app/api
npm install
npm start
```

次に、 nginx をローカルモードで起動:
```
bin/nginx.sh local
```

- [ ] Add fleet
- [ ] Authenticate with API key
- [ ] Why specifying module names to load filebeat assets with `filebeat setup --modules nginx` didn't work as expected? How does filebeat uses the `--modules` option?
- [ ] Why nginx metricbeat module didn't use `server_status_path` as expected? If I used the default path to expose nginx stub_status, it worked just fine. Probably I had to use the `raw` label
- [x] How does Filebeat set ingest pipeline? For example `filebeat-7.11.1-nginx-access-pipeline` is set somehow from ECS fields I guess.
    - [setting fileset rootPipelineID](https://github.com/elastic/beats/blob/9b2fecb327a29fe8d0477074d8a2e42a3fabbc4b/filebeat/fileset/fileset.go#L390)
    - [formatPipelineID](https://github.com/elastic/beats/blob/9b2fecb327a29fe8d0477074d8a2e42a3fabbc4b/filebeat/fileset/fileset.go#L516)
    - [manifest struct](https://github.com/elastic/beats/blob/v7.11.1/filebeat/fileset/fileset.go#L114)
    - [getTemplateFunctions IngestPipeline](https://github.com/elastic/beats/blob/v7.11.1/filebeat/fileset/fileset.go#L313)
    - [LoadPipelines](https://github.com/elastic/beats/blob/9b2fecb327a29fe8d0477074d8a2e42a3fabbc4b/filebeat/fileset/pipelines.go#L62)

