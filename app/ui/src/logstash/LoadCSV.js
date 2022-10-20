import {
  EuiMarkdownFormat
} from '@elastic/eui';

function LoadCSV() {

  return (
  <>
<EuiMarkdownFormat>{`
## 国税調査のファイルをロードしてみよう

「国勢調査 / 時系列データ / 男女，年齢，配偶関係」のデータを Logstash で取り込んでみましょう。

- 0003410379.csv: [男女別人口及び人口性比 － 全国，都道府県（大正9年～令和2年）](https://www.e-stat.go.jp/dbview?sid=0003410379)
- 0003410382.csv: [配偶関係（4区分），年齢（5歳階級），男女別15歳以上人口 － 全国（大正9年～令和2年）](https://www.e-stat.go.jp/dbview?sid=0003410382)

これらの CSV ファイルは上記サイトからダウンロードし、文字コードを shift-jis から utf-8 に変換したものです。

### 男女別人口及び人口性比

ファイルの内容を理解するために、いくつかデータをみてみましょう。列指向のデータ構造となっています。 Elasticsearch には各レコードを JSON に変換して取り込めば項目ごとに集計ができそうです。

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

コピーした \`logstash/0003410379.conf\` ファイルを編集していきます。次の処理を追加していきます:

1. input の設定でファイルを読み込む
1. csv filter で項目を分割
1. 不要なレコードは削除
1. タイムスタンプの加工
1. データ型変換
1. 不要なフィールドは削除
1. Elasticsearch への出力設定

中には value が "-" になっている厄介なレコードもあります。このようなレコードは削除してしまうのがよいでしょう。

\`\`\`csv
"1120","人口性比","100","総数","47000","沖縄県","1945000000","1945年","","-"
\`\`\`

### 1. input の設定でファイルを読み込む

Input 部分を書き換えます。 \`file\` input には多くの設定パラメータがあります。今回はリアルタイムに書き込まれるファイルではないので \`read\` モードで良いでしょう。読み取りが完了し、EOF に達したら即座に終了させるため \`exit_after_read\` を有効にします。 Docker で実行する際に csv ファイルを配置するパスを指定します。

\`\`\`ruby
input {
  file {
    mode => read
    exit_after_read => true
    path => "/var/log/0003410379.csv"
  }
}
\`\`\`

上記の設定を行ったら、一度動かしてみましょう。次のコマンドをターミナルから実行します。ファイルを一行ずつ読込み、結果が標準出力に表示されます。

\`\`\`
logstash/0003410379.sh
\`\`\`

### 2. csv filter で項目を分割

続いて filter の設定に進みます。 \`columns\` で列の名前を指定します。これで、各フィールドに分割することができます。

\`\`\`ruby
  csv {
    columns => [
      "tab_code",
      "dataset",
      "cat01_code",
      "gender",
      "area_code",
      "area_name",
      "time_code",
      "year",
      "unit",
      "value"
    ]
  }
\`\`\`

### 3. 不要なレコードは削除

\`value\` フィールドが有効でないレコードは取り込まないようにします。条件付きで \`drop\` filter を実行します。

\`\`\`
  if [value] == "-" {
    drop {}
  }
\`\`\`

### 4.タイムスタンプの加工

Elastic 界隈では時系列データのタイムスタンプを \`@timestamp\` というフィールドに設定することが慣習となっています。 Elastic Common Schema でも定義されています。今回のデータセットは間隔は広いものの立派な時系列データです。 \`year\` から \`@timestamp\` を生成します。タイムゾーンは常に意識するようにしましょう。

\`\`\`ruby
  date {
    match => ["year", "yyyy年"]
    timezone => "Asia/Tokyo"
  }
\`\`\`

### 5.データ型の変換

\`year\` は整数に、 \`value\` は少数に変換します。 \`value\` には人口の人数と、比率としての少数が設定されます。このような場合、どちらも保存できるように \`float\` を採用するとよいでしょう。 \`year\` は "年" という文字を \`gsub\` で除去してから変換します。

\`\`\`ruby
  mutate {
    gsub => [
      "year", "年", ""
    ]
    convert => {
      "year" => "integer"
      "value" => "float"
    }
  }
\`\`\`

### 6.不要なフィールドは削除

元々の \`message\` や Logstash が付与する \`event\`, \`@version\` といったフィールドは不要なので削除しましょう。 \`prune\` を使うとまとめて削除できます。

\`\`\`ruby
  prune {
    blacklist_names => ["message", "event", "@version"]
  }
\`\`\`

### 7.Elasticsearch への出力設定

\`env.sh\` に設定した認証情報で Elasticsearch にアクセスするようにします。

\`\`\`ruby
output {
  elasticsearch {
    cloud_id => "\${ELASTIC_CLOUD_ID}"
    cloud_auth => "\${ELASTIC_CLOUD_AUTH}"
    index => "es-hands-on-0003410379-\${HANDS_ON_KEY}"
  }
}
\`\`\`

### 結果の確認

CSV ファイルには 4200件のデータがありますが、 value 列が "-" のデータが 84件あるので、 Elasticsearch には 4116 件のドキュメントが保存されていれば成功です:

\`\`\`bash
$ wc -l logstash/0003410379.csv
4200 logstash/0003410379.csv
$ grep ',"-"' logstash/0003410379.csv |wc -l
84
\`\`\`

\`\`\`
GET es-hands-on-0003410379-${process.env.REACT_APP_KEY}/_count
\`\`\`



## Challenge!

- 取り込んだ 0003410379 を Kibana で分析してみましょう
- 0003410382.csv も取り込んでみましょう

ダッシュボード例
![](/images/0003410379-dashboard.png)

`}</EuiMarkdownFormat>

</>
  );
}

export default LoadCSV;