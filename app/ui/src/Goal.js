import {EuiMarkdownFormat} from '@elastic/eui';

function Goal(props) {
  return (
  <>
  <h1>おつかれさまでした 🎉</h1>
<EuiMarkdownFormat>{`
Elastic スタックの理解を深めるには、色々な情報ソースがあります。
是非ご覧ください:

- [公式トレーニング](https://www.elastic.co/jp/training/) リアルタイムオンラインのバーチャルトレーニング:
    - 主要コース、 Elasticsearch Engineer 1, 2, Data Analysis with Kibana, Elasticsearch Observability Engineer は全て日本人講師により日本語で受講可能
    - 利用方法が素早く学べる [Quick Start ガイド](https://www.elastic.co/training/free#quick-starts) は必見!
- [Webinar](https://www.elastic.co/jp/videos/) さまざまな最新トピックをビデオで学ぶ
- [ブログ](https://www.elastic.co/jp/blog/) 人気の記事は日本語でも閲覧可能、[英語版](https://www.elastic.co/blog/)では全ての記事が閲覧可能
- [Elasticsearch 勉強会](https://www.meetup.com/Tokyo-Elastic-Fantastics/) 最近はオンラインで開催
- [Discuss](https://discuss.elastic.co/c/in-your-native-tongue/japanese/18) 日本語での質問、疑問が可能なフォーラム
- [Elastic 語りチャンネル](https://stand.fm/channels/5fbf3981c6465465908d4b66) 音声コンテンツでゆるりと情報収集
- [demo.elastic.co](https://demo.elastic.co/) 誰でも使えるデモ環境、データセットも揃っているので色々な機能を試すことができる
`}</EuiMarkdownFormat>
  <a href="/">back to top</a>
  </>);
}


export default Goal;