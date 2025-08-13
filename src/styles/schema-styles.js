import { css } from 'lit';

export default css`
*, *:before, *:after { box-sizing: border-box; }
.tr {
  display: flex;
  flex: none;
  width: 100%;
  box-sizing: content-box;
  border-bottom: 1px solid transparent;
}
.td {
  display: block;
  flex: 0 0 auto;
}
.key {
  font-family: var(--font-mono);
  white-space: normal;
  word-break: break-word;
}
.collapsed-descr .key{
  overflow:hidden;
}
.key-descr {
  font-family:var(--font-regular);
}
.expanded-descr .key-descr{
  max-height:auto;
}
.collapsed-descr .tr {
  max-height:20px;
}
.xxx-of-key {
  font-size: calc(var(--font-size-small) - 2px);
  font-weight:bold;
  background-color:var(--light-red);
  color:var(--lighter-red);
  border-radius:var(--border-radius-smaller);
  line-height:calc(var(--font-size-regular) + 6px);
  padding:0px 5px;
  margin-bottom:1px;
  display:inline-block;
}
.xxx-of-descr {
    font-family: var(--font-regular);
    color: var(--primary-color);
    font-size: calc(var(--font-size-small) - 1px);
    margin-left: 2px;
}
.stri, .string, .uri, .url, .byte, .bina, .date, .pass, .ipv4, .uuid, .emai, .host {color: var(--lighter-green);}
.inte, .numb, .number, .int6, .int3, .int, .floa, .doub, .deci .blue {color:var(--lighter-blue-add);}
.null {color:var(--lighter-red);}
.bool, .boolean{color:var(--lighter-pink)}
.enum {color:var(--lighter-orange)}
.recu {color:var(--lighter-gray)}
.toolbar {
  display:flex;
  width:100%;
  padding: 2px 0;
  color:var(--primary-color);
}
.toolbar-item {
  cursor:pointer;
  padding:5px 0;
  margin:0 2px;
}
.schema-root-type {
  cursor:auto;
  color:var(--fg2);
  font-weight: bold;
  text-transform: capitalize;
}
.schema-root-type.xxx-of {
  display:none;
}
.toolbar-item:first-of-type { margin:0 2px 0 0;}
`;
