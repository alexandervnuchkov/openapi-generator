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
.nav-bar {
  width: 230px;
  display:flex;
}
.main-content {
  margin:0;
  padding: 16px;
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
.header {
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
@media only screen and (min-width: 768px) {
  .only-large-screen{
    display:block;
  }
  .only-large-screen-flex{
    display:flex;
  }
}
`;
