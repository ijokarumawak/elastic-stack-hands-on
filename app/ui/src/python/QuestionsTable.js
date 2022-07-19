import React, { useState, Fragment } from 'react';
import {
  Random,
  EuiCallOut,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiBasicTable,
  EuiFieldSearch,
  EuiFilterGroup,
  EuiFilterButton,
} from '@elastic/eui';
import QuestionEditor from "./QuestionEditor.js";

const random = new Random();
const tags = [
  { name: 'marketing', color: 'danger' },
  { name: 'finance', color: 'success' },
  { name: 'eng', color: 'success' },
  { name: 'sales', color: 'warning' },
  { name: 'ga', color: 'success' },
];
const users = [process.env.REACT_APP_KEY, 'gabic'];
const items = Array(10).fill(0).map((id) => {
  return {
    id,
    status: random.oneOf(['open', 'closed']),
    tag: random.setOf(
      tags.map((tag) => tag.name),
      { min: 0, max: 3 }
    ),
    active: random.boolean(),
    user: random.oneOf(users),
    followers: random.integer({ min: 0, max: 20 }),
    comments: random.integer({ min: 0, max: 10 }),
    stars: random.integer({ min: 0, max: 5 }),
  };
});

const initialQuery = 'status:open';
export default (props) => {

  const {questions, setQuestions} = props;

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
  const renderTable = () => {
    const columns = [
      {
        name: 'Posted at',
        field: 'timestamp',
      },
      {
        name: 'Status',
        field: 'status',
      },
      {
        name: 'Tags',
        field: 'tag',
      },
      {
        name: 'User',
        field: 'user',
      },
      {
        name: 'Stats',
        width: '150px',
        render: (item) => {
          return (
            <div>
              <div>{`${item.comments} Comments`}</div>
            </div>
          );
        },
      },
    ];
    // TODO: set API response
    const queriedItems = items;
    return <EuiBasicTable items={queriedItems} columns={columns} />;
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
  return (
    <Fragment>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>
          <QuestionEditor
            questions={questions}
            setQuestions={setQuestions}
            />
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
    </Fragment>
  );
};