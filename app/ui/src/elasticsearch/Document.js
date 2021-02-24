import React from 'react';
import {Section, Markdown, Code} from '../Common.js'

class Document extends React.Component {
  render() {
    return (
<Section>
<Markdown>{`## ドキュメントを保存、検索してみよう

Elasticsearch は REST API を実装していて、送信する HTTP リクエストのメソッド (GET, POST, PUT, DELETE) と、
送信先の URL で直感的にリクエストの内容がわかります。
例えばドキュメント操作 API の URL は \`index名\` / _doc / \`ドキュメントID\` となっています。

Elasticsearch では JSON ドキュメントを格納する場所のことをインデックスといいます。
事前にインデックスを作成しておかなくても、デフォルトではドキュメント保存時に作成されます。
ドキュメントが保存されると同時にインデックスも作成されます。`}</Markdown>

<ol>
<li>次の API を Kibana コンソールから実行しましょう:
<Code language="json">{`
PUT es-hands-on-${process.env.REACT_APP_KEY}/_doc/1
{
  "@timestamp": "2021-02-01T10:00:00+09:00",
  "labels.api": "PUT _doc",
  "message": "ドキュメント 1 を保存"
}
`}</Code>

ID を指定して保存したドキュメントを取得できます:
<Code language="json">{`GET es-hands-on-${process.env.REACT_APP_KEY}/_doc/1`}</Code>
</li>

<li>
ドキュメントの ID を指定せずに保存することもできます:
<Code language="json">{`
POST es-hands-on-${process.env.REACT_APP_KEY}/_doc
{
  "@timestamp": "2021-02-02T10:00:00+09:00",
  "labels.api": "POST _doc",
  "message": "ID を指定せずにドキュメントを保存"
}
`}</Code>
</li>

<li>バルク API を実行してみましょう:
<Code language="json">{`
POST es-hands-on-${process.env.REACT_APP_KEY}/_bulk
{"index":{"_id":2}}
{"@timestamp": "2021-02-03T10:00:00+09:00", "labels.api": "_bulk", "message":"バルクで複数更新処理を一括実行"}
{"index":{"_id":3}}
{"@timestamp": "2021-02-03T11:00:00+09:00", "labels.api": "_bulk", "message":"複数のドキュメントを効率的に保存"}
{"index":{"_id":4}}
{"@timestamp": "2021-02-03T12:00:00+09:00", "labels.api": "_bulk", "message":"削除や更新も実行できる"}
{"delete": {"_id":4}}
`}</Code>
</li>

<li>
保存されたドキュメントの件数をみてみましょう:
<Code language="json">{`GET es-hands-on-${process.env.REACT_APP_KEY}/_count`}</Code>
</li>

<li>保存されたドキュメントを検索語を指定して検索してみましょう:
<Code language="json">{`GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "query": {
    "match": {
      "message": "ドキュメント"
    }
  }
}`}</Code>
</li>
</ol>


</Section>
    );
  }
}

export default Document;