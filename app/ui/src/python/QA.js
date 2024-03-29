import React, { useState, useEffect, Fragment } from 'react';
import {
  EuiButton,
  EuiCallOut,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiBasicTable,
  EuiButtonIcon,
  EuiFieldSearch,
  EuiFilterGroup,
  EuiFilterButton,
  EuiLink,
  formatDate,
} from '@elastic/eui';
import QuestionEditor from "./QuestionEditor.js";

export default (props) => {

  console.log('Initializing QA...');

  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const [isMineFilterOn, setIsMineFilterOn] = useState(false);
  const [isOpenFilterOn, setIsOpenFilterOn] = useState(false);
  const [isClosedFilterOn, setIsClosedFilterOn] = useState(false);
  let _isMineFilterOn = isMineFilterOn;
  let _isOpenFilterOn = isOpenFilterOn;
  let _isClosedFilterOn = isClosedFilterOn;

  const [questions, setQuestions] = useState([]);

  const loadQuestions = async() => {
    console.log('loading questions');
    fetch('/python/qa/questions/_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        user: _isMineFilterOn ? process.env.REACT_APP_KEY : null,
        status: _isOpenFilterOn ? 'open' : (_isClosedFilterOn ? 'closed' : null)
      })
    })
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


  const toggleMineFilter = () => {
    _isMineFilterOn = !isMineFilterOn;
    setIsMineFilterOn(_isMineFilterOn);
    loadQuestions();
  };

  const toggleOpenFilter = () => {
    _isOpenFilterOn = !isOpenFilterOn;
    _isClosedFilterOn = isClosedFilterOn && !isOpenFilterOn ? false : isClosedFilterOn;
    setIsOpenFilterOn(_isOpenFilterOn);
    setIsClosedFilterOn(_isClosedFilterOn);
    loadQuestions();
  };

  const toggleClosedFilter = () => {
    _isClosedFilterOn = !isClosedFilterOn;
    _isOpenFilterOn = isOpenFilterOn && !isClosedFilterOn ? false : isOpenFilterOn;
    setIsClosedFilterOn(_isClosedFilterOn);
    setIsOpenFilterOn(_isOpenFilterOn);
    loadQuestions();
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

  const newQuestion = () => {
    setQuestionId('');
    setTitle('');
    setBody('');
    setUser(process.env.REACT_APP_KEY);
    setTags([]);
    setComments([]);
    setTimestamp(null);
    showFlyout();
  }

  const showQuestion = (record) => {
    console.log(record.record);
    setQuestionId(record.record._id);
    setTitle(record.record._source.title);
    setBody(record.record._source.body);
    setUser(record.record._source.user);
    setTags(record.record._source.tags.map(x => {return {label: x}}));
    setComments(record.record._source.comments);
    setTimestamp(record.record._source.timestamp);
    showFlyout();
  }

  const renderTable = () => {
    const columns = [
      {
        name: 'Posted at',
        field: '_source.timestamp',
        dataType: 'date',
        width: '170px',
        render: (date) => formatDate(date, 'YYYY-MM-DD HH:mm:ss')
      },
      {
        name: 'Status',
        width: '80px',
        field: '_source.status',
      },
      {
        name: 'Tags',
        width: '120px',
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
        width: '150px',
        field: '_source.user',
      },
      {
        name: 'Comments',
        width: '80px',
        align: 'right',
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
      <EuiFlexItem>{renderTable()}</EuiFlexItem>
    </EuiFlexGroup>
  );
  const handleSearchKeyPress = (e) => {
    if(e.key === 'Enter'){
      loadQuestions();
    }
  }

  const [title, setTitle] = useState('');
  const [user, setUser] = useState(process.env.REACT_APP_KEY);
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp, setTimestamp] = useState();

  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const showFlyout = () => setIsFlyoutVisible(true);
  const closeFlyout = () => setIsFlyoutVisible(false);

  return (
    <Fragment>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiButton onClick={newQuestion}>質問する</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon onClick={loadQuestions} iconType="refresh"
            title="更新" aria-label="更新" />
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
        setQuestionId={setQuestionId}
        user={user}
        title={title}
        setTitle={setTitle}
        tags={tags}
        setTags={setTags}
        body={body}
        setBody={setBody}
        comments={comments}
        setComments={setComments}
        timestamp={timestamp}
        setTimestamp={setTimestamp}
        isFlyoutVisible={isFlyoutVisible}
        closeFlyout={closeFlyout}
        />
    </Fragment>
  );
};