import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import { schemaInObjectNotation } from '~/utils/schema-utils';
import '~/components/json-tree';
import '~/components/schema-tree';
import '~/components/schema-table';

function schemaBodyTemplate(sComponent) {
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${sComponent.name}' id='cmp--${sComponent.id}' >
    <div class="bold-text"> ${sComponent.name} <span class="schm-tab"> Schema </span></div>
  ${this.schemaStyle === 'table'
    ? html`
      <schema-table
        render-style = '${this.renderStyle}'
        .data = '${schemaInObjectNotation(sComponent.component, {})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-tree> `
    : html`
      <schema-tree
        render-style = '${this.renderStyle}'
        .data = '${schemaInObjectNotation(sComponent.component, {})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-tree>`
}
  </div>`;
}

function componentBodyTemplate(sComponent, componentType) {
  if (sComponent.id.indexOf('schemas-') !== -1) {
    return schemaBodyTemplate.call(this, sComponent);
  }
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${sComponent.name}' id='cmp--${sComponent.id}' >
    ${html`
      <div class="bold-text"> ${sComponent.name} <span class="schm-tab"> ${componentType} </span> </div>
      ${sComponent.component
    ? html`
      <div class='mono-font regular-font-size schm-alt-tab'>
        <json-tree class="border tree" render-style='${this.renderStyle}' .data="${sComponent.component}"> </json-tree>
      </div>`
    : ''}
    `}
  </div>
  `;
}

export default function componentsTemplate() {
  if (!this.resolvedSpec) { return ''; }
  return html`
  ${this.resolvedSpec.components.map((component) => html`
    <div id="cmp--${component.name.toLowerCase()}" class='regular-font section-gap--read-mode observe-me comp-name'>
      <div class="title tag">${component.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(component.description ? component.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${component.subComponents.filter((c) => c.expanded !== false).map((sComponent) => componentBodyTemplate.call(this, sComponent, component.name))}
    </div>
    `)
}
`;
}
/* eslint-enable indent */
