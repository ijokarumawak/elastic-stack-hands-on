import {EuiMarkdownFormat} from '@elastic/eui';
import Mermaid from '../Mermaid';

function Integrations() {
  return (

<>
<EuiMarkdownFormat>{`
## Fleet, Integration, Elastic Agent

Beats のモジュールを利用すれば、さまざまなサービスやプロセスの情報を収集して、オブザーバビリティを高めることができます。ですが、 Beats は収集対象のデータに応じた Beats を個別にインストール、設定する必要があり、煩雑な面があります。

Nginx を例にしてみると、ログを収集するために Filebeat、メトリックを収集するために Metricbeat をそれぞれインストールする必要があります。どちらの YML ファイルにも Elasticsearch の接続先を定義しますが、設定は同じ様になるでしょう。また、対象のサーバー台数が多くなった場合、同様の設定を全てのサーバーに展開するのも大変です。

そこで登場するのが Fleet, Integration, Elastic Agent です。

- Elastic Agent: 軽量のエージェント方プログラム、データ収集対象のサーバや端末にインストールします
- Fleet: Kibana の UI から、複数の Agent を集中管理する仕組みです
- Integrations: 特定のサービスごとに、さまざまな情報を収集するためのパッケージとして提供されます、Elastic Agent ごとにポリシーを割り当て、その Agent では何を収集するのかを紐づけて管理します、一つのポリシーを複数の Agent で使い回すことができます

各コンポーネントの関連を ER 図で示すと次のようになります:
`}</EuiMarkdownFormat>

<Mermaid chart={`
erDiagram
    Fleet
    ElasticAgent {
      process filebeat
      process metricbeat
    }
    Policy
    Integrations {
      string name
      string package
      bool collectLog
      bool collectMetric
      etc otherConfigurations
    }
    Fleet ||--o{ ElasticAgent : manages
    Policy ||--o{ ElasticAgent : assigned_to
    Policy ||--o{ Integrations : has
    ElasticAgent ||--|| Computer : runs_on
`} />

<EuiMarkdownFormat>{`

Integrations を使えば、先程の Nginx のデータ収集手順は以下の様により簡単になります:

1. Kibana の integrations から Nginx を検索
2. Nginx integrations を追加して、設定 (ログ、メトリックなどの収集を一度に設定できる)
3. Nginx integrations をポリシーに割り当て
4. Elastic Agent を Nginx サーバーにインストール
5. Elastic Agent にポリシーを割り当て

Kibana の Integrations から、さまざまなデータ統合機能を追加できます。

![](/images/integrations.png)
`}</EuiMarkdownFormat>
</>
  );
}

export default Integrations;