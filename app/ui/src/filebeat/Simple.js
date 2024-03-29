import {EuiMarkdownFormat} from '@elastic/eui';

function Simple() {
  return (

<EuiMarkdownFormat>{`
## Filebeat でログを取り込もう

Elasticsearch に保存したデータは Kibana で様々な分析、可視化できます。ですが、そもそも Elasticsearch にデータを集めるにはどうしたらよいでしょうか。Elasticsearch を導入した後、最大限に活用できるかどうかは、必要なデータを色々なデータソースから収集できるかどうかがカギになります。

データ収集方法の一つとして、 Filebeat があります。ここでは、 Filebeat を実際に動かしてみて、どんなことができるのかを見ていきましょう。

本ハンズオン環境では、みなさんのマシンに Filebeat をインストールしなくても試せるよう、Docker を使って Filebeat が実行できるようにしてあります。

> もちろん、お使いのマシンに直接 Filebeat を[インストールして利用](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation-configuration.html)することもできます。

まずは一番簡単な Filebeat 設定で実行してみましょう。

![](/images/filebeat-simple.png)

次のシェルを実行すると、 CentOS をベースイメージとする Filebeat の Docker コンテナが起動します。
その際、ローカルマシンにある *filebeat-simple.yml* を Filebeat の設定ファイルである \`filebeat.yml\` として、 *simple.log* を CentOS 上の */var/log/simple.log* としてマウントします。コンテナ内で Filebeat が起動する仕組みです:

\`\`\`bash
filebeat/filebeat-simple.sh
\`\`\`

設定ファイルの中身は非常にシンプルです。 \`log\` インプットとしてテキストファイルの末尾を捕獲し、新しいエントリを収集します。それをコンソールに出力するだけです。

\`\`\`yaml
logging.level: error

filebeat.inputs:
  - type: log
    paths:
      - /var/log/simple.log

output.console:
  pretty: true
\`\`\`

あらかじめ用意されていた 3行のデータの読み取りが終わると、次の行が追記されるのを待ちます。 Ctrl + C で終了しましょう。

この設定では何も加工していないので、ログの情報がそのまま \`message\` フィールドとして出力されています。入力のログデータは非常にシンプルですが、 Filebeat によりホスト名やログの場所など色々なメタデータが付与されているのが分かります。

\`\`\`
# 入力データ
2021-02-25T14:05:11.061Z INFO Message1
\`\`\`

また \`@timestamp\` フィールドには Filebeat がログを処理したタイムスタンプが設定されています。ログ情報としてのイベントが発生した日時とは異なりますね。

\`\`\`json
# 出力結果
{
  "@timestamp": "2021-07-14T01:33:55.006Z",
  "@metadata": {
    "beat": "filebeat",
    "type": "_doc",
    "version": "8.3.2"
  },
  "input": {
    "type": "log"
  },
  "host": {
    "name": "9fb7ac5bbd49"
  },
  "agent": {
    "ephemeral_id": "18d0b474-47b6-4845-8ff8-02949677b6e3",
    "id": "4decdb60-1d56-40f9-9a66-5908df6ad65f",
    "name": "9fb7ac5bbd49",
    "type": "filebeat",
    "version": "8.3.2",
    "hostname": "9fb7ac5bbd49"
  },
  "ecs": {
    "version": "8.0.0"
  },
  "log": {
    "offset": 0,
    "file": {
      "path": "/var/log/simple.log"
    }
  },
  "message": "2021-02-25T14:05:11.061Z INFO Message1"
}
\`\`\`

`}</EuiMarkdownFormat>

  );
}

export default Simple;