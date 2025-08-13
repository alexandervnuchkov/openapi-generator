import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import FontStyles from '~/styles/font-styles';
import SchemaStyles from '~/styles/schema-styles';
import SchemaTreeStyles from '~/styles/schema-tree-styles';
import BorderStyles from '~/styles/border-styles';
import CustomStyles from '~/styles/custom-styles';

export default class SchemaTree extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true false'.includes(this.schemaDescriptionExpanded)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.schemaHideReadOnly || !'true false'.includes(this.schemaHideReadOnly)) { this.schemaHideReadOnly = 'true'; }
    if (!this.schemaHideWriteOnly || !'true false'.includes(this.schemaHideWriteOnly)) { this.schemaHideWriteOnly = 'true'; }
  }

  static get styles() {
    return [
      FontStyles,
      SchemaStyles,
      BorderStyles,
      SchemaTreeStyles,
      CustomStyles,
    ];
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class="tree ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : 'collapsed-descr'}">
        <div class="toolbar">
          <div class="toolbar-item schema-root-type ${this.data?.['::type'] || ''} "> ${this.data?.['::type'] || ''} </div>
          ${this.allowSchemaDescriptionExpandToggle === 'true'
            ? html`
              <div class="request-flex-inline"></div>
              <div part="schema-toolbar-item schema-multiline-toggle" class='toolbar-item' @click='${() => { this.schemaDescriptionExpanded = (this.schemaDescriptionExpanded === 'true' ? 'false' : 'true'); }}'>
                ${this.schemaDescriptionExpanded === 'true' ? 'Single line description' : 'Multiline description'}
              </div>
            `
            : ''
          }
        </div>
        ${this.data?.['::description']
          ? html`<span part="schema-description" class='m-markdown'> ${unsafeHTML(marked(this.data['::description'] || ''))}</span>`
          : ''
        }
        ${this.data
          ? html`
            ${this.generateTree(
              this.data['::type'] === 'array' ? this.data['::props'] : this.data,
              this.data['::type'],
              this.data['::array-type'] || '',
            )}`
          : html`<span class='mono-font font-red'> Schema not found </span>`
        }
      </div>
    `;
  }

  generateTree(data, dataType = 'object', arrayType = '', key = '', description = '', schemaLevel = 0, indentLevel = 0, readOrWrite = '') {
    if (this.schemaHideReadOnly === 'true') {
      if (dataType === 'array') {
        if (readOrWrite === 'readonly') {
          return;
        }
      }
      if (data && data['::readwrite'] === 'readonly') {
        return;
      }
    }
    if (this.schemaHideWriteOnly === 'true') {
      if (dataType === 'array') {
        if (readOrWrite === 'writeonly') {
          return;
        }
      }
      if (data && data['::readwrite'] === 'writeonly') {
        return;
      }
    }

    if (!data) {
      return html`<div class="null json-disp-inline">
        <span class="key-label xxx-of-key"> ${key.replace('::OPTION~', '')}</span>
        ${
          dataType === 'array'
            ? html`<span class='mono-font'> [ ] </span>`
            : dataType === 'object'
              ? html`<span class='mono-font'> { } </span>`
              : html`<span class='mono-font'> schema undefined </span>`
        }
      </div>`;
    }
    if (Object.keys(data).length === 0) {
      return html`<span class="key object">${key}:{ }</span>`;
    }
    let keyLabel = '';
    let keyDescr = '';
    if (key.startsWith('::ONE~OF') || key.startsWith('::ANY~OF')) {
      keyLabel = key.replace('::', '').replace('~', ' ');
    } else if (key.startsWith('::OPTION')) {
      const parts = key.split('~');
      keyLabel = parts[1]; // eslint-disable-line prefer-destructuring
      keyDescr = parts[2]; // eslint-disable-line prefer-destructuring
    } else {
      keyLabel = key;
    }

    const leftPadding = 12;
    const minFieldColWidth = 400 - (indentLevel * leftPadding);
    let openBracket = '';
    let closeBracket = '';
    const newSchemaLevel = data['::type']?.startsWith('xxx-of') ? schemaLevel : (schemaLevel + 1);
    // const newIndentLevel = dataType === 'xxx-of-option' || data['::type'] === 'xxx-of-option' ? indentLevel : (indentLevel + 1);
    const newIndentLevel = dataType === 'xxx-of-option' || data['::type'] === 'xxx-of-option' || key.startsWith('::OPTION') ? indentLevel : (indentLevel + 1);
    if (data['::type'] === 'object') {
      if (dataType === 'array') {
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket array-of-object" @click="${this.toggleObjectExpand}">[{</span>`;
        } else {
          openBracket = html`<span class="open-bracket array-of-object" @click="${this.toggleObjectExpand}">[{...}]</span>`;
        }
        closeBracket = '}]';
      } else {
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket object" @click="${this.toggleObjectExpand}">{</span>`;
        } else {
          openBracket = html`<span class="open-bracket object" @click="${this.toggleObjectExpand}">{...}</span>`;
        }
        closeBracket = '}';
      }
    } else if (data['::type'] === 'array') {
      if (dataType === 'array') {
        const arrType = arrayType !== 'object' ? arrayType : '';
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket array-of-array" data-array-type="${arrType}" @click="${this.toggleObjectExpand}">[[ ${arrType} </span>`;
        } else {
          openBracket = html`<span class="open-bracket array-of-array"  data-array-type="${arrType}" @click="${this.toggleObjectExpand}">[[...]]</span>`;
        }
        closeBracket = ']]';
      } else {
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket array" @click="${this.toggleObjectExpand}">[</span>`;
        } else {
          openBracket = html`<span class="open-bracket array" @click="${this.toggleObjectExpand}">[...]</span>`;
        }
        closeBracket = ']';
      }
    }
    if (typeof data === 'object') {
      return html`
        <div class="tr ${schemaLevel < this.schemaExpandLevel || data['::type']?.startsWith('xxx-of') ? 'expanded' : 'collapsed'} ${data['::type'] || 'no-type-info'}" title="${data['::deprecated'] ? 'Deprecated' : ''}">
          <div class="td key ${data['::deprecated'] ? 'deprecated' : ''}" style='min-width:${minFieldColWidth}px'>
            ${data['::type'] === 'xxx-of-option' || data['::type'] === 'xxx-of-array' || key.startsWith('::OPTION')
              ? html`<span class='key-label xxx-of-key'>${keyLabel}</span><span class="xxx-of-descr">${keyDescr}</span>`
              : keyLabel === '::props' || keyLabel === '::ARRAY~OF'
                ? ''
                : schemaLevel > 0
                  ? html`<span class="key-label" title="${readOrWrite === 'readonly' ? 'read-only' : readOrWrite === 'writeonly' ? 'write-only' : ''}">
                    ${data['::deprecated'] ? '✗' : ''}
                    ${keyLabel.replace(/\*$/, '')}${keyLabel.endsWith('*') ? html`<span class="param-required">required</span>` : ''}${readOrWrite === 'readonly' ? html` 🆁` : readOrWrite === 'writeonly' ? html` 🆆` : readOrWrite}:
                    </span>`
                  : ''
            }
            ${data['::type'] === 'xxx-of' && dataType === 'array' ? html`<span class="prim-color">ARRAY</span>` : ''}
            ${openBracket}
          </div>
          <div class='td key-descr m-markdown-small'>${unsafeHTML(marked(description || ''))}</div>
        </div>
        <div class='inside-bracket ${data['::type'] || 'no-type-info'}' style='padding-left:${data['::type'] === 'xxx-of-option' || data['::type'] === 'xxx-of-array' ? 0 : leftPadding}px;'>
          ${Array.isArray(data) && data[0]
            ? html`${this.generateTree(data[0], 'xxx-of-option', '', '::ARRAY~OF', '', newSchemaLevel, newIndentLevel, data[0]['::readwrite'])}`
            : html`
              ${Object.keys(data).map((dataKey) => html`
              ${['::title', '::description', '::type', '::props', '::deprecated', '::array-type', '::readwrite', '::dataTypeLabel'].includes(dataKey)
              ? data[dataKey]['::type'] === 'array' || data[dataKey]['::type'] === 'object'
                    ? html`${this.generateTree(
                      data[dataKey]['::type'] === 'array' ? data[dataKey]['::props'] : data[dataKey],
                        data[dataKey]['::type'],
                        data[dataKey]['::array-type'] || '',
                        dataKey,
                        data[dataKey]['::description'],
                        newSchemaLevel,
                        newIndentLevel,
                        data[dataKey]['::readwrite'] ? data[dataKey]['::readwrite'] : '',
                      )}`
                    : ''
                  : html`${this.generateTree(
                    data[dataKey]['::type'] === 'array' ? data[dataKey]['::props'] : data[dataKey],
                    data[dataKey]['::type'],
                    data[dataKey]['::array-type'] || '',
                    dataKey,
                    data[dataKey]['::description'],
                    newSchemaLevel,
                    newIndentLevel,
                    data[dataKey]['::readwrite'] ? data[dataKey]['::readwrite'] : '',
                  )}`
                }
              `)}
            `
          }
        </div>
        ${data['::type'] && data['::type'].includes('xxx-of')
          ? ''
          : html`<div class='close-bracket'> ${closeBracket} </div>`
        }
      `;
    }

    // For Primitive types and array of Primitives
    const [type, primitiveReadOrWrite, constraint, defaultValue, allowedValues, pattern, schemaDescription, schemaTitle, deprecated] = data.split('~|~');
    if (primitiveReadOrWrite === '🆁' && this.schemaHideReadOnly === 'true') {
      return;
    }
    if (primitiveReadOrWrite === '🆆' && this.schemaHideWriteOnly === 'true') {
      return;
    }
    const dataTypeCss = type.replace(/|.*/g, '').replace(/[^a-zA-Z0-9+]/g, '').substring(0, 4).toLowerCase();

    let finalReadWriteText = '';
    let finalReadWriteTip = '';
    if (dataType === 'array') {
      if (readOrWrite === 'readonly') {
        finalReadWriteText = '🆁';
        finalReadWriteTip = 'read-only';
      } else if (readOrWrite === 'writeonly') {
        finalReadWriteText = '🆆';
        finalReadWriteTip = 'write-only';
      }
    } else if (primitiveReadOrWrite === '🆁') {
        finalReadWriteText = '🆁';
        finalReadWriteTip = 'read-only';
      } else if (primitiveReadOrWrite === '🆆') {
        finalReadWriteText = '🆆';
        finalReadWriteTip = 'write-only';
      }

    return html`
      <div class = "tr primitive" title="${deprecated ? 'Deprecated' : ''}">
        <div class="td key ${deprecated}" style='min-width:${minFieldColWidth}px' >
          ${deprecated ? html`<span class='font-red'>✗</span>` : ''}
          ${keyLabel.endsWith('*')
            ? html`<span class="key-label">${keyLabel.substring(0, keyLabel.length - 1)}</span><span class='param-required'>required</span>:`
            : key.startsWith('::OPTION')
              ? html`<span class='key-label xxx-of-key'>${keyLabel}</span><span class="xxx-of-descr">${keyDescr}</span>`
              : html`<span class="key-label">${keyLabel}:</span>`
          }
          <span class="${dataTypeCss}" title="${finalReadWriteTip}">
            ${dataType === 'array' ? `[${type}]` : `${type}`}
            ${finalReadWriteText}
          </span>
        </div>
        <div class='td key-descr'>
          ${dataType === 'array' ? html`<span class="m-markdown-small">${unsafeHTML(marked(description))}</span>` : ''}
          ${constraint ? html`<div class='key-dscr-pat font-mono'><span class='bold-text font-regl'>Constraints: </span>${constraint}</div>` : ''}
          ${defaultValue ? html`<div class='key-dscr-pat font-mono'><span class='bold-text font-regl'>Default: </span>${defaultValue}</div>` : ''}
          ${allowedValues ? html`<div class='key-dscr-pat font-mono'><span class='bold-text font-regl'>Allowed values: </span>${allowedValues}</div>` : ''}
          ${pattern ? html`<div class='key-dscr-pat font-mono'><span class='bold-text font-regl'>Pattern: </span>${pattern}</div>` : ''}
          ${schemaDescription ? html`<span class="m-markdown-small">${unsafeHTML(marked(`${schemaTitle ? `**${schemaTitle}:**` : ''} ${schemaDescription}`))}</span>` : ''}
        </div>
      </div>
    `;
  }
  /* eslint-enable indent */

  toggleObjectExpand(e) {
    const rowEl = e.target.closest('.tr');
    if (rowEl.classList.contains('expanded')) {
      rowEl.classList.replace('expanded', 'collapsed');
      e.target.innerHTML = e.target.classList.contains('array-of-object')
        ? '[{...}]'
        : e.target.classList.contains('array-of-array')
          ? '[[...]]'
          : e.target.classList.contains('array')
            ? '[...]'
            : '{...}';
    } else {
      rowEl.classList.replace('collapsed', 'expanded');
      e.target.innerHTML = e.target.classList.contains('array-of-object')
        ? '[{'
        : e.target.classList.contains('array-of-array')
          ? `[[ ${e.target.dataset.arrayType}`
          : e.target.classList.contains('object')
            ? '{'
            : '[';
    }
  }
}
customElements.define('schema-tree', SchemaTree);
