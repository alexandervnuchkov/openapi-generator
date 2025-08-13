import { css } from 'lit';

export default css`
.nav-bar {
  width:0;
  height:100%;
  overflow: hidden;
  color:var(--nav-text-color);
  background-color: var(--nav-bg-color);
  background-blend-mode: multiply;
  line-height: var(--font-size-small);
  display:none;
  position:relative;
  flex-direction:column;
  flex-wrap:nowrap;
  word-break:break-word;
  border-right: 2px solid #f2f2f2;
}
::slotted([slot=nav-logo]){
  padding:16px 16px 0 16px;
}
.nav-scroll {
  overflow-x: hidden;
  overflow-y: auto;
  overflow-y: overlay;
  scrollbar-width: thin;
  scrollbar-color: var(--nav-hover-bg-color) transparent;
}
.nav-bar-tag-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  min-height: 26px;
}
.nav-bar-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  min-height: 26px;
}
.nav-bar-tag-icon {
  width: 26px;
  height: 26px;
}
.nav-bar-tag-icon:hover {
  color:var(--nav-hover-text-color);
}
.nav-bar .nav-bar-tag-and-paths.collapsed .nav-bar-paths-under-tag {
  display:none;
}
.nav-bar .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon::after,
.nav-bar .nav-bar-tag-and-paths.expanded .nav-bar-tag-icon::after {
  background-image: url(./images/expand.svg);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 16px 16px;
  content: '';
  width:26px;
  height:26px;
  text-align: center;
  display: inline-block;
  transition: transform 0.2s ease-out 0s;
}
.nav-bar .nav-bar-tag-and-paths.expanded .nav-bar-tag-icon::after {
  transform: rotate(90deg);
}
.nav-scroll::-webkit-scrollbar {
  width: var(--scroll-bar-width, 8px);
}
.nav-scroll::-webkit-scrollbar-track {
  background:transparent;
}
.nav-scroll::-webkit-scrollbar-thumb {
  background-color: var(--nav-hover-bg-color);
}
.nav-bar-tag-wrapper {
  font-size: var(--font-size-small);
  color: var(--nav-text-color);
  border-left:4px solid transparent;
  padding: 0 12px;
}
.nav-bar-tag-and-paths.expanded .nav-bar-tag,
.nav-bar-tag-and-paths.collapsed .nav-bar-tag {
  text-transform: capitalize;
}
.nav-bar-components,
.nav-bar-h1,
.nav-bar-h2,
.nav-bar-info,
.nav-bar-tag-wrapper,
.nav-bar-path {
  display:flex;
  cursor:pointer;
  border-left:4px solid transparent;
  text-decoration: none;
}
.nav-bar-info,
.nav-bar-h2,
.nav-bar-path {
  color: var(--nav-text-color);
}
.nav-bar-h1,
.nav-bar-h2 {
  font-size: var(--font-size-small);
  padding: var(--nav-item-padding);
}
.nav-bar-path {
  font-size: var(--font-size-small);
  padding: 4px 10px 4px 20px;
}
.nav-bar-path.small-font {
  font-size: var(--font-size-small);
}
.nav-bar-info {
  font-size: var(--font-size-small);
  padding: 10px 12px;
  font-weight:bold;
}
.nav-bar-section {
  display: flex;
  flex-direction: row;
  justify-content: left;
  font-size: var(--font-size-small);
  color: var(--nav-text-color);
  padding: 10px 5px;
  font-weight:bold;
}
.nav-bar-section:first-child {
  display: none;
}
.nav-bar-h2 {padding-left:12px;}
.nav-bar-h1.active,
.nav-bar-h2.active,
.nav-bar-info.active,
.nav-bar-tag-wrapper.active,
.nav-bar-path.active {
  color:var(--nav-hover-text-color);
  background-color: var(--lightest-gray);
}
.nav-bar-info.active#link-overview {
  background-color: transparent;
}
.nav-bar-h1:hover,
.nav-bar-h2:hover,
.nav-bar-info:hover,
.nav-bar-tag-wrapper:hover,
.nav-bar-path:hover {
  color:var(--nav-hover-text-color);
  background-color: var(--lightest-gray);
}
.navbar-srch {
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:stretch;
  padding:4px 24px 6px 24px;
}
.navbar-srch-adv {
  display:flex;
  flex:1;
  line-height:22px;
}
.navbar-srch-input {
  width:100%;
  padding-right:20px;
  color:var(--nav-hover-text-color);
  border-color:var(--nav-accent-color);
  background-color:var(--nav-hover-bg-color);
}
.navbar-srch-larrow {
  margin: 6px 5px 0 -24px;
  font-size:var(--font-size-regular);
  cursor:pointer;
}
.navbar-srch-btn {
  margin-left:5px;
  color:var(--nav-text-color);
  width:75px;
  padding:6px 8px;
}
.navbar-srch-btn-add {
  margin-left:5px;
}
.navbar-hr {
  border:none;
  border-top: 1px solid var(--lightest-gray);
  margin:10px 0;
}
.navbar-oprtns {
  font-size:16px;
  display:flex;
  margin-left:10px;
}
.navbar-oprtns-exp {
  transform: rotate(90deg);
  cursor:pointer;
  margin-right:10px;
}
.navbar-oprtns-col {
  transform: rotate(270deg);
  cursor:pointer;
}
.navbar-pths {
  display:flex;
  align-items:center;
  width: 100%;
}
.navbar-pths-whook {
  font-weight:bold;
  margin-right:8px;
  font-size: calc(var(--font-size-small) - 2px);
}
.navbar-seealso {
  margin-top:10px;
  cursor:default;
  padding-top:10px;
  border-top:1px solid var(--lightest-gray);
}
.navbar-seealso:hover {
  background-color: transparent;
}
.navbar-sls-block {
  padding-bottom:20px;
}
.navbar-sls-block .nav-bar-h2 {
  text-decoration:none;
  color:var(--gray);
}
`;
