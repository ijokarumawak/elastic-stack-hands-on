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


## データ分散の仕組み

\`settings\` にはインデックス単位の設定があります。例えば \`number_of_shards\` はインデックスのプライマリシャード数です。単一のインデックスを複数の Elasticsearch ノードで分散、分担する場合にシャードの数を増やします。

- プライマリ: データ更新を受け付けるシャード
- レプリカ: 耐障害性向上、検索負荷分散のためのシャード

シャードの数は、データ投入をスケールさせたい場合と、参照をスケールさせたい場合の大きくふたつの考え方があります。

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

> これは一つのインデックスについて局所的にみた場合の話です。実際は一つの Elasticsearch クラスタ内に複数のインデックスを作成し、さまざまなワークロードが発生します。どこにボトルネックがあるかを見極め、適切な方法で改善する必要があります。

`}</EuiMarkdownFormat>

</>
  );
}

export default Index;