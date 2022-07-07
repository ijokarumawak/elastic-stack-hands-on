import {EuiMarkdownFormat} from '@elastic/eui';

function Discover() {
  return (
<EuiMarkdownFormat>{`
## Discover でドキュメントを探索しよう

Elasticsearch に保存されたデータを分析する手法は色々あります。
その中で最も汎用性が高く、特にデータセットを知る上で最初に触ることが多いのが Discover でしょう。

Kibana メインメニューから *Analytics* の *Discover* を選択します

インデックスパターンを作成するように促されるので作成します、 *Create index pattern* をクリックします。
もしくは別のインデックスパターンがすでに作成済の場合は、メインメニューの *Management* にある *Stack Management* に遷移し、
*Kibana* の *Index Patterns* から、 *Create index pattern* をクリックします。

*Index pattern name* を \`es-hands-on-${process.env.REACT_APP_KEY}\`、 *Time field* を \`@timestamp\` とします。
作成したら再び Discover の画面に戻りましょう。

左上のインデックスパターンで、 \`es-hands-on-${process.env.REACT_APP_KEY}\` を選びます。

結果がないので時間範囲を拡げよ、と促されます。デフォルトでは \`Last 15 minutes\` となっています。
先ほど登録したドキュメントが含まれる範囲を右上のタイムピッカーで指定しましょう。
例えば \`Last 1 year\` を選択します。

時系列グラフに緑のバーが表示されるはずです。表示部分をマウスで囲うとズームできます。

左のフィールドリストでフィールドにマウスを乗せると表示される \`+\` アイコンをクリックすると、
右側のドキュメント一覧の表示列として追加できます。
表形式で表示されるので特定項目を並べて比較しやすくなります。
\`labels.api\` と \`message\` を表示項目として追加してみましょう。

また、左のフィールドリスト上のフィールド名をクリックすると、値の分布が確認でき便利です。

左上の検索バーに "ドキュメント" のような検索語を入力してみましょう。ヒットするドキュメントに絞り込むことができます。
![](/images/kibana-discover.png)

右上の *Save* ボタンをクリックして、　\`${process.env.REACT_APP_KEY}-discover\` という名前で保存しましょう。
`}</EuiMarkdownFormat>
  );
}

export default Discover;