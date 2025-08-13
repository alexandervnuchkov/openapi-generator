import { html } from 'lit';

/* eslint-disable indent */
export default function overviewTemplate() {
  return html`
    <section id="overview" part="section-overview"
      class="observe-me ${this.renderStyle === 'view' ? 'section-gap' : 'section-gap--read-mode'}">
      ${this.resolvedSpec?.info
        ? html`
          <div id="api-title" part="section-overview-title" class="main-title">
            ${this.resolvedSpec.info.title}
            ${!this.resolvedSpec.info.version ? '' : html`
              <span class='api-version'>
                ${this.resolvedSpec.info.version}
              </span>`
            }
          </div>
          <slot name="overview"></slot>
        `
        : ''
      }
    </section>
  `;
}
/* eslint-enable indent */
