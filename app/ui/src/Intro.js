import {EuiMarkdownFormat} from '@elastic/eui';

function WhatIsElasticStack() {
  return <EuiMarkdownFormat>{
`## Elastic Stack とは

Elastic Stack とは Elasticsearch を中核とするソフトウェア群のことです。

![](https://www.elastic.co/guide/en/logstash/current/static/images/deploy2.png)

[出典](https://www.elastic.co/guide/en/logstash/current/deploying-and-scaling.html)


- Elasticsearch: JSON ドキュメントを保存でき、複数のサーバインスタンスでスケールアウトするドキュメントストアです。内部で Apache Lucene を利用しており、全文検索が可能です。 REST API を利用して操作します。
- Kibana: Elasticsearch に保存された JSON ドキュメントを可視化、分析する UI を提供します。 Elastic スタックの管理画面でもあります。
- Logstash: サーバサイドで稼働する ETL データパイプライン処理プロセスです。外部データベースからデータをロードしたり、ルックアップしてデータを修飾したり、複数の出力先に書き込むなど、複雑なパイプラインを作成可能です。
- Beats: データ発生元にデプロイして収集するエージェント型の軽量データシッパーです。

## サーチ、オブザーブ、プロテクト

全文検索や、 ELK スタック (Elasticsearch, Logstash, Kibana) を使ったログ収集、分析基盤などのユースケースから拡がり、最近では複雑化するシステムのオブザーバビリティを高めたり、セキュリティ用途にも利用されるようになっています。
Elastic では主な三つのユースケースにすぐに利用可能なソリューションとしてスタックの開発を進めています。

> 検索は幅広いエクスペリエンスを支えます。検索でドキュメントを見つけることも、インフラを監視してセキュリティ脅威から保護することも可能です。検索の会社であるElasticは、Elastic Stackという1つのパワフルなスタックを通じて3つのソリューションを提供しています。Elastic Stackは、クラウドからベアメタルまであらゆる環境にデプロイできます。そしてあらゆるタイプのデータから瞬時に、実践的なインサイトを引き出します。

[出典](https://www.elastic.co/jp/products/)

## 実際どんな風に使われているの?

検索は全てのシステムで必要になる機能です。多彩な [顧客事例](https://www.elastic.co/jp/customers/) を確認しましょう。
エンタープライズサーチ、オブザーバビリティ、セキュリティと各ユースケース毎に事例集を閲覧できます。
`}</EuiMarkdownFormat>;
}

function Intro(){
  return (
    <div>
      <WhatIsElasticStack />
    </div>
  );
}

export default Intro;