import { css } from 'lit';

export default css`
:host{
  display:flex;
}
.json-tree {
  position: relative;
  font-family: var(--font-mono);
  font-size: calc(var(--font-size-mono) + 2px);
  display:block;
  overflow:hidden;
  word-break: break-all;
  flex:1;
  line-height: calc(var(--font-size-regular) + 6px);
  direction: ltr;
  text-align: left;
  min-height: 40px;
}
.json-tree div::selection,
.json-tree div span::selection {
/*  background-color: #ededee;
  color: var(--lighter-gray);*/
  background-color: var(--lighter-gray);
  color: #ededee;
}
.open-bracket {
  display:inline-block;
  padding: 0 20px 0 0;
  cursor:pointer;
  border: 1px solid transparent;
  border-radius:var(--border-radius-smaller);
  /*color: #fff;*/
  color: var(--fg);
}
.close-bracket {
  border: 1px solid transparent;
  border-radius:var(--border-radius-smaller);
  display:inline-block;
  /*color: #fff;*/
  color: var(--fg);
}
.open-bracket:hover {
  color:var(--primary-color);
  background-color:#8e9092;
  border: 1px solid var(--light-gray);
}
.open-bracket.expanded:hover ~ .inside-bracket {
  border-left: 1px solid var(--fg3);
}
.open-bracket.expanded:hover ~ .close-bracket {
  color:var(--primary-color);
}
.inside-bracket{
  padding-left:12px;
  border-left:1px solid var(--light-gray);
  /*color: #7FE8FF;*/
  color: #36acaa;
}
.open-bracket.collapsed + .inside-bracket,
.open-bracket.collapsed + .inside-bracket + .close-bracket {
  display:none;
}
.string{/*color: var(--green);*/color: #e3116c;}
.number{/*color:var(--blue);*/color: #36acaa;}
.null{color:var(--red);}
.boolean{/*color:var(--purple);*/color: #36acaa;}
.object{/*color:#fff;*/color:var(--fg);}
.toolbar {
  position: absolute;
  top:5px;
  right:6px;
  display:flex;
  padding:2px;
  align-items: center;
}
`;
