import React, {useState, Fragment} from 'react';

import {
  EuiMarkdownFormat,
  EuiSpacer,
} from '@elastic/eui';

import QuestionsTable from "./QuestionsTable.js";

function QA() {

  const [questions, setQuestions] = useState([]);

  return (
  <>
<EuiMarkdownFormat>{`
## QA アプリ

TODO: Python の API を実装して QA アプリを開発

- 質問が検索できる
- 質問が入力できる
- 質問が修正できる
- 回答が入力できる

JSON ドキュメントのデザイン

質問:
- @timestamp
- 投稿者 (env-key)
- tag
- タイトル
- 本文 markdown
- ステータス (open, closed)

回答:
- @timestamp
- 投稿者 (env-key)
- 質問 ID
- 本文 markdown

\`\`\`json
PUT es-hands-on-qa-${process.env.REACT_APP_KEY}
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
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "tags": {
        "type": "keyword"
      }
    }
  }
}
\`\`\`

\`\`\`bash
curl -i -XPOST localhost:8000/qa/questions/ -H 'Content-Type: application/json' -d '{"timestamp": "2022-07-11T12:17:01+09:00", "user": "${process.env.REACT_APP_KEY}", "tags": ["Python", "Elasticsearch"], "title": "Python クライアント", "body": "Python 用の公式ライブラリはありますか?"}'
\`\`\`

[Python Elasticsearch Client](https://elasticsearch-py.readthedocs.io/en/v8.3.2/)

`}</EuiMarkdownFormat>
<EuiSpacer />
<QuestionsTable
  questions={questions}
  setQuestions={setQuestions} />

</>
  );
}

export default QA;