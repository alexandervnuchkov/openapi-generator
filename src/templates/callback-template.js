import { html } from 'lit';

/* eslint-disable indent */
export default function callbackTemplate(callbacks) {
  return html`
    <div class="req-res-title marg-top-12">CALLBACKS</div>
    ${Object.entries(callbacks).map((kv) => html`
      <div class="tiny-title tiny-title-call">
        ${kv[0]}
        ${Object.entries(kv[1]).map((pathObj) => html`
          <div class="mono-font small-font-size callback-block">
            <div class="full-width">
              ${Object.entries(pathObj[1]).map((method) => html`
                <div>
                  <div class="marg-top-12">
                    <div class="method method-fg ${method[0]} cb-method">
                      <span class="font-gross"> &#x2944; </span>
                      ${method[0]}
                    </div>
                    <span class="cb-pathobj">${pathObj[0]} </span>
                  </div>
                  <div class='expanded-req-resp-container'>
                    <api-request
                      class = "${this.renderStyle}-mode callback full-width"
                      callback = "true"
                      method = "${method[0] || ''}",
                      path = "${pathObj[0] || ''}"
                      .parameters = "${method[1]?.parameters || ''}"
                      .request_body = "${method[1]?.requestBody || ''}"
                      fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
                      allow-try = "false"
                      render-style="${this.renderStyle}"
                      schema-style = "${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
                      schema-hide-read-only = "false"
                      schema-hide-write-only = "${this.schemaHideWriteOnly === 'never' ? 'false' : 'true'}"
                      fetch-credentials = "${this.fetchCredentials}"
                      exportparts = "btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                        file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param,
                        anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                    > </api-request>

                    <api-response
                      class = "${this.renderStyle}-mode resp-blk-left"
                      callback = "true"
                      .responses="${method[1]?.responses}"
                      render-style="${this.renderStyle}"
                      schema-style="${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                      schema-hide-read-only = "${this.schemaHideReadOnly === 'never' ? 'false' : 'true'}"
                      schema-hide-write-only = "false"
                      exportparts = "btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-copy:btn-copy,
                      schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                    > </api-response>
                  </div>
                </div>
              `)}
            </div>
          </div>
        `)}
      </div>
    `)}
  `;
}
/* eslint-enable indent */
