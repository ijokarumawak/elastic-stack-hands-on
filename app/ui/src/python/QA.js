import React, {useState, useEffect, Fragment} from 'react';

import {
  EuiMarkdownFormat,
  EuiSpacer,
} from '@elastic/eui';

import QuestionsTable from "./QuestionsTable.js";

function QA() {

  return (
  <>
<QuestionsTable />
</>
  );
}

export default QA;