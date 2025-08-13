import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';

export function setApiServer(serverUrl) {
  const serverObj = this.resolvedSpec?.servers.find((s) => s.url === serverUrl);
  if (!serverObj) {
    return false;
  }
  this.selectedServer = serverObj;
  this.requestUpdate();
  this.dispatchEvent(new CustomEvent('api-server-change', {
    bubbles: true,
    composed: true,
    detail: {
      selectedServer: serverObj,
    },
  }));
  return true;
}

function onApiServerVarChange(e, serverObj) {
  const inputEls = [...e.currentTarget.closest('table').querySelectorAll('input, select')];
  let tempUrl = serverObj.url;
  inputEls.forEach((v) => {
    const regex = new RegExp(`{${v.dataset.var}}`, 'g');
    tempUrl = tempUrl.replace(regex, v.value);
  });
  serverObj.computedUrl = tempUrl;
  this.requestUpdate();
}

/* eslint-disable indent */
function serverVarsTemplate() {
  // const selectedServerObj = this.resolvedSpec.servers.find((v) => (v.url === this.selectedServer));
  return this.selectedServer && this.selectedServer.variables
    ? html`
    <div class="table-title"> SERVER VARIABLES</div>
    <table class='m-table'>
      ${Object.entries(this.selectedServer.variables).map((kv) => html`
        <tr>
          <td class="vert-middle">${kv[0]}</td>
          <td>
            ${kv[1].enum
            ? html`
            <select
              data-var = "${kv[0]}"
              @input = ${(e) => { onApiServerVarChange.call(this, e, this.selectedServer); }}
            >
            ${Object.entries(kv[1].enum).map((e) => (kv[1].default === e[1]
              ? html`
              <option
                selected
                label = ${e[1]}
                value = ${e[1]}
              />`
              : html`
              <option
                label = ${e[1]}
                value = ${e[1]}
              />`
            ))}
            </select>`
            : html`
            <input
              type = "text"
              part="textbox textbox-server-var"
              spellcheck = "false"
              data-var = "${kv[0]}"
              value = "${kv[1].default}"
              @input = ${(e) => { onApiServerVarChange.call(this, e, this.selectedServer); }}
            />`}
          </td>
        </tr>
        ${kv[1].description
          ? html`<tr><td colspan="2" class="no-border"><span class="m-markdown-small"> ${unsafeHTML(marked(kv[1].description))} </span></td></tr>`
          : ''
        }
      `)}
    </table>
    `
    : '';
}

export default function serverTemplate() {
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) { return ''; }
  return html`
  <section id='servers' part="section-servers" class='sctn-servers regular-font observe-me ${'read focused'.includes(this.renderStyle) ? 'section-gap--read-mode' : 'section-gap'}'>
    <div part="section-servers-title" class="sub-title">API servers</div>
    <div class='mono-font sctn-servers-list'>
      ${this.allowServerSelection === 'true'
        ? html`
          ${!this.resolvedSpec.servers || this.resolvedSpec.servers?.length === 0
            ? ''
            : html`
              ${this.resolvedSpec?.servers.map((server, i) => html`
                <input type = 'radio'
                  name = 'api_server'
                  id = 'srvr-opt-${i}'
                  value = '${server.url}'
                  @change = ${() => { setApiServer.call(this, server.url); }}
                  .checked = '${this.selectedServer.url === server.url}'
                  class = 'sctn-servers-input'
                />
                  <label class='cpointer' for='srvr-opt-${i}'>
                    ${server.url} ${server.description ? html`- <span class='regular-font'>${server.description} </span>` : ''}
                  </label>
                <br/>
              `)}
          `}
        <div class="table-title primary-text" part="label-selected-server"> SELECTED: ${this.selectedServer?.computedUrl || 'none'}</div>`
    : html`
    ${!this.resolvedSpec.servers || this.resolvedSpec.servers?.length === 0
      ? ''
      : html`
        ${this.resolvedSpec?.servers.map((server) => html`
          <p class="m-markdown"><code>${server.url}</code> ${server.description ? html`- <span class='regular-font'>${server.description}</span>` : ''}
        `)}
      `}`
    }
    </div>
    <slot name="servers"></slot>
    ${serverVarsTemplate.call(this)}
  </section>`;
}
/* eslint-enable indent */
