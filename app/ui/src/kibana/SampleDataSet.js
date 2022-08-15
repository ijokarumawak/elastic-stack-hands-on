import {EuiAccordion, EuiMarkdownFormat, EuiPanel} from '@elastic/eui';

function sampleQuiz(i, q, a) {
return (
<li style={{ marginTop: "1em" }}>
<EuiAccordion id="sample-quiz-q{i}" arrowDisplay="right" buttonContent={q}>
  <EuiPanel>
    {a}
  </EuiPanel>
</EuiAccordion>
</li>
);
}

function SampleDataSet() {
  return (
<>

<EuiMarkdownFormat>{`
\`kibana_sample_data_ecommerce\` サンプルデータセットを使ったクイズをいくつか出題します！問題をクリックすると模範解答が表示されます。
`}</EuiMarkdownFormat>

<ol style={{ listStyleType: "auto"}}>

{sampleQuiz(1, "いくつのカテゴリーがありますか?", (<EuiMarkdownFormat>{`
いくつかの方法があります:
1. Discover でフィールドをクリックして Lens のビジュアリゼーションを作成、 Top n 件を増やしてみる
2. Data Visualizer で値のリストを確認
3. \`cardinality\` アグリゲーションを使う
    \`\`\`json
    GET kibana_sample_data_ecommerce/_search
    {
      "size": 0,
      "aggs": {
        "num_of_categories": {
          "cardinality": {
            "field": "category.keyword"
          }
        }
      }
    }
    \`\`\`
`}</EuiMarkdownFormat>))}

{sampleQuiz(2, "\"Wilhemina St. Parker\" さんの購入履歴を検索してみましょう", (<EuiMarkdownFormat>{`
Discover で検索する場合は \`OR\` 検索にならないよう、引用符で囲みましょう。フィールド名を指定して検索するのも良いですね:
\`\`\`
customer_full_name: "Wilhemina St. Parker"
\`\`\`
`}</EuiMarkdownFormat>))}

{sampleQuiz(3, "\"Wilhemina St. Parker\" さんはどこに住んでいますか?", (<EuiMarkdownFormat>{`
サンプルダッシュボードにある Maps を使うと良いでしょう。 \`Fit to data bounds\` ボタンをクリックすると該当箇所にズームできます。
アグリゲーションで答えを得るには、次のようなクエリを実行します:
\`\`\`json
GET kibana_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "match": {
      "customer_first_name": "Wilhemina St. Parker"
    }
  },
  "aggs": {
    "country": {
      "terms": {
        "field": "geoip.country_iso_code",
        "size": 10
      }
    }
  }
}
\`\`\`
得られた二桁の国コードから国名を調査するには、 [Elastic Map Service](https://maps.elastic.co/#file/world_countries) が使えます。
`}</EuiMarkdownFormat>))}

{sampleQuiz(4, "曜日を表す day_of_week と、曜日の数値表現である day_of_week_i がありますが、月曜日の数値は何でしょう?", (<EuiMarkdownFormat>{`
Discover でフィールドをクリックしたり、 Data Visualizer を使ったりして、各値の分布をみることで自ずとわかるでしょう。
次のようなクエリで確認するのもよいですね:
\`\`\`json
GET kibana_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "day_of_week": {
      "terms": {
        "field": "day_of_week",
        "size": 7
      },
      "aggs": {
        "day_of_week_i": {
          "terms": {
            "field": "day_of_week_i",
            "size": 7
          }
        }
      }
    }
  }
}
\`\`\`
`}</EuiMarkdownFormat>))}

{sampleQuiz(5, "\"Women's Accessories\" が最も売れた日付は？", (<EuiMarkdownFormat>{`
ダッシュボードでフィルタを作成し、 \`% of target revenue ($10k)\` チャートで最も売上の高い日を探すと分かります。
アグリゲーションで見つけるにはこのようなクエリになるでしょう:
\`\`\`json
GET kibana_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "category.keyword": "Women's Accessories"
          }
        }
      ]
    }
  },
  "aggs": {
    "per_day": {
      "date_histogram": {
        "field": "order_date",
        "calendar_interval": "1d",
        "order": {
          "sales": "desc"
        }
      },
      "aggs": {
        "sales": {
          "sum": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}
\`\`\`
`}</EuiMarkdownFormat>))}


{sampleQuiz(6, "カテゴリーごとの集計を厳密に行うには、今のインデックスの構造では問題があります。それはなぜですか？改善するにはどうすれば良いでしょうか?", (<EuiMarkdownFormat>{`

各 JSON ドキュメントは注文ごとにモデリングされていて、一つの注文で複数の商品を含むことができます。別々のカテゴリーの注文を単一の注文で購入した場合、 \`taxful_total_price\` の値は注文の合計金額となるため、別カテゴリーの売上も含むことになってしまいます。

Elasticsearch ではオブジェクトの配列内のフィールドを、オブジェクトの単位を保ったまま検索、集計することがデフォルトではできません。転置インデックスや doc_values はフィールドごとにフラットに作成されるため、 \`products.taxful_price\` と \`products.category\` の関連性が失われてしまいます。

このようにオブジェクトが要素となる配列があり、要素ごとのオブジェクトのかたまりを意識して扱う必要がある場合、 [\`nested\`](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html) タイプを使います。まず、 \`products\` が \`nested\` 型であるとマッピングで宣言します。既存フィールドのマッピングを変更するので、別インデックス作成、 \`reindex\` が必要です。

\`\`\`json
PUT kibana_sample_data_ecommerce_nested
{
  "mappings": {
    "properties": {
      "..."
      "products": {
        "type": "nested",
        "properties": {
          "_id": {
            "type": "text",
            "..."
          },
          "base_price": {
            "type": "half_float"
          },
          "..."
        }
      },
      "..."
    }
  }
}
\`\`\`

\`\`\`json
POST _reindex
{
  "source": {
    "index": "kibana_sample_data_ecommerce"
  },
  "dest": {
    "index": "kibana_sample_data_ecommerce_nested"
  }
}
\`\`\`

\`\`\`json
GET kibana_sample_data_ecommerce_nested/_search
{
  "query": {
    "nested": {
      "path": "products",
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "products.category.keyword": "Women's Accessories"
              }
            }
          ]
        }
      }
    }
  },
  "aggs": {
    "per_day": {
      "date_histogram": {
        "field": "order_date",
        "calendar_interval": "1d",
        "order": {
          "products>category>sum": "desc"
        }
      },
      "aggs": {
        "products": {
          "nested": {
            "path": "products"
          },
          "aggs": {
            "category": {
              "filter": {
                "bool": {
                  "filter": [
                    {
                      "term": {
                        "products.category.keyword": "Women's Accessories"
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "sum": {
                  "sum": {
                    "field": "products.taxful_price"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
\`\`\`

注文単位でみた場合の "Women's Accessories" カテゴリー最大売上日は:

\`\`\`json
{
  "key_as_string": "2022-08-23T00:00:00.000Z",
  "key": 1661212800000,
  "doc_count": 31,
  "sales": {
    "value": 2851.421875
  }
}
\`\`\`

\`nested\` を使った場合の最大売上は:

\`\`\`json
{
  "key_as_string": "2022-08-18T00:00:00.000Z",
  "key": 1660780800000,
  "doc_count": 28,
  "products": {
    "doc_count": 66,
    "category": {
      "doc_count": 29,
      "sum": {
        "value": 1045.76171875
      }
    }
  }
}
\`\`\`

と、差が出ました。(日付や値は環境によって異なります)

`}</EuiMarkdownFormat>))}

</ol>
<EuiMarkdownFormat>{`
`}</EuiMarkdownFormat>
</>
  );
}

export default SampleDataSet;