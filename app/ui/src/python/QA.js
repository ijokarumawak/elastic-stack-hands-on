import React, {useState} from 'react';

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
  EuiSwitch,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage
} from '@elastic/eui';

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

  const [tags, setTags] = useState([]);
  const [tagOptions, setTagOptions] = useState(tagOptionsStatic);

  function handleCreate(name) {
    let newOption = { name }

    // select new option
    setTags([...tags, newOption]);

    // add new option to our dataset
    setTagOptions(data => [newOption, ...data])
  }

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

<EuiForm>
  <EuiFormRow label="タイトル">
    <EuiFieldText name="qa.title" />
  </EuiFormRow>
  <EuiFormRow label="ユーザー">
    <EuiFieldText name="qa.user" />
  </EuiFormRow>
  <EuiFormRow label="タグ">
    {/* I wanted to use EuiComboBox, but it doesn't show options as expected.. */}
    <Multiselect
      data={tagOptions}
      value={tags}
      textField="name"
      allowCreate="onFilter"
      onCreate={handleCreate}
      onChange={setTags}
    />
  </EuiFormRow>
  <EuiSpacer />
  <EuiMarkdownEditor value="hello" onChange={() => {}} />
</EuiForm>
</>
  );
}

export default QA;