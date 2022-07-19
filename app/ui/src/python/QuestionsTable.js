import React, { useState, useEffect, Fragment } from 'react';
import {
  EuiButton,
  EuiCallOut,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiBasicTable,
  EuiFieldSearch,
  EuiFilterGroup,
  EuiFilterButton,
  EuiLink,
  formatDate,
} from '@elastic/eui';
import QuestionEditor from "./QuestionEditor.js";

const initialQuery = 'status:open';
export default (props) => {

  console.log('Initializing QA...');

  const [questions, setQuestions] = useState([]);

  const loadQuestions = async() => {
    console.log('loading questions');
    fetch('/python/qa/questions')
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
        setQuestions(data.hits.hits);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {loadQuestions();}, []);


  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const [isMineFilterOn, setIsMineFilterOn] = useState(false);
  const [isOpenFilterOn, setIsOpenFilterOn] = useState(false);
  const [isClosedFilterOn, setIsClosedFilterOn] = useState(false);

  const toggleMineFilter = () => {
    setIsMineFilterOn(!isMineFilterOn);
  };

  const toggleOpenFilter = () => {
    setIsOpenFilterOn(!isOpenFilterOn);
    setIsClosedFilterOn(isClosedFilterOn && !isOpenFilterOn ? false : isClosedFilterOn);
  };

  const toggleClosedFilter = () => {
    setIsClosedFilterOn(!isClosedFilterOn);
    setIsOpenFilterOn(isOpenFilterOn && !isClosedFilterOn ? false : isOpenFilterOn);
  };

  const renderError = () => {
    if (!error) {
      return;
    }
    return (
      <Fragment>
        <EuiCallOut
          iconType="faceSad"
          color="danger"
          title={`Invalid search: ${error.message}`}
        />
        <EuiSpacer size="l" />
      </Fragment>
    );
  };

  const showQuestion = (record) => {
    console.log(record.record);
    setQuestionId(record.record._id);
    setTitle(record.record._source.title);
    setBody(record.record._source.body);
    setUser(record.record._source.user);
    setTags(record.record._source.tags.map(x => {return {label: x}}));
    setComments(record.record._source.comments);
    showFlyout();
  }

  const renderTable = () => {
    const columns = [
      {
        name: 'Posted at',
        field: '_source.timestamp',
        dataType: 'date',
        render: (date) => formatDate(date, 'YYYY-MM-DD HH:mm:ss')
      },
      {
        name: 'Status',
        field: '_source.status',
      },
      {
        name: 'Tags',
        field: '_source.tags',
      },
      {
        name: 'Title',
        render: (record) => (
          <EuiLink onClick={() => showQuestion({record})}>
            {record._source.title}
          </EuiLink>
        )
      },
      {
        name: 'User',
        field: '_source.user',
      },
      {
        name: 'Comments',
        width: '150px',
        render: (item) => {
          return (
            <div>
              <div>{`${item._source.comments ? item._source.comments.length : 0}`}</div>
            </div>
          );
        },
      },
    ];

    return <EuiBasicTable items={questions} columns={columns} />;
  };
  const content = renderError() || (
    <EuiFlexGroup>
      <EuiFlexItem grow={6}>{renderTable()}</EuiFlexItem>
    </EuiFlexGroup>
  );
  const handleSearchKeyPress = (e) => {
    if(e.key === 'Enter'){
      // TODO: call Python API
      console.log('enter press here! ')
    }
  }

  const [title, setTitle] = useState('');
  const [user, setUser] = useState(process.env.REACT_APP_KEY);
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [comments, setComments] = useState([]);

  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const showFlyout = () => setIsFlyoutVisible(true);
  const closeFlyout = () => setIsFlyoutVisible(false);

  return (
    <Fragment>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiButton onClick={showFlyout}>質問する</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <EuiFieldSearch
            placeholder="質問を検索"
            value={query}
            onChange={(e) => onChange(e)}
            onKeyPress={handleSearchKeyPress}
            isClearable={true}
            fullWidth={true}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFilterGroup>
            <EuiFilterButton
              withNext
              hasActiveFilters={isOpenFilterOn}
              onClick={toggleOpenFilter}
            >Open</EuiFilterButton>
            <EuiFilterButton
              hasActiveFilters={isClosedFilterOn}
              onClick={toggleClosedFilter}
            >Closed</EuiFilterButton>
            <EuiFilterButton
              hasActiveFilters={isMineFilterOn}
              onClick={toggleMineFilter}
            >Mine</EuiFilterButton>
          </EuiFilterGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="l" />
      {content}
      <QuestionEditor
        loadQuestions={loadQuestions}
        questionId={questionId}
        user={user}
        title={title}
        setTitle={setTitle}
        tags={tags}
        setTags={setTags}
        body={body}
        setBody={setBody}
        comments={comments}
        setComments={setComments}
        isFlyoutVisible={isFlyoutVisible}
        closeFlyout={closeFlyout}
        />
    </Fragment>
  );
};