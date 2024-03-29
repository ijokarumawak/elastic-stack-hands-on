import React from 'react';
import {EuiMarkdownFormat} from '@elastic/eui';

class EmbedDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const match = this.state.value.match(/^<iframe src="([^"]+)" .+$/);
    console.log(match);
    if (match) {
      this.setState({url: match[1]});
    } else {
      alert("Kibana ダッシュボードを share する iframe を入力してください");
    }
  }

  render() {
    return (
      <>
      <form onSubmit={this.handleSubmit}>
        <label>
          Kibana ダッシュボード共有 iframe:
          <input type="text" style={{width: '100%'}} value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {this.state.url && (<iframe title="kibana-dashboard" src={this.state.url} height="600px" width="100%"/>)  }
      </>
    );
  }
}

function Dashboard() {
  return (
<>
<EuiMarkdownFormat>{`
## カスタムダッシュボードの作成

先ほど作成した Visualization を使って、カスタムダッシュボードを作成してみましょう。
複数の可視化した情報を単一の画面で表示できるようになります。
さらに、作成したダッシュボードは Web ページに埋め込んで共有することもできます。


Kibana メインメニューから *Analytics* の *Dashboard* を選択し、 *Create dashboard* をクリックします。

*Add from library* をクリックして、 \`${process.env.REACT_APP_KEY}-discover\` と \`${process.env.REACT_APP_KEY}-lens\` を追加しましょう

右上の *Save* をクリックし、 \`${process.env.REACT_APP_KEY}-dashboard\` という名前で保存しましょう。

## ダッシュボードを Web ページに埋め込む
作成したダッシュボードをこのチュートリアルページに埋め込んで表示してみましょう。

ダッシュボードを埋め込み、 Kibana のログインを成功させるには Kibana [sameSiteCookies](https://www.elastic.co/guide/en/kibana/current/kibana-authentication.html#embedded-content-authentication) を設定する必要があります。

先ほど作成した \`${process.env.REACT_APP_KEY}-dashboard\` の画面右上にある *Share* をクリックし、 *Embed code* > *Copy iFrame code* をクリックします。
すると埋め込み用の HTML iframe タグがクリップボードにコピーされます。

以下のテキスト入力にペーストして、 *Submit* ボタンを押すと、 iframe を追加し、ダッシュボードが表示されます。
`}</EuiMarkdownFormat>
<EmbedDashboard />
</>


  );
}

export default Dashboard;