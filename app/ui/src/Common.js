import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import {CopyToClipboard} from 'react-copy-to-clipboard';


export function Section(props) {
  return (<div className="Section">{props.children}</div>);
}

export function Markdown(props) {
  return <ReactMarkdown plugins={[gfm]} >{props.children}</ReactMarkdown>;
}

export function Code(props) {
  return (
  <>
    <CopyToClipboard text={props.children.trim()}>
      {((typeof props.copy) === 'undefined') || props.copy === true
        ? (<div className="copy"><button>copy</button></div>) : <div />}
    </CopyToClipboard>
    <SyntaxHighlighter language={props.language} style={syntaxStyle}>{props.children.trim()}</SyntaxHighlighter>
  </>
  );
}