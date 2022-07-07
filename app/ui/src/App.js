import React, {
  useState,
  useEffect
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
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

import { css } from '@emotion/react';

import {
  EuiProvider,
  EuiPageTemplate,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiSideNav,
  EuiTitle,
  EuiText,
  EuiSelect,
  htmlIdGenerator
} from '@elastic/eui';

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
  const navigate = useNavigate();
  return (
    <div id="progressBar" onClick={() => navigate('/')}>
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

function moveTo(navigate, location) {
  navigate(location);
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


function move(navigate, targetIndex) {
  moveTo(navigate, contents[targetIndex].location);
}

function Prev(props) {
  const navigate = useNavigate();
  return props.index > 0
    ? <button onClick={() => move(navigate, props.index - 1)}>prev</button> : null;
}

function Next(props) {
  const navigate = useNavigate();
  return props.index < contents.length -1
    ? <button onClick={() => move(navigate, props.index + 1)}>next</button>
    : <button onClick={() => moveTo(navigate, '/goal')}>next</button>;
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

function SideNav() {
  const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

  const toggleOpenOnMobile = () => {
    setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
  };

  const navigate = useNavigate();

  const sideNavItems = contents.map((v, i) => {
    return {
      name: v.title,
      id: htmlIdGenerator('basicExample')(),
      onClick: () => {
        moveTo(navigate, v.location);
      }
    };
  });

  const sideNav = [
    {
      name: 'Root item',
      id: htmlIdGenerator('basicExample')(),
      items: sideNavItems
    },
  ];

  return (
    <EuiSideNav
      aria-label="Basic example"
      mobileTitle="Basic example"
      toggleOpenOnMobile={() => toggleOpenOnMobile()}
      isOpenOnMobile={isSideNavOpenOnMobile}
      items={sideNavItems}
    />
  );
};


function App() {
  const themeKey = 'elastic-stack-hands-on.theme';
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(themeKey);
    return saved || 'light'
  });
  useEffect(() => {
    localStorage.setItem(themeKey, theme);
  }, [theme]);
  const handleChange = function(event) {
    setTheme(event.target.value);
  }
  const themes = [{value: 'light', text: 'Light'}, {value: 'dark', text: 'Dark'}]

  return (
    <Router>
      <Routes>
        {contents.map((v, i) => {
          return (
            <Route key={i} path={v.location} element={
            <React.Fragment>
              <Progressbar />

              {/*
              instead of importing css, link css
              https://github.com/elastic/eui/discussions/2574#discussioncomment-3043796
              $ cp -p ./node_modules/@elastic/eui/dist/eui_theme_dark.css public/
              $ cp -p ./node_modules/@elastic/eui/dist/eui_theme_light.css public/
              */}
              <link
                  rel="stylesheet"
                  type="text/css"
                  href={theme == 'light' ? "/eui_theme_light.css" : "/eui_theme_dark.css"}
              />
              <EuiProvider colorMode={theme}>
                <EuiHeader theme={theme}>
                  <EuiHeaderSection>
                    <EuiHeaderSectionItem>
                      <EuiTitle size="s"><h1>Elastic Stack Hands-on</h1></EuiTitle>
                    </EuiHeaderSectionItem>
                    <EuiHeaderSectionItem>
                      <Header />
                    </EuiHeaderSectionItem>
                  </EuiHeaderSection>
                  <EuiHeaderSection>
                    <EuiHeaderSectionItem>
                      <EuiSelect
                        options={themes}
                        value={theme}
                        onChange={handleChange}
                        compressed={true}
                      />
                    </EuiHeaderSectionItem>
                  </EuiHeaderSection>
                </EuiHeader>
                <EuiPageTemplate pageSideBar={<SideNav />}>
                  {v.tag}
                  <Footer />
                </EuiPageTemplate>
              </EuiProvider>
            </React.Fragment>
            } />
          )
        })}
        <Route key="goal" path="/goal" element={<Goal />} />
        <Route key="home" path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}



export default App;
