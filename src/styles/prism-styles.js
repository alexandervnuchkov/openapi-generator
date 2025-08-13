import { css } from 'lit';

export default css`
code[class*="language-"],
pre[class*="language-"] {
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;
  tab-size: 2;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}
/* Code blocks */
pre[class*="language-"] {
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
}
/* Inline code */
:not(pre) > code[class*="language-"] {
  white-space: normal;
}
.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #DBDDDF;
}
.token.punctuation {
  color: #8e9092;
}
.token.tag,
.token.attr-name,
.token.namespace,
.token.deleted {
  color:var(--pink);
}
.token.function-name {
  color: #66B1FF;
}
.token.boolean,
.token.number,
.token.function {
  /*color: #FFEEB3;*/
  color: #36acaa;
}
.token.property,
.token.class-name,
.token.constant,
.token.symbol {
  /*color: #7FE8FF;*/
  color: #36acaa;
}
.token.selector,
.token.important,
.token.atrule,
.token.keyword,
.token.builtin {
  /*color: #ff8c5f;*/
  color: rgb(0, 0, 159);
}
.token.string,
.token.char,
.token.attr-value,
.token.regex,
.token.variable {
  /*color: #80c974;*/
  color: #e3116c;
}
.token.operator,
.token.entity,
.token.url {
  color: var(--code-operator-color);
}
.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}
.token.entity {
  cursor: help;
}
.token.inserted {
  color: green;
}
`;
