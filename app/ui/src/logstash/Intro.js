import {
  EuiMarkdownFormat
} from '@elastic/eui';

function Intro() {

  return (
  <>
<EuiMarkdownFormat>{`
## Logstash の基本

データ収集は Elastic Agent や Beat を利用できます。しかし RDBMS からのデータ取り込みや、複数の出力先にデータを送信したい場合など、より複雑な ETL データパイプラインを作成するには、 Logstash が必要な場合があります。

Logstash の設定ファイルは [\`input\`](https://www.elastic.co/guide/en/logstash/current/input-plugins.html), [\`filter\`](https://www.elastic.co/guide/en/logstash/current/filter-plugins.html), [\`output\`](https://www.elastic.co/guide/en/logstash/current/output-plugins.html) の三部分で構成されています。

まずはシンプルに Logstash の動作確認をしてみましょう。次のコマンドを実行すると、 \`logstash/simple.conf\` の設定で Logstash を実行します:

\`\`\`bash
./logstash/simple.sh
\`\`\`

\`logstash/simple.con\` の設定は次の様になっています。標準入力から入力を受け取り、 \`response\` というフィールドを追加して、標準出力に結果を出力します。

\`\`\`ruby
input {
  stdin {
  }
}

filter {
  mutate {
    add_field => {"response" => "Hello from Logstash!"}
  }
}

output {
  stdout { }
}
\`\`\`

Logstash が無事起動すると、標準入力の入力待ちになります。起動には数十秒と時間がかかるので気長に待ちましょう。何か文字列を入力し、 Enter キーを押しましょう。次の様な結果が表示されれば OK です:

\`\`\`
{
      "response" => "Hello from Logstash!",
       "message" => "hogehoge",
      "@version" => "1",
    "@timestamp" => 2022-07-20T06:47:15.827366Z,
          "host" => {
        "hostname" => "f62a2a4eb010"
    },
         "event" => {
        "original" => "hogehoge"
    }
}
\`\`\`

Ctrl+c で終了しましょう。


`}</EuiMarkdownFormat>

</>
  );
}

export default Intro;