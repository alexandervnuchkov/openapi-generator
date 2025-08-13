import { css } from 'lit';

export default css`
.tags{
  display:flex;
  flex-wrap: wrap;
  outline: none;
  padding:0;
  border-radius:var(--border-radius);
  border:1px solid var(--light-gray);
  cursor:text;
  overflow:hidden;
  background:var(--input-bg);
}
.tag, .editor {
  padding:3px;
  margin:2px;
}
.tag{
  border:1px solid var(--light-gray);
  background-color:var(--bg3);
  color:var(--fg3);
  border-radius:var(--border-radius);
  word-break: break-all;
  font-size: var(--font-size-small);
}
.tag:hover ~ #cursor {
  display: block;
}
.editor{
  flex:1;
  border:1px solid transparent;
  color:var(--fg);
  min-width:60px;
  outline: none;
  line-height: inherit;
  font-family:inherit;
  background:transparent;
  font-size: var(--font-size-regular);
}
.editor::placeholder {
  color: var(--placeholder-color);
  opacity:1;
}
`;
