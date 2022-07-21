import React, {useState, useEffect, Fragment} from 'react';
import example from "./example";
import Mermaid from '../Mermaid';

import {
  EuiMarkdownFormat
} from '@elastic/eui';

function QARequirements() {

  return (
  <>
<Mermaid chart={`
  flowchart LR

  A[Hard] -->|Text| B(Round)
  B --> C{Decision}
  C -->|One| D[Result 1]
  C -->|Two| E[Result 2]
`} />
<EuiMarkdownFormat>{`
## QA アプリ

TODO: Python の API を実装して QA アプリを開発

- 質問が検索できる
- 質問が入力できる
- 質問が修正できる
- 回答が入力できる

JSON ドキュメントのデザイン

モデリングの方法は大きく二つのアプローチ。質問と回答を同一ドキュメントとして扱う、あるいは別々に管理する。今回は検索性を優先し、前者とする。

質問:
- @timestamp
- 投稿者 (env-key)
- tag
- タイトル
- 本文 markdown
- ステータス (open, closed)
- 回答 (n):
  - @timestamp
  - 投稿者 (env-key)
  - 質問 ID
  - 本文 markdown

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

質問を作成
\`\`\`bash
curl -i -XPOST localhost:8000/qa/questions/ -H 'Content-Type: application/json' -d '{"timestamp": "2022-07-11T12:17:01+09:00", "user": "${process.env.REACT_APP_KEY}", "tags": ["Python", "Elasticsearch"], "title": "Python クライアント", "body": "Python 用の公式ライブラリはありますか?"}'
\`\`\`

質問を取得
\`\`\`bash
curl -i -XGET localhost:8000/qa/questions/2KdaFIIBOaP8JqATcdFM -H 'Content-Type: application/json'
\`\`\`

質問を全件取得
\`\`\`bash
curl -i -XGET localhost:8000/qa/questions -H 'Content-Type: application/json'
\`\`\`

質問を検索
\`\`\`bash
curl -i -XGET localhost:8000/qa/questions -H 'Content-Type: application/json' -d '{"query": "タイムスタンプ"}'
\`\`\`

質問を検索 (POST)
\`\`\`bash
curl -i -XPOST localhost:8000/qa/questions/_search -H 'Content-Type: application/json' -d '{"query": "タイムスタンプ"}'
\`\`\`



## 排他制御
[楽観ロック](https://www.elastic.co/guide/en/elasticsearch/reference/current/optimistic-concurrency-control.html)


`}</EuiMarkdownFormat>

</>
  );
}

export default QARequirements;