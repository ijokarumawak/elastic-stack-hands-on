import React, {useState, Fragment} from 'react';

import {
  EuiMarkdownFormat,
  EuiMarkdownEditor,
  EuiForm,
  EuiFormControlLayout,
  EuiFormLabel,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
  EuiCodeBlock,
  EuiButton,
  EuiButtonEmpty,
  EuiSwitch,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiTitle,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiHealth,
  EuiSearchBar,
  EuiCallOut,
  EuiBasicTable,
  useGeneratedHtmlId,
  Random
} from '@elastic/eui';

import QuestionsTable from "./QuestionsTable.js";

import Multiselect from "react-widgets/Multiselect";
import "react-widgets/styles.css";

const tagOptionsStatic = [
  {name: 'Elasticsearch'},
  {name: 'Kibana'},
  {name: 'Beats'},
  {name: 'Elastic Agent'},
  {name: 'Discover'},
  {name: 'Lens'},
  {name: 'Vega'}
];

function QA() {

  const [questions, setQuestions] = useState([]);

  return (
  <>
<EuiMarkdownFormat>{`
## QA アプリ

TODO: Python の API を実装して QA アプリを開発

- 質問が検索できる
- 質問が入力できる
- 質問が修正できる
- 回答が入力できる

JSON ドキュメントのデザイン

質問:
- @timestamp
- 投稿者 (env-key)
- tag
- タイトル
- 本文 markdown
- ステータス (open, closed)

回答:
- @timestamp
- 投稿者 (env-key)
- 質問 ID
- 本文 markdown

\`\`\`json
PUT es-hands-on-qa-${process.env.REACT_APP_KEY}
{
  "mappings": {
    "properties": {
      "body": {
        "type": "text"
      },
      "timestamp": {
        "type": "date"
      },
      "title": {
        "type": "text"
      },
      "user": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "tags": {
        "type": "keyword"
      }
    }
  }
}
\`\`\`

\`\`\`bash
curl -i -XPOST localhost:8000/qa/questions/ -H 'Content-Type: application/json' -d '{"timestamp": "2022-07-11T12:17:01+09:00", "user": "${process.env.REACT_APP_KEY}", "tags": ["Python", "Elasticsearch"], "title": "Python クライアント", "body": "Python 用の公式ライブラリはありますか?"}'
\`\`\`

[Python Elasticsearch Client](https://elasticsearch-py.readthedocs.io/en/v8.3.2/)

`}</EuiMarkdownFormat>
<QuestionEditor
  questions={questions}
  setQuestions={setQuestions}
  />

<QuestionsTable />

</>
  );
}

function QuestionEditor(props) {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const showFlyout = () => setIsFlyoutVisible(true);
  const closeFlyout = () => setIsFlyoutVisible(false);

  const [title, setTitle] = useState('');
  const [user, setUser] = useState(process.env.REACT_APP_KEY);
  const [tags, setTags] = useState([]);
  const [tagOptions, setTagOptions] = useState(tagOptionsStatic);
  const [body, setBody] = useState('');

  const createQuestionFlyoutId = useGeneratedHtmlId({
    prefix: 'createQuestionFlyout',
  });

  function handleCreateTag(name) {
    let newOption = { name }

    // select new option
    setTags([...tags, newOption]);

    // add new option to our dataset
    setTagOptions(data => [newOption, ...data])
  }

  function save() {
    const question = {
      title: title,
      user: user,
      tags: tags,
      body: body
    };
    props.setQuestions([...props.questions, question]);
    closeFlyout();
  }

  let flyout;
  if (isFlyoutVisible) {
    flyout = (
<EuiFlyout
  ownFocus
  onClose={closeFlyout}
  hideCloseButton
  aria-labelledby={createQuestionFlyoutId}
>
  <EuiFlyoutHeader>
    <EuiTitle size="m"><h2>質問しよう</h2></EuiTitle>
  </EuiFlyoutHeader>
  <EuiFlyoutBody>
    <EuiForm>
      <EuiFormRow label="タイトル">
        <EuiFieldText name="qa.title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="ユーザー">
        <EuiFieldText name="qa.user" value={user} onChange={(e) => setUser(e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="タグ">
        {/* I wanted to use EuiComboBox, but it doesn't show options as expected.. */}
        <Multiselect
          data={tagOptions}
          value={tags}
          textField="name"
          allowCreate="onFilter"
          onCreate={handleCreateTag}
          onChange={setTags}
        />
      </EuiFormRow>
      <EuiSpacer />
      <EuiMarkdownEditor value={body} onChange={setBody} />
    </EuiForm>
  </EuiFlyoutBody>
  <EuiFlyoutFooter>
    <EuiFlexGroup justifyContent="spaceBetween">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty
          iconType="cross"
          onClick={closeFlyout}
          flush="left"
        >
          Close
        </EuiButtonEmpty>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton onClick={save} fill>
          Save
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiFlyoutFooter>
</EuiFlyout>
    );
  }

  return (
  <>
<EuiButton onClick={showFlyout}>質問する</EuiButton>
{flyout}
  </>
  );
}

export default QA;