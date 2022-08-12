import {EuiMarkdownFormat} from '@elastic/eui';
import Mermaid from '../Mermaid';

function Document() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const today = now.toJSON().split('T')[0];
  return (
<>
<EuiMarkdownFormat>{`
## ドキュメントを保存、検索してみよう

Elasticsearch は REST API を実装しています。送信する HTTP リクエストのメソッド (GET, POST, PUT, DELETE) と、送信先の URL で直感的にリクエストの内容がわかります。
例えばドキュメント操作 API の URL は \`index名\` / _doc / \`ドキュメントID\` となっています。

Elasticsearch では JSON ドキュメントを格納する場所のことをインデックスといいます。
事前にインデックスを作成しておかなくても、デフォルトではドキュメント保存時に作成されます。
ドキュメントが保存されると同時にインデックスも作成されます。

`}</EuiMarkdownFormat>

<Mermaid chart={`
flowchart LR
    App-->API
    subgraph Elasticsearch
    API-->Index
    Index---Documents
    end
`} />

<EuiMarkdownFormat>{`

次の API を Kibana コンソールから実行しましょう:
\`\`\`json
PUT es-hands-on-${process.env.REACT_APP_KEY}/_doc/1
{
  "@timestamp": "${today}T10:00:00+09:00",
  "labels.api": "PUT _doc",
  "message": "ドキュメント 1 を保存",
  "value": 1
}
\`\`\`

ID を指定して保存したドキュメントを取得できます:
\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_doc/1
\`\`\`

ドキュメントの ID を指定せずに保存することもできます。この場合、 Elasticsearch がユニークな ID を自動で付与します:
\`\`\`json
POST es-hands-on-${process.env.REACT_APP_KEY}/_doc
{
  "@timestamp": "${today}T10:00:00+09:00",
  "labels.api": "POST _doc",
  "message": "ID を指定せずにドキュメントを保存",
  "value": 9
}
\`\`\`

複数のドキュメントをひとつの API 呼び出しで効率的に保存できる、バルク API を実行してみましょう:
\`\`\`json
POST es-hands-on-${process.env.REACT_APP_KEY}/_bulk
{"index":{"_id":2}}
{"@timestamp": "${today}T10:00:00+09:00", "labels.api": "_bulk", "message":"バルクで複数更新処理を一括実行", "value": 200}
{"index":{"_id":3}}
{"@timestamp": "${today}T11:00:00+09:00", "labels.api": "_bulk", "message":"複数のドキュメントを効率的に保存", "value": 30}
{"index":{"_id":4}}
{"@timestamp": "${today}T12:00:00+09:00", "labels.api": "_bulk", "message":"削除や更新も実行できる"}
{"delete": {"_id":4}}
\`\`\`

保存されたドキュメントの件数をみてみましょう:
\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_count
\`\`\`

保存されたドキュメントを検索語を指定して検索してみましょう:
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

検索リクエストのボディで渡した JSON オブジェクトのことを Query DSL と言います。 Elasticsearch では色々なクエリ方法がありますが Query DSL が最もネイティブなクエリ言語です。次のページでは Query DSL の詳細をみていきます。

## Challenge!

- Elasticsearch の [Document API リファレンス](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html) をみてみましょう
- Elasticsearch の [Search API リファレンス](https://www.elastic.co/guide/en/elasticsearch/reference/current/search.html) をみてみましょう

`}</EuiMarkdownFormat>
</>
  );
}

export default Document;