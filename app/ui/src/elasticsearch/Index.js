import {EuiMarkdownFormat} from '@elastic/eui';
import Mermaid from '../Mermaid';

function Index() {
  return (
<>
<EuiMarkdownFormat>{`
## インデックスとは

Elasticsearch では JSON ドキュメントを格納する場所のことをインデックスというのでした。
JSON ドキュメントを格納するだけでなく、インデックスには、 JSON ドキュメントのスキーマ情報や、インデックス単位の設定などを保持しています。

次の API を Kibana コンソールから実行しましょう:
\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}
\`\`\`

レスポンスで返される \`mappings\` には、ドキュメントのスキーマ情報が設定されています。
インデックスが自動作成される際に、保存した JSON ドキュメントの値により自動でデータ型を推測して設定してくれます。
Elasticsearch はインデックス、フィールドごとにきめ細かくデータ型、検索用の転置インデックスの作成方法が設定できます。マッピングについては次のページで解説します。

また、 \`settings\` には以下のようなインデックス単位での設定情報があります:
- number_of_shards: プライマリシャードの数
- number_of_replicas: レプリカシャードの数
- [設定可能なインデックス設定の一覧](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules.html)

## データ分散の仕組み

Elasticsearch のインデックスは論理的な存在で、物理的には 1つ以上の *シャード* (shard) で構成されます。単一のインデックスを複数の Elasticsearch ノードで分散、分担する場合に複数のシャードを利用します。

- プライマリ: データ更新を受け付けるシャード
- レプリカ: 耐障害性向上、検索負荷分散のためのシャード

シャードの数は、データ投入をスケールさせたい場合と、参照をスケールさせたい場合の大きくふたつの考え方があります。

ここで説明するシャード数の設定プラクティスは一つのインデックスについて局所的にみた場合の話です。実際は一つの Elasticsearch クラスタ内に複数のインデックスが作成され、さまざまなワークロードが発生します。どこにボトルネックがあるかを見極め、適切な方法で改善する必要があります。

### データ投入をスケールさせたい場合

大量のデータを投入する必要があり、一台のサーバーだけではインジェストスループットが十分でない場合、サーバーを追加してデータ投入の負荷を分散させます。

`}</EuiMarkdownFormat>

<Mermaid chart={`
flowchart LR
    subgraph Elasticsearch
      Index--write-->Shard_P0
      Index--write-->Shard_P1
      Index--write-->Shard_P2
      subgraph Node1
        Shard_P0
      end
      subgraph Node2
        Shard_P1
      end
      subgraph Node3
        Shard_P2
      end
    end
`} />

<EuiMarkdownFormat>{`

他にも、[データ投入の性能を改善するテクニック](https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-indexing-speed.html)は色々あります。公式ドキュメントをみてみましょう。

### データ参照をスケールさせたい場合

EC サイトなど、検索をヘビーに行うシステムでは、同時に多数のユーザーからの検索リクエストをさばく必要があります。複数台のサーバーで同一のデータを持つことにより、検索リクエストを分散でき、スループットを高めることができます。

`}</EuiMarkdownFormat>

<Mermaid chart={`
flowchart LR
    subgraph Elasticsearch
      Index--write-->Shard_P0
      Index--read-->Shard_P0
      Index--read-->Shard_R0_1[Shard_R0]
      subgraph Node1
        Shard_P0
      end
      subgraph Node2
        Shard_R0_1
        Shard_P0-.copy-.->Shard_R0_1
      end
      subgraph Node3
        Shard_R0_2
        Shard_P0-.copy-.->Shard_R0_2
      end
      Index--read-->Shard_R0_2[Shard_R0]
    end
`} />

<EuiMarkdownFormat>{`

他にも、[データ参照の性能を改善するテクニック](https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-search-speed.html)は色々あります。公式ドキュメントをみてみましょう。

## タイムシリーズデータの管理

ログやメトリック、セキュリティイベントといったタイムシリーズデータの場合は、 [Data Stream](https://www.elastic.co/guide/en/elasticsearch/reference/current/data-streams.html) を利用して書き込み対象のインデックスを時間とともに切り替えていきます。さらにストレージ運用コストを抑えつつ長期間のデータを検索可能とするために Index Lifecycle Management (ILM) や Searchable Snapshot などの機能があります。詳細は[データ管理](https://www.elastic.co/guide/en/elasticsearch/reference/current/data-management.html)の公式ドキュメントを参照してください。


`}</EuiMarkdownFormat>

</>
  );
}

export default Index;