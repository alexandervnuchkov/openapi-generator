import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import '~/components/api-request';

/* eslint-disable indent */
function headingRenderer(tagElementId) {
  const renderer = new marked.Renderer();
  renderer.heading = ((text, level, raw, slugger) => `<h${level} class="observe-me" id="${tagElementId}--${slugger.slug(raw)}">${text}</h${level}>`);
  return renderer;
}

export function expandedEndpointBodyTemplate(path, tagName = '') {
  return html`
    ${this.renderStyle === 'read' ? '' : ''}
    ${(this.renderStyle === 'focused' && tagName !== 'General ⦂') ? html`<div class="upper bold-text" part="section-operation-tag"> ${tagName} </div>` : ''}
    ${path.deprecated ? html`<div class="bold-text red-text deprecated-big-text"> DEPRECATED </div>` : ''}
    ${html`
      ${path.xBadges && path.xBadges?.length > 0
        ? html`
          <div class="code-sample-expand-badge">
            ${path.xBadges.map((v) => (
                html`<span class="endbadge-style" style="background-color: var(--light-${v.color}, var(--input-bg)); color:var(--${v.color}); border:1px solid var(--${v.color})">${v.label}</span>`
              ))
            }
          </div>
          `
        : ''
      }
      <tr>
        <td>
          <p part="section-operation-summary"><a href="/#${path.method}-${path.path.replace(/{|}/g, '-')}">${path.shortSummary || `${path.method.toUpperCase()} ${path.path}`}</a></p>
        </td>
      ${path.isWebhook
        ? html`<td part="section-operation-webhook class="span-whook-exp"> WEBHOOK </td>`
        : html`
          <td class='part="section-operation-webhook-method"'>
            <p>
              <span part="label-operation-method" class='upper mono-font'><span class="classlist-method ${path.method}">${path.method}</span></span>
              <span part="label-operation-path oper-path-label" class="mono-font">${path.path}</span>
            </p>
          </td>
          <td>
          ${
            unsafeHTML(`
            <p part="section-operation-summary">${marked(path.description).split('.', 1)[0]}.</p>`)
          }
        </td>
        </tr>
        `
      }
      `
    }
  `;
}

export default function expandedEndpointTemplate() {
  if (!this.resolvedSpec) { return ''; }
  return html`
  ${this.resolvedSpec.tags.map((tag) => html`
    <section id="${tag.elementId}" part="section-tag" class="regular-font section-gap--read-mode observe-me sctn-tag-gap">
      <h2 class="tag list-tag" part="section-tag-title label-tag-title">${tag.name}</h2>
      <slot name="${tag.elementId}"></slot>
      <div class="regular-font-size">
      ${
        unsafeHTML(`
          <div class="m-markdown regular-font">
          ${marked(tag.description || '', this.infoDescriptionHeadingsInNavBar === 'true' ? { renderer: headingRenderer(tag.elementId) } : undefined)}
        </div>`)
      }
      </div>
    </section>
    <section class='regular-font section-gap--read-mode' part="section-operations-in-tag">
      <table class='m-table mtable-inline m-list-table'>
        <thead>
          <tr>
            <th>Summary</th>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        ${tag.paths.map((path) => expandedEndpointBodyTemplate.call(this, path, 'BBB'))}
      </table>
    </section>
    `)
  }
`;
}
/* eslint-enable indent */
