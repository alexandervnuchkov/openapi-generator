import { LitElement, html } from 'lit';
import { copyToClipboard } from '~/utils/common-utils';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import InputStyles from '~/styles/input-styles';
import JsonTreeStyles from '~/styles/json-tree-styles';
import CustomStyles from '~/styles/custom-styles';

export default class JsonTree extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      renderStyle: { type: String, attribute: 'render-style' },
    };
  }

  static get styles() {
    return [
      FontStyles,
      BorderStyles,
      InputStyles,
      JsonTreeStyles,
      CustomStyles,
    ];
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class = "json-tree" >
        <div class='toolbar'>
          <button class="toolbar-btn copy-button" part="btn btn-fill btn-copy" @click='${(e) => { copyToClipboard(JSON.stringify(this.data, null, 2), e); }}'> Copy </button>
        </div>
        ${this.generateTree(this.data, true)}
      </div>
    `;
  }

  generateTree(data, isLast = false) {
    if (data === null) {
      return html`<div class="null json-disp-inline">null</div>`;
    }
    if (typeof data === 'object' && (data instanceof Date === false)) {
      const detailType = Array.isArray(data) ? 'array' : 'pure_object';
      if (Object.keys(data).length === 0) {
        return html`${(Array.isArray(data) ? '[ ],' : '{ },')}`;
      }
      return html`
      <div class="open-bracket expanded ${detailType === 'array' ? 'array' : 'object'} " @click="${this.toggleExpand}" > ${detailType === 'array' ? '[' : '{'}</div>
      <div class="inside-bracket">
        ${Object.keys(data).map((key, i, a) => html`
          <div class="item">
            ${detailType === 'pure_object' ? html`"${key}":` : ''}
            ${this.generateTree(data[key], i === (a.length - 1))}
          </div>`)
        }
      </div>
      <div class="close-bracket">${detailType === 'array' ? ']' : '}'}${isLast ? '' : ','}</div>
      `;
    }

    return (typeof data === 'string' || data instanceof Date)
      ? html`<span class="${typeof data}">"${data}"</span>${isLast ? '' : ','}`
      : html`<span class="${typeof data}">${data}</span>${isLast ? '' : ','}`;
  }
  /* eslint-enable indent */

  toggleExpand(e) {
    const openBracketEl = e.target;
    if (openBracketEl.classList.contains('expanded')) {
      openBracketEl.classList.replace('expanded', 'collapsed');
      e.target.innerHTML = e.target.classList.contains('array') ? '[...]' : '{...}';
    } else {
      openBracketEl.classList.replace('collapsed', 'expanded');
      e.target.innerHTML = e.target.classList.contains('array') ? '[' : '{';
    }
  }
}
// Register the element with the browser
customElements.define('json-tree', JsonTree);
