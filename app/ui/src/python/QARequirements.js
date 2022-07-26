import React, {useState, useEffect, Fragment} from 'react';
import example from "./example";
import Mermaid from '../Mermaid';

import {
  EuiMarkdownFormat
} from '@elastic/eui';

function QARequirements() {

  return (
  <>
<EuiMarkdownFormat>{`
## QA アプリ

Python の API を実装して QA アプリを開発してみましょう。実装する機能は以下の通りです:

- 質問が入力できる
- 質問が検索できる
- 回答が入力できる

あらかじめ UI と API の雛形は作成済です。UI から呼び出される API を実装してください。API では Elasticsearch へのドキュメント保存、検索などを実装します。 Python API では [FastAPI](https://fastapi.tiangolo.com/) というフレームワークを利用しています。

`}</EuiMarkdownFormat>

<Mermaid chart={`
flowchart LR
  UI[QA APP]-->API[Python API]
  API-->Index
  subgraph Elasticsearch
    Index
  end
`} />

<EuiMarkdownFormat>{`
## JSON ドキュメントのデザイン

前述の要件から、 Elasticsearch に保存する JSON ドキュメントをどのように設計すればよいでしょうか。
大きく二つのアプローチがあるでしょう。質問と回答を同一ドキュメントとして扱う、あるいは別々に管理する方法です。
Elasticsearch では検索効率を高めるために、関連する情報をひとつのドキュメント内にまとめるのがベストプラクティスです。 RDB とは違い、正規化は行いません。今回は次のようにドキュメントをモデリングしました:

- timestamp
- user 投稿者 (env-key)
- tags (n)
- title タイトル
- body 本文 markdown
- status ステータス (open, closed)
- comments コメント (n):
  - timestamp
  - user 投稿者 (env-key)
  - comment 本文 markdown
  - is_answer コメントが回答として採用されたか

それぞれのフィールドのデータ型は何がよいでしょうか？少し考えてみましょう。

今回は次のようにマッピングを定義しました:

\`\`\`json
PUT es-hands-on-qa
{
  "mappings": {
    "properties": {
      "body": {
        "type": "text"
      },
      "timestamp": {
        "type": "date"
      },
      "title": {
        "type": "text"
      },
      "user": {
        "type": "keyword"
      },
      "tags": {
        "type": "keyword"
      },
      "status": {
        "type": "keyword"
      },
      "comments": {
        "type": "object",
        "properties": {
          "timestamp": {
            "type": "date"
          },
          "user": {
            "type": "keyword"
          },
          "comment": {
            "type": "text"
          },
          "is_answer": {
            "type": "boolean"
          },
        }
      }
    }
  }
}
\`\`\`

### 排他制御はどうする？
このように質問と回答を一つのドキュメントとして扱う場合、同時に更新されるケースを制御する仕組みが必要です。今回のサンプルアプリではそこまでの作り込みはしませんが、 Elasticsearch で排他制御を行う場合、[楽観ロック](https://www.elastic.co/guide/en/elasticsearch/reference/current/optimistic-concurrency-control.html)か [Update](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html) を使うとよいでしょう。

それでは Python のコーディングを始めましょう。

`}</EuiMarkdownFormat>

</>
  );
}

export default QARequirements;