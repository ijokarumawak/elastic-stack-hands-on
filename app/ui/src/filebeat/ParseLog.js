import {EuiMarkdownFormat} from '@elastic/eui';

function ParseLog() {
  return (

<EuiMarkdownFormat>{`
## Filebeat でログを加工しよう

それでは、ログメッセージを加工してみましょう。
タイムスタンプ、ログレベル、メッセージの三つのフィールドに分割してみます。
Filebeat でデータの加工をする場合、 [\`processor\`](https://www.elastic.co/guide/en/beats/filebeat/current/defining-processors.html) で行います。

通常 Filebeat はログの発生元であるアプリケーションやサービスと同じマシンにデプロイします。
対象に負荷を与えないように、 Filebeat での加工は最低限にするのがベストプラクティスです。
複雑な加工が必要な場合は Elasticsearch の [*Ingest Node Pipeline*](https://www.elastic.co/guide/en/elasticsearch/reference/current/ingest.html) を使います。

次のようなログデータをパースして構造化してみましょう、タイムスタンプ、ログレベル、メッセージがスペース区切りで出力されています:

\`\`\`
2021-02-25T14:05:11.061Z INFO Message1
\`\`\`

シンプルな filebeat-simple.yml をベースに設定を加えていきましょう:

\`\`\`bash
cp filebeat/filebeat-simple.yml filebeat/filebeat-parse-log.yml
\`\`\`

次のコマンドで実行できます、 \`Ctrl + c\` で終了できます:

\`\`\`bash
filebeat/filebeat-parse-log.sh
\`\`\`

それでは、 \`filebeat-parse-log.yml\` に変更を加えていきましょう:

### 1. dissect で文字列を分割

次の \`dissect\` プロセッサを追加してログの文字列を \`timestamp\`, \`log.level\`, \`message\` のフィールドに分割します、これらのフィールドは Elastic Common Schema (ECS) にも定義されています。 ECS のフィールド名を利用しています:
\`\`\`yaml
processors:
  - dissect:
      target_prefix: ""
      overwrite_keys: true
      tokenizer: "%{timestamp} %{log.level} %{message}"
\`\`\`

### 2. @timestamp を設定

\`dissect\` で直接 \`@timestamp\` に設定できれば楽なのですが、[直接は設定できない](https://discuss.elastic.co/t/setting-timestamp-in-filebeat/136224)ようです。 \`dissect\` では一度 \`timestamp\` という仮のフィールドに設定しておき、 \`timestamp\` プロセッサを利用して \`@timestamp\` にタイムスタンプを設定するようにします。その後 \`timestamp\` フィールドは不要なので削除してしまいましょう:

\`\`\`yaml
  - timestamp:
      field: timestamp
      layouts:
        - "2006-01-02T15:04:05.999Z"
  - drop_fields:
      fields: [timestamp]
\`\`\`

### 3. log.level の値を小文字にする

ECS では \`log.level\` の値は小文字になっているので、小文字に統一しておきます。残念ながら小文字にするプロセッサが存在しないので、 \`script\` プロセッサで無理やり小文字にしてみます。あくまで \`script\` 利用方法の一例として捉えてください。プロセッサで用意されていない処理は \`script\` を書いて対応することもできます:


これを、以下の processors でパースします:
\`\`\`yaml
  - script:
      lang: javascript
      id: lowercase
      source: >
        function process(event) {
          event.Put("log.level", event.Get("log.level").toLowerCase());
        }
\`\`\`

結果を確認すると、以下のように生のテキストデータを構造化することができました。 \`@timestamp\` の時間範囲や \`log.level\` でログを絞り込んだり、任意のキーワードで \`message\` を検索できるようになります:
\`\`\`json
{
  "@timestamp": "2021-02-25T14:05:11.061Z",
  "@metadata": {...},
  "ecs": {...},
  "host": {...},
  "log": {
    "file": {
      "path": "/var/log/simple.log"
    },
    "level": "info",
    "offset": 0
  },
  "message": "Message1",
  "input": {...},
  "agent": {...}
}
\`\`\`
`}</EuiMarkdownFormat>

  );
}

export default ParseLog;