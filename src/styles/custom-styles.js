import { css } from 'lit';

export default css`
.regular-font a:not(.logo-link,.anchor-param-constraint-font) {
  color:var(--blue);
  text-decoration: none;
  background-image: linear-gradient(var(--blue),var(--blue));
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0 1px;
  --link-color: var(--blue);
  --link-side-offset: 6px;
  --link-side-offset-hover: 9px;
  color: var(--blue);
  display: inline;
  outline: none;
  overflow-wrap: break-word;
  position: relative;
  transition: all .15s linear;
  z-index: 5;
}
.regular-font a:not(.logo-link,.anchor-param-constraint-font):hover {
  background-size: 100% 1px;
}
.copy-button {
  width: 16px;
  height: 16px;
  color: transparent;
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-image: url(./images/copy-button.svg);
  background-color: transparent;
  opacity: 1;
  position:absolute;
  top:12px;
  right:8px;
}
.copy-button:hover {
  background-color: transparent;
  background-image: url(./images/copy-button.svg);
  width: 16px;
  height: 16px;
  color: transparent;
}
.copy-button.text-copied,
.copy-button.text-copied:hover {
  background-image: url(./images/text-copied.svg);
}
.request-flex-inline {
  flex:1;
}
.full-width {
  width:100%;
}
.full-width-clear {
  width:100%;
  display:block;
  clear:both;
}
.json-disp-inline {
  display:inline;
}
.neg-lmargin {
  margin-left:-6px;
}
.disp-inline-block {
  display:inline-block;
}
.prim-color {
  color:var(--primary-color);
}
.key-dscr-pat {
  display:block;
  line-break:loose;
  margin-right:8px;
}
.key-dscr-pat.font-mono,
.font-mono {
  font-family: var(--font-mono);
}
.font-regl {
  font-family: var(--font-regular);
}
.font-red {
  color:var(--red);
}
.font-green {
  color:var(--green);
}
.header-uppr-level {
  background-color: #1E2126;
  padding:0 4px;
  min-height:63px;
}
.flex-align-cntr {
  align-items: center;
}
.blogo-style {
  height:94px;
  width:111px;
  margin-left:20px
}
.mlogo-style {
  height:94px;
  width:111px;
  margin-left:20px
}
.logo-link {
  display:flex;
  align-items:center;
  height:94px;
}
@media only screen and (max-width: 1000px) {
  .blogo-style,
  .mlogo-style,
  .logo-link {
    height: 36px;
  }
}
.header-cntnr {
  margin: 0px 20px 0 8px;
  display:flex;
  flex:1;
}
.fnt-size-small {
  font-size:var(--font-size-small);
}
.larrow-btn {
  margin: 6px 5px 0 -24px;
  font-size:var(--font-size-regular);
  cursor:pointer;
}
.mrgn-lft-10 {
  margin-left:10px;
}
.mx-wdth-130 {
  max-width:130px;
}
.btn-prim-large {
  margin-left:auto;
  height:40px;
  padding:10px 11px;
  font-size: 16px;
  border-radius:var(--border-radius-bigger);
  color: #fff;
  border-color: #fff;
}
.btn-prim-large:hover {
  background-color: transparent;
  color: #ededee;
  border-color: #ededee;
}
.top-gap{margin-top:16px;}
.jsn-nav {
  display:flex;
  line-height:22px;
  padding:8px;
}
.jsn-input {
  width:100%;
  height: 26px;
  padding-right:20px;
  color:var(--nav-hover-text-color);
  border-color:var(--nav-accent-color);
  background-color:var(--nav-hover-bg-color);
}
.jsn-larrow {
  margin: 6px 5px 0 -24px;
  font-size:var(--font-size-regular);
  cursor:pointer;
}
.jsn-schm-body {
  font-size:var(--font-size-regular);
}
.jsn-schm-section {
  display:flex;
  flex-direction: column;
  border:1px solid var(--light-gray);
  margin-bottom:32px;
  border-top: 5px solid var(--light-gray);
}
.jsn-schm-section-hdr {
  padding:16px;
  border-bottom: 1px solid var(--light-gray);
}
.jsn-schm-section-hdrname {
  font-size:var(--font-size-small);
  font-weight:bold;
}
.jsn-schm-tree {
  display:flex;
  flex-direction: row;
  gap:16px;
}
.jsn-schm-def {
  flex:1;
  padding:16px 0 16px 16px;
}
.jsn-schm-example {
  width:400px;
  background-color: var(--input-bg);
  padding:16px 0 16px 16px;
  border-left: 1px solid var(--light-gray);
}
.jsn-schm-example-select {
  min-width:100px;
  max-width:100%
}
.jsn-schm-example-summary {
  font-size: var(--font-size-small);
  font-weight:700;
  margin:5px 0;
}
.jsn-schm-err {
  display:flex;
  align-items:center;
  border:1px solid var(--light-gray);
  height:42px;
  padding:5px;
  font-size:var(--font-size-small);
  color:var(--red);
  font-family:var(--font-mono);
}
.jsn-schm-slot {
  margin:24px;
  text-align: center;
}
.jsn-schm-fail {
  text-align: center;
  margin: 16px;
}
.reference-heading {
  font-size: 30px;
  padding: 20px 36px 24px;
  margin-bottom: 40px;
  border-top: 1px solid var(--lightest-gray);
  border-bottom: 1px solid var(--lightest-gray);
}
.main-title {
  font-size:32px;
}
.api-version {
  font-size:var(--font-size-small);
  font-weight:bold
}
.api-info {
  font-size:calc(var(--font-size-regular) - 1px);
  margin-top:8px;
}
.ovrview-dwnld {
  display:flex;
  margin:12px 0;
  gap:8px;
  justify-content: start;
}
.ovrview-dwnld-btn {
  width:auto;
}
.no-border {
  border:none;
}
.vert-middle {
  vertical-align: middle;
}
.sctn-servers {
  text-align:left;
  direction:ltr;
  margin-top:24px;
  margin-bottom:24px;
}
.sctn-servers-list {
  margin: 12px 0;
  font-size:calc(var(--font-size-small) + 1px);
}
.sctn-servers-input {
  margin:4px 0;
  cursor:pointer;
}
.cpointer {
  cursor:pointer;
}
.oth-flw {
  padding: 12px 0;
  margin-bottom:12px;
}
.mbottom-8 {
  margin-bottom:8px;
}
.mbottom-5 {
  margin-bottom:5px;
}
.oth-url {
  width:75px;
  display: inline-block;
}
.oth-scps {
  width:100%;
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
  margin:0 0 10px 24px;
}
.oth-scps-chbx {
  display:inline-flex;
  align-items:center
}
.oth-scps-chbx-lbl {
  margin-left:5px;
  cursor:pointer
}
.oth-psw-blk {
  margin:5px 0;
}
.oth-psw-input {
  margin:0 5px;
}
.oth-code {
  margin: 16px 0 4px;
}
.oth-code-label {
  margin:0 16px 0 4px;
  line-height:24px;
  cursor:pointer;
}
.oauth-client-secret {
  margin:0 5px;
}
.oauth-send-client-secret-in {
  margin-right:5px;
}
.auth-subhdr {
  display:flex;
  align-items: center;
  min-height:30px;
}
.allow-no-try .auth-subhdr,
.allow-no-try #auth-table {
  display: none;
}
.auth-hdr2 {
  line-height:28px;
  margin-bottom:5px;
}
.auth-hdr2-span {
  font-weight:bold;
  font-size:var(--font-size-regular);
}
.auth-npt {
  max-height:30px;
}
.auth-nptfld {
  vertical-align: top;
}
.auth-btn {
  vertical-align: top;
  margin-left:5px;
}
.auth-errr {
  font-size::var(--font-size-small);
}
.oth2-table {
  border:none;
  padding-left:48px;
}
.oth2-insection {
  position:absolute;
  top:3px;
  right:2px;
  font-size:var(--font-size-small);
  line-height: 1.5;
}
.oth2-ins-block {
  position:relative;
  display:flex;
  min-width:350px;
  max-width:700px;
  justify-content: flex-end;
}
.oth2-btip {
  padding:3px 4px;
}
.oth2-state {
  padding:2px 4px;
  white-space:nowrap;
  text-overflow:ellipsis;
  max-width:200px;
  overflow:hidden;
}
.oth2-ttip {
  position:absolute;
  color: var(--fg);
  top:26px;
  right:0;
  border:1px solid var(--light-gray);
  padding:2px 8px;
  display:block;
}
.mleft-8 {
  margin-left:8px;
}
.oth2-ttext {
  font-family:var(--font-mono);
  color:var(--primary-color);
}
.sowm {
  text-align:left;
  direction:ltr;
  width: 100%;
  color:var(--fg3);
  background-color: var(--lightest-gray);
  border-radius: var(--border-radius);
  padding: 0 6px;
  margin: 8px 0 16px;
}
.oper-meth-label {
  padding:12px 6px;
  display: inline-block;
  white-space: nowrap;
}
.oper-path-label {
  padding:12px 6px;
  display: inline-block;
  white-space: nowrap;
}
`;
