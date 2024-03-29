import {EuiMarkdownFormat} from '@elastic/eui';

function Lens() {
  return (
<EuiMarkdownFormat>{`
## Lens でデータセットを分析しよう

Discover に次いで簡単にデータセットを分析できるのが *Lens* です。
ドラッグアンドドロップの簡単な操作で多彩な可視化が可能です。

Kibana メインメニューから *Analytics* の *Visualize Library* を選択し、 *Create new visualization* をクリックします。
いくつか可視化手法の選択肢が表示されます。 *Lens* をクリックしましょう。


左上の Data view プルダウンで、 \`es-hands-on-${process.env.REACT_APP_KEY}\` を選びます。

左側のフィールドリストから \`Records\` を真ん中のチャートエリアにドラッグしてみましょう。
すると、 \`@timestamp\` フィールドをベースに件数を Y軸に表示する、 Discover に似た棒グラフができました:
![](/images/kibana-lens-count.png)

さらに左側のフィールドリストから \`labels.api\` を真ん中のチャートエリアにドラッグしてみましょう。
すると、 \`labels.api\` の値で棒グラフが分割されます:
![](/images/kibana-lens-count-per-api.png)

描画方法を簡単に変更できるのも Lens の魅力です。
チャート上の Chart Type から \`Donut\` を選択してみましょう。
すると現在選択中の時間範囲内における API フィールド値での件数分布が表示されます:
![](/images/kibana-lens-donut-per-api.png)

右上の *Save* ボタンをクリックして、　\`${process.env.REACT_APP_KEY}-lens\` というタイトルで保存しましょう。\`Add to dashboard\` は \`None\` を選択します。
`}</EuiMarkdownFormat>
  );
}

export default Lens;