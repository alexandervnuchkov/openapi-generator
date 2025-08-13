import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import FontStyles from '~/styles/font-styles';
import SchemaStyles from '~/styles/schema-styles';
import SchemaTableStyles from '~/styles/schema-table-styles';
import CustomStyles from '~/styles/custom-styles';

export default class SchemaTable extends LitElement {
  static get properties() {
    return {
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
      data: { type: Object },
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
      SchemaTableStyles,
      CustomStyles,
    ];
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class="table expanded-descr">
        <div class="schm-table-dscr">
          <div class='toolbar regular-font-size'>
            <div class="schema-root-type ${this.data?.['::type'] || ''} "> ${this.data?.['::type'] || ''} </div>
            ${this.allowSchemaDescriptionExpandToggle === 'true'
              ? html`
                <div class="request-flex-inline"></div>
              `
              : ''
            }
          </div>
          ${this.data?.['::description']
          ? html`<span part="schema-description" class='m-markdown regular-font-size'> ${unsafeHTML(marked(this.data['::description'] || ''))}</span>`
          : ''
        }
        </div>
        <div class='schm-header'>
          <div class='schm-header-int'>
            <div class='key schm-hkey'> Attribute </div>
          </div>
          ${this.data
            ? html`
              ${this.generateTree(
                this.data['::type'] === 'array' ? this.data['::props'] : this.data,
                this.data['::type'],
                this.data['::array-type'],
              )}`
            : ''
          }
        </div>
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
        <span style='margin-left:${(schemaLevel + 1) * 16}px'> &nbsp; </span>
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

    const newSchemaLevel = data['::type']?.startsWith('xxx-of') ? schemaLevel : (schemaLevel + 1);
    const newIndentLevel = dataType === 'xxx-of-option' || data['::type'] === 'xxx-of-option' || key.startsWith('::OPTION') ? indentLevel : (indentLevel + 1);
    if (Object.keys(data).length === 0) {
      return html`<span class="td key object schm-obj">${key}</span>`;
    }
    let keyLabel = '';
    let keyDescr = '';
    let isOneOfLabel = false;
    if (key.startsWith('::ONE~OF') || key.startsWith('::ANY~OF')) {
      keyLabel = key.replace('::', '').replace('~', ' ');
      isOneOfLabel = true;
    } else if (key.startsWith('::OPTION')) {
      const parts = key.split('~');
      keyLabel = parts[1]; // eslint-disable-line prefer-destructuring
      keyDescr = parts[2]; // eslint-disable-line prefer-destructuring
    } else {
      keyLabel = key;
    }

    let detailObjType = '';
    if (data['::type'] === 'object') {
      if (dataType === 'array') {
        detailObjType = 'array of objects'; // Array of Object
      } else {
        detailObjType = data['::dataTypeLabel'] || data['::type'];
      }
    } else if (data['::type'] === 'array') {
      if (dataType === 'array') {
        // detailObjType = 'array of array'; // Array of array
        detailObjType = `array of array ${arrayType !== 'object' ? `of ${arrayType}` : ''}`; // Array of array
      } else {
        detailObjType = data['::dataTypeLabel'] || data['::type'];
      }
    }

    if (typeof data === 'object') {
      return html`
        ${newSchemaLevel >= 0 && key
          ? html`
            <div class='tr ${newSchemaLevel <= this.schemaExpandLevel ? 'expanded' : 'collapsed'} ${data['::type']}' data-obj='${keyLabel}' title="${data['::deprecated'] ? 'Deprecated' : ''}">
              <div class="td key schm-obj ${data['::deprecated'] ? 'deprecated' : ''}">
                ${(keyLabel || keyDescr)
                  ? html`
                    <span
                      class='obj-toggle ${newSchemaLevel < this.schemaExpandLevel ? 'expanded' : 'collapsed'}'
                      data-obj='${keyLabel}'
                      @click= ${(e) => this.toggleObjectExpand(e, keyLabel)}
                    >
                      ${schemaLevel < this.schemaExpandLevel ? '-' : '+'}
                    </span>`
                  : ''
                }
                ${data['::type'] === 'xxx-of-option' || data['::type'] === 'xxx-of-array' || key.startsWith('::OPTION')
                  ? html`<span class="xxx-of-key neg-lmargin">${keyLabel}</span><span class="${isOneOfLabel ? 'xxx-of-key' : 'xxx-of-descr'}">${keyDescr}</span>`
                  : keyLabel.endsWith('*')
                    ? html`<span class="key-label neg-lmargin disp-inline-block"">${data['::deprecated'] ? '✗' : ''} ${keyLabel.substring(0, keyLabel.length - 1)}</span><span class='param-required'>required</span>`
                    : html`<span class="key-label neg-lmargin disp-inline-block">${data['::deprecated'] ? '✗' : ''} ${keyLabel === '::props' ? '' : keyLabel}</span>`
                }
                ${data['::type'] === 'xxx-of' && dataType === 'array' ? html`<span class="prim-color">ARRAY</span>` : ''}
                <span class='key-type' title="${data['::readwrite'] === 'readonly' ? 'read-only' : data['::readwrite'] === 'writeonly' ? 'write-only' : ''}">
                  ${(data['::type'] || '').includes('xxx-of') ? '' : detailObjType}
                  <span>${data['::readwrite'] === 'readonly' ? ' 🆁' : data['::readwrite'] === 'writeonly' ? ' 🆆' : ''}</span>
                </span>
                <p class='key-descr m-markdown-small'>${unsafeHTML(marked(description || ''))}</p>
              </div>
            </div>`
          : html`
              ${data['::type'] === 'array' && dataType === 'array'
                ? html`
                  <div class='tr'>
                    <div class='td key'>
                      <span class='key-type'>
                        ${arrayType && arrayType !== 'object' ? `${dataType} of ${arrayType}` : dataType}
                      </span>
                      <p class='key-descr'></p>
                    </div>
                  </div>`
                : ''
              }
          `
        }
        <div class='object-body'>
        ${Array.isArray(data) && data[0]
          ? html`${this.generateTree(data[0], 'xxx-of-option', '', '::ARRAY~OF', '', newSchemaLevel, newIndentLevel, '')}`
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
        <div>
      `;
    }

    // For Primitive Data types
    const [type, readOrWriteOnly, constraint, defaultValue, allowedValues, pattern, schemaDescription, schemaTitle, deprecated] = data.split('~|~');
    if (readOrWriteOnly === '🆁' && this.schemaHideReadOnly === 'true') {
      return;
    }
    if (readOrWriteOnly === '🆆' && this.schemaHideWriteOnly === 'true') {
      return;
    }
    const dataTypeCss = type.replace(/|.*/g, '').replace(/[^a-zA-Z0-9+]/g, '').substring(0, 4).toLowerCase();
    let dataTypeHtml = '';
    if (dataType === 'array') {
      dataTypeHtml = html`
        <span class='key-type ${dataTypeCss}' title="${readOrWrite === 'readonly' ? 'read-only' : readOrWriteOnly === 'writeonly' ? 'write-only' : ''}">
          [${type}] <span>${readOrWrite === 'readonly' ? '🆁' : readOrWrite === 'writeonly' ? '🆆' : ''}</span>
        </span>`;
    } else {
      dataTypeHtml = html`
        <span class='key-type ${dataTypeCss}' title="${readOrWriteOnly === '🆁' ? 'read-only' : readOrWriteOnly === '🆆' ? 'write-only' : ''}">
          ${type} <span>${readOrWriteOnly}</span>
        </span>`;
    }
    return html`
      <div class="tr primitive" title="${deprecated ? 'Deprecated' : ''}">
        <div class="td key ${deprecated} schm-obj">
          ${deprecated ? html`<span class='font-red'>✗</span>` : ''}
          ${keyLabel?.endsWith('*')
            ? html`<span class="key-label">${keyLabel.substring(0, keyLabel.length - 1)}</span><span class='param-required'>required</span>`
            : key.startsWith('::OPTION')
              ? html`<span class='xxx-of-key'>${keyLabel}</span><span class="xxx-of-descr">${keyDescr}</span>`
              : html`${keyLabel ? html`<span class="key-label"> ${keyLabel}</span>` : html`<span class="xxx-of-descr">${schemaTitle}</span>`}`
          }
          ${dataTypeHtml}
          <p class='key-descr'>
            ${dataType === 'array' ? html`<span class="m-markdown-small">${unsafeHTML(marked(description))}</span>` : ''}
            ${constraint ? html`<div class='key-dscr-pat font-mono'> <span class='bold-text font-regl'>Constraints: </span> ${constraint}</div>` : ''}
            ${defaultValue ? html`<div class='key-dscr-pat font-mono'> <span class='bold-text font-regl'>Default: </span>${defaultValue}</div>` : ''}
            ${allowedValues ? html`<div class='key-dscr-pat font-mono'> <span class='bold-text font-regl'>Allowed values: </span>${allowedValues}</div>` : ''}
            ${pattern ? html`<div class='key-dscr-pat font-mono'> <span class='bold-text font-regl'>Pattern: </span>${pattern}</div>` : ''}
            ${schemaDescription ? html`<span class="m-markdown-small">${unsafeHTML(marked(`${schemaTitle ? `**${schemaTitle}:**` : ''} ${schemaDescription}`))}</span>` : ''}
          </p>
        </div>
      </div>
    `;
  }
  /* eslint-enable indent */

  toggleObjectExpand(e) {
    const rowEl = e.target.closest('.tr');
    if (rowEl.classList.contains('expanded')) {
      rowEl.classList.add('collapsed');
      rowEl.classList.remove('expanded');
      e.target.innerText = '+';
    } else {
      rowEl.classList.remove('collapsed');
      rowEl.classList.add('expanded');
      e.target.innerText = '-';
    }
  }
}
customElements.define('schema-table', SchemaTable);
