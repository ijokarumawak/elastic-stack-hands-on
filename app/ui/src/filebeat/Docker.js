import {EuiMarkdownFormat} from '@elastic/eui';

function Docker() {
  return (

<EuiMarkdownFormat>{`
## Docker の Auto Discover を使ってみよう

最近では、 Web アプリケーションをマイクロサービスアーキテクチャで実装し、コンテナライズして運用することも増えてきました。
このような環境では、コンテナが動的にさまざまなホスト上で生成されるため、自動的にログを収集する仕組みが必要になります。

Filebeat には Docker コンテナや、 Kubernetes で利用できる Auto Discover という仕組みが備わっています。

ここでは、 Docker の Auto Discover 機能を利用して、以下の図に示されるように、複数のコンテナからのログを収集してみましょう。

さらに、ログ情報に加え、 Metricbeat により各コンテナのメトリックデータも収集し、よりオブザーバビリティを高めましょう。

![](../images/beat-auto-discover.png)


### Filebeat でログを収集

次のコマンドで Filebeat を実行してみましょう:
\`\`\`bash
filebeat/filebeat-docker.sh
\`\`\`

設定のキモになる部分は *filebeat/filebeat-docker.yml* の以下の部分です:
\`\`\`yaml
filebeat.autodiscover:
  providers:
    - type: docker
      hints.enabled: true
\`\`\`

Docker コンテナ起動時に指定するラベルをヒントとして自動的にログ収集をおこないます。
例えば、このハンズオンテキストを表示している Nginx の Docker コンテナ起動の設定をみてみましょう。
*bin/nginx.sh* には、次のようにラベルが設定されています:

\`\`\`bash
docker run --rm --name \${CONTAINER_NAME} $network -d -p 80:80 \\
  --volume="$(pwd)/nginx/templates-$target:/etc/nginx/templates:ro" \\
  --volume="$(pwd)/nginx/auth:/etc/nginx/auth:ro" \\
  --label co.elastic.logs/module=nginx \\
  --label co.elastic.logs/fileset.stdout=access \\
  --label co.elastic.logs/fileset.stderr=error \\
  --label co.elastic.metrics/module=nginx \\
  --label co.elastic.metrics/metricsets=stubstatus \\
  --label co.elastic.metrics/hosts='\${data.host}:\${data.port}' \\
  --label co.elastic.metrics/username=\${ELASTIC_USERNAME} \\
  --label co.elastic.metrics/password=\${ELASTIC_PASSWORD} \\
  --label co.elastic.metrics/server_status_path="/nginx_status" \\
  nginx
\`\`\`

### Metricbeat でメトリックを収集

次のコマンドで Metricbeat を実行してみましょう:
\`\`\`bash
bin/metricbeat-docker.sh
\`\`\`

### Kibana の Observability 画面で収集したデータを分析
Kibana の *Observability* には、 Metrics や Logs など、収集したオブザーバビリティデータを可視化、分析するための便利な画面が用意されています。
ぜひ色々触って試してみてください。
`}</EuiMarkdownFormat>
  );
}

export default Docker;