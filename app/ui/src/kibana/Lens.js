import React from 'react';
import {Section, Markdown} from '../Common.js'

class Lens extends React.Component {
  render() {
    return (
<Section>
<Markdown>{`## Lens でデータセットを分析しよう

Discover に次いで簡単にデータセットを分析できるのが *Lens* です。
ドラッグアンドドロップの簡単な操作で多彩な可視化が可能です。
`}</Markdown>

<ol>
<li>
<Markdown>Kibana メインメニューから *Analytics* の *Visualize* を選択し、 *Create new visualization* をクリックします。
いくつか可視化手法の選択肢が表示されます。 *Lens* をクリックしましょう。</Markdown>
</li>
<li><Markdown>{`
左上のインデックスパターンで、 \`es-hands-on-${process.env.REACT_APP_KEY}\` を選びます。
`}</Markdown></li>
<li>
<Markdown>{`左側のフィールドリストから \`Records\` を真ん中のチャートエリアにドラッグしてみましょう。
すると、 \`@timestamp\` フィールドをベースに件数を Y軸に表示する、 Discover に似た棒グラフができました:
![](/images/kibana-lens-count.png)`}</Markdown>
</li>
<li>
<Markdown>{`さらに左側のフィールドリストから \`labels.api\` を真ん中のチャートエリアにドラッグしてみましょう。
すると、 \`labels.api\` の値で棒グラフが分割されます:
![](/images/kibana-lens-count-per-api.png)`}</Markdown>
</li>
<li>
<Markdown>{`描画方法を簡単に変更できるのも Lens の魅力です。
チャート上の Chart Type から \`Donut\` を選択してみましょう。
すると現在選択中の時間範囲内における API フィールド値での件数分布が表示されます:
![](/images/kibana-lens-donut-per-api.png)`}</Markdown>
</li>
<li>
<Markdown>{`
右上の *Save* ボタンをクリックして、　\`${process.env.REACT_APP_KEY}-lens\` という名前で保存しましょう。
`}</Markdown>
</li>
</ol>

</Section>



    );
  }
}

export default Lens;