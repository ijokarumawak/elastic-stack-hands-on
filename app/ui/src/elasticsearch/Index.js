import React from 'react';
import {Section, Markdown, Code} from '../Common.js'

class Index extends React.Component {
  render() {
    return (
<Section>
<Markdown>{`## インデックスとは

Elasticsearch では JSON ドキュメントを格納する場所のことをインデックスというのでした。
JSON ドキュメントを格納するだけでなく、インデックスには、 JSON ドキュメントのスキーマ情報や、インデックス単位の設定などを保持しています。

`}</Markdown>

<ol>
<li>次の API を Kibana コンソールから実行しましょう:
<Code language="json">{`
GET es-hands-on-${process.env.REACT_APP_KEY}
`}</Code>

<Markdown>{`レスポンスで返される \`mappings\` には、ドキュメントのスキーマ情報が設定されています。
インデックスが自動作成される際に、保存した JSON ドキュメントの値により自動でデータ型を推測して設定してくれます。

\`settings\` にはインデックス単位の設定があります。例えば \`number_of_shards\` はインデックスのプライマリシャード数です。
複数の Elasticsearch ノードで分散、分担して単一のインデックスを扱う場合にシャードの数を増やします。
`}</Markdown>
</li>
</ol>

<Markdown>{`## 二つの文字列型、 text と keyword
Elasticsearch を使いこなす上で、避けて通れないのが、 \`text\` と \`keyword\` 型の違いです。
簡単に言うと:
- text: 全文検索用、文字列を一定のルールで分解、正規化し、検索語で探しやすくする
- keyword: 完全一致用、入力文字列はそのままの形で保存される、ソート、アグリゲーションに利用可能

Elasticsearch はインデックスを自動生成する際に文字列のフィールドをマルチフィールドという仕組みを使って、 text, keyword の二つの型のフィールドを生成してくれます。
例えば、先ほど作成した es-hands-on インデックスの \`message\` フィールドは次のようになっています:
`}</Markdown>
<Code language="json" copy="false">{`
{
  "message" : {
    "type" : "text",
    "fields" : {
      "keyword" : {
        "type" : "keyword",
        "ignore_above" : 256
      }
    }
  }
}
`}</Code>

<Markdown>{`これは、 Elasticsearch には対象のフィールドが全文検索用なのか、集計用のフィールドなのか判断できないためです。
ただし、多くの場合これは冗長なマッピング定義となり、インデックスサイズが必要以上に大きくなる原因となる場合があります。

## マッピングを最適化

事前に保存するデータのフィールド仕様が分かっているのであれば、明示的にマッピング情報を指定してインデックスを作成すると良いでしょう。
ただ、 Elasticsearch では既存フィールドのデータ型を ***変更することはできません***。
新しいフィールド定義は追加できますが、既存のフィールドのデータ型を変更する場合には別のインデックスを作る必要があります。

手順としては、次のようになります:
1. 新しいインデックスを新しいマッピングで作成する
2. reindex API で古いインデックスからデータを登録し直す
3. 古いインデックスを削除する
4. 古いインデックスの名前で新しいインデックスへのエイリアスを作成する

すると、当該インデックスにアクセスしているクライアントアプリケーションなどを変更することなくマッピングの最適化が可能になります。
それでは、以下の手順を実行し、インデックスを最適化してみましょう。
`}</Markdown>

<ol>
<li>新しいインデックスを新しいマッピングで作成する:
<Code language="json">{`
PUT es-hands-on-${process.env.REACT_APP_KEY}-v2
{
  "mappings": {
      "properties" : {
        "@timestamp" : {
          "type" : "date"
        },
        "labels" : {
          "properties" : {
            "api" : {
              "type" : "keyword"
            }
          }
        },
        "message" : {
          "type" : "text"
        }
      }
    }
}
`}</Code>
</li>

<li>新しいインデックスにデータを投入し直す:
<Code language="json">{`
POST _reindex
{
  "source": {
    "index": "es-hands-on-${process.env.REACT_APP_KEY}"
  },
  "dest": {
    "index": "es-hands-on-${process.env.REACT_APP_KEY}-v2"
  }
}
`}</Code>
</li>

<li>古いインデックスを削除する:
<Code language="json">{`
DELETE es-hands-on-${process.env.REACT_APP_KEY}
`}</Code>
</li>

<li>古いインデックスの名前でエイリアスを作成する:
<Code language="json">{`
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "es-hands-on-${process.env.REACT_APP_KEY}-v2",
        "alias": "es-hands-on-${process.env.REACT_APP_KEY}"
      }
    }
  ]
}
`}</Code>
</li>
<li>これで古いインデックス名でも継続してアクセスできます:
<Code language="json">{`
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "match": {
      "message": "ドキュメント"
    }
  }
}
`}</Code>
</li>
</ol>



</Section>
    );
  }
}

export default Index;