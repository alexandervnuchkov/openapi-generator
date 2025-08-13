import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';

// Templates
import overviewTemplate from '~/templates/overview-template';
import headerTemplate from '~/templates/header-template';
import { schemaInObjectNotation, generateExample } from '~/utils/schema-utils';
import '~/components/json-tree';
import '~/components/schema-tree';
import SetTheme from '~/utils/theme';
import { isValidHexColor } from '~/utils/color-utils';

/* eslint-disable indent */
// Json Schema Nav Template
function jsonSchemaNavTemplate() {
  return html`
  <nav class='nav-bar' part="section-navbar">
    <slot name="nav-logo" class="logo"></slot>
    <div class="jsn-nav">
      <input id="nav-bar-search"
        part = "textbox textbox-nav-filter"
        class = "jsn-input"
        type = "text"
        placeholder = "Filter"
        @change = "${this.onSearchChange}"
        spellcheck = "false"
      >
      <div class="jsn-larrow">&#x21a9;</div>
    </div>
    <nav class='nav-scroll request-flex-inline' part="section-navbar-scroll">
      ${this.resolvedSpec.schemaAndExamples.map((v) => html`
        <div class='nav-bar-path' data-content-id='${v.elementId}' id='link-${v.elementId}'
          @click = '${(e) => {
            this.scrollToEventTarget(e, false);
          }}'
        >
          ${v.name}
        </div>`)
      }
    </nav>
  </nav>
  `;
}

// Json Schema Body Template
function jsonSchemaBodyTemplate() {
  return html`
    ${this.showInfo === 'true' ? overviewTemplate.call(this) : ''}
    <div class="jsn-schm-body">
    ${this.resolvedSpec.schemaAndExamples.map((jSchemaBody) => {
      const examplesObj = generateExample(jSchemaBody.schema, 'json', jSchemaBody.examples, jSchemaBody.example, true, false, 'json', true);
      jSchemaBody.selectedExample = examplesObj[0]?.exampleId;
      return html`
        <section id='${jSchemaBody.elementId}' class='json-schema-and-example regular-font jsn-schm-section'>
          <div class="jsn-schm-section-hdr">
            <div class="jsn-schm-section-hdrname">${jSchemaBody.name}</div>
            <span class="json-schema-description m-markdown ">${unsafeHTML(marked(jSchemaBody.description || ''))}</span>
          </div>
          <div class="jsn-schm-tree">
            <div class="json-schema-def jsn-schm-def">
              <schema-tree
                .data = "${schemaInObjectNotation(jSchemaBody.schema, {})}"
                schema-expand-level = "${this.schemaExpandLevel}"
                schema-description-expanded = "${this.schemaDescriptionExpanded}"
                allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
                schema-hide-read-only = "false"
                schema-hide-write-only = "false"
              > </schema-tree>
            </div>
            <div class="json-schema-example-panel jsn-schm-example">
              ${examplesObj.length > 1
                ? html`<select class="jsn-schm-example-select" @change='${(e) => this.onSelectExample(e, jSchemaBody)}'>
                    ${examplesObj.map((v) => html`
                      <option value="${v.exampleId}" ?selected=${(v.exampleId === jSchemaBody.selectedExample)}>
                        ${v.exampleSummary.length > 80 ? v.exampleId : v.exampleSummary}
                      </option>`)
                    }
                  </select>`
                : html`<div class="jsn-schm-example-summary"> ${examplesObj[0].exampleSummary}</div>`
              }
              ${examplesObj.map((v) => html`
                <json-tree
                  .data = "${v.exampleValue}"
                  data-example = "${v.exampleId}"
                  class = "example top-gap"
                  style = "display: ${v.exampleId === jSchemaBody.selectedExample ? 'flex' : 'none'}"
                ></json-tree>`)
              }
            </div>
          </div>
        </section>`;
      })
    }
    </div>
  `;
}
/* eslint-enable indent */

// Json Schema Root Template
export default function jsonSchemaViewerTemplate(isMini = false) {
// export default function jsonSchemaViewerTemplate(isMini = false, showExpandCollapse = true, showTags = true, pathsExpanded = false) {
  if (!this.resolvedSpec) {
    return '';
  }
  const newTheme = {
    bg1: isValidHexColor(this.bgColor) ? this.bgColor : '',
    fg1: isValidHexColor(this.textColor) ? this.textColor : '',
    headerColor: isValidHexColor(this.headerColor) ? this.headerColor : '',
    primaryColor: isValidHexColor(this.primaryColor) ? this.primaryColor : '',
    navBgColor: isValidHexColor(this.navBgColor) ? this.navBgColor : '',
    navTextColor: isValidHexColor(this.navTextColor) ? this.navTextColor : '',
    navHoverBgColor: isValidHexColor(this.navHoverBgColor) ? this.navHoverBgColor : '',
    navHoverTextColor: isValidHexColor(this.navHoverTextColor) ? this.navHoverTextColor : '',
    navAccentColor: isValidHexColor(this.navAccentColor) ? this.navAccentColor : '',
  };
  /* eslint-disable indent */
  if (this.resolvedSpec.specLoadError) {
    if (isMini) {
      return html`
        ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}
        <div class="jsn-schm-err"> ${this.resolvedSpec.info.description} </div>
      `;
    }
    return html`
      ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}
      <!-- Header -->
      ${headerTemplate.call(this)}
      <h1> Header </h1>
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="jsn-schm-slot">
          <h1 class="red-text"> ${this.resolvedSpec.info.title} </h1>
          <div class="font-mono"> ${this.resolvedSpec.info.description} </div>
        </div>
      </main>
    `;
  }
  if (this.resolvedSpec.isSpecLoading) {
    return html`
      ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          <div class="loader"></div>
        </div>
      </main>
    `;
  }

  return html`
    ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}

    <!-- Header -->
    ${this.showHeader === 'false' ? '' : headerTemplate.call(this)}

    <div id='the-main-body' class="body ${this.cssClasses}" dir= ${this.pageDirection}>

      <!-- Side Nav -->
      ${jsonSchemaNavTemplate.call(this)}

      <!-- Main Content -->
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${this.loading === true
            ? html`<div class="loader"></div>`
            : html`
              ${this.loadFailed === true
                ? html`<div class="jsn-schm-fail"> Unable to load the Spec</div>`
                : html`
                  <div class="operations-root" @click="${(e) => { this.handleHref(e); }}">
                    ${jsonSchemaBodyTemplate.call(this)}
                  </div>
                `
              }`
          }
        </div>
        <slot name="footer"></slot>
      </main>
    </div>
  `;
}
/* eslint-enable indent */
