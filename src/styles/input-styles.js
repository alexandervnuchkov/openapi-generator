import { css } from 'lit';

/* eslint-disable max-len */
export default css`
/* Button */
.m-btn {
  border-radius: var(--border-radius-smaller);
  display: inline-block;
  padding: 6px 16px;
  font-size: var(--font-size-small);
  outline: 0;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  border: 1px solid var(--lighter-gray);
  background-color:transparent;
  transition: background-color 0.2s;
  user-select: none;
  cursor: pointer;
  color: var(--lighter-gray);
}
.m-btn.thin-border { border-width: 1px; }
.m-btn.large { padding:8px 14px; }
.m-btn.small { padding:5px 12px; }
.m-btn.tiny { padding:5px 6px; }
.m-btn.circle { border-radius: 50%; }
.m-btn:hover {
  background-color: #fff;
  color: var(--gray);
  border-color: var(--gray);
}
.m-btn.nav { border: 2px solid var(--nav-accent-color); }
.m-btn.nav:hover {
  background-color: var(--nav-accent-color);
}
.m-btn:disabled{
  background-color: var(--bg3);
  color: var(--fg3);
  border-color: var(--fg3);
  cursor: not-allowed;
  opacity: 0.4;
}
.toolbar-btn{
  cursor: pointer;
  padding: 4px;
  margin:0 2px;
  font-size: var(--font-size-small);
  min-width: 50px;
  color: var(--primary-color-invert);
  border: none;
  background-color: rgba(0,105,255,.5);
}
.toolbar-btn:hover {
  background-color: rgba(0,105,255,.8);
}
input, textarea, select, button, pre {
  color:var(--fg);
  outline: none;
  background-color: var(--input-bg);
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius-smaller);
}
button {
  font-family: var(--font-regular);
}
/* Form Inputs */
pre,
select,
textarea,
input[type="file"],
input[type="text"],
input[type="password"] {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: calc(var(--font-size-mono) + 2px);
  transition: border .2s;
  padding: 4px 5px;
  line-height: calc(var(--font-size-regular) + 6px);
}
.tab-btn {
  border-radius: 0;
}
.request-param {
  color: #444;
}
.request-param:focus {
  color: var(--gray);
}
select {
  font-family: var(--font-regular);
  padding: 5px 30px 5px 5px;
  background-image: url(./images/select.svg);
  background-position: calc(100% - 5px) center;
  background-repeat: no-repeat;
  background-size: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}
select:hover {
  border-color: var(--lighter-gray);
}
textarea::placeholder,
input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: var(--placeholder-color);
  opacity:1;
}
select:focus,
textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
textarea:active,
input[type="text"]:active,
input[type="password"]:active {
  border:1px solid var(--lighter-gray);
}
input[type="file"]{
  font-family: var(--font-regular);
  padding:2px;
  cursor:pointer;
  border: 1px solid var(--lighter-gray);
  min-height: calc(var(--font-size-regular) + 18px);
}
input[type="file"]::-webkit-file-upload-button {
  font-family: var(--font-regular);
  font-size: var(--font-size-small);
  outline: none;
  cursor:pointer;
  padding: 3px 8px;
  border: 1px solid var(--lighter-gray);
  background-color: var(--lighter-gray);
  color: var(--primary-color-invert);
  border-radius: var(--border-radius);
  -webkit-appearance: none;
}
pre,
textarea {
  scrollbar-width: thin;
  scrollbar-color: var(--light-gray) var(--input-bg);
}
pre::-webkit-scrollbar,
textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
pre::-webkit-scrollbar-track,
textarea::-webkit-scrollbar-track {
  background:var(--input-bg);
}
pre::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb {
  border-radius: var(--border-radius-smaller);
  background-color: var(--light-gray);
}
.link {
  font-size:var(--font-size-small);
  text-decoration: underline;
  color:var(--blue);
  font-family:var(--font-mono);
  margin-bottom:2px;
}
input[type="checkbox"]:focus{
  outline:0;
}
/* Toggle Body */
input[type="checkbox"] {
  appearance: none;
  display: inline-block;
  background-color: var(--light-bg);
  border: 1px solid var(--light-bg);
  border-radius: var(--border-radius-bigger);
  cursor: pointer;
  height: 18px;
  position: relative;
  transition: border .25s .15s, box-shadow .25s .3s, padding .25s;
  min-width: 36px;
  width: 36px;
  vertical-align: top;
}
/* Toggle Thumb */
input[type="checkbox"]:after {
  position: absolute;
  background-color: var(--bg);
  border: 1px solid var(--light-bg);
  border-radius: var(--border-radius-bigger);
  content: '';
  top: 0px;
  left: 0px;
  right: 16px;
  display: block;
  height: 16px;
  transition: border .25s .15s, left .25s .1s, right .15s .175s;
}
/* Toggle Body - Checked */
input[type="checkbox"]:checked {
  box-shadow: inset 0 0 0 13px var(--lighter-green);
  border-color: var(--lighter-green);
}
/* Toggle Thumb - Checked*/
input[type="checkbox"]:checked:after {
  border: 1px solid var(--lighter-green);
  left: 16px;
  right: 1px;
  transition: border .25s, left .15s .25s, right .25s .175s;
}
`;
