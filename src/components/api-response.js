import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import { schemaInObjectNotation, generateExample } from '~/utils/schema-utils';
import FontStyles from '~/styles/font-styles';
import FlexStyles from '~/styles/flex-styles';
import TableStyles from '~/styles/table-styles';
import InputStyles from '~/styles/input-styles';
import TabStyles from '~/styles/tab-styles';
import BorderStyles from '~/styles/border-styles';
import ApiResponseStyles from '~/styles/api-response-styles';
import CustomStyles from '~/styles/custom-styles';
import '~/components/schema-tree';
import '~/components/schema-table';

export default class ApiResponse extends LitElement {
  constructor() {
    super();
    this.selectedStatus = '';
    this.headersForEachRespStatus = {};
    this.mimeResponsesForEachStatus = {};
    this.activeSchemaTab = 'schema';
  }

  static get properties() {
    return {
      callback: { type: String },
      webhook: { type: String },
      responses: { type: Object },
      parser: { type: Object },
      schemaStyle: { type: String, attribute: 'schema-style' },
      renderStyle: { type: String, attribute: 'render-style' },
      selectedStatus: { type: String, attribute: 'selected-status' },
      selectedMimeType: { type: String, attribute: 'selected-mime-type' },
      activeSchemaTab: { type: String, attribute: 'active-schema-tab' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
    };
  }

  static get styles() {
    return [
      FontStyles,
      FlexStyles,
      TabStyles,
      TableStyles,
      InputStyles,
      BorderStyles,
      ApiResponseStyles,
      CustomStyles,
    ];
  }

  render() {
    return html`
    <h3 class="col regular-font response-panel ${this.renderStyle}-mode">
      <div class=" ${this.callback === 'true' ? 'tiny-title' : 'req-res-title'} ">
        ${this.callback === 'true' ? 'Callback response' : 'Response'}
      </h3>
      <div>
        ${this.responseTemplate()}
      <div>
    </div>
    `;
  }

  resetSelection() {
    this.selectedStatus = '';
    this.selectedMimeType = '';
  }

  /* eslint-disable indent */
  responseTemplate() {
    if (!this.responses) { return ''; }
    for (const statusCode in this.responses) {
      if (!this.selectedStatus) {
        this.selectedStatus = statusCode;
      }
      const allMimeResp = {};
      for (const mimeResp in this.responses[statusCode]?.content) {
        const mimeRespObj = this.responses[statusCode].content[mimeResp];
        if (!this.selectedMimeType) {
          this.selectedMimeType = mimeResp;
        }
        // Generate Schema
        const schemaTree = schemaInObjectNotation(mimeRespObj.schema, {});
        // Generate Example
        const respExamples = generateExample(
          mimeRespObj.schema,
          mimeResp,
          mimeRespObj.examples,
          mimeRespObj.example,
          this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
          this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
          mimeResp.includes('json') ? 'json' : 'text',
        );
        allMimeResp[mimeResp] = {
          description: this.responses[statusCode].description,
          examples: respExamples,
          selectedExample: respExamples[0]?.exampleId || '',
          schemaTree,
        };
      }
      // Headers for each response status
      const tempHeaders = [];
      for (const key in this.responses[statusCode]?.headers) {
        tempHeaders.push({ name: key, ...this.responses[statusCode].headers[key] });
      }
      this.headersForEachRespStatus[statusCode] = tempHeaders;
      this.mimeResponsesForEachStatus[statusCode] = allMimeResp;
    }
    return html`
      ${Object.keys(this.responses).length > 1
        ? html`<div class='row resp-div'>
          ${Object.keys(this.responses).map((respStatus) => html`
            ${respStatus === '$$ref' // Swagger-Client parser creates '$$ref' object if JSON references are used to create responses - this should be ignored
              ? ''
              : html`
                <button
                  @click="${() => {
                    this.selectedStatus = respStatus;
                    if (this.responses[respStatus].content && Object.keys(this.responses[respStatus].content)[0]) {
                      this.selectedMimeType = Object.keys(this.responses[respStatus].content)[0]; // eslint-disable-line prefer-destructuring
                    } else {
                      this.selectedMimeType = undefined;
                    }
                  }}"
                  class='status-code status-code-${respStatus.replace(/..$/, 'xx')} btn-rsp-stat'
                  part="btn ${this.selectedStatus === respStatus ? 'btn-response-status btn-selected-response-status' : ' btn-response-status'}"
                >
                  ${respStatus}
                </button>`
              }`)
          }`
        : html`<span class="status-code-${Object.keys(this.responses)[0].replace(/..$/, 'xx')}">${Object.keys(this.responses)[0]}</span>`
      }
      </div>

      ${Object.keys(this.responses).map((status) => html`
        <div style = 'display: ${status === this.selectedStatus ? 'block' : 'none'}' >
          <div class="top-gap">
            <span class="resp-descr m-markdown ">${unsafeHTML(marked(this.responses[status]?.description || ''))}</span>
            ${(this.headersForEachRespStatus[status] && this.headersForEachRespStatus[status]?.length > 0)
              ? html`${this.responseHeaderListTemplate(this.headersForEachRespStatus[status])}`
              : ''
            }
          </div>
          ${Object.keys(this.mimeResponsesForEachStatus[status]).length === 0
            ? ''
            : html`
              <div class="mrg-top-15">
                <div class='resp-blk-right'>
                      ${this.mimeExampleTemplate(this.mimeResponsesForEachStatus[status][this.selectedMimeType])}
                    </div>
                <div class='resp-blk-left'>
                      ${this.mimeSchemaTemplate(this.mimeResponsesForEachStatus[status][this.selectedMimeType])}
                    </div>
              </div>
            `
          }`)
        }
    `;
  }

  responseHeaderListTemplate(respHeaders) {
    return html`
      <div class="resp-headers small-font-size bold-text">RESPONSE HEADERS</div>
      <table class="small-font-size mono-font resp-headers-table">
        ${respHeaders.map((v) => html`
          <tr>
            <td class="resp-headers-name">
              ${v.name || ''}
            </td>
            <td class="resp-headers-type">
              ${v.schema.type || ''}
            </td>
            <td class="resp-headers-description">
              <div class="m-markdown-small regular-font" >${unsafeHTML(marked(v.description || ''))}</div>
            </td>
            <td class="resp-headers-example">
              ${v.schema.example || ''}
            </td>
          </tr>
        `)}
    </table>`;
  }

  mimeTypeDropdownTemplate(mimeTypes) {
    return html`
      <select @change="${(e) => { this.selectedMimeType = e.target.value; }}" class='resp-mime'>
        ${mimeTypes.map((mimeType) => html`<option value='${mimeType}' ?selected = '${mimeType === this.selectedMimeType}'> ${mimeType} </option>`)}
      </select>`;
  }

  onSelectExample(e) {
    const exampleContainerEl = e.target.closest('.example-panel');
    const exampleEls = [...exampleContainerEl.querySelectorAll('.example')];

    exampleEls.forEach((v) => {
      v.style.display = v.dataset.example === e.target.value ? 'block' : 'none';
    });
  }

  mimeExampleTemplate(mimeRespDetails) {
    if (!mimeRespDetails) {
      return html`
        <pre class='red-text ${this.renderStyle === 'read' ? 'read example-panel border pad-8-16' : 'example-panel border-top'}'> No example provided </pre>
      `;
    }
    return html`
      ${mimeRespDetails.examples.length === 1
        ? html`
          ${mimeRespDetails.examples[0].exampleFormat === 'json'
            ? html`
              ${mimeRespDetails.examples[0].exampleSummary && mimeRespDetails.examples[0].exampleSummary.length > 80 ? html`<div class="resp-example-padding"> ${mimeRespDetails.examples[0].exampleSummary} </div>` : ''}
              ${mimeRespDetails.examples[0].exampleDescription ? html`<div class="resp-example-style"><div class='bold-text regular-font-size'>Sample response</div> ${unsafeHTML(marked(mimeRespDetails.examples[0].exampleDescription || ''))} </div>`
              : html`<div class="resp-example-style"><div class='bold-text regular-font-size'>Sample response</div></div>`}
              <json-tree
                render-style = '${this.renderStyle}'
                .data="${mimeRespDetails.examples[0].exampleValue}"
                class = 'example-panel ${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top pad-top-8'}'
                exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy"
              ></json-tree>`
            : html`
              ${mimeRespDetails.examples[0].exampleSummary && mimeRespDetails.examples[0].exampleSummary.length > 80 ? html`<div class="resp-example-padding"> ${mimeRespDetails.examples[0].exampleSummary} </div>` : ''}
              ${mimeRespDetails.examples[0].exampleDescription ? html`<div class="resp-example-style"><div class='bold-text regular-font-size'>Sample response</div> ${unsafeHTML(marked(mimeRespDetails.examples[0].exampleDescription || ''))} </div>`
              : html`<div class="resp-example-style"><div class='bold-text regular-font-size'>Sample response</div></div>`}
              <pre class = 'example-panel ${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top pad-top-8'}'>${mimeRespDetails.examples[0].exampleValue}</pre>
            `
          }`
        : html`${mimeRespDetails.examples[0].exampleSummary && mimeRespDetails.examples[0].exampleSummary.length > 80 ? html`<div class="resp-example-padding"> ${mimeRespDetails.examples[0].exampleSummary} </div>` : ''}
          ${mimeRespDetails.examples[0].exampleDescription ? html`<div class="resp-example-style"><div class='bold-text regular-font-size'>Sample response</div> ${unsafeHTML(marked(mimeRespDetails.examples[0].exampleDescription || ''))} </div>`
          : html`<div class="resp-example-style"><div class='bold-text regular-font-size'>Sample response</div></div>`}
          <span class = 'example-panel ${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top pad-top-8'}'>
            <select class="resp-example-select" @change='${(e) => this.onSelectExample(e)}'>
              ${mimeRespDetails.examples.map((v) => html`<option value="${v.exampleId}" ?selected=${v.exampleId === mimeRespDetails.selectedExample} >
                ${v.exampleSummary.length > 80 ? v.exampleId : v.exampleSummary}
              </option>`)}
            </select>
            ${mimeRespDetails.examples.map((v) => html`
              <div class="example" data-example = '${v.exampleId}' style = "display: ${v.exampleId === mimeRespDetails.selectedExample ? 'block' : 'none'}">
                ${v.exampleFormat === 'json'
                  ? html`
                    <json-tree
                      render-style = '${this.renderStyle}'
                      .data = '${v.exampleValue}'
                      exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy"
                    ></json-tree>`
                  : html`<pre>${v.exampleValue}</pre>`
                }
              </div>
            `)}
          </span>
        `
      }
    `;
  }

  mimeSchemaTemplate(mimeRespDetails) {
    if (!mimeRespDetails) {
      return html`
        <pre class = 'red-text ${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top'}'> Schema not found</pre>
      `;
    }
    return html`
      ${this.schemaStyle === 'table'
        ? html`
          <schema-table
            render-style = "${this.renderStyle}"
            .data = "${mimeRespDetails.schemaTree}"
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-tree> `
        : html`
          <schema-tree
            render-style = "${this.renderStyle}"
            .data = '${mimeRespDetails.schemaTree}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-tree>`
      }`;
  }
  /* eslint-enable indent */
}

// Register the element with the browser
customElements.define('api-response', ApiResponse);
