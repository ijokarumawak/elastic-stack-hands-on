import React, {useState, Fragment} from 'react';

import {
  EuiMarkdownEditor,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  useGeneratedHtmlId,
} from '@elastic/eui';

const tagOptionsStatic = [
  {label: 'Elasticsearch'},
  {label: 'Kibana'},
  {label: 'Beats'},
  {label: 'Elastic Agent'},
  {label: 'Discover'},
  {label: 'Lens'},
  {label: 'Vega'}
];

function QuestionEditor(props) {
  const {questionId, user, title, setTitle, tags, setTags, body, setBody, loadQuestions,
        isFlyoutVisible, closeFlyout} = props;

  const [tagOptions, setTagOptions] = useState(tagOptionsStatic);

  const createQuestionFlyoutId = useGeneratedHtmlId({
    prefix: 'createQuestionFlyout',
  });

  function handleCreateTag(name) {
    let newOption = { label: name }

    // select new option
    setTags([...tags, newOption]);

    // add new option to our dataset
    setTagOptions(data => [newOption, ...data])
  }

  function post(question) {
    return fetch('/python/qa/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question)
    });
  }

  function put(questionId, question) {
    return fetch('/python/qa/questions/' + questionId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question)
    });
  }

  function save() {
    const question = {
      title: title,
      user: user,
      tags: tags.map(x => x.label),
      body: body,
      timestamp: new Date()
    };
    console.log(question);

    (questionId ? put(questionId, question) : post(question))
      .then(response => {
        console.log(response);
        if (!response.ok) {
            return {
              status: response.status,
              statusText: response.statusText
            }
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        loadQuestions();
        closeFlyout();
      })
      .catch((error) => {
        console.log(error);
      });
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
        <EuiFieldText name="qa.user" value={user} disabled={true} />
      </EuiFormRow>
      <EuiFormRow label="タグ">
        <EuiComboBox
          aria-label="Tags combo box"
          placeholder="Select or create options"
          options={tagOptions}
          selectedOptions={tags}
          onChange={setTags}
          onCreateOption={handleCreateTag}
          isClearable={true}
          data-test-subj="tagsComboBox"
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
{flyout}
  </>
  );
}

export default QuestionEditor;