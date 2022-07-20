import {
  EuiMarkdownFormat
} from '@elastic/eui';

function Logstash() {

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

Logstash が無事起動すると、標準入力の入力待ちになります。何か文字列を入力し、 Enter キーを押しましょう。
次の様な結果が表示されれば OK です:

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


## 国税調査のファイルをロードしてみよう

「国勢調査 / 時系列データ / 男女，年齢，配偶関係」のデータを Logstash で取り込んでみましょう。

- 0003410379.csv: [男女別人口及び人口性比 － 全国，都道府県（大正9年～令和2年）](https://www.e-stat.go.jp/dbview?sid=0003410379)
- 0003410382.csv: [配偶関係（4区分），年齢（5歳階級），男女別15歳以上人口 － 全国（大正9年～令和2年）](https://www.e-stat.go.jp/dbview?sid=0003410382)

これらの CSV ファイルは上記サイトからダウンロードし、文字コードを shift-jis から utf-8 に変換したものです。

### 男女別人口及び人口性比

ファイルの内容を理解するために、いくつかデータをみてみましょう。列志向のデータ構造となっています。 Elasticsearch には各レコードを JSON に変換して取り込めば項目ごとに集計ができそうです。

|tab_code|表章項目|cat01_code|男女_時系列|area_code|地域_時系列|time_code|時間軸（調査年）|unit|value|
|--|--|--|--|--|--|--|--|--|--|
|020|人口|100|総数|00000|全国|1920000000|1920年|人|55963053|
|020|人口|100|総数|13000|東京都|2005000000|2005年|人|12576601|
|020|人口|110|男|03000|岩手県|2005000000|2005年|人|663580|
|020|人口|120|女|16000|富山県|2005000000|2005年|人|576112|

それでは、 \`logstash/simple.conf\` をテンプレートとして、このファイルを取り込む設定を作成していきましょう。

\`\`\`bash
cp logstash/simple.conf logstash/0003410379.conf
\`\`\`

コピーした \`logstash/0003410379.conf\` ファイルを編集していきます。

1. input の設定でファイルを読み込む
1. csv filter で項目を分割
1. 不要なレコードは削除
1. データ型変換
1. 不要なフィールドは prune
1. Elasticsearch への出力設定

中には value が "-" になっている厄介なレコードもあります。このようなレコードは削除してしまうのがよいでしょう。

\`\`\`csv
"1120","人口性比","100","総数","47000","沖縄県","1945000000","1945年","","-"
\`\`\`

CSV ファイルには 4200件のデータがありますが、 value 列が "-" のデータが 84件あるので、 Elasticsearch には 4116 件のドキュメントが保存されていれば成功です:

\`\`\`bash
$ wc -l logstash/0003410379.csv
4200 logstash/0003410379.csv
$ grep ',"-"' logstash/0003410379.csv |wc -l
84
\`\`\`

\`\`\`
GET es-hands-on-00003410379-${process.env.REACT_APP_KEY}/_count
\`\`\`

## Challenge!

- 取り込んだ 0003410379 を Kibana で分析してみましょう
- 0003410382.csv も取り込んでみましょう

`}</EuiMarkdownFormat>

</>
  );
}

export default Logstash;