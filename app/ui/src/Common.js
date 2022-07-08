import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import {CopyToClipboard} from 'react-copy-to-clipboard';


export function Section(props) {
  return (<div className="Section">{props.children}</div>);
}

