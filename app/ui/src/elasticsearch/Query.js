import {EuiMarkdownFormat} from '@elastic/eui';
import Mermaid from '../Mermaid';

function Query() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const today = now.toJSON().split('T')[0];
  return (
<>
<EuiMarkdownFormat>{`
## Elasticsearch の検索の仕組み

Elasticsearch は内部で Apache Lucene という検索エンジン用ライブラリを利用しています。

- Elasticsearch の shard は Lucene のインスタンス
- Lucene のデータは Segment と呼ばれる、ディスク上に永続化されたデータ
- Segment は一度書き込んだら変更できない、インミュータブル
- 新しいドキュメントは別の Segment に書き込まれる
- Segment は定期的にマージされる
- Segment には検索、集約を効率的に行うためにさまざまな派生的なデータ構造が作成される:
  - _source: もともとの JSON ドキュメント
  - 二次インデックス: 転置インデックス (inverted index), BKD-trees
  - doc_values: アグリゲーション、ソートなどに利用する

### ドキュメントをインデックスしてから検索できるようになるまで

インデックスされたドキュメントは MemoryBuffer に保存されます。 Lucene の Segment には非同期に書き込まれます。 Segment を新しく書き込む処理のことを \`refresh\` と言い、デフォルトでは 1秒間に一回バックグラウンドで実行されています。

`}</EuiMarkdownFormat>

<Mermaid chart={`
flowchart LR
    Client--write-->Shard
    Shard--write-->MemoryBuffer
    MemoryBuffer--refresh-->Segment2
    subgraph Lucene
      Segment1
      Segment2
      Segment1--merge-->Segment3
      Segment2--merge-->Segment3
    end
`} />

<EuiMarkdownFormat>{`

ドキュメントは ID を指定した \`GET {index-name}/_doc/{id}\` APIで取得する場合、 MemoryBuffer にそのドキュメントがあれば Lucene を検索する必要はありません。このため、 ID が分かれば、インデックスした直後でもドキュメントを取得することができます。 MemoryBuffer にない場合は Lucene から取得することになります。

`}</EuiMarkdownFormat>

<Mermaid chart={`
flowchart LR
    Client--get-->Shard
    Shard--get-->MemoryBuffer
`} />

<EuiMarkdownFormat>{`

\`GET {index-name}/_search\` API を利用する場合は Lucene を見にいくことになります。ドキュメントがインデックスされても、 Lucene の Segment が生成される (refresh される) までは、検索結果に新しいドキュメントは現れません。

`}</EuiMarkdownFormat>

<Mermaid chart={`
flowchart LR
    Client--search-->Shard
    Shard--search-->Segments
    subgraph Lucene
      Segments
    end
`} />

<EuiMarkdownFormat>{`

興味がある方はこちらのブログをご覧ください:
- [Elasticsearch from the Bottom Up](https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up)
- [Elasticsearch from the Top Down](https://www.elastic.co/blog/found-elasticsearch-top-down)
- Elasticsearch 関連ソースコード:
  - [InternalEngine.index](https://github.com/elastic/elasticsearch/blob/main/server/src/main/java/org/elasticsearch/index/engine/InternalEngine.java#L909)
  - [InternalEngine.get](https://github.com/elastic/elasticsearch/blob/main/server/src/main/java/org/elasticsearch/index/engine/InternalEngine.java#L675)
  - [ShardGetService.innerGet](https://github.com/elastic/elasticsearch/blob/main/server/src/main/java/org/elasticsearch/index/get/ShardGetService.java#L188)
  - [ShardGetService.innerGetFetch](https://github.com/elastic/elasticsearch/blob/main/server/src/main/java/org/elasticsearch/index/get/ShardGetService.java#L260)


### 転置インデックスとは

全文検索エンジンの重要な役割の一つは、文字の揺らぎをある程度吸収して、完全に一致しない文字列であったとしてもデータを検索できることです。 Elasticsearch はこれを実現するために Lucene を使い、転置インデックスというデータ構造を作成しています。

転置インデックスは分厚い本の巻末にある単語の索引のようなデータです。その語句が出現するドキュメントを簡単に参照できるようになっています。転置インデックスは元々の文字列から語句を抽出するテキスト解析 (Text Analysis) という処理を行います。 Elasticsearch の \`_analyze\` API を使うとテキスト解析の様子をシミュレートすることができます:

\`\`\`json
POST _analyze
{
  "text": [
    "How does Elasticsearch search data?"
  ]
}
\`\`\`

結果は次のように、 how, does, elasticsearch, search, data の 5つの語句になりました。全て小文字に統一されている点にも注目してください。このデータを検索する場合、検索に指定した文字列も同じルールでテキスト解析されます。 "Elasticsearch" と検索しても "elasticsearch" と検索してもヒットするようになります。

\`\`\`json
{
  "tokens": [
    {
      "token": "how",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "does",
      "start_offset": 4,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "elasticsearch",
      "start_offset": 9,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "search",
      "start_offset": 23,
      "end_offset": 29,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "data",
      "start_offset": 30,
      "end_offset": 34,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
\`\`\`

### 日本語はどうなる?

先程、いくつか日本語でドキュメントを登録しました。 自動発番した ID は \`x\` としておきます。

| ID | message |
|----|---------|
|x|ID を指定せずにドキュメントを保存|
|1|ドキュメント 1 を保存|
|2|バルクで複数更新処理を一括実行|
|3|複数のドキュメントを効率的に保存|

これらの \`message\` フィールドの値は次のように転置インデックスが作成されています:

| Term | Doc IDs |
|------|---------|
|1|1|
|id|x|
|ず|x|
|せ|x|
|で|2|
|に|x, 3|
|の|3|
|を|x, 1, 2, 3|
|ドキュメント|x, 1, 3|
|バルク|2|
|一|2|
|保|x, 1, 3|
|処|2|
|効|3|
|存|x, 1, 3|
|定|x|
|実|2|
|括|2|
|指|1|
|数|2, 3|
|新|2|
|更|2|
|率|3|
|理|2|
|的|3|
|行|2|
|複|2, 3|

ユニコードの文字範囲によってカタカナのように連続する語はひとまとまりになったり、漢字やひらがなは一文字になっていたりします。デフォルトの日本語テキスト解析の仕組みは、検索結果は返ってくるけれど、なぜこれがヒットするの？と首を傾げたくなるような挙動となるでしょう。通常、日本語を期待通り検索したい場合、形態素解析や N-Gram といったテクニックを組み合わせて利用します。

参考ブログ:
- [Elasticsearchで日本語の全文検索の機能を実装する](https://www.elastic.co/jp/blog/how-to-implement-japanese-full-text-search-in-elasticsearch)
- [Elasticsearchで日本語のサジェストの機能を実装する
](https://www.elastic.co/jp/blog/implementing-japanese-autocomplete-suggestions-in-elasticsearch)

## 基本のクエリ

検索の仕組みを説明する前置きが長くなりましたが、 [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) でよく使う基本のクエリをいくつかみてみましょう。

### match

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "match": {
      "message": "ドキュメント"
    }
  }
}
\`\`\`

\`match\` クエリでは検索対象のフィールドと検索語を指定します。検索語はテキスト解析の仕組みで分割され、転置インデックスの term と比較されます。複数の検索語はスペース区切りで指定できます。何も指定しない場合、 \`OR\` 検索となります。

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "match": {
      "message": "複数 ドキュメント"
    }
  }
}
\`\`\`

\`AND\` 検索にする場合は \`operator\` というオプションを指定します:

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "match": {
      "message": {
        "query": "複数 ドキュメント",
        "operator": "AND"
      }
    }
  }
}
\`\`\`

他にもたくさんのオプションパラメータがあります、 [match クエリのリファレンス](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) を見てみましょう。

### range

数値や日付の範囲を検索する場合には、 [\`range\` クエリ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)を利用します。

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "range": {
      "value": {
        "gte": 5,
        "lt": 35
      }
    }
  }
}
\`\`\`

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "range": {
      "@timestamp": {
        "gte": "${today}T10:00:00+09:00",
        "lt": "${today}T11:00:00+09:00"
      }
    }
  }
}
\`\`\`

\`date\` 型の場合、 \`date math\` という表記で相対的に時間を指定することもできます:
\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "range": {
      "@timestamp": {
        "gte": "now-2d"
      }
    }
  }
}
\`\`\`

### Bool クエリ

検索性能を測る尺度として、[適合率と再現率](https://en.wikipedia.org/wiki/Precision_and_recall) (precision and recall) があります。これは求めている情報が正しく返せたかを表ます。

Elasticsearch のような全文検索エンジンでは、単に検索語がドキュメントに含まれるかどうかだけでなく、「検索語がどれだけドキュメントにマッチしているか」という関連度が重要になります。検索結果として返されたドキュメントの一覧を関連度でソートし、ユーザーが求めている情報を優先的に返すことが重要です。 Elasticsearch では [\`bool\` クエリ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) できめ細やかな検索条件を指定することができます。

#### Query と Filter コンテキスト

Elasticsearch の検索には Query と Filter の二つのコンテキストがあります。 Filter は「検索結果に返すか、返さないか」だけに影響するのに対し、 Query コンテキストはそのドキュメントがどれだけ関連しているかを示すスコアも計算します。

Bool クエリでは、役割の異なる 4つの部分で検索条件を指定でき、検索結果として返す対象と、検索結果内の順位を細かく調整できます。

|bool の句|コンテキスト|一致したら検索結果に|一致したらスコアが|
|--------|----------|-----------------|---------------|
|must|query|含める|上がる|
|filter|filter|含める|関係ない|
|should|query|関係ない|上がる|
|must_not|filter|含めない|関係ない|

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "message": "ドキュメント"
        }
      },
      "should": {
        "range": {
          "value": {
            "gte": 10
          }
        }
      },
      "filter": [
        {
          "terms": {
            "labels.api": ["_bulk", "put"]
          }
        }
      ]
    }
  }
}
\`\`\`


`}</EuiMarkdownFormat>

</>
  );
}

export default Query;