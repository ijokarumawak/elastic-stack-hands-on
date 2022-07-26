import React, {useState, useEffect, Fragment} from 'react';
import example from "./example";
import Mermaid from '../Mermaid';

import {
  EuiMarkdownFormat
} from '@elastic/eui';

function QADevelopment() {

  return (
  <>
<EuiMarkdownFormat>{`
## QA アプリ Python API

\`python/app/main.py\` に API の実装を追加していきます。

Elasticsearch への接続部分はすでに実装されています。 \`env.sh\` に設定した環境変数を使ってアクセスするようになっています。この \`es\` を使って Elasticsearch の API を呼び出しましょう。

\`\`\`python
es = Elasticsearch(cloud_id=os.getenv("ELASTIC_CLOUD_ID"),
                   basic_auth=[os.getenv("ELASTIC_USERNAME"), os.getenv("ELASTIC_PASSWORD")])
\`\`\`

### 1. 質問を新規作成する

QA 画面から新しい質問を入力し、 *Save* をクリックした時に呼び出されます。 \`add_question\` を実装しましょう。今は未実装を示すメッセージを返しています。

\`\`\`python
@app.post("/qa/questions")
def add_question(question: Question):
    return {"message": "Not implemented yet."}
\`\`\`

引数の \`question\` に画面から入力された値が設定されています。 FastAPI の仕組みで \`Question\` というデータモデルとして渡ってきます。 Elasticsearch に保存する情報は全て \`question\` に設定されているので、ここで必要なのは \`question\` を JSON に変換し、Elasticsearch に渡すだけです。

JSON への変換は \`jsonable_encoder\` を使います。インデックスを指定して \`es.index\` を呼び出します。結果をそのまま API の結果として返してしまいましょう:
\`\`\`python
return es.index(index=qa_index, document=jsonable_encoder(question))
\`\`\`

これで QA アプリの画面から新しい質問が送信できるようになりました。ですが、質問を取得する API をまだ実装していないので画面には保存した質問は表示されません。

### 2. 質問を取得する



### 3. 質問を更新する
### 4. 質問を検索する

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



`}</EuiMarkdownFormat>

</>
  );
}

export default QADevelopment;