import {EuiMarkdownFormat} from '@elastic/eui';

function Query() {
  return (
<>
<EuiMarkdownFormat>{`
## アグリゲーション

[アグリゲーション](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html) は Elasticsearch でデータを集計する仕組みです。三つのカテゴリがあります。

- Bucket: ドキュメントをグループ分けする
- Metric: バケットないのドキュメントを使って何かの値を計算する
- Pipeline: 他のアグリゲーションの出力をさらに処理する

## Bucket アグリゲーション

\`terms\` アグリゲーションを使うと、特定のフィールドの値でグループ化できます。

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "size": 0,
  "aggs": {
    "count_by_api": {
      "terms": {
        "field": "labels.api.keyword"
      }
    }
  }
}
\`\`\`

## Metric アグリゲーション

\`avg\` アグリゲーションは平均値を計算します。

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "size": 0,
  "aggs": {
    "avg_value": {
      "avg": {
        "field": "value"
      }
    }
  }
}
\`\`\`

## 組み合わせ

前述の二つを組み合わせて、グループ分けしてから、各グループにおける平均値を計算する例です。

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "size": 0,
  "aggs": {
    "count_by_api": {
      "terms": {
        "field": "labels.api.keyword"
      },
      "aggs": {
        "avg_value": {
          "avg": {
            "field": "value"
          }
        }
      }
    }
  }
}
\`\`\`

## 検索条件の指定

\`query\` を指定すれば、集計対象のドキュメントを絞り込むこともできます。

\`\`\`json
GET es-hands-on-${process.env.REACT_APP_KEY}/_search
{
  "size": 0,
  "query": {
    "match": {
      "message": "ドキュメント"
    }
  },
  "aggs": {
    "count_by_api": {
      "terms": {
        "field": "labels.api.keyword"
      },
      "aggs": {
        "avg_value": {
          "avg": {
            "field": "value"
          }
        }
      }
    }
  }
}
\`\`\`

`}</EuiMarkdownFormat>

</>
  );
}

export default Query;