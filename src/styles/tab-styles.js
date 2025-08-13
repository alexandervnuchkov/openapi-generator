import { css } from 'lit';

export default css`
.tab-panel {
  border: none;
}
.tab-buttons {
  height:auto;
  align-items: stretch;
  overflow-y: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}
.tab-buttons::-webkit-scrollbar {
  height: 1px;
  background-color: var(--light-gray);
}
.tab-btn {
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--light-fg);
  background-color: transparent;
  white-space: nowrap;
  cursor:pointer;
  outline:none;
  font-family:var(--font-regular);
  font-size:var(--font-size-small);
  margin-right:16px;
  padding:4px 1px 2px;
  margin-bottom: 6px;
}
.tab-btn.active {
  border-bottom: 3px solid var(--lighter-red);
  color:var(--lighter-red);
}
.tab-btn:hover {
  color:var(--lighter-red);
}
.tab-content {
  margin:-1px 0 0 0;
  position:relative;
  min-height: 50px;
}
.tab-btn.lang-button {
  padding: 35px 0 0;
  vertical-align: top;
  background-size: auto 24px;
  background-repeat: no-repeat;
  background-image: url(./images/icons.svg);
  background-position-y: 7px;
  width: 70px;
  white-space: normal;
  display: flex;
  align-content: flex-start;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  margin-bottom: 8px;
  margin-top: 8px;
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
}
.tab-btn.lang-button.active {
  background-color: var(--light-blue);
  color: var(--dark-blue);
}
.lang-button:hover {
  background-color: var(--lightest-gray);
  color: var(--gray);
}
.lang-button.java {
  background-position-x: -266px;
}
.lang-button.java.active {
  background-position-x: -626px;
}
.lang-button.shell {
  background-position-x: 22px;
}
.lang-button.shell.active {
  background-position-x: -338px;
}
.lang-button.python {
  background-position-x: -122px;
}
.lang-button.python.active {
  background-position-x: -482px;
}
.lang-button.py {
  background-position-x: -50px;
}
.lang-button.py.active {
  background-position-x: -410px;
}
.lang-button.js {
  background-position-x: -194px;
}
.lang-button.js.active {
  background-position-x: -554px;
}
.lng-sample-title {
  margin-top:60px;
  width: 43%;
  float: right;
  padding: 0;
  font-size: 18px;
}
@media only screen and (max-width: 1200px) {
  .lng-sample-title {
    float: none;
    width: 100%;
  }
}
.lng-sample-tabs {
  margin-top: 7px;
  padding-top: 5px;
}
.lng-sample-row {
  width:100;
  overflow:auto;
}
`;
