import React, {useState, Fragment} from 'react';

import {
  EuiMarkdownFormat,
  EuiMarkdownEditor,
  EuiCommentList,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
  EuiBasicTable,
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
  formatDate
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
  const {questionId, setQuestionId, user, title, setTitle, tags, setTags, body, setBody,
        comments, setComments, loadQuestions,
        isFlyoutVisible, closeFlyout} = props;

  const [tagOptions, setTagOptions] = useState(tagOptionsStatic);
  const [comment, setComment] = useState('');

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

  function close() {
    setQuestionId('');
    setTitle('');
    setTags([]);
    setComment('');
    setComments([]);
    setBody('');
    closeFlyout();
  }

  function save() {
    const question = {
      title: title,
      user: user,
      tags: tags.map(x => x.label),
      body: body,
      timestamp: new Date(),
      comments: comments
    };

    if (comment) {
      const newComment = {timestamp: new Date(), user: process.env.REACT_APP_KEY, comment: comment};
      if (question.comments) {
        question.comments = [...question.comments, newComment]
      } else {
        question.comments = [newComment]
      }
    }

    console.log('question', JSON.stringify(question));

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
        close();
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
  onClose={close}
  hideCloseButton
  aria-labelledby={createQuestionFlyoutId}
>
  <EuiFlyoutHeader>
  </EuiFlyoutHeader>
  <EuiFlyoutBody>
    <EuiTitle size="m"><h2>質問</h2></EuiTitle>
    <EuiSpacer />
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
    </EuiForm>
    <EuiSpacer />
    <EuiMarkdownEditor value={body} onChange={setBody} />

    <EuiSpacer />

    <EuiCommentList comments={comments.map(x => {return {
          username: x.user,
          event: 'added a comment',
          timestamp: 'at ' + formatDate(x.timestamp, 'YYYY-MM-DD HH:mm:ss'),
          children: (<EuiMarkdownFormat>{x.comment}</EuiMarkdownFormat>)
        }})} />

    <EuiSpacer />
    <EuiTitle size="m"><h2>回答</h2></EuiTitle>
    <EuiSpacer />

    <EuiMarkdownEditor value={comment} onChange={setComment} />
  </EuiFlyoutBody>
  <EuiFlyoutFooter>
    <EuiFlexGroup justifyContent="spaceBetween">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty
          iconType="cross"
          onClick={close}
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