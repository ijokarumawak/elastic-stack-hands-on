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
  const {questions, setQuestions} = props;
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
    let newOption = { label: name }

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
    console.log(question);
    setQuestions([...questions, question]);
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
<EuiButton onClick={showFlyout}>質問する</EuiButton>
{flyout}
  </>
  );
}

export default QuestionEditor;