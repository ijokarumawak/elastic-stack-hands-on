import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiMarkdownFormat,
  EuiCodeBlock,
  EuiButton,
  EuiSpacer
} from '@elastic/eui';

function Install() {

  return <div><EuiMarkdownFormat>{`
## ハンズオンの内容
このハンズオンでは、 Elasticsearch の API 利用方法から、 Kibana の操作、 Beats を使ったデータの取り込み方法などを実際に動かしながら学んでいきます。

## Elasticsearch、 Kibana のインストール

様々な方法で [Elasticsearch をインストール](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html) できます。
すでに [Elastic Cloud の無料トライアル](https://www.elastic.co/cloud/elasticsearch-service/signup?baymax=docs-body&elektra=docs) はお試しでしょうか。
Elastic Cloud が最も簡単にセキュアでスケールする環境をデプロイできる方法です。
是非ご利用ください。

Elastic Cloud を利用するとデフォルトでセキュリティが有効になっています。
スーパーユーザにあたる、 \`elastic\` ユーザがデプロイ作成時に作成されます。
\`elastic\` ユーザのパスワードはメモしておきましょう。もしメモし忘れていた場合は Elastic Cloud 管理画面から再設定できます。

注: 本ハンズオンの内容は Elastic Cloud の利用を前提として記載しています。

## セキュリティを意識しましょう

セキュアな環境を保つために、必要な設定を行っていきましょう。
以降の手順で、必要最小限の権限を持った \`es-hands-on\` というユーザを作成していきます。

![](images/hands-on-setup.png)

### Kibana スペースを作ろう

デプロイが完了したら、早速 Kibana を使ってみましょう。

1. Elastic Cloud 管理コンソールから Kibana の Quick link をクリックすると、 Kibana 画面が表示されます。インストール時に作成された \`elastic\` ユーザでログインしましょう。

2. まず、スペースを作成します。Kibana にはマルチテナント性を実現するためのスペースがあります。ハンズオンで利用するスペースを作りましょう。

    Kibana 画面左上のメインメニューから *Management* にある *Stack Management* を選択します。
    *Kibana* にある *Spaces* を選択します。

3. *Create a space* をクリックし、次を入力:
    - \`Name\` に "Elastic Stack ハンズオン"
    - \`URL identifier\` に "es-hands-on"

    *Create a space* をクリックして作成を完了します。

4. そして、メインメニューアイコンの隣にあるスペースをクリックし、今作成したハンズオンスペースを選択しましょう。
    これから先の作業はこのスペースで行うことにします。

### Kibana Dev Tools Console を使ってみよう

Kibana メインメニューから *Management* にある *Dev Tools* を選択します。するとこんな画面が表示されます:
![](images/kibana-console.png)

この Kibana Console からは、 [Elasticsearch の API](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html) が簡単に実行できます。

画面左側に API リクエストを記述し、三角ボタンをクリックして実行できます。
すると右側に結果が返ってきます。

### ハンズオン用ユーザの作成

\`elastic\` ユーザで全てのハンズオンを進めることも可能ですが、スーパーユーザを例えば beats のような外部のアプリケーションからの接続時に使うことはお勧めできません。
用途に最低限必要な権限を持つユーザを作成するのがベストプラクティスです。

ハンズオンで利用するユーザは以下の権限が必要になります:
- Kibana へのアクセス
- \`filebeat-*\`, \`metricbeat-*\`, \`es-hands-on*\` インデックスへの読み書き権限

それでは、 Kibana Console から次の API を実行し、該当のユーザを作成しましょう
 (同様の操作は Kibana UI からも可能です)。
まずはユーザの権限を制御するロールを作成します:

\`\`\`json
PUT _security/role/es-hands-on
{
  "cluster" : [
    "monitor",
    "manage_ilm",
    "manage_ingest_pipelines",
    "manage_index_templates"
  ],
  "indices" : [
    {
      "names" : [
        "filebeat-*",
        "metricbeat-*",
        "es-hands-on*"
      ],
      "privileges" : ["all"],
      "field_security" : {
        "grant" : ["*"]
      }
    }
  ],
  "applications" : [
    {
      "application" : "kibana-.kibana",
      "privileges" : [
        "feature_discover.all",
        "feature_dashboard.all",
        "feature_canvas.all",
        "feature_maps.all",
        "feature_logs.all",
        "feature_visualize.all",
        "feature_infrastructure.all",
        "feature_uptime.all",
        "feature_dev_tools.all",
        "feature_indexPatterns.all",
        "feature_savedObjectsManagement.all",
        "feature_savedObjectsTagging.all"
      ],
      "resources" : [
        "space:es-hands-on"
      ]
    }
  ]
}
\`\`\`

続いて、そのロールを持ったユーザを作成します:

\`\`\`json
PUT _security/user/es-hands-on
{
  "roles" : [
    "es-hands-on"
  ],
  "full_name" : "Elastic Stack Hands On",
  "password": "Password!123"
}
\`\`\`

一度 Kibana からログアウトして、 \`es-hands-on\` ユーザでログインし直しましょう。

### ハンズオンアプリの接続先設定

作成したユーザと接続先の情報をハンズオンアプリにも設定しましょう。
*bin/env.sh* で:
- 接続先 Elastic Cloud デプロイメントの \`ELASTIC_CLOUD_ID\` を指定してください。 Cloud Id は Elastic Cloud 管理コンソールで取得できます。
- \`HANDS_ON_KEY\` にハンズオン環境内でユニークな値を入力してください、これは同一の Elasticsearch クラスタを複数名でシェアする際に他の参加者の方と作業が重複しないためのものです。ご自身の環境を使っている場合は \`default\` のままで構いません。

その後、接続情報を反映させるため、次のコマンドで API サーバを再起動しましょう:

\`\`\`json
bin/app-api.sh
\`\`\`

このハンズオン環境に設定されているユーザが、必要な権限を持っているかチェックしてみましょう。
次の *show* ボタンを押すと、 API サーバを経由して Elasticsearch の [has_privileges API](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-has-privileges.html) を実行した結果を返します:
`}
</EuiMarkdownFormat>
<ElasticsearchPrivileges />
</div>
}

class ElasticsearchPrivileges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleRefresh() {
    fetch('/api/has-privileges')
      .then(response => {
        if (!response.ok) {
            return {
              status: response.status,
              statusText: response.statusText
            }
        }
        return response.json();
      })
      .then(data => this.setState({
        hasPrivileges: [data]
      }))
      .catch((error) => {
        console.log(error);
        this.setState({
          hasPrivileges: [{error: error.message}]
        })
      });
  }

  handleClose() {
    this.setState({hasPrivileges: null});
  }

  render() {
    return <>
        <EuiSpacer size="s" />
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={() => this.handleRefresh()}>{this.state.hasPrivileges ? "refresh" : "show"}</EuiButton>
          </EuiFlexItem>
          {this.state.hasPrivileges && (
          <EuiFlexItem grow={false}>
            <EuiButton onClick={() => this.handleClose()}>close</EuiButton>
          </EuiFlexItem>
          )}
        </EuiFlexGroup>
        <EuiSpacer size="s" />

        {this.state.hasPrivileges && (
          <>
            <p>{this.state.hasPrivileges[0].has_all_requested ? "ユーザ権限の確認が成功しました!" : "ユーザ権限の確認に失敗しました。"}</p>
            <EuiCodeBlock>
            {JSON.stringify(this.state.hasPrivileges[0], null, 2)}
            </EuiCodeBlock>
          </>
        )}
      </>;
  }
}

export default () => {
  return (
    <div>
      <Install />
    </div>
  );
}