import {
  EuiMarkdownFormat
} from '@elastic/eui';

function Intro() {

  return (
  <>
<EuiMarkdownFormat>{`

## 各プログラミング言語向けのライブラリ

Elasticsearch へのデータ登録や検索などは、REST API で実行することができます。 curl コマンドでも実行できますし、クライアントライブラリを利用すれば、お好きなプログラミング言語でアプリケーション開発が可能です。

ライブラリは通常二段階構成となっています:

1. low level: Elasticsearch の REST API エンドポイントと 1:1 でひもづく低レベルなメソッドや関数が用意されたもの
2. high level: 低レベルなライブラリをベースに、より各プログラミング言語において自然に記述できるようにしたもの、例えば、データモデルの永続化機構など

## Python のライブラリ

Python 向けにも二段階のライブラリが提供されています:

1. low level: [Python Elasticsearch Client](https://elasticsearch-py.readthedocs.io/en/latest/)
2. high level: [Python Elasticsearch DSL](https://elasticsearch-dsl.readthedocs.io/en/latest/)

本ワークショップでは low level の Python Elasticsearch Client を利用して、サンプルの QA アプリを作っていきます。

`}</EuiMarkdownFormat>

</>
  );
}

export default Intro;