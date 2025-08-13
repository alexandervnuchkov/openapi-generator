import { css } from 'lit';

export default css`
.tree {
  font-size:var(--font-size-regular);
  text-align: left;
  direction: ltr;
  line-height:calc(var(--font-size-regular) + 6px);
}
.tree .tr:hover{
  background-color:var(--hover-color);
}
.collapsed-descr .tr {
  max-height:calc(var(--font-size-regular) + 6px);
}
.collapsed-descr .m-markdown-small p {
  line-height:calc(var(--font-size-regular) + 6px);
}
.tree .key {
  max-width: 300px;
}
.key.deprecated .key-label {
  color: var(--red);
}
.tr.expanded:hover > .td.key > .open-bracket {
  color: var(--primary-color);
}
.tr.expanded:hover + .inside-bracket {
  border-left: 1px solid var(--fg3);
}
.tr.expanded:hover + .inside-bracket + .close-bracket {
  color: var(--primary-color);
}
.open-bracket{
  display:inline-block;
  padding: 0 20px 0 0;
  cursor:pointer;
  border: 1px solid transparent;
  border-radius:var(--border-radius-smaller);
  color: #fff;
}
.open-bracket:hover {
  color:var(--primary-color);
  background-color:#8e9092;
  border: 1px solid var(--light-gray);
}
.close-bracket{
  display:inline-block;
  font-family: var(--font-mono);
}
.tr.collapsed + .inside-bracket,
.tr.collapsed + .inside-bracket + .close-bracket{
  display:none;
}
.inside-bracket.object,
.inside-bracket.array {
  border-left: 1px solid var(--light-gray);
}
.inside-bracket.xxx-of {
  padding:5px 0px;
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color:var(--primary-color);
}
`;
