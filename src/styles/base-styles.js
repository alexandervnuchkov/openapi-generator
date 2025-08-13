import { css } from 'lit';

export default css`
:host {
  display:flex;
  flex-direction: column;
  min-width:360px;
  width:100%;
  height:100%;
  margin:0;
  padding:0;
  overflow: hidden;
  letter-spacing:normal;
  color:var(--fg);
  background-color:var(--bg);
  font-family:var(--font-regular);
}
.body {
  display:flex;
  height:100%;
  width:100%;
  overflow:hidden;
}
.main-content {
  margin:0;
  padding: 0;
  display:block;
  flex:1;
  height:100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--light-gray) transparent;
}
.main-content-inner--view-mode {
  padding: 0 8px;
}
.main-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.main-content::-webkit-scrollbar-track {
  background:transparent;
}
.main-content::-webkit-scrollbar-thumb {
  background-color: var(--light-gray);
}
.section-gap.section-tag {
  border-bottom:1px solid var(--light-gray);
}
.section-gap,
.section-gap--focused-mode,
.section-gap--read-mode {
  padding: 24px 20px;
}
.section-tag-header {
  position:relative;
  cursor: n-resize;
  padding: 12px 0;
}
.collapsed .section-tag-header:hover{
  cursor: s-resize;
}
.section-tag-header:hover{
  background-image: linear-gradient(to right, rgba(0,0,0,0), var(--light-gray), rgba(0,0,0,0));
}
.section-tag-header:hover::after {
  position:absolute;
  margin-left:-24px;
  font-size:20px;
  top: calc(50% - 14px);
  color:var(--primary-color);
  content: '⬆';
}
.collapsed .section-tag-header::after {
  position:absolute;
  margin-left:-24px;
  font-size:20px;
  top: calc(50% - 14px);
  color: var(--light-gray);
  content: '⬇';
}
.collapsed .section-tag-header:hover::after {
  color:var(--primary-color);
}
.collapsed .section-tag-body {
  display:none;
}
.logo {
  height:36px;
  width:36px;
  margin-left:5px;
}
.only-large-screen-flex,
.only-large-screen{
  display:none;
}
.tag.title,
.tag.list-tag {
  text-transform: capitalize;
}
.main-header {
  background-color:var(--header-bg);
  color:var(--header-fg);
  width:100%;
}
.header-title {
  font-size:calc(var(--font-size-regular) + 8px);
  padding:0 8px;
}
input.header-input{
  background:var(--header-color-darker);
  color:var(--header-fg);
  border:1px solid var(--header-color-border);
  flex:1;
  padding-right:24px;
  border-radius:var(--border-radius-smaller);
}
input.header-input::placeholder {
  opacity:0.4;
}
.loader {
  margin-top: calc(50vh - 18px);
  margin-left: auto;
  margin-right: auto;
  margin-bottom: auto;
  border: 4px solid var(--bg3);
  border-radius: 50%;
  border-top: 4px solid var(--lighter-red);
  width: 36px;
  height: 36px;
  animation: spin 2s linear infinite;
}
.expanded-endpoint-body{
  position: relative;
  padding: 6px 0px;
}
.expanded-endpoint-body.deprecated{ filter:opacity(0.6); }
.divider {
  border-top: 1px solid var(--lightest-gray);
  margin: 24px 0;
  width:100%;
  clear: both;
}
.tooltip {
  cursor:pointer;
  border: 1px solid var(--light-gray);
  border-left-width: 4px;
  margin-left:2px;
}
.tooltip a {
  color: var(--fg2);
  text-decoration: none;
}
.tooltip-text {
  color: var(--fg2);
  max-width: 400px;
  position: absolute;
  z-index:1;
  background-color: var(--bg2);
  visibility: hidden;
  overflow-wrap: break-word;
}
.tooltip:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}
.tooltip:hover a:hover {
  color: var(--primary-color);
}
.tooltip:hover .tooltip-text {
  visibility: visible;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.nav-method { font-weight: bold; margin-right: 4px; font-size: calc(var(--font-size-small) - 2px); white-space: nowrap; }
.nav-method.false { display: none; }
.nav-method.as-colored-text.get { color:var(--nav-get-color); }
.nav-method.as-colored-text.put { color:var(--nav-put-color); }
.nav-method.as-colored-text.post { color:var(--nav-post-color); }
.nav-method.as-colored-text.delete { color:var(--nav-delete-color); }
.nav-method.as-colored-text.head, .nav-method.as-colored-text.patch, .nav-method.as-colored-text.options { color:var(--nav-head-color); }
.nav-method.as-colored-block {
  font-size: 10px;
  font-weight: bold;
  border-radius: var(--border-radius-smaller);
  display: inline-block;
  margin-left: auto;
  padding: 3px 4px;
  text-align: center;
  line-height: calc(var(--font-size-small) - 2px);
  white-space: nowrap;
  align-self: start;
}
.nav-method.as-colored-block.get { background-color: var(--light-blue-add);color: var(--lighter-blue-add); }
.nav-method.as-colored-block.put { background-color: var(--light-yellow); color: var(--lighter-yellow); }
.nav-method.as-colored-block.post { background-color: var(--light-green);color: var(--lighter-green); }
.nav-method.as-colored-block.delete { background-color: var(--light-red); color: var(--lighter-red); }
.nav-method.as-colored-block.head, .nav-method.as-colored-block.patch , .nav-method.as-colored-block.options {
  background-color: var(--light-pink); color: var(--lighter-pink);
}
.classlist-method {font-weight: 600;}
.classlist-method.get { color: var(--lighter-blue-add); }
.classlist-method.put { color: var(--lighter-yellow); }
.classlist-method.post { color: var(--lighter-green); }
.classlist-method.delete { color: var(--lighter-red); }
.classlist-method.head, .classlist-method.patch , .classlist-method.options { color: var(--lighter-pink);
}
.m-markdown img {
  width: 1000px;
  max-width: 100%;
  background: linear-gradient(0deg,hsla(0,0%,100%,.04),hsla(0,0%,100%,.04)),rgba(30,33,38,.04);
  border-radius: var(--border-radius);
  padding: 16px;
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
@media only screen and (min-width: 768px) {
  .nav-bar {
    width: 260px;
    display:flex;
  }
  .only-large-screen{
    display:block;
  }
  .only-large-screen-flex{
    display:flex;
  }
  .section-gap {
    padding: 0 0 0 24px;
  }
  .section-gap--focused-mode {
    padding: 24px 20px;
  }
  .section-gap--read-mode {
    padding: 24px 20px;
  }
  .endpoint-body {
    position: relative;
    padding:36px 0 48px 0;
  }
}
@media only screen and (min-width: 1024px) {
  .nav-bar {
    width: 300px;
    display:flex;
  }
  .section-gap--focused-mode {
    padding: 12px 80px 12px 80px;
  }
  .section-gap--read-mode {
    padding: 20px 36px 36px;
  }
  .section-gap--read-mode.sctn-tag-gap {
    padding-top: 30px;
    border-top: 1px solid var(--lightest-gray);
  }
  div.observe-me + .section-gap--read-mode.sctn-tag-gap {
    border-top: 0;
  }
}
`;
