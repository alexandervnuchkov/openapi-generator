import { css } from 'lit';

export default css`
.resp-head{
  vertical-align: middle;
  padding:16px 0 8px;
}
.resp-head.divider{
  border-top: 1px solid var(--light-gray);
  margin-top:10px;
}
.resp-status{
  font-weight:bold;
  font-size:calc(var(--font-size-regular) + 1px);
}
.resp-descr{
  font-size:calc(var(--font-size-regular) + 1px);
  color:var(--light-fg);
  text-align:left;
}
.example-panel{
  font-size:var(--font-size-small);
  margin:0 0 24px;
  display: block;
  background-color: var(--code-bg);
}
.focused-mode,
.read-mode {
  padding-top:24px;
  margin-top:12px;
}
.resp-div {
  flex-wrap:wrap;
}
.btn-rsp-stat {
  margin: 8px 4px 0 0;
}
.mrg-top-15 {
  margin-top: 15px;
}
.resp-blk-right {
  display: block;
  float: right;
  width: 43%;
}
.resp-blk-left {
  display: block;
  width: calc(57% - 35px);
}
@media only screen and (max-width: 1200px) {
  .resp-blk-right,
  .resp-blk-left {
    float: none;
    width: 100%;
  }
}
.resp-headers {
  padding:16px 0 8px 0;
}
.resp-headers-table {
  border-collapse: collapse;
  margin-bottom:16px;
  border:1px solid var(--light-gray);
  border-radius: var(--border-radius);
}
.resp-headers-name {
  padding:8px;
  vertical-align: baseline;
  min-width:120px;
  border-top: 1px solid var(--light-gray);
  text-overflow: ellipsis;
}
.resp-headers-type {
  padding:4px;
  vertical-align: baseline;
  padding:0 5px;
  border-top: 1px solid var(--light-gray);
  text-overflow: ellipsis;
}
.resp-headers-description {
  padding:8px;
  vertical-align: baseline;
  border-top: 1px solid var(--light-gray);
  text-overflow: ellipsis;
}
.resp-headers-example {
  padding:8px;
  vertical-align: baseline;
  border-top: 1px solid var(--light-gray);
  text-overflow: ellipsis;
}
.resp-mime {
  margin-bottom: -1px;
  z-index:1
}
.resp-example-padding {
  padding: 4px 0;
}
.resp-example-style {
  padding: 10px 0;
  height: 70px;
  font-size: 15px;
}
.resp-example-select {
  min-width:100px;
  max-width:100%;
}
.resp-example-style code {
  padding: 2px 8px;
  border-radius: var(--border-radius-smaller);
  color: var(--lighter-gray);
  background-color: var(--code-bg);
  font-size: calc(var(--font-size-mono) + 2px);
  line-height: 1.2;
  white-space: pre-wrap;
  border: 1px solid var(--code-border-color);
}
`;
