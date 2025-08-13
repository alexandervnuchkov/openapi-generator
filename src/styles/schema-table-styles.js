import { css } from 'lit';

export default css`
.table {
  font-size: var(--font-size-regular);
  text-align: left;
  line-height: calc(var(--font-size-regular) + 6px);
}
.table .tr {
  width: calc(100% - 5px);
  padding: 0 0 0 5px;
  border-bottom: 1px solid var(--light-gray);
}
.table div:last-of-type {
  border-bottom: 0 none;
}
.table .td {
  padding: 6px 8px;
}
.table .key {
  width: 100%;
}
.key-label {
  margin: 1px 0;
  text-align: left;
  line-height: calc(var(--font-size-regular) + 6px);
  color: var(--fg);
  font-family: var(--font-mono);
  font-weight: bold;
  margin-bottom: 10px;
}
.key.deprecated .key-label {
  color: var(--red);
}
.table .key-type {
  white-space: normal;
  width: 100px;
  font-family: var(--font-regular);
}
.table .key-type span {
  font-size: 11px;
}
.collapsed-descr .tr {
  max-height: calc(var(--font-size-small) + var(--font-size-small) + 4px);
}
.param-required {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--lighter-red);
  display: inline-block;
  background-color: var(--light-red);
  padding: 0 6px;
  border-radius: var(--border-radius-smaller);
  margin-left: 5px;
  line-height: calc(var(--font-size-regular) + 6px);
  font-weight: bold;
  font-family: var(--font-regular);
}
.param-requiredif {
  font-weight: bold;
  color: var(--red);
}
.obj-toggle {
  padding: 0 2px;
  border-radius:var(--border-radius-smaller);
  border: 1px solid transparent;
  display: inline-block;
  margin-left: -16px;
  color:var(--gray);
  cursor:pointer;
  font-size: calc(var(--font-size-small) + 4px);
  font-family: var(--font-mono);
  background-clip: border-box;
}
.obj-toggle:hover {
  color: var(--lighter-gray);
}
.tr.expanded + .object-body {
  display:block;
  padding-left:6px;
  border-left:1px solid var(--light-gray);
}
.tr.collapsed + .object-body {
  display:none;
}
.schm-table-dscr {
  height: 80px;
}
.schm-header {
  border:1px solid var(--light-gray);
  border-radius: var(--border-radius);
  margin-top:10px;
}
.schm-header-int {
  display:flex;
  color: var(--gray);
  background-color: var(--lightest-gray);
  padding:8px;
  border-bottom:1px solid var(--light-gray);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}
.schm-hkey {
  font-family:var(--font-regular);
  font-size:var(--font-size-regular);
  color:var(--gray);
  padding-left: 24px;
}
.td.schm-obj {
  padding-left:24px;
}
.schm-tab {
  color:var(--light-fg);
  font-size:var(--font-size-small);
  font-weight:400;
}
.schm-alt-tab {
  padding: 8px 0;
  color:var(--fg2)
}
.comp-name {
  border-top:1px solid var(--primary-color);
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
`;
