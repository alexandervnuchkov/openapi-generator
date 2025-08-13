import { css } from 'lit';

export default css`
*, *:before, *:after { box-sizing: border-box; }
.read-mode {
  margin-top: 0;
}
.param-type{
  color: var(--light-fg);
  font-family: var(--font-regular);
  display: inline-block;
  font-weight: normal;
}
.param-constraint{
  min-width:100px;
}
.param-constraint:empty{
  display:none;
}
.top-gap{margin-top:24px;}
.textarea {
  min-height:150px;
  padding:5px;
  resize:vertical;
  direction: ltr;
}
.example:first-child {
  margin-top: -9px;
}
.response-message{
  text-overflow: ellipsis;
  line-height: calc(var(--font-size-regular) + 6px);
}
.response-message.error {
  color:var(--red);
}
.response-message.success {
  color:var(--gray);
}
.file-input-container {
  align-items:flex-end;
}
.file-input-container .input-set:first-child .file-input-remove-btn{
  visibility:hidden;
}
.file-input-remove-btn{
  font-size:16px;
  color:var(--red);
  outline: none;
  border: none;
  background:none;
  cursor:pointer;
}
.param-required {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--lighter-red);
  display: inline-block;
  background-color: var(--light-red);
  padding: 0 6px;
  border-radius: var(--border-radius-smaller);
  line-height: calc(var(--font-size-regular) + 6px);
  font-weight: bold;
  font-family: var(--font-regular);
}
.v-tab-btn {
  font-size: var(--font-size-small);
  height:24px;
  border:none;
  background:none;
  opacity: 0.3;
  cursor: pointer;
  padding: 4px 8px;
}
.v-tab-btn.active {
  font-weight: bold;
  background: var(--bg);
  opacity: 1;
}
.stri, .string, .uri, .url, .byte, .bina, .date, .pass, .ipv4, .uuid, .emai, .host {color:var(--lighter-green);}
.inte, .numb, .number, .int6, .int3, .int, .floa, .doub, .deci .blue {color:var(--lighter-blue-add);}
.null {color:var(--lighter-red);}
.bool, .boolean{color:var(--lighter-pink)}
.enum {color:var(--lighter-orange)}
.recu {color:var(--lighter-gray)}
.anchor-param-constraint-font {
  font-family: var(--font-mono);
}
@media only screen and (min-width: 768px) {
  .textarea {
    padding:8px;
  }
}
@media only screen and (max-width: 470px) {
  .hide-in-small-screen {
    display:none;
  }
}
.calc-width-api-request {
  width: calc(57% - 35px);
}
@media only screen and (max-width: 1200px) {
  .calc-width-api-request {
    width: 100%;
  }
}
.example-style {
  font-weight: normal;
  font-style: italic;
}
.param-name-td {
  min-width: 300px;
}
.param-name-td-try {
  max-width: 100%;
  width: 500px;
}
.param-name-td-notry {
  max-width: 100%;
}
.param-schema-default-title,
.param-schema-pattern-title,
.param-schema-values-title {
  font-weight: bold;
}
.request-param-td {
  width: 200px;
}
.request-param-tabs,
.request-body-tab-inline {
  border-width: 0 0 1px 0;
}
.input-password-text {
  width: 100%;
}
.params-table-styles {
  display: block;
  overflow-x: auto;
  max-width: 100%;
  margin-top: 20px;
}
.mtable-inline {
  width: 100%;
  word-break: break-word;
}
.request-body-inline,
.request-body-example-inline {
  min-width: 100px;
  max-width: 100%;
  margin-bottom: -1px;
}
.example-summary-inline,
.example-description-inline {
  padding: 4px 0;
}
.request-body-param-inline {
  width: 100%;
  resize: vertical;
  display: none;
}
.request-body-param-user-inline {
  width: 100%;
  resize: vertical;
}
.request-body-type-inline {
  max-width: 100%;
}
.selected-request-inline {
  font-weight:normal;
  margin-left:5px;
  color:var(--lighter-gray);
}
.md-mbottom {
  margin-bottom:12px;
}
.tpanel-row-inline {
  min-height:220px;
  border-left: 6px solid var(--light-gray);
  align-items: stretch;
}
.tpr-div {
  width:24px;
  background-color:var(--light-gray);
}
.tpr-div-int {
  flex-direction:row-reverse;
  width:160px;
  height:24px;
  transform:rotate(270deg) translateX(-160px);
  transform-origin:top left;
  display:block;
}
.tab-cont-col-div {
  padding-left:5px;
  width:100%;
}
.min-width-input {
  min-width:100px;
}
.align-flex-end {
  align-items:flex-end;
}
.file-input-add-btn {
  margin:2px 25px 0 0;
  padding:2px 6px;
}
.res-vert {
  resize:vertical;
}
.colspan-2 {
  margin-top:0;
  padding:0 5px 8px 5px;
}
.response-row {
  font-size:var(--font-size-small);
  margin:5px 0;
}
.response-col {
  border-width:0 0 1px 0;
}
.response-pre {
  white-space:pre;
  max-height:300px;
  min-height: 40px;
  overflow:auto;
}
.clear-response {
  padding: 10px 0;
}
.sel-server {
  display:flex;
  flex-direction:column;
}
.sel-server-div {
  display:flex;
  align-items:baseline;
  line-height: calc(var(--font-size-regular) + 6px);
}
.sel-server-label {
  font-weight:bold;
  padding-right:5px;
  line-height: calc(var(--font-size-regular) + 6px);
}
.response-auth {
  display:flex;
  align-items:flex-end;
  margin:16px 0;
  font-size:var(--font-size-small);
}
.response-auth-mobile {
  flex-direction:column;
  margin:0;
  width:100%;
  clear:left;
}
.response-auth-html {
  display:flex;
  flex-direction:row;
  align-items:center;
  overflow:hidden;
}
.disp-flex {
  display:flex;
}
.response-auth-applied {
  color:var(--lighter-blue-add);
  overflow:hidden;
  line-height:calc(var(--font-size-regular) + 6px);
}
.response-auth-none {
  color:var(--red);
}
.mright-btn {
  margin-right:5px;
}
.rsp-msg {
  color:var(--lighter-gray);
}
.small-width {
  width:135px;
}
.endbadge-style {
  margin:1px;
  margin-right:5px;
  padding:1px 8px;
  font-weight:bold;
  border-radius:var(--border-radius-bigger);
}
.code-sample-badge {
  display:flex;
  flex-wrap:wrap;
  font-size: var(--font-size-small);
}
.code-sample-expand-badge {
  display:flex;
  flex-wrap:wrap;
  margin-bottom: -24px;
  font-size: var(--font-size-small);
}
.resp-cont-int {
  display:flex;
  flex-direction:column;
}
.expand-collapse {
  display:flex;
  justify-content:flex-end;
}
.expcol-link {
  color:var(--primary-color);
  cursor:pointer;
}
.pad-bot-12 {
  padding-bottom:12px;
}
.marg-top-12 {
  margin-top:12px;
}
.span-whook {
  font-family: var(--font-regular);
  font-size: var(--);
  font-size: var(--font-size-small);
  color:var(--primary-color);
  margin-left: 16px
}
.span-whook-exp {
  color:var(--primary-color);
  font-weight:bold;
  font-size: var(--font-size-regular);
}
.span-depr {
  font-size:var(--font-size-small);
  text-transform:uppercase;
  font-weight:bold;
  color:var(--red);
  margin:2px 0 0 5px;
}
.summary-collapsed {
  min-width:60px;
  flex:1
}
.tiny-title-call {
  padding: 12px;
  border:1px solid var(--light-gray);
}
.callback-block {
  display:flex;
  margin-left:16px;
}
.cb-method {
  width:70px;
  border:none;
  margin:0;
  padding:0;
  line-height:20px;
  vertical-align: baseline;
  text-align:left
}
.font-gross {
  font-size:20px;
}
.cb-pathobj {
  line-height:20px;
  vertical-align: baseline;
}
.sctn-tag-gap {
  border-top:1px solid var(--lightest-gray);
}
aside {
  display: block;
  padding: 18px 20px 18px 50px;
  border-radius: var(--border-radius);
  margin: 16px 0;
  background-repeat: no-repeat;
  background-position: 13px 17px;
  background-size: 24px 24px;
  font-size: var(--font-size-regular);
  line-height: calc(var(--font-size-regular) + 6px);
}
aside.warning {
  background-color: var(--lightest-red);
  background-image: url(./images/warning.svg);
}
aside.note {
  background-color: var(--lightest-blue);
  background-image: url(./images/note.svg);
}
aside.tip {
  background-color: var(--lightest-green);
  background-image: url(./images/tip.svg);
}
.key-label {
  text-align: left;
  line-height: calc(var(--font-size-regular) + 6px);
  color: var(--fg);
  font-family: var(--font-mono);
  font-weight: bold;
  font-size: var(--font-size-regular);
}
.key.deprecated .key-label {
  color: var(--red);
}
.btn-try {
  color: #fff;
  background-color: #1e2126;
}
.btn-try:hover {
  color: #fff;
  background-color: #0f1013;
}
`;
