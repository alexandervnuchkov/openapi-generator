import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { guard } from 'lit/directives/guard.js'; // eslint-disable-line import/extensions
import { live } from 'lit/directives/live.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import formatXml from 'xml-but-prettier';
import Prism from 'prismjs';
import TableStyles from '~/styles/table-styles';
import FlexStyles from '~/styles/flex-styles';
import InputStyles from '~/styles/input-styles';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import TabStyles from '~/styles/tab-styles';
import PrismStyles from '~/styles/prism-styles';
import ApiRequestStyles from '~/styles/api-request-styles';
import CustomStyles from '~/styles/custom-styles';
import { copyToClipboard, downloadResource, viewResource } from '~/utils/common-utils';
import { schemaInObjectNotation,
  getTypeInfo,
  generateExample,
  normalizeExamples,
  getSchemaFromParam,
  json2xml,
  nestExampleIfPresent,
  anyExampleWithSummaryOrDescription } from '~/utils/schema-utils';
import '~/components/json-tree';
import '~/components/schema-tree';
import '~/components/tag-input';

export default class ApiRequest extends LitElement {
  constructor() {
    super();
    this.responseMessage = '';
    this.responseStatus = 'success';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseUrl = '';
    this.curlSyntax = '';
    this.activeResponseTab = 'response'; // allowed values: response, headers, curl
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
    this.activeParameterSchemaTabs = {};
  }

  static get properties() {
    return {
      serverUrl: { type: String, attribute: 'server-url' },
      servers: { type: Array },
      method: { type: String },
      path: { type: String },
      security: { type: Array },
      parameters: { type: Array },
      request_body: { type: Object },
      api_keys: { type: Array },
      parser: { type: Object },
      accept: { type: String },
      callback: { type: String },
      webhook: { type: String },
      responseMessage: { type: String, attribute: false },
      responseText: { type: String, attribute: false },
      responseHeaders: { type: String, attribute: false },
      responseStatus: { type: String, attribute: false },
      responseUrl: { type: String, attribute: false },
      fillRequestFieldsWithExample: { type: String, attribute: 'fill-request-fields-with-example' },
      allowTry: { type: String, attribute: 'allow-try' },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      activeSchemaTab: { type: String, attribute: 'active-schema-tab' },
      activeParameterSchemaTabs: {
        type: Object,
        converter: {
          fromAttribute: (attr) => JSON.parse(attr),
          toAttribute: (prop) => JSON.stringify(prop),
        },
        attribute: 'active-parameter-schema-tabs',
      },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
      fetchCredentials: { type: String, attribute: 'fetch-credentials' },

      // properties for internal tracking
      activeResponseTab: { type: String }, // internal tracking of response-tab not exposed as a attribute
      selectedRequestBodyType: { type: String, attribute: 'selected-request-body-type' }, // internal tracking of selected request-body type
      selectedRequestBodyExample: { type: String, attribute: 'selected-request-body-example' }, // internal tracking of selected request-body example
    };
  }

  static get styles() {
    return [
      TableStyles,
      InputStyles,
      FontStyles,
      FlexStyles,
      BorderStyles,
      TabStyles,
      PrismStyles,
      ApiRequestStyles,
      CustomStyles,
    ];
  }

  render() {
    return html`
    <div class="calc-width-api-request col regular-font request-panel ${'read focused'.includes(this.renderStyle) || this.callback === 'true' ? 'read-mode' : 'view-mode'}">
      <h3 class=" ${this.callback === 'true' ? 'tiny-title' : 'req-res-title'} ">
        ${this.callback === 'true' ? 'Callback request' : 'Request'}
      </h3>
      <div>
      ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('path'))}
      ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('query'))}
      ${this.requestBodyTemplate()}
      ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('header'))}
      ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('cookie'))}
      ${this.allowTry === 'false' || this.path.includes('/webhook-subscriptions') ? '' : html`${this.apiCallTemplate()}`}
      </div>
    </div>
    `;
  }

  /*
  async updated(changedProperties) {
    // In focused mode after rendering the request component, update the text-areas(which contains examples) using
    // the original values from hidden textareas
    // This is done coz, user may update the dom by editing the textarea's and once the DOM is updated externally change detection wont happen, therefore update the values manually
    if (this.renderStyle === 'focused') {
      if (changedProperties.size === 1 && changedProperties.has('activeSchemaTab')) {
        // dont update example as only tabs is switched
      } else {
        this.requestUpdate();
      }
    }
  }
  */

  async saveExampleState() {
    if (this.renderStyle === 'focused') {
      const reqBodyTextAreaEls = [...this.shadowRoot.querySelectorAll('textarea.request-body-param-user-input')];
      reqBodyTextAreaEls.forEach((el) => {
        el.dataset.user_example = el.value;
      });
      const exampleTextAreaEls = [...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')];
      exampleTextAreaEls.forEach((el) => {
        el.dataset.user_example = el.value;
      });
      this.requestUpdate();
    }
  }

  async updateExamplesFromDataAttr() {
    // In focused mode after rendering the request component, update the text-areas(which contains examples) using
    // the original values from hidden textareas
    // This is done coz, user may update the dom by editing the textarea's and once the DOM is updated externally change detection wont happen, therefore update the values manually
    if (this.renderStyle === 'focused') {
      const reqBodyTextAreaEls = [...this.shadowRoot.querySelectorAll('textarea.request-body-param-user-input')];
      reqBodyTextAreaEls.forEach((el) => {
        el.value = el.dataset.user_example || el.dataset.example;
      });
      const exampleTextAreaEls = [...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')];
      exampleTextAreaEls.forEach((el) => {
        el.value = el.dataset.user_example || el.dataset.example;
      });
      this.requestUpdate();
    }
  }

  renderExample(example, paramType, paramName) {
    return html`
          ${paramType === 'array' ? '[' : ''}
          <a
          part="anchor anchor-param-example"
          class = "anchor-param-constraint-font ${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions') ? '' : 'inactive-link'}"
            data-example-type="${paramType === 'array' ? paramType : 'string'}"
            data-example="${example.value && Array.isArray(example.value) ? example.value?.join('~|~') : example.value || ''}"
            @click="${(e) => {
    const inputEl = e.target.closest('table').querySelector(`[data-pname="${paramName}"]`);
    if (inputEl) {
      if (e.target.dataset.exampleType === 'array') {
        inputEl.value = e.target.dataset.example.split('~|~');
      } else {
        inputEl.value = e.target.dataset.example;
      }
    }
  }
}"
          >
          ${example.value && Array.isArray(example.value) ? example.value?.join(', ') : example.value || '∅'}
          </a>
          ${paramType === 'array' ? '] ' : ''}
          `;
  }

  renderShortFormatExamples(examples, paramType, paramName) {
    return html`${examples.map((x, i) => html`
      ${i === 0 ? '' : '|'}
      ${this.renderExample(x, paramType, paramName)}`)}`;
  }

  renderLongFormatExamples(exampleList, paramType, paramName) {
    return html` <ul style="list-style-type: disclosure-closed;">
            ${exampleList.map((v) => html`
                <li>
                  ${this.renderExample(v, paramType, paramName)}
                  ${v.summary?.length > 0 ? html`<span>&lpar;${v.summary}&rpar;</span>` : ''}
                  ${v.description?.length > 0 ? html`<p>${unsafeHTML(marked(v.description))}</p>` : ''}
                </li>
              `)}
          </ul>`;
  }

  /* eslint-disable indent */

        exampleListTemplate(paramName, paramType, exampleList = []) {
          return html` ${exampleList.length > 0
            ? html`<span style="font-weight:bold">Example: </span>
                ${
                  anyExampleWithSummaryOrDescription(exampleList)
                  ? this.renderLongFormatExamples(exampleList, paramType, paramName)
                  : this.renderShortFormatExamples(exampleList, paramType, paramName)
                }`
            : ''}`;
        }

  inputParametersTemplate(paramType) {
    const filteredParams = this.parameters ? this.parameters.filter((param) => param.in === paramType) : [];
    if (filteredParams.length === 0) {
      return '';
    }
    let title = '';
    if (paramType === 'path') {
      title = 'Path parameters';
    } else if (paramType === 'query') {
      title = 'Query parameters';
    } else if (paramType === 'header') {
      title = 'Request headers';
    } else if (paramType === 'cookie') {
      title = 'Cookies';
    }

    const tableRows = [];
    for (const param of filteredParams) {
      const [declaredParamSchema, serializeStyle, mimeTypeElem] = getSchemaFromParam(param);
      if (!declaredParamSchema) {
        continue; // eslint-disable-line no-continue
      }
      const paramSchema = getTypeInfo(declaredParamSchema);
      if (!paramSchema) {
        continue; // eslint-disable-line no-continue
      }
      const schemaAsObj = schemaInObjectNotation(declaredParamSchema, {});
      // let exampleVal = '';
      // let exampleList = [];
      let paramStyle = 'form';
      let paramExplode = true;
      let paramAllowReserved = false;
      if (paramType === 'query') {
        if (param.style && 'form spaceDelimited pipeDelimited'.includes(param.style)) {
          paramStyle = param.style;
        } else if (serializeStyle) {
          paramStyle = serializeStyle;
        }
        if (typeof param.explode === 'boolean') {
          paramExplode = param.explode;
        }
        if (typeof param.allowReserved === 'boolean') {
          paramAllowReserved = param.allowReserved;
        }
      }

      // openapi 3.1.0 spec based examples (which must be Object(string : { value:any, summary?: string, description?: string})
      const example = normalizeExamples(
        (param.examples
          || nestExampleIfPresent(param.example)
          || nestExampleIfPresent(mimeTypeElem?.example)
          || mimeTypeElem?.examples
          || paramSchema.examples
          || nestExampleIfPresent(paramSchema.example)
        ),
        paramSchema.type,
      );
      if (!example.exampleVal && paramSchema.type === 'object') {
        example.exampleVal = generateExample(
          declaredParamSchema,
          serializeStyle || 'json',
          '',
          '',
          this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
          this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
          true,
          'text',
          false,
        )[0].exampleValue;
      }
      const dataTypeCss = paramSchema.type.replace(/|.*/g, '').replace(/[^a-zA-Z0-9+]/g, '').substring(0, 4).toLowerCase();
      tableRows.push(html`
      <tr title="${param.deprecated ? 'Deprecated' : ''}">
        <td class="${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions') ? 'param-name-td-try' : 'param-name-td-notry'} param-name-td">
        <div class="param-name ${param.deprecated ? 'deprecated' : ''}" >
          ${param.name}
          ${param.deprecated ? html`<span class='font-red'>✗</span>` : ''}
          ${param.required ? html`<span class='param-required'>required</span>` : ''}
            <div class="param-type key-type ${dataTypeCss}">
              ${paramSchema.type === 'array'
                ? `${paramSchema.arrayType}`
                : `${paramSchema.format ? paramSchema.format : paramSchema.type}`
              }
            </div>
        </div>
        <div>${unsafeHTML(marked(param.description || ''))}
          ${paramSchema.default || paramSchema.constrain || paramSchema.allowedValues || paramSchema.pattern
            ? html`
                <div class="param-constraint">
                  ${paramSchema.default ? html`<span class="param-schema-default-title">Default: </span><span class="font-mono">${paramSchema.default}</span><br/>` : ''}
                  ${paramSchema.pattern ? html`<span class="param-schema-pattern-title">Pattern: </span><span class="font-mono"${paramSchema.pattern}</span><br/>` : ''}
                  ${paramSchema.constrain ? html`${paramSchema.constrain}<br/>` : ''}
                  <p>
                  ${paramSchema.allowedValues && paramSchema.allowedValues.split('|').map((v, i) => html`
                    ${i > 0 ? '|' : html`<span class="param-schema-values-title">Allowed values: </span>`}
                    ${html`
                      <a part="anchor anchor-param-constraint" class = "anchor-param-constraint-font ${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions') ? '' : 'inactive-link'}"
                        data-type="${paramSchema.type === 'array' ? paramSchema.type : 'string'}"
                        data-enum="${v.trim()}"
                        @click="${(e) => {
                          const inputEl = e.target.closest('table').querySelector(`[data-pname="${param.name}"]`);
                          if (inputEl) {
                            if (e.target.dataset.type === 'array') {
                              inputEl.value = [e.target.dataset.enum];
                            } else {
                              inputEl.value = e.target.dataset.enum;
                            }
                          }
                        }}"
                      >${v}</a>`
                    }`)}
                    </p>
                </div>`
            : ''
          }
          ${example.exampleList.length > 0
            ? html`<p>${this.exampleListTemplate.call(this, param.name, paramSchema.type, example.exampleList)}</p>`
            : ''
          }
          </div>
        </td>
        ${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions')
          ? html`
            <td class="request-param-td" colspan="${paramSchema.default || paramSchema.constrain || paramSchema.allowedValues || paramSchema.pattern ? '1' : '1'}">
              ${paramSchema.type === 'array'
                ? html`
                  <tag-input class="request-param full-width"
                    data-ptype = "${paramType}"
                    data-pname = "${param.name}"
                    data-example = "${Array.isArray(example.exampleVal) ? example.exampleVal.join('~|~') : example.exampleVal}"
                    data-param-serialize-style = "${paramStyle}"
                    data-param-serialize-explode = "${paramExplode}"
                    data-param-allow-reserved = "${paramAllowReserved}"
                    data-x-fill-example = "${param['x-fill-example'] || 'yes'}"
                    data-array = "true"
                    placeholder = "add-multiple &#x21a9;"
                    .value="${param['x-fill-example'] === 'no'
                      ? []
                      : live(this.fillRequestFieldsWithExample === 'true' ? Array.isArray(example.exampleVal) ? example.exampleVal : [example.exampleVal] : [])
                    }"
                  >
                  </tag-input>`
                : paramSchema.type === 'object'
                  ? html`
                    <div class="tab-panel col request-param-tabs">
                      <div class="tab-buttons row" @click="${(e) => {
                        if (e.target.tagName.toLowerCase() === 'button') {
                          const newState = { ...this.activeParameterSchemaTabs };
                          newState[param.name] = e.target.dataset.tab;
                          this.activeParameterSchemaTabs = newState;
                        }
                      }}">
                        <button class="tab-btn ${this.activeParameterSchemaTabs[param.name] === 'example' ? 'active' : ''}" data-tab = 'example'>EXAMPLE </button>
                        <button class="tab-btn ${this.activeParameterSchemaTabs[param.name] !== 'example' ? 'active' : ''}" data-tab = 'schema'>SCHEMA</button>
                      </div>
                      ${this.activeParameterSchemaTabs[param.name] === 'example'
                        ? html`<div class="tab-content col">
                          <textarea
                            class = "textarea request-param full-width res-vert"
                            part = "textarea textarea-param"
                            data-ptype = "${paramType}-object"
                            data-pname = "${param.name}"
                            data-example = "${example.exampleVal}"
                            data-param-serialize-style = "${paramStyle}"
                            data-param-serialize-explode = "${paramExplode}"
                            data-param-allow-reserved = "${paramAllowReserved}"
                            data-x-fill-example = "${param['x-fill-example'] || 'yes'}"
                            spellcheck = "false"
                            .textContent="${param['x-fill-example'] === 'no' ? '' : live(this.fillRequestFieldsWithExample === 'true' ? example.exampleVal : '')}"
                            style = "height: ${'read focused'.includes(this.renderStyle) ? '180px' : '120px'};"
                          ></textarea>
                        </div>`
                        : html`
                          <div class="tab-content col">
                            <schema-tree
                              class = 'json'
                              style = 'display: block'
                              .data = '${schemaAsObj}'
                              schema-expand-level = "${this.schemaExpandLevel}"
                              schema-description-expanded = "${this.schemaDescriptionExpanded}"
                              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
                              schema-hide-read-only = "${this.schemaHideReadOnly.includes(this.method)}"
                              schema-hide-write-only = "${this.schemaHideWriteOnly.includes(this.method)}"
                            > </schema-tree>
                          </div>`
                        }
                    </div>`
                  : html`
                    <input type="${paramSchema.format === 'password' ? 'password' : 'text'}" spellcheck="false"
                      class="request-param input-password-text"
                      part="textbox textbox-param"
                      data-ptype="${paramType}"
                      data-pname="${param.name}"
                      data-example="${Array.isArray(example.exampleVal) ? example.exampleVal.join('~|~') : example.exampleVal}"
                      data-param-allow-reserved = "${paramAllowReserved}"
                      data-x-fill-example = "${param['x-fill-example'] || 'yes'}"
                      data-array="false"
                      .value="${param['x-fill-example'] === 'no' ? '' : live(this.fillRequestFieldsWithExample === 'true' ? example.exampleVal : '')}"
                    />`
                }
            </td>`
          : ''
        }
    </tr>
    `);
    }

    return html`
    <h4 class="table-title top-gap">${title}</h4>
    <div class="params-table-styles">
      <table class="m-table mtable-inline">
        <thead>
        <tr>
          <th class="${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions') ? 'allow-try-first' : 'deny-try-first'}">Parameter</th>
          <th class="${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions') ? 'allow-try-last' : 'deny-try-last'}">Value</th>
        </tr>
      </thead>
    ${tableRows}
      </table>
    </div>`;
  }

  // This method is called before navigation change in focusd mode
  async beforerNavigationFocusedMode() {
    // this.saveExampleState();
  }

  // This method is called after navigation change in focusd mode
  async afterNavigationFocusedMode() {
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
    this.updateExamplesFromDataAttr();
    this.clearResponseData();
  }

  // Request-Body Event Handlers
  onSelectExample(e) {
    this.selectedRequestBodyExample = e.target.value;
    const exampleDropdownEl = e.target;
    window.setTimeout((selectEl) => {
      const readOnlyExampleEl = selectEl.closest('.example-panel').querySelector('.request-body-param');
      const userInputExampleTextareaEl = selectEl.closest('.example-panel').querySelector('.request-body-param-user-input');
      userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;
    }, 0, exampleDropdownEl);
  }

  onMimeTypeChange(e) {
    this.selectedRequestBodyType = e.target.value;
    const mimeDropdownEl = e.target;
    this.selectedRequestBodyExample = '';
    window.setTimeout((selectEl) => {
      const readOnlyExampleEl = selectEl.closest('.request-body-container').querySelector('.request-body-param');
      if (readOnlyExampleEl) {
        const userInputExampleTextareaEl = selectEl.closest('.request-body-container').querySelector('.request-body-param-user-input');
        userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;
      }
    }, 0, mimeDropdownEl);
  }

  requestBodyTemplate() {
    if (!this.request_body) {
      return '';
    }
    if (Object.keys(this.request_body).length === 0) {
      return '';
    }

    // Variable to store partial HTMLs
    let reqBodyTypeSelectorHtml = '';
    let reqBodyFileInputHtml = '';
    let reqBodyFormHtml = '';
    let reqBodySchemaHtml = '';
    let reqBodyExampleHtml = '';

    const requestBodyTypes = [];
    const { content } = this.request_body;
    for (const mimeType in content) {
      requestBodyTypes.push({
        mimeType,
        schema: content[mimeType].schema,
        example: content[mimeType].example,
        examples: content[mimeType].examples,
      });
      if (!this.selectedRequestBodyType) {
        this.selectedRequestBodyType = mimeType;
      }
    }
    // MIME Type selector
    reqBodyTypeSelectorHtml = requestBodyTypes.length === 1
      ? ''
      : html`
        <select class="request-body-inline" @change = '${(e) => this.onMimeTypeChange(e)}'>
          ${requestBodyTypes.map((reqBody) => html`
            <option value = '${reqBody.mimeType}' ?selected = '${reqBody.mimeType === this.selectedRequestBodyType}'>
              ${reqBody.mimeType}
            </option> `)
          }
        </select>
      `;

    // For Loop - Main
    requestBodyTypes.forEach((reqBody) => {
      let schemaAsObj;
      let reqBodyExamples = [];

      if (this.selectedRequestBodyType.includes('json') || this.selectedRequestBodyType.includes('xml') || this.selectedRequestBodyType.includes('text') || this.selectedRequestBodyType.includes('jose')) {
        // Generate Example
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          reqBodyExamples = generateExample(
            reqBody.schema,
            reqBody.mimeType,
            reqBody.examples,
            reqBody.example,
            this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
            this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
            'text',
            false,
          );
          if (!this.selectedRequestBodyExample) {
            this.selectedRequestBodyExample = (reqBodyExamples.length > 0 ? reqBodyExamples[0].exampleId : '');
          }
          reqBodyExampleHtml = html`
            ${reqBodyExampleHtml}
            <div class = 'example-panel pad-top-8'>
              ${reqBodyExamples.length === 1
                ? ''
                : html`
                  <select class="request-body-example-inline" @change='${(e) => this.onSelectExample(e)}'>
                    ${reqBodyExamples.map((v) => html`<option value="${v.exampleId}" ?selected=${v.exampleId === this.selectedRequestBodyExample} >
                      ${v.exampleSummary.length > 80 ? v.exampleId : v.exampleSummary ? v.exampleSummary : v.exampleId}
                    </option>`)}
                  </select>
                `
              }
              ${reqBodyExamples
                .filter((v) => v.exampleId === this.selectedRequestBodyExample)
                .map((v) => html`
                <div class="example ${v.exampleId === this.selectedRequestBodyExample ? 'example-selected' : ''}" data-example = '${v.exampleId}'>
                  ${v.exampleSummary && v.exampleSummary.length > 80 ? html`<div class="example-summary-inline"> ${v.exampleSummary} </div>` : ''}
                  ${v.exampleDescription ? html`<div class="example-description-inline"> ${unsafeHTML(marked(v.exampleDescription || ''))} </div>` : ''}
                  <!-- This pre(hidden) is to store the original example value, this will remain unchanged when users switches from one example to another, its is used to populate the editable textarea -->
                  <pre
                    class = "textarea is-hidden request-body-param ${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)} request-body-param-inline"
                    spellcheck = "false"
                    data-ptype = "${reqBody.mimeType}"
                  >${(v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2))}</pre>

                  <!-- this textarea is for user to edit the example -->
                  <textarea
                    class = "textarea request-body-param-user-input request-body-param-user-inline"
                    part = "textarea textarea-param"
                    spellcheck = "false"
                    data-ptype = "${reqBody.mimeType}"
                    data-example = "${v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2)}"
                    data-example-format = "${v.exampleFormat}"
                    .textContent = "${(v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2))}"
                  ></textarea>
                </div>
              `)}

            </div>
          `;
        }
      } else if (this.selectedRequestBodyType.includes('form-urlencoded') || this.selectedRequestBodyType.includes('form-data')) {
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          const ex = generateExample(
            reqBody.schema,
            reqBody.mimeType,
            reqBody.examples,
            reqBody.example,
            this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
            this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
            'text',
            false,
          );
          if (reqBody.schema) {
            reqBodyFormHtml = this.formDataTemplate(reqBody.schema, reqBody.mimeType, (ex[0] ? ex[0].exampleValue : ''));
          }
        }
      } else if ((/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(this.selectedRequestBodyType))) {
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          reqBodyFileInputHtml = html`
            <div class = "small-font-size bold-text row">
              <input type="file" part="file-input" class="request-body-param-file request-body-type-inline" data-ptype="${reqBody.mimeType}" spellcheck="false" />
            </div>
          `;
        }
      }

      // Generate Schema
      if (reqBody.mimeType.includes('json') || reqBody.mimeType.includes('xml') || reqBody.mimeType.includes('text') || this.selectedRequestBodyType.includes('jose')) {
        schemaAsObj = schemaInObjectNotation(reqBody.schema, {});
        if (this.schemaStyle === 'table') {
          reqBodySchemaHtml = html`
            ${reqBodySchemaHtml}
            <schema-table
              class = '${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}'
              style = 'display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};'
              .data = '${schemaAsObj}'
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
            > </schema-table>
          `;
        } else if (this.schemaStyle === 'tree') {
          reqBodySchemaHtml = html`
            ${reqBodySchemaHtml}
            <schema-tree
              class = "${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}"
              style = "display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};"
              .data = "${schemaAsObj}"
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
            > </schema-tree>
          `;
        }
      }
    });

    return html`
      <div class='request-body-container' data-selected-request-body-type="${this.selectedRequestBodyType}">
        <div class="table-title top-gap row">
          <span class="key-label">Request body</span>&nbsp; ${this.request_body.required ? html`<span class="mono-font param-required">required</span>` : ''}
          <span class="selected-request-inline"> ${this.selectedRequestBodyType}</span>
          <span class="request-flex-inline"></span>
          ${reqBodyTypeSelectorHtml}
        </div>
        ${this.request_body.description ? html`<div class="m-markdown md-mbottom">${unsafeHTML(marked(this.request_body.description))}</div>` : ''}

        ${(this.selectedRequestBodyType.includes('json') || this.selectedRequestBodyType.includes('xml') || this.selectedRequestBodyType.includes('text') || this.selectedRequestBodyType.includes('jose'))
          ? html`
            <div class="tab-panel col request-body-tab-inline">
              <div class="tab-buttons row" @click="${(e) => { if (e.target.tagName.toLowerCase() === 'button') { this.activeSchemaTab = e.target.dataset.tab; } }}">
                <button class="tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab = 'example'>EXAMPLE</button>
                <button class="tab-btn ${this.activeSchemaTab !== 'example' ? 'active' : ''}" data-tab = 'schema'>SCHEMA</button>
              </div>
              ${html`<div class="tab-content col" style="display:${this.activeSchemaTab === 'example' ? 'block' : 'none'};"> ${reqBodyExampleHtml}</div>`}
              ${html`<div class="tab-content col" style="display:${this.activeSchemaTab === 'example' ? 'none' : 'block'};"> ${reqBodySchemaHtml}</div>`}
            </div>`
          : html`
            ${reqBodyFileInputHtml}
            ${reqBodyFormHtml}`
        }
      </div>
    `;
  }

  formDataParamAsObjectTemplate(fieldName, fieldSchema, mimeType) {
    // This template is used when form-data param should be send as a object (application/json, application/xml)
    const formdataPartSchema = schemaInObjectNotation(fieldSchema, {});
    const formdataPartExample = generateExample(
      fieldSchema,
      'json',
      fieldSchema.examples,
      fieldSchema.example,
      this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
      this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
      'text',
      false,
    );

    return html`
      <div class="tab-panel row tpanel-row-inline">
        <div class="tpr-div">
          <div class="row tpr-div-int" @click="${(e) => {
          if (e.target.classList.contains('v-tab-btn')) {
            const { tab } = e.target.dataset;
            if (tab) {
              const tabPanelEl = e.target.closest('.tab-panel');
              const selectedTabBtnEl = tabPanelEl.querySelector(`.v-tab-btn[data-tab="${tab}"]`);
              const otherTabBtnEl = [...tabPanelEl.querySelectorAll(`.v-tab-btn:not([data-tab="${tab}"])`)];
              const selectedTabContentEl = tabPanelEl.querySelector(`.tab-content[data-tab="${tab}"]`);
              const otherTabContentEl = [...tabPanelEl.querySelectorAll(`.tab-content:not([data-tab="${tab}"])`)];
              selectedTabBtnEl.classList.add('active');
              selectedTabContentEl.style.display = 'block';
              otherTabBtnEl.forEach((el) => { el.classList.remove('active'); });
              otherTabContentEl.forEach((el) => { el.style.display = 'none'; });
            }
          }
          if (e.target.tagName.toLowerCase() === 'button') { this.activeSchemaTab = e.target.dataset.tab; }
        }}">
          <button class="v-tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab = 'example'>EXAMPLE</button>
          <button class="v-tab-btn ${this.activeSchemaTab !== 'example' ? 'active' : ''}" data-tab = 'schema'>SCHEMA</button>
        </div>
      </div>
      ${html`
        <div class="tab-content col tab-cont-col-div" data-tab='example' style="display:${this.activeSchemaTab === 'example' ? 'block' : 'none'};">
          <textarea
            class = "textarea full-width no-border res-vert"
            part = "textarea textarea-param"
            data-array = "false"
            data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
            data-pname = "${fieldName}"
            data-example = "${formdataPartExample[0]?.exampleValue || ''}"
            .textContent = "${this.fillRequestFieldsWithExample === 'true' ? formdataPartExample[0].exampleValue : ''}"
            spellcheck = "false"
          ></textarea>
        </div>`
      }
      ${html`
        <div class="tab-content col tab-cont-col-div" data-tab = 'schema' style="display:${this.activeSchemaTab !== 'example' ? 'block' : 'none'};">
          <schema-tree
            .data = '${formdataPartSchema}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
          > </schema-tree>
        </div>`
      }
      </div>
    `;
  }

  formDataTemplate(schema, mimeType, exampleValue = '') {
    const formDataTableRows = [];
    if (schema.properties) {
      for (const fieldName in schema.properties) {
        const fieldSchema = schema.properties[fieldName];
        if (fieldSchema.readOnly) {
          continue;
        }
        const fieldExamples = fieldSchema.examples || fieldSchema.example || '';
        const fieldType = fieldSchema.type;
        const paramSchema = getTypeInfo(fieldSchema);
        const labelColWidth = 'read focused'.includes(this.renderStyle) ? '200px' : '160px';
        const example = normalizeExamples((paramSchema.examples || paramSchema.example), paramSchema.type);
        formDataTableRows.push(html`
        <tr title="${fieldSchema.deprecated ? 'Deprecated' : ''}">
          <td class="min-width-input" style="width:${labelColWidth};">
            <div class="param-name ${fieldSchema.deprecated ? 'deprecated' : ''}">
              ${fieldName}${(schema.required?.includes(fieldName) || fieldSchema.required) ? html`<span class='param-required'>required</span>` : ''}
            </div>
            <div class="param-type">${paramSchema.type}</div>
          </td>
          <td class="min-width-input"
            style="${fieldType === 'object' ? 'width:100%; padding:0;' : this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions') ? '' : 'display:none;'}"
            colspan="${fieldType === 'object' ? 2 : 1}">
            ${fieldType === 'array'
              ? fieldSchema.items?.format === 'binary'
                ? html`
                <div class="file-input-container col align-flex-end" @click="${(e) => this.onAddRemoveFileInput(e, fieldName, mimeType)}">
                  <div class='input-set row'>
                    <input
                      type = "file"
                      part = "file-input"
                      class = "full-width"
                      data-pname = "${fieldName}"
                      data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                      data-array = "false"
                      data-file-array = "true"
                    />
                    <button class="file-input-remove-btn"> &#x2715; </button>
                  </div>
                  <button class="m-btn primary file-input-add-btn" part="btn btn-fill">ADD</button>
                </div>
                `
                : html`
                  <tag-input
                    class = "full-width"
                    data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                    data-pname = "${fieldName}"
                    data-example = "${Array.isArray(fieldExamples) ? fieldExamples.join('~|~') : fieldExamples}"
                    data-array = "true"
                    placeholder = "add-multiple &#x21a9;"
                    .value = "${Array.isArray(fieldExamples) ? Array.isArray(fieldExamples[0]) ? fieldExamples[0] : [fieldExamples[0]] : [fieldExamples]}"
                  >
                  </tag-input>
                `
              : html`
                ${fieldType === 'object'
                  ? this.formDataParamAsObjectTemplate.call(this, fieldName, fieldSchema, mimeType)
                  : html`
                    ${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions')
                      ? html`<input
                          .value = "${this.fillRequestFieldsWithExample === 'true' ? example.exampleVal : ''}"
                          spellcheck = "false"
                          type = "${fieldSchema.format === 'binary' ? 'file' : fieldSchema.format === 'password' ? 'password' : 'text'}"
                          part = "textbox textbox-param"
                          class = "full-width"
                          data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                          data-pname = "${fieldName}"
                          data-example = "${Array.isArray(fieldExamples) ? fieldExamples[0] : fieldExamples}"
                          data-array = "false"
                        />`
                      : ''
                    }
                    `
                  }`
              }
          </td>
          ${fieldType === 'object'
            ? ''
            : html`
              <td>
                ${paramSchema.default || paramSchema.constrain || paramSchema.allowedValues || paramSchema.pattern
                  ? html`
                    <div class="param-constraint">
                      ${paramSchema.default ? html`<span class="bold-text">Default: </span><span class="font-mono">${paramSchema.default}</span><br/>` : ''}
                      ${paramSchema.pattern ? html`<span class="bold-text">Pattern: </span><span class="font-mono">${paramSchema.pattern}</span><br/>` : ''}
                      ${paramSchema.constrain ? html`${paramSchema.constrain}<br/>` : ''}
                      ${paramSchema.allowedValues && paramSchema.allowedValues.split('|').map((v, i) => html`
                        ${i > 0 ? '|' : html`<span class="bold-text">Allowed: </span>`}
                        ${html`
                          <a part="anchor anchor-param-constraint" class = "anchor-param-constraint-font ${this.allowTry === 'true' && !this.path.includes('/webhook-subscriptions') ? '' : 'inactive-link'}"
                            data-type="${paramSchema.type === 'array' ? paramSchema.type : 'string'}"
                            data-enum="${v.trim()}"
                            @click="${(e) => {
                              const inputEl = e.target.closest('table').querySelector(`[data-pname="${fieldName}"]`);
                              if (inputEl) {
                                if (e.target.dataset.type === 'array') {
                                  inputEl.value = [e.target.dataset.enum];
                                } else {
                                  inputEl.value = e.target.dataset.enum;
                                }
                              }
                            }}"
                          >
                            ${v}
                          </a>`
                        }`)
                      }
                    </div>`
                  : ''
                }
              </td>`
          }
        </tr>
        ${fieldType === 'object'
          ? ''
          : html`
            <tr>
              <td class="no-border"> </td>
              <td colspan="2" class="no-border colspan-2">
                <span>${unsafeHTML(marked(fieldSchema.description || ''))}</span>
                ${this.exampleListTemplate.call(this, fieldName, paramSchema.type, example.exampleList)}
              </td>
            </tr>
          `
        }`);
      }
      return html`
        <table class="m-table full-width">
          ${formDataTableRows}
        </table>
      `;
    }

    return html`
      <textarea
        class = "textarea dynamic-form-param ${mimeType} full-width"
        part = "textarea textarea-param"
        spellcheck = "false"
        data-pname="dynamic-form"
        data-ptype="${mimeType}"
        .textContent = "${exampleValue}"
      ></textarea>
      ${schema.description ? html`<span class="">${unsafeHTML(marked(schema.description))}</span>` : ''}
    `;
  }

  apiResponseTabTemplate() {
    let responseFormat = '';
    let responseContent = '';
    if (!this.responseIsBlob) {
      if (this.responseHeaders.includes('application/x-ndjson')) {
        responseFormat = 'json';
        const prismLines = this.responseText.split('\n').map((q) => Prism.highlight(q, Prism.languages[responseFormat], responseFormat)).join('\n');
        responseContent = html`<code>${unsafeHTML(prismLines)}</code>`;
      } else if (this.responseHeaders.includes('json')) {
        responseFormat = 'json';
        responseContent = html`<code>${unsafeHTML(Prism.highlight(this.responseText, Prism.languages[responseFormat], responseFormat))}</code>`;
      } else if (this.responseHeaders.includes('html') || this.responseHeaders.includes('xml')) {
        responseFormat = 'html';
        responseContent = html`<code>${unsafeHTML(Prism.highlight(this.responseText, Prism.languages[responseFormat], responseFormat))}</code>`;
      } else {
        responseFormat = 'text';
        responseContent = html`<code>${this.responseText}</code>`;
      }
    }
    return html`
      <div class="row response-row">
        <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
        <div class="request-flex-inline"></div>
      </div>
      <div class="tab-panel col response-col">
        <div id="tab_buttons" class="tab-buttons row" @click="${(e) => {
            if (e.target.classList.contains('tab-btn') === false) { return; }
            this.activeResponseTab = e.target.dataset.tab;
        }}">
          <button class="tab-btn ${this.activeResponseTab === 'response' ? 'active' : ''}" data-tab = 'response'>RESPONSE</button>
          <button class="tab-btn ${this.activeResponseTab === 'headers' ? 'active' : ''}"  data-tab = 'headers'>RESPONSE HEADERS</button>
          <button class="tab-btn ${this.activeResponseTab === 'curl' ? 'active' : ''}" data-tab = 'curl'>CURL</button>
        </div>
        ${this.responseIsBlob
          ? html`
            <div class="tab-content col request-flex-inline" style="display:${this.activeResponseTab === 'response' ? 'flex' : 'none'};">
              <button class="m-btn thin-border mar-top-8 small-width" @click='${(e) => { downloadResource(this.responseBlobUrl, this.respContentDisposition, e); }}' part="btn btn-outline">
                DOWNLOAD
              </button>
              ${this.responseBlobType === 'view'
                ? html`<button class="m-btn thin-border mar-top-8 small-width"  @click='${(e) => { viewResource(this.responseBlobUrl, e); }}' part="btn btn-outline">VIEW (NEW TAB)</button>`
                : ''
              }
            </div>`
          : html`
            <div class="tab-content col m-markdown request-flex-inline" style="display:${this.activeResponseTab === 'response' ? 'flex' : 'none'};" >
              <button class="toolbar-btn copy-button" @click='${(e) => { copyToClipboard(this.responseText, e); }}' part="btn btn-fill"> Copy </button>
              <pre class="response-pre">${responseContent}</pre>
            </div>`
        }
        <div class="tab-content col m-markdown request-flex-inline" style="display:${this.activeResponseTab === 'headers' ? 'flex' : 'none'};" >
          <button  class="toolbar-btn copy-button" @click='${(e) => { copyToClipboard(this.responseHeaders, e); }}' part="btn btn-fill"> Copy </button>
          <pre class="response-pre"><code>${unsafeHTML(Prism.highlight(this.responseHeaders, Prism.languages.css, 'css'))}</code></pre>
        </div>
        <div class="tab-content col m-markdown request-flex-inline" style="display:${this.activeResponseTab === 'curl' ? 'flex' : 'none'};">
          <button  class="toolbar-btn copy-button" @click='${(e) => { copyToClipboard(this.curlSyntax.replace(/\\$/, ''), e); }}' part="btn btn-fill"> Copy </button>
          <pre class="response-pre"><code>${unsafeHTML(Prism.highlight(this.curlSyntax.trim().replace(/\\$/, ''), Prism.languages.shell, 'shell'))}</code></pre>
        </div>
      </div>
      <div class="clear-response">
        <button class="m-btn" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
      </div>
      `;
  }

  apiCallTemplate() {
    let selectServerDropdownHtml = '';

    if (this.servers && this.servers.length > 0) {
      selectServerDropdownHtml = html`
        <select class="min-width-input" @change='${(e) => { this.serverUrl = e.target.value; }}'>
          ${this.servers.map((v) => html`<option value = "${v.url}"> ${v.url} - ${v.description} </option>`)}
        </select>
      `;
    }
    const selectedServerHtml = html`
      <div class="sel-server">
        ${selectServerDropdownHtml}
        ${this.serverUrl
          ? html`
            <div class="sel-server-div">
              <div class="sel-server-label">API server: </div>
              <span class="gray-text"> ${this.serverUrl} </span>
            </div>
          `
          : ''
        }
      </div>
    `;

    return html`
    <div class="response-auth">
      <div class="hide-in-small-screen response-auth-mobile">
        <div class="response-auth-html">
          ${selectedServerHtml}
        </div>
        <div class="disp-flex">
          <div class="sel-server-label">Authentication: </div>
          ${this.security?.length > 0
            ? html`
              ${this.api_keys.length > 0
                ? html`<div class="response-auth-applied">
                    ${this.api_keys.length === 1
                      ? `${this.api_keys[0]?.typeDisplay} in ${this.api_keys[0].in}`
                      : `${this.api_keys.length} API keys applied`
                    }
                  </div>`
                : html`<div class="gray-text"><span class='param-required'>Required</span> <span class="response-auth-none">(None applied)</span>`
              }`
            : html`<span class="gray-text"> Not required </span>`
          }
        </div>
      </div>
    </div>
    ${
      this.parameters.length > 0 || this.request_body
        ? html`
          <button class="m-btn thin-border" part="btn btn-outline btn-fill mright-btn" @click="${this.onFillRequestData}" title="Fills with example data (if provided)">
            FILL EXAMPLE
          </button>
          <button class="m-btn thin-border" part="btn btn-outline btn-clear mright-btn" @click="${this.onClearRequestData}">
            CLEAR
          </button>`
        : ''
    }
    <button class="m-btn primary thin-border btn-try" part="btn btn-try" @click="${this.onTryClick}">TRY</button>
  ${this.responseMessage === '' ? '' : this.apiResponseTabTemplate()}
    `;
  }
  /* eslint-enable indent */

  async onFillRequestData(e) {
    const requestPanelEl = e.target.closest('.request-panel');
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => {
      if (el.dataset.example) {
        if (el.tagName.toUpperCase() === 'TAG-INPUT') {
          el.value = el.dataset.example.split('~|~');
        } else {
          el.value = el.dataset.example;
        }
      }
    });
  }

  async onClearRequestData(e) {
    const requestPanelEl = e.target.closest('.request-panel');
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => { el.value = ''; });
  }

  async onTryClick(e) {
    // const me = this;
    if (window.ym) {
      window.ym(57571228, 'reachGoal', 'button_docs_api_try');
    }
    const tryBtnEl = e.target;
    let fetchUrl;
    let curlUrl;
    let curl = '';
    let curlHeaders = '';
    let curlData = '';
    let curlForm = '';
    const respEl = this.closest('.expanded-req-resp-container, .req-resp-container')?.getElementsByTagName('api-response')[0];
    const acceptHeader = respEl?.selectedMimeType;
    const requestPanelEl = e.target.closest('.request-panel');
    const pathParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='path']")];
    const queryParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='query']")];
    const queryParamObjTypeEls = [...requestPanelEl.querySelectorAll("[data-ptype='query-object']")];
    const headerParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='header']")];
    const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');
    fetchUrl = this.path;
    const fetchOptions = {
      method: this.method.toUpperCase(),
    };
    // Generate URL using Path Params
    pathParamEls.map((el) => {
      fetchUrl = fetchUrl.replace(`{${el.dataset.pname}}`, encodeURIComponent(el.value));
    });

    // Query Params
    const urlQueryParamsMap = new Map();
    const queryParamsWithReservedCharsAllowed = [];
    if (queryParamEls.length > 0) {
      queryParamEls.forEach((el) => {
        const queryParam = new URLSearchParams();
        if (el.dataset.paramAllowReserved === 'true') {
          queryParamsWithReservedCharsAllowed.push(el.dataset.pname);
        }
        if (el.dataset.array === 'false') {
          if (el.value !== '') {
            queryParam.append(el.dataset.pname, el.value);
          }
        } else {
          const { paramSerializeStyle, paramSerializeExplode } = el.dataset;
          let vals = ((el.value && Array.isArray(el.value)) ? el.value : []);
          vals = Array.isArray(vals) ? vals.filter((v) => v !== '') : [];
          if (vals.length > 0) {
            if (paramSerializeStyle === 'spaceDelimited') {
              queryParam.append(el.dataset.pname, vals.join(' ').replace(/^\s|\s$/g, ''));
            } else if (paramSerializeStyle === 'pipeDelimited') {
              queryParam.append(el.dataset.pname, vals.join('|').replace(/^\||\|$/g, ''));
            } else {
              if (paramSerializeExplode === 'true') { // eslint-disable-line no-lonely-if
                vals.forEach((v) => { queryParam.append(el.dataset.pname, v); });
              } else {
                queryParam.append(el.dataset.pname, vals.join(',').replace(/^,|,$/g, ''));
              }
            }
          }
        }
        if (queryParam.toString()) {
          urlQueryParamsMap.set(el.dataset.pname, queryParam);
        }
      });
    }

    // Query Params (Dynamic - create from JSON)
    if (queryParamObjTypeEls.length > 0) {
      queryParamObjTypeEls.map((el) => {
        const queryParam = new URLSearchParams();
        try {
          let queryParamObj = {};
          const { paramSerializeStyle, paramSerializeExplode } = el.dataset;
          queryParamObj = Object.assign(queryParamObj, JSON.parse(el.value.replace(/\s+/g, ' ')));
          if (el.dataset.paramAllowReserved === 'true') {
            queryParamsWithReservedCharsAllowed.push(el.dataset.pname);
          }
          if ('json xml'.includes(paramSerializeStyle)) {
            if (paramSerializeStyle === 'json') {
              queryParam.append(el.dataset.pname, JSON.stringify(queryParamObj));
            } else if (paramSerializeStyle === 'xml') {
              queryParam.append(el.dataset.pname, json2xml(queryParamObj));
            }
          } else {
            for (const key in queryParamObj) {
              if (typeof queryParamObj[key] === 'object') {
                if (Array.isArray(queryParamObj[key])) {
                  if (paramSerializeStyle === 'spaceDelimited') {
                    queryParam.append(key, queryParamObj[key].join(' '));
                  } else if (paramSerializeStyle === 'pipeDelimited') {
                    queryParam.append(key, queryParamObj[key].join('|'));
                  } else {
                    if (paramSerializeExplode === 'true') { // eslint-disable-line no-lonely-if
                      queryParamObj[key].forEach((v) => {
                        queryParam.append(key, v);
                      });
                    } else {
                      queryParam.append(key, queryParamObj[key]);
                    }
                  }
                }
              } else {
                queryParam.append(key, queryParamObj[key]);
              }
            }
          }
        } catch (err) {
          console.log('RapiDoc: unable to parse %s into object', el.value); // eslint-disable-line no-console
        }
        if (queryParam.toString()) {
          urlQueryParamsMap.set(el.dataset.pname, queryParam);
        }
      });
    }
    let urlQueryParamString = '';
    if (urlQueryParamsMap.size) {
      urlQueryParamString = '?';
      urlQueryParamsMap.forEach((val, pname) => {
        if (queryParamsWithReservedCharsAllowed.includes(pname)) {
          urlQueryParamString += `${pname}=`;
          urlQueryParamString += val.getAll(pname).join(`&${pname}=`);
          urlQueryParamString += '&';
        } else {
          urlQueryParamString += `${val.toString()}&`;
        }
      });
      urlQueryParamString = urlQueryParamString.slice(0, -1);
    }
    fetchUrl = `${fetchUrl}${urlQueryParamString}`;

    // Add authentication Query-Param if provided
    this.api_keys
      .filter((v) => (v.in === 'query'))
      .forEach((v) => {
        fetchUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${v.name}=${encodeURIComponent(v.finalKeyValue)}`;
      });

    // Final URL for API call
    fetchUrl = `${this.serverUrl.replace(/\/$/, '')}${fetchUrl}`;
    if (fetchUrl.startsWith('http') === false) {
      const url = new URL(fetchUrl, window.location.href);
      curlUrl = url.href;
    } else {
      curlUrl = fetchUrl;
    }
    curl = `curl -X ${this.method.toUpperCase()} "${curlUrl}" \\\n`;
    const reqHeaders = new Headers();
    if (acceptHeader) {
      // Uses the acceptHeader from Response panel
      reqHeaders.append('Accept', acceptHeader);
      curlHeaders += ` -H "Accept: ${acceptHeader}" \\\n`;
    } else if (this.accept) {
      reqHeaders.append('Accept', this.accept);
      curlHeaders += ` -H "Accept: ${this.accept}" \\\n`;
    }

    // Add Authentication Header if provided
    this.api_keys
      .filter((v) => (v.in === 'header'))
      .forEach((v) => {
        reqHeaders.append(v.name, v.finalKeyValue);
        curlHeaders += ` -H "${v.name}: ${v.finalKeyValue}" \\\n`;
      });

    // Add Header Params
    headerParamEls.map((el) => {
      if (el.value) {
        reqHeaders.append(el.dataset.pname, el.value);
        curlHeaders += ` -H "${el.dataset.pname}: ${el.value}" \\\n`;
      }
    });

    // Request Body Params
    if (requestBodyContainerEl) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType;
      if (requestBodyType.includes('form-urlencoded')) {
        // url-encoded Form Params (dynamic) - Parse JSON and generate Params
        const formUrlDynamicTextAreaEl = requestPanelEl.querySelector("[data-ptype='dynamic-form']");
        if (formUrlDynamicTextAreaEl) {
          const val = formUrlDynamicTextAreaEl.value;
          const formUrlDynParams = new URLSearchParams();
          let proceed = true;
          let tmpObj;
          if (val) {
            try {
              tmpObj = JSON.parse(val);
            } catch (err) {
              proceed = false;
              console.warn('RapiDoc: Invalid JSON provided', err); // eslint-disable-line no-console
            }
          } else {
            proceed = false;
          }
          if (proceed) {
            for (const prop in tmpObj) {
              formUrlDynParams.append(prop, JSON.stringify(tmpObj[prop]));
            }
            fetchOptions.body = formUrlDynParams;
            curlData = ` -d ${formUrlDynParams.toString()} \\\n`;
          }
        } else {
          // url-encoded Form Params (regular)
          const formUrlEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-urlencode']")];
          const formUrlParams = new URLSearchParams();
          formUrlEls
            .filter((v) => (v.type !== 'file'))
            .forEach((el) => {
              if (el.dataset.array === 'false') {
                if (el.value) {
                  formUrlParams.append(el.dataset.pname, el.value);
                }
              } else {
                const vals = (el.value && Array.isArray(el.value)) ? el.value.join(',') : '';
                formUrlParams.append(el.dataset.pname, vals);
              }
            });
          fetchOptions.body = formUrlParams;
          curlData = ` -d ${formUrlParams.toString()} \\\n`;
        }
      } else if (requestBodyType.includes('form-data')) {
        const formDataParams = new FormData();
        const formDataEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-data']")];
        formDataEls.forEach((el) => {
          if (el.dataset.array === 'false') {
            if (el.type === 'file' && el.files[0]) {
              formDataParams.append(el.dataset.pname, el.files[0], el.files[0].name);
              curlForm += ` -F "${el.dataset.pname}=@${el.files[0].name}" \\\n`;
            } else if (el.value) {
              formDataParams.append(el.dataset.pname, el.value);
              curlForm += ` -F "${el.dataset.pname}=${el.value}" \\\n`;
            }
          } else if (el.value && Array.isArray(el.value)) {
            el.value.forEach((v) => {
              curlForm = `${curlForm} -F "${el.dataset.pname}[]=${v}" \\\n`;
            });
            formDataParams.append(el.dataset.pname, el.value.join(','));
          }
        });
        fetchOptions.body = formDataParams;
      } else if (/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(requestBodyType)) {
        const bodyParamFileEl = requestPanelEl.querySelector('.request-body-param-file');
        if (bodyParamFileEl?.files[0]) {
          fetchOptions.body = bodyParamFileEl.files[0]; // eslint-disable-line prefer-destructuring
          curlData = ` --data-binary @${bodyParamFileEl.files[0].name} \\\n`;
        }
      } else if (requestBodyType.includes('json') || requestBodyType.includes('xml') || requestBodyType.includes('text')) {
        const exampleTextAreaEl = requestPanelEl.querySelector('.request-body-param-user-input');
        if (exampleTextAreaEl?.value) {
          fetchOptions.body = exampleTextAreaEl.value;
          if (requestBodyType.includes('json')) {
            try {
              curlData = ` -d '${JSON.stringify(JSON.parse(exampleTextAreaEl.value))}' \\\n`;
            } catch (err) {
              // Ignore.
            }
          }
          if (!curlData) {
            curlData = ` -d '${exampleTextAreaEl.value.replace(/'/g, '\'"\'"\'')}' \\\n`;
          }
        }
      }
      // Common for all request-body
      if (!requestBodyType.includes('form-data')) {
        // For multipart/form-data dont set the content-type to allow creation of browser generated part boundaries
        reqHeaders.append('Content-Type', requestBodyType);
      }
      curlHeaders += ` -H "Content-Type: ${requestBodyType}" \\\n`;
    }
    this.responseUrl = '';
    this.responseHeaders = [];
    this.curlSyntax = '';
    this.responseStatus = 'success';
    this.responseIsBlob = false;

    this.respContentDisposition = '';
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
    this.curlSyntax = `${curl}${curlHeaders}${curlData}${curlForm}`;
    if (this.fetchCredentials) {
      fetchOptions.credentials = this.fetchCredentials;
    }
    const controller = new AbortController();
    const { signal } = controller;
    fetchOptions.headers = reqHeaders;
    const fetchRequest = new Request(fetchUrl, fetchOptions);
    this.dispatchEvent(new CustomEvent('before-try', {
      bubbles: true,
      composed: true,
      detail: {
        request: fetchRequest,
        controller,
      },
    }));

    let fetchResponse;
    let responseClone;
    try {
      let respBlob;
      let respJson;
      let respText;
      tryBtnEl.disabled = true;
      this.responseText = '⌛';
      this.responseMessage = '';
      this.requestUpdate();
      const startTime = performance.now();
      fetchResponse = await fetch(fetchRequest, { signal });
      const endTime = performance.now();
      responseClone = fetchResponse.clone(); // create a response clone to allow reading response body again (response.json, response.text etc)
      tryBtnEl.disabled = false;
      this.responseMessage = html`${fetchResponse.statusText ? `${fetchResponse.statusText}:${fetchResponse.status}` : fetchResponse.status} <div class="rsp-msg"> Took ${Math.round(endTime - startTime)} milliseconds </div>`;
      this.responseUrl = fetchResponse.url;
      const respHeadersObj = {};
      fetchResponse.headers.forEach((hdrVal, hdr) => {
        respHeadersObj[hdr] = hdrVal;
        this.responseHeaders = `${this.responseHeaders}${hdr}: ${hdrVal}\n`;
      });
      const contentType = fetchResponse.headers.get('content-type');
      const respEmpty = (await fetchResponse.clone().text()).length === 0;
      if (respEmpty) {
        this.responseText = '';
      } else if (contentType) {
        if (contentType === 'application/x-ndjson') {
          this.responseText = await fetchResponse.text();
        } else if (contentType.includes('json')) {
          if ((/charset=[^"']+/).test(contentType)) {
            const encoding = contentType.split('charset=')[1];
            const buffer = await fetchResponse.arrayBuffer();
            try {
              respText = new TextDecoder(encoding).decode(buffer);
            } catch {
              respText = new TextDecoder('utf-8').decode(buffer);
            }
            try {
              respJson = JSON.parse(respText);
              this.responseText = JSON.stringify(respJson, null, 2);
            } catch {
              this.responseText = respText;
            }
          } else {
            respJson = await fetchResponse.json();
            this.responseText = JSON.stringify(respJson, null, 2);
          }
        // eslint-disable-next-line no-useless-escape
        } else if (/^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$|^application\/vnd\./.test(contentType)) {
          this.responseIsBlob = true;
          this.responseBlobType = 'download';
        } else if (/^audio|^image|^video/.test(contentType)) {
          this.responseIsBlob = true;
          this.responseBlobType = 'view';
        } else {
          respText = await fetchResponse.text();
          if (contentType.includes('xml')) {
            this.responseText = formatXml(respText, { textNodesOnSameLine: true, indentor: '  ' });
          } else {
            this.responseText = respText;
          }
        }
        if (this.responseIsBlob) {
          const contentDisposition = fetchResponse.headers.get('content-disposition');
          this.respContentDisposition = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"|'/g, '') : 'filename';
          respBlob = await fetchResponse.blob();
          this.responseBlobUrl = URL.createObjectURL(respBlob);
        }
      } else {
        respText = await fetchResponse.text();
        this.responseText = respText;
      }
      this.dispatchEvent(new CustomEvent('after-try', {
        bubbles: true,
        composed: true,
        detail: {
          request: fetchRequest,
          response: responseClone,
          responseHeaders: respHeadersObj,
          responseBody: respJson || respText || respBlob,
          responseStatus: responseClone.ok,
        },
      }));
    } catch (err) {
      tryBtnEl.disabled = false;
      if (err.name === 'AbortError') {
        this.dispatchEvent(new CustomEvent('request-aborted', {
          bubbles: true,
          composed: true,
          detail: {
            err,
            request: fetchRequest,
          },
        }));
        this.responseMessage = 'Request Aborted';
      } else {
        this.dispatchEvent(new CustomEvent('after-try', {
          bubbles: true,
          composed: true,
          detail: {
            err,
            request: fetchRequest,
          },
        }));
        this.responseMessage = `${err.message}`;
        this.responseStatus = 'error';
      }
    }
    this.requestUpdate();
  }

  onAddRemoveFileInput(e, pname, ptype) {
    if (e.target.tagName.toLowerCase() !== 'button') {
      return;
    }

    if (e.target.classList.contains('file-input-remove-btn')) {
      // Remove File Input Set
      const el = e.target.closest('.input-set');
      el.remove();
      return;
    }
    const el = e.target.closest('.file-input-container');

    // Add File Input Set

    // Container
    const newInputContainerEl = document.createElement('div');
    newInputContainerEl.setAttribute('class', 'input-set row');

    // File Input
    const newInputEl = document.createElement('input');
    newInputEl.type = 'file';
    newInputEl.style = 'width:200px; margin-top:2px;';
    newInputEl.setAttribute('data-pname', pname);
    newInputEl.setAttribute('data-ptype', ptype.includes('form-urlencode') ? 'form-urlencode' : 'form-data');
    newInputEl.setAttribute('data-array', 'false');
    newInputEl.setAttribute('data-file-array', 'true');

    // Remover Button
    const newRemoveBtnEl = document.createElement('button');
    newRemoveBtnEl.setAttribute('class', 'file-input-remove-btn');
    newRemoveBtnEl.innerHTML = '&#x2715;';

    newInputContainerEl.appendChild(newInputEl);
    newInputContainerEl.appendChild(newRemoveBtnEl);
    el.insertBefore(newInputContainerEl, e.target);
    // el.appendChild(newInputContainerEl);
  }

  clearResponseData() {
    this.responseUrl = '';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseStatus = 'success';
    this.responseMessage = '';
    this.responseIsBlob = false;
    this.responseBlobType = '';
    this.respContentDisposition = '';
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
  }

  disconnectedCallback() {
    // Cleanup ObjectURL forthe blob data if this component created one
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
    super.disconnectedCallback();
  }
}

// Register the element with the browser
customElements.define('api-request', ApiRequest);
