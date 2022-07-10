import {EuiMarkdownFormat} from '@elastic/eui';

function Module() {
  return (

<EuiMarkdownFormat>{`
## Module で楽をしよう

先ほどは Filebeat での簡単なデータ加工例を見てみました。
生ログのテキストのパースを各アプリケーションのログファイルに対して実装するのは大変ですね。

例えば、 Nginx の *access.log* のログは以下のようなデータになっています:

\`\`\`
172.17.0.1 - es-hands-on [25/Feb/2021:14:36:48 +0000] "GET / HTTP/1.1" 200 76 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36" "-"
172.17.0.1 - es-hands-on [25/Feb/2021:14:36:48 +0000] "GET /favicon.ico HTTP/1.1" 404 555 "http://localhost:8080/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36" "-"
\`\`\`


アクセスしたユーザ名、日時、 URL、結果コードやユーザエージェントなど、 Web トラフィックの分析に役立つ情報があります。
しかしこれを問題なく取り込むには Nginx のログ仕様をチェックしなければなりません。
そして、今見ているパターンが全てかも分かりません。

幸いなことに Filebeat にはポピュラーなソフトウェア向けに各種モジュールが提供されています。
モジュールは:

- ログのデフォルトロケーション
- パース方法
- Elastic Common Schema (ECS) へのマッピング方法

を知っています。対応するモジュールがあればそれを使うだけで分析可能な状態で取り込むことが可能です。

ハンズオン環境には、 Nginx モジュールを有効にした Filebeat 設定ファイルと、サンプルの access.log があり、 Docker を使って簡単に試せるようになっています。

\`\`\`bash
filebeat/filebeat-module-nginx.sh
\`\`\`

![](../images/filebeat-nginx.png)
`}</EuiMarkdownFormat>
  );
}

export default Module;