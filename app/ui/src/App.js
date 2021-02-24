import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory
} from "react-router-dom";
import './App.css';
import {Markdown} from './Common.js'
import Intro from './Intro.js'
import Setup from './Setup.js'
import ElasticsearchDocument from './elasticsearch/Document.js'
import ElasticsearchIndex from './elasticsearch/Index.js'
import KibanaDiscover from './kibana/Discover.js'
import KibanaLens from './kibana/Lens.js'
import KibanaDashboard from './kibana/Dashboard.js'
import FilebeatSimple from './filebeat/Simple.js'
import FilebeatModule from './filebeat/Module.js'
import FilebeatDocker from './filebeat/Docker.js'
import Goal from './Goal.js'

const contents = [
  {location: '/intro', title: 'Elastic Stack とは', tag: <Intro />},
  {location: '/setup', title: 'ハンズオン環境のセットアップ', tag: <Setup />},
  {location: '/elasticsearch/document', title: 'Elasticsearch のドキュメント', tag: <ElasticsearchDocument />},
  {location: '/elasticsearch/index', title: 'Elasticsearch のインデックス', tag: <ElasticsearchIndex />},
  {location: '/kibana/discover', title: 'Kibana Discover', tag: <KibanaDiscover />},
  {location: '/kibana/lens', title: 'Kibana Lens', tag: <KibanaLens />},
  {location: '/kibana/dashboard', title: 'Kibana ダッシュボード', tag: <KibanaDashboard />},
  {location: '/filebeat/simple', title: 'Filebeat', tag: <FilebeatSimple />},
  {location: '/filebeat/module', title: 'Filebeat モジュール', tag: <FilebeatModule />},
  {location: '/filebeat/docker', title: 'Docker コンテナを自動監視', tag: <FilebeatDocker />}
];

function getContentIndex(pathname) {
  return contents.findIndex(c => c.location === pathname)
}

function getContent(pathname) {
  const content = contents.find(c => c.location === pathname);
  return content ? content : contents[0];
}

function ContentLink(props) {
  const to = props.to;
  const title = getContent(to).title;
  return <Link to={to}>{title}</Link>;
}

function Home() {
  return (<>
    <h1>Home</h1>
    <Markdown>{`環境ID: \`${process.env.REACT_APP_KEY}\``}</Markdown>
    <Link to={contents[0].location}>ハンズオンをはじめる</Link>
  </>);
}



function Progressbar() {
  const location = useLocation();
  const history = useHistory();
  return (
    <div id="progressBar" onClick={() => history.push('/')}>
      <div id="progressBarDone" style={{
        width: ((getContentIndex(location.pathname) + 1) * 100 / contents.length) + '%'
      }} />
    </div>
  );
}

function Navi() {
  const location = useLocation();
  const index = getContentIndex(location.pathname);
  return (
    <div className="Navi">
      <Prev index={index} />
      {index + 1} / {contents.length}
      <Next index={index} />
    </div>
  );
}

function moveTo(history, location) {
  history.push(location);
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


function move(history, targetIndex) {
  moveTo(history, contents[targetIndex].location);
}

function Prev(props) {
  const history = useHistory();
  return props.index > 0
    ? <button onClick={() => move(history, props.index - 1)}>prev</button> : null;
}

function Next(props) {
  const history = useHistory();
  return props.index < contents.length -1
    ? <button onClick={() => move(history, props.index + 1)}>next</button>
    : <button onClick={() => moveTo(history, '/goal')}>next</button>;
}

function Header() {
  const location = useLocation();
  return (<div id="header">
    <h1>{getContent(location.pathname).title}</h1>
    <Navi />
  </div>);
}

function Footer() {
  return (<div>
    <Navi />
  </div>);
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            {contents.map((v, i) => {
              return (
                <Route key={i} path={v.location}>
                  <Progressbar />
                  <nav>
                    <ol>
                      {contents.map((v, i) => {
                        return (
                          <li key={i}>
                            <ContentLink to={v.location} />
                          </li>
                        )
                      })}
                    </ol>
                  </nav>
                  <Header />
                  {v.tag}
                  <Footer />
                </Route>
              )
            })}
            <Route key="goal" path="/goal"><Goal /></Route>
            <Route key="home" path="/"><Home /></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
