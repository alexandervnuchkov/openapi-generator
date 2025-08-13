import { css } from 'lit';

export default css`
  .hover-bg:hover{
    background: var(--bg3);
  }
  ::selection {
/*    background: var(--selection-bg);
    color: var(--selection-fg);*/
    background-color: var(--lighter-gray);
    color: #ededee;
  }
  code::selection,
  code span::selection {
    /*  background-color: #ededee;
    color: var(--lighter-gray);*/
    background-color: var(--lighter-gray);
    color: #ededee;
  }
  .regular-font{
    font-family:var(--font-regular);
  }
  .mono-font {
    font-family:var(--font-mono);
  }
  .title {
    font-size: calc(var(--font-size-regular) + 12px);
    font-weight: normal
  }
  .sub-title{ font-size: calc(var(--font-size-regular) + 12px);}
  .req-res-title {
    margin-bottom:0;
    margin-top: 0;
    text-align:left;
  }
  .tiny-title {
    font-size:calc(var(--font-size-regular) + 1px);
    font-weight:bold;
  }
  .regular-font-size { font-size: var(--font-size-regular); }
  .small-font-size { font-size: var(--font-size-small); }
  .upper { text-transform: uppercase; }
  .primary-text{ color: var(--primary-color); }
  .bold-text { font-weight:bold; }
  .deprecated-big-text { font-size: calc(var(--font-size-regular) - 1px); margin: 15px 0 0 32px; }
  .gray-text { color: var(--light-fg); line-height:calc(var(--font-size-regular) + 6px); }
  .red-text {color: var(--red)}
  .blue-text {color: var(--lighter-blue-add)}
  .multiline {
    overflow: scroll;
    max-height: var(--resp-area-height, 300px);
    color: var(--fg3);
  }
  .method-fg span {color: #fefefe; font-size: 14px; border-radius: var(--border-radius-smaller); display: inline-block; vertical-align: middle; padding: 3px 10px;}
  .method-fg.put span { background-color: var(--light-yellow); color: var(--lighter-yellow);}
  .method-fg.post span { background-color: var(--light-green);color: var(--lighter-green); }
  .method-fg.get span { background-color: var(--light-blue-add);color: var(--lighter-blue-add); }
  .method-fg.delete span { background-color: var(--light-red); color: var(--lighter-red); }
  .method-fg.options span,
  .method-fg.head span,
  .method-fg.patch span {
    background-color: var(--light-pink); color: var(--lighter-pink);
  }
  .status-code-2xx {
    background-color: var(--light-green);
    border-radius: var(--border-radius-smaller);
    color: var(--lighter-green);
    font-weight: 600;
    display: inline-block;
    padding: 3px 5px;
    font-size: var(--font-size-small);
    border: 0 none;
  }
  .status-code-4xx {
    background-color: var(--light-red);
    border-radius: var(--border-radius-smaller);
    color: var(--lighter-red);
    font-weight: 600;
    display: inline-block;
    padding: 3px 5px;
    font-size: var(--font-size-small);
    border: 0 none;
  }
  .status-code-5xx {
    background-color: var(--light-orange);
    border-radius: var(--border-radius-smaller);
    color: var(--lighter-orange);
    font-weight: 600;
    display: inline-block;
    padding: 3px 5px;
    font-size: var(--font-size-small);
    border: 0 none;
  }
  button.status-code {
    cursor: pointer;
    transition: background-color .2s;
  }
  button.status-code-2xx:hover {
    background-color: var(--light-green);
  }
  button.status-code-4xx:hover
  {
    background-color: var(--light-red);
  }
  button.status-code-5xx:hover
  {
    background-color: var(--light-orange);
  }
  h1{ font-family:var(--font-regular); font-size:28px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h2{ font-family:var(--font-regular); font-size:24px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h3{ font-family:var(--font-regular); font-size:20px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h4{ font-family:var(--font-regular); font-size:18px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h5{ font-family:var(--font-regular); font-size:16px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h6{ font-family:var(--font-regular); font-size:14px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  p { margin-block-start: 0.5em; }
  a { color: var(--blue); cursor:pointer; }
  .regular-font a.inactive-link,
  a.inactive-link {
    color:var(--lighter-gray);
    text-decoration: none;
    cursor:text;
  }
  code,
  pre {
    margin: 0px;
    font-family: var(--font-mono);
    font-size: calc(var(--font-size-mono) + 2px);
  }
  table code {
    padding: 1px 6px;
    border-radius: var(--border-radius-smaller);
    color: var(--lighter-gray);
    background-color: var(--code-bg);
    font-size: calc(var(--font-size-mono) + 2px);
    line-height: calc(var(--font-size-regular) + 6px);
    white-space: nowrap;
    border: 1px solid var(--code-border-color);
  }
  .m-markdown,
  .m-markdown-small {
    display:block;
  }
  .m-markdown p,
  .m-markdown span,
  p {
    font-size: var(--font-size-regular);
    line-height:calc(var(--font-size-regular) + 6px);
  }
  .m-markdown li,
  li {
    font-size: var(--font-size-regular);
    line-height:calc(var(--font-size-regular) + 8px);
  }
  .m-markdown-small p,
  .m-markdown-small span,
  .m-markdown-small li {
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 6px);
  }
  .m-markdown-small li {
    line-height: calc(var(--font-size-regular) + 6px);
  }
  .m-markdown p:not(:first-child) {
    margin-block-start: 16px;
  }
  .m-markdown-small p:not(:first-child) {
    margin-block-start: 12px;
  }
  .m-markdown p:first-child {
    margin-block-start: 12px;
  }
  .m-markdown p,
  .m-markdown-small p {
    margin-block-end: 0;
  }
  .m-list-table {
    width: 100%;
  }
  .m-list-table tr td:first-child {
    min-width: 20%;
  }
  .m-list-table tr td:last-child {
    min-width: 50%;
  }
  .m-list-table p {
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .m-markdown code span {
    font-size: calc(var(--font-size-mono) + 2px);
  }
  .m-markdown-small code,
  .m-markdown code {
    padding: 1px 6px;
    border-radius: var(--border-radius-smaller);
    color: var(--lighter-gray);
    background-color: var(--code-bg);
    font-size: calc(var(--font-size-mono) + 2px);
    line-height: calc(var(--font-size-regular) + 6px);
    white-space: pre-wrap;
    border: 1px solid var(--code-border-color);
  }
  .m-markdown-small code {
    font-size: calc(var(--font-size-mono) + 2px);
  }
  .m-markdown-small pre,
  .m-markdown pre {
    white-space: pre-wrap;
    overflow-x: auto;
    line-height: normal;
    border-radius: var(--border-radius);
    border: 1px solid var(--code-border-color);
  }
  .m-markdown pre {
    padding: 12px;
    background-color: var(--code-bg);
    color:var(--fg);
  }
  .m-markdown p + pre {
    margin-top: 16px;
  }
  .m-markdown-small pre {
    margin-top: 4px;
    padding: 2px 4px;
    background-color: var(--code-bg);
    color: var(--fg);
  }
  .m-markdown-small pre code,
  .m-markdown pre code {
    border:none;
    padding:0;
    white-space: pre-wrap;
  }
  .m-markdown pre code {
    color: var(--fg);
    background-color: transparent;
  }
  .m-markdown-small pre code {
    color: var(--fg2);
    background-color: transparent;
  }
  .m-markdown ul,
  .m-markdown ol {
    padding-inline-start: 30px;
  }
  .m-markdown-small ul,
  .m-markdown-small ol {
    padding-inline-start: 20px;
  }
  .m-markdown-small a:not(.logo-link,.anchor-param-constraint-font),
  .m-markdown a:not(.logo-link,.anchor-param-constraint-font) {
    color:var(--blue);
    text-decoration: none;
    background-image: linear-gradient(var(--blue),var(--blue));
    background-position: 0 100%;
    background-repeat: no-repeat;
    background-size: 0 1px;
    --link-color: var(--blue);
    --link-side-offset: 6px;
    --link-side-offset-hover: 9px;
    color: var(--blue);
    display: inline;
    outline: none;
    overflow-wrap: break-word;
    position: relative;
    transition: all .15s linear;
    z-index: 5;
  }
  .m-markdown-small a:not(.logo-link,.anchor-param-constraint-font):hover,
  .m-markdown a:not(.logo-link,.anchor-param-constraint-font):hover {
    background-size: 100% 1px;
  }
  .m-markdown-small img,
  .m-markdown img {
    max-width: 100%;
  }
  /* Markdown table */
  .m-markdown-small table,
  .m-markdown table {
    border-spacing: 0;
    margin: 10px 0;
    border-collapse: separate;
    border: 1px solid var(--light-gray);
    border-radius: var(--border-radius);
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 6px);
    max-width: 100%;
  }
  .m-markdown-small table {
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 6px);
    margin: 8px 0;
  }
  .m-markdown-small td,
  .m-markdown-small th,
  .m-markdown td,
  .m-markdown th {
    vertical-align: top;
    border-top: 1px solid var(--light-gray);
    line-height: calc(var(--font-size-regular) + 6px);
  }
  .m-markdown-small tr:first-child th,
  .m-markdown tr:first-child th {
    border-top: 0 none;
  }
  .m-markdown tr:nth-child(even) {
    background-color: var(--bg2);
  }
  .m-markdown th,
  .m-markdown td {
    padding: 10px 12px;
  }
  .m-markdown-small th,
  .m-markdown-small td {
    padding: 8px 8px;
  }
  .m-markdown th,
  .m-markdown-small th {
    font-weight: 500;
    background-color: var(--lightest-gray);
    vertical-align: middle;
  }
  .m-markdown-small table code {
    font-size: calc(var(--font-size-mono) + 2px);
  }
  .m-markdown table code {
    font-size: calc(var(--font-size-mono) + 2px);
  }
  .m-markdown blockquote,
  .m-markdown-small blockquote {
    margin-inline-start: 0;
    margin-inline-end: 0;
    border-left: 3px solid var(--light-gray);
    padding: 6px 0 6px 6px;
  }
  .m-markdown hr{
    border: 1px solid var(--light-gray);
  }
  .param-name,
  .param-type {
    margin: 1px 0;
    text-align: left;
    line-height: calc(var(--font-size-regular) + 6px);
  }
  .param-name{
    color: var(--fg);
    font-family: var(--font-mono);
    font-weight: bold;
    margin-bottom: 10px;
  }
  .deprecated {
    color:var(--lighter-gray);
  }
  .param-name.deprecated {
    color: var(--red);
  }
  .cs-description {
    margin-bottom: 20px;
  }
`;
