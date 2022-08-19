import React, {Fragment} from 'react';

import {
  EuiMarkdownFormat
} from '@elastic/eui';

function QADevelopment() {

  return (
  <>
<EuiMarkdownFormat>{`
## QA アプリ Python API

Python API は自動リロード対応にしてあります。ローカルのファイルを更新し、保存するだけで更新できます。次のページの [QA アプリ](/doc/python/qa) を別のウィンドウで開き、確認しながら進めるとよいでしょう。
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

これで QA アプリの画面から新しい質問が送信できるようになりました。ですが、質問を取得する API をまだ実装していないので画面には保存した質問は表示されません。しかし、ドキュメントとしてはインデックスに保存されているので Kibana のコンソールからは直接確認できるでしょう。

### 2. 質問を取得する

続いて、QA アプリに質問の一覧を表示できるようにしましょう。検索条件を利用する部分は後回しとして、 \`get_questions\` 関数で結果を全て返すようにしてみます。

\`\`\`python
return es.search(index=qa_index)
\`\`\`

これで、 Elasticsearch に保存された質問が一覧で表示されるようになりました。各質問のタイトルをクリックすると詳細画面が表示されます。

しかし、もうひとつ新しい質問を投稿してみても、入力パネルが閉じた後の質問一覧にはすぐには表示されません。表示を更新すると出てきます。UI としては質問入力画面を閉じたら再検索を実行しているのですが、最後に入力した質問が検索結果に含まれていないのです。これは、 Elasticsearch が非同期で検索用の転置インデックスを作成していることが原因です。

今回のように、保存したドキュメントをすぐさま検索可能とする場合、保存時に \`refresh\` というオプションを指定します。 \`add_question\` を修正しましょう:
\`\`\`python
return es.index(index=qa_index, document=jsonable_encoder(question), refresh="wait_for")
\`\`\`

もう一度新しい質問を投稿すると、今度はすぐさま質問の一覧に追加されるはずです。

### 3. 質問を更新する

既存の質問を更新するための API を実装しましょう。 \`put_question\` 関数を実装します。ほぼ \`add_question\` と同じですが、パラメータとして渡ってきた \`id\` を Elasticsearch にも渡すようにしましょう:

\`\`\`python
return es.index(index=qa_index, id=id, document=jsonable_encoder(question), refresh="wait_for")
\`\`\`

### 4. 質問を検索する

最後に、検索部分を実装しましょう。 \`get_questions\` では全件をとりあえず返しました。パラメータとして渡ってきた \`options\` は全く利用していません。画面で入力した検索語やステータスはこの \`options\` で渡ってきます:

- options.query: 入力された検索語
- options.user: QA アプリを操作しているユーザ
- options.status: 質問のステータス、 open, closed

これらのパラメータを利用して \`es.search\` で \`query\` を指定するようにしてください。
また、質問を新しい順に並び替えるようにしましょう。

- 検索窓に入力された検索語は複数のフィールドに対してマッチングが必要です、 [multi_match](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) を使います
- 検索語に加え、ユーザ、ステータスでも検索する必要があります、複数の検索条件を組み合わせるには [bool](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) クエリを使います
- 検索結果のソートには \`sort\` を指定します
- 利用可能なパラメータの詳細は [Elasticsearch REST API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html) や [Python Elasticsearch client](https://elasticsearch-py.readthedocs.io/en/latest/api.html#elasticsearch.Elasticsearch.search) のドキュメントを参考にしましょう。

模範解答は \`python/main_solution.py\` に記載されています。


`}</EuiMarkdownFormat>

</>
  );
}

export default QADevelopment;