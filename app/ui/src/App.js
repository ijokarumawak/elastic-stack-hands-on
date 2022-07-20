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
import Intro from './Intro.js'
import Setup from './Setup.js'
import ElasticsearchDocument from './elasticsearch/Document.js'
import ElasticsearchIndex from './elasticsearch/Index.js'
import KibanaDiscover from './kibana/Discover.js'
import KibanaLens from './kibana/Lens.js'
import KibanaDashboard from './kibana/Dashboard.js'
import KibanaSampleDataSet from './kibana/SampleDataSet.js'
import FilebeatSimple from './filebeat/Simple.js'
import FilebeatModule from './filebeat/Module.js'
import FilebeatDocker from './filebeat/Docker.js'
import PythonQARequirements from './python/QARequirements.js'
import PythonQA from './python/QA.js'
import Goal from './Goal.js'

import {
  EuiProvider,
  EuiPageTemplate,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiSideNav,
  EuiTitle,
  EuiSelect,
  EuiButtonIcon,
  EuiMarkdownFormat,
  EuiSpacer,
  EuiShowFor,
  htmlIdGenerator
} from '@elastic/eui';

import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';

import { icon as EuiIconApps } from '@elastic/eui/es/components/icon/assets/apps';
import { icon as EuiIconArrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as EuiIconArrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left';
import { icon as EuiIconArrowRight } from '@elastic/eui/es/components/icon/assets/arrow_right';
import { icon as EuiIconCopyClipboard } from '@elastic/eui/es/components/icon/assets/copy_clipboard';
import { icon as EuiIconCross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as EuiIconEditorBold } from '@elastic/eui/es/components/icon/assets/editor_bold';
import { icon as EuiIconEditorItalic } from '@elastic/eui/es/components/icon/assets/editor_italic';
import { icon as EuiIconEditorUnorderedList } from '@elastic/eui/es/components/icon/assets/editor_unordered_list';
import { icon as EuiIconEditorOrderedList } from '@elastic/eui/es/components/icon/assets/editor_ordered_list';
import { icon as EuiIconEditorChecklist } from '@elastic/eui/es/components/icon/assets/editor_checklist';
import { icon as EuiIconEditorCodeBlock } from '@elastic/eui/es/components/icon/assets/editor_code_block';
import { icon as EuiIconEditorComment } from '@elastic/eui/es/components/icon/assets/editor_comment';
import { icon as EuiIconEditorLink } from '@elastic/eui/es/components/icon/assets/editor_link';
import { icon as EuiIconEye } from '@elastic/eui/es/components/icon/assets/eye';
import { icon as EuiIconFaceSad } from '@elastic/eui/es/components/icon/assets/face_sad';
import { icon as EuiIconQuote } from '@elastic/eui/es/components/icon/assets/quote';
import { icon as EuiIconSearch } from '@elastic/eui/es/components/icon/assets/search';
import { icon as EuiIconStarEmpty } from '@elastic/eui/es/components/icon/assets/star_empty';
import { icon as EuiIconStarFilledSpace } from '@elastic/eui/es/components/icon/assets/star_filled_space';

appendIconComponentCache({
  apps: EuiIconApps,
  arrowDown: EuiIconArrowDown,
  arrowLeft: EuiIconArrowLeft,
  arrowRight: EuiIconArrowRight,
  copyClipboard: EuiIconCopyClipboard,
  cross: EuiIconCross,
  editorBold: EuiIconEditorBold,
  editorItalic: EuiIconEditorItalic,
  editorUnorderedList: EuiIconEditorUnorderedList,
  editorOrderedList: EuiIconEditorOrderedList,
  editorChecklist: EuiIconEditorChecklist,
  editorCodeBlock: EuiIconEditorCodeBlock,
  editorComment: EuiIconEditorComment,
  editorLink: EuiIconEditorLink,
  eye: EuiIconEye,
  faceSad: EuiIconFaceSad,
  quote: EuiIconQuote,
  search: EuiIconSearch,
  starEmpty: EuiIconStarEmpty,
  starFilled: EuiIconStarFilledSpace,
});

const contents = [
  {title: 'はじめに', contents: [
    {location: '/intro', title: 'Elastic Stack とは', tag: <Intro />},
    {location: '/setup', title: '環境のセットアップ', tag: <Setup />},
  ]},
  {title: 'Elasticsearch', contents: [
    {location: '/elasticsearch/document', title: 'ドキュメント', tag: <ElasticsearchDocument />},
    {location: '/elasticsearch/index', title: 'インデックス', tag: <ElasticsearchIndex />},
  ]},
  {title: 'Kibana', contents: [
    {location: '/kibana/discover', title: 'Discover', tag: <KibanaDiscover />},
    {location: '/kibana/lens', title: 'Lens', tag: <KibanaLens />},
    {location: '/kibana/dashboard', title: 'ダッシュボード', tag: <KibanaDashboard />},
    {location: '/kibana/samples', title: 'サンプルデータセット', tag: <KibanaSampleDataSet />},
  ]},
  {title: 'Beats', contents: [
    {location: '/filebeat/simple', title: 'Filebeat', tag: <FilebeatSimple />},
    {location: '/filebeat/module', title: 'Filebeat モジュール', tag: <FilebeatModule />},
    {location: '/filebeat/docker', title: 'Docker コンテナを自動監視', tag: <FilebeatDocker />}
  ]},
  {title: 'Python', contents: [
    {location: '/python/qa_requirements', title: 'QA アプリ要件', tag: <PythonQARequirements />},
    {location: '/python/qa', title: 'QA アプリ', tag: <PythonQA />}
  ]}
];

const flatContents = contents.flatMap((v, i) => {
  return v.contents;
});

function getContentIndex(pathname) {
  return flatContents.findIndex(c => c.location === pathname)
}

function getContent(pathname) {
  switch(pathname) {
    case '/': {
      return {title: ''};
    }
    case '/goal': {
      return {title: 'おつかれさまでした 🎉'};
    }
    default: {}
  }

  const content = flatContents.find(c => c.location === pathname);
  return content ? content : flatContents[0];
}

function Home() {
  return (<>
    <h1>Home</h1>
    <EuiMarkdownFormat>{`環境ID: \`${process.env.REACT_APP_KEY}\``}</EuiMarkdownFormat>
    <Link to={flatContents[0].location}>ハンズオンをはじめる</Link>
  </>);
}


function Navi() {
  const location = useLocation();
  const index = getContentIndex(location.pathname);
  return (
    <EuiFlexGroup responsive={false} justifyContent="center" alignItems="center">
      <EuiFlexItem grow={false}>
        <Prev index={index} />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        {index + 1} / {flatContents.length}
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <Next index={index} />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}

function moveTo(navigate, location) {
  navigate(location);
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


function move(navigate, targetIndex) {
  moveTo(navigate, flatContents[targetIndex].location);
}

function Prev(props) {
  const navigate = useNavigate();
  return props.index > 0
    ? <EuiButtonIcon iconType="arrowLeft" aria-label="prev" onClick={() => move(navigate, props.index - 1)} /> : null;
}

function Next(props) {
  const navigate = useNavigate();
  return props.index < flatContents.length -1
    ? <EuiButtonIcon iconType="arrowRight" aria-label="next" onClick={() => move(navigate, props.index + 1)} />
    : <EuiButtonIcon iconType="arrowRight" aria-label="next" onClick={() => moveTo(navigate, '/goal')} />;
}

function Header() {
  const location = useLocation();
  return (
    <EuiTitle>
      <h1>{getContent(location.pathname).title}</h1>
    </EuiTitle>
  );
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
      id: htmlIdGenerator('navi')(),
      items: v.contents.map((v, i) => {
        return {
          name: v.title,
          id: htmlIdGenerator('navi')(),
          onClick: () => {
            moveTo(navigate, v.location);
          }
        }
      })
    };
  });

  return (
    <EuiSideNav
      aria-label="Table of contents"
      mobileTitle="Table of contents"
      toggleOpenOnMobile={() => toggleOpenOnMobile()}
      isOpenOnMobile={isSideNavOpenOnMobile}
      truncate={false}
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
      {/*
      instead of importing css, link css
      https://github.com/elastic/eui/discussions/2574#discussioncomment-3043796
      $ cp -p ./node_modules/@elastic/eui/dist/eui_theme_dark.css public/
      $ cp -p ./node_modules/@elastic/eui/dist/eui_theme_light.css public/
      */}
      <link
          rel="stylesheet"
          type="text/css"
          href={theme === 'light' ? "/eui_theme_light.css" : "/eui_theme_dark.css"}
      />
      <EuiProvider colorMode={theme}>
        <EuiHeader>
          <EuiShowFor sizes={['m', 'l', 'xl']}>
            <EuiHeaderSection>
              <EuiHeaderSectionItem>
                <EuiTitle size="xs"><h1>Elastic Stack hands-on</h1></EuiTitle>
              </EuiHeaderSectionItem>
            </EuiHeaderSection>
          </EuiShowFor>
          <EuiHeaderSection>
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
        <Routes>
          {flatContents.map((v, i) => {
            return (
              <Route key={i} path={v.location} element={
              <React.Fragment>
                  <EuiPageTemplate pageSideBar={<SideNav />}>
                    <Navi />
                    <EuiSpacer />
                    {v.tag}
                    <EuiSpacer />
                    <Footer />
                  </EuiPageTemplate>
              </React.Fragment>
              } />
            )
          })}
          <Route key="goal" path="/goal" element={<Goal />} />
          <Route key="home" path="/" element={<Home />} />
        </Routes>
      </EuiProvider>
    </Router>
  );
}



export default App;
