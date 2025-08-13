import { html } from 'lit';
import { marked } from 'marked';
import { pathIsInSearch } from '~/utils/common-utils';
import navbarAddTemplate from '~/templates/navbar-add-template';

export function expandCollapseNavBarTag(navLinkEl, action = 'toggle') {
  const tagAndPathEl = navLinkEl?.closest('.nav-bar-tag-and-paths');
  if (tagAndPathEl) {
    const isExpanded = tagAndPathEl.classList.contains('expanded');
    if (isExpanded && (action === 'toggle' || action === 'collapse')) {
      tagAndPathEl.classList.replace('expanded', 'collapsed');
    } else if (!isExpanded && (action === 'toggle' || action === 'expand')) {
      tagAndPathEl.classList.replace('collapsed', 'expanded');
    }
  }
}

export function expandCollapseAll(navEl, action = 'expand-all') {
  const elList = [...navEl.querySelectorAll('.nav-bar-tag-and-paths')];
  if (action === 'expand-all') {
    elList.map((el) => {
      el.classList.replace('collapsed', 'expanded');
    });
  } else {
    elList.map((el) => {
      el.classList.replace('expanded', 'collapsed');
    });
  }
}

function onExpandCollapse(e) {
  expandCollapseNavBarTag(e.target, 'toggle');
}

function onExpandCollapseAll(e, action = 'expand-all') {
  expandCollapseAll(e.target.closest('.nav-scroll'), action);
}

/* eslint-disable indent */
export default function navbarTemplate() {
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) {
    return html`
      <nav class='nav-bar' part="section-navbar">
        <slot name="nav-logo" class="logo"></slot>
      </nav>
    `;
  }
  return html`
  <nav class='nav-bar ${this.renderStyle}' part="section-navbar">
    <slot name="nav-logo" class="logo"></slot>
    ${(this.allowSearch === 'false' && this.allowAdvancedSearch === 'false')
      ? ''
      : html`
        <div class="navbar-srch" style="${this.allowAdvancedSearch === 'false' ? 'border-bottom: 1px solid var(--nav-hover-bg-color)' : ''}" part="section-navbar-search">
          ${this.allowSearch === 'false'
            ? ''
            : html`
              <div class="navbar-srch-adv">
                <input id="nav-bar-search"
                  part = "textbox textbox-nav-filter"
                  class = "navbar-srch-input"
                  type = "text"
                  placeholder = "Filter"
                  @change = "${this.onSearchChange}"
                  spellcheck = "false"
                >
                <div class="navbar-srch-larrow">&#x21a9;</div>
              </div>
              ${this.matchPaths
                ? html`
                <button @click = '${this.onClearSearch}' class="m-btn thin-border navbar-srch-btn" part="btn btn-outline btn-clear-filter">
                CLEAR
              </button>`
            : ''
              }
            `
          }
          ${this.allowAdvancedSearch === 'false' || this.matchPaths || 'read'.includes(this.renderStyle)
            ? ''
            : html`
              <button class="m-btn primary" part="btn btn-fill btn-search navbar-srch-btn-add" @click="${this.onShowSearchModalClicked}">
                Search
              </button>
            `
          }
        </div>
      `
    }
    ${html`<nav class='nav-scroll' part="section-navbar-scroll">
      ${(this.showInfo === 'false' || !this.resolvedSpec.info)
        ? ''
        : html`
          ${(this.infoDescriptionHeadingsInNavBar === 'true')
            ? html`
            ${this.resolvedSpec.infoDescriptionHeaders.length > 0
              ? html`<div class='nav-bar-info' id='link-overview' data-content-id='overview' @click = '${(e) => this.scrollToEventTarget(e, false)}'>
                  ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
                </div>`
              : ''
            }
            <div class="overview-headers">
                ${this.resolvedSpec.infoDescriptionHeaders.map((header) => html`
                  <a
                    class='nav-bar-h${header.depth}'
                    id="link-overview--${new marked.Slugger().slug(header.text)}"
                    href='/#overview--${new marked.Slugger().slug(header.text)}'
                  >
                    ${header.text}
                  </a>`)
                }
              </div>
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? '' : ''}
            `
            : html`<div class='nav-bar-info' id='link-overview' data-content-id='overview' @click = '${(e) => this.scrollToEventTarget(e, false)}'>
            ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
              </div>`
          }
        `
      }

      <a class='nav-bar-info' id='link-servers' data-content-id='servers' href='/#servers'> API servers </a>

      ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
        ? ''
        : html`<a class='nav-bar-info' id='link-auth' data-content-id='auth' href='/#auth'> Authentication </a>`
      }
      <hr class="navbar-hr"/>
      <div id='link-operations-top' class='nav-bar-section operations' data-content-id='operations-top'>
        <div class="navbar-oprtns">
          ${this.renderStyle === 'focused'
            ? html`
              <div @click="${(e) => { onExpandCollapseAll.call(this, e, 'expand-all'); }}" title="Expand all" class="navbar-oprtns-exp">▸</div>
              <div @click="${(e) => { onExpandCollapseAll.call(this, e, 'collapse-all'); }}" title="Collapse all" class="navbar-oprtns-col">▸</div>`
            : ''
          }
        </div>
        <div class='nav-bar-section-title'> Reference </div>
      </div>

      <!-- TAGS AND PATHS-->
      ${this.resolvedSpec.tags
        .filter((tag) => tag.paths.filter((path) => pathIsInSearch(this.matchPaths, path, this.matchType)).length)
        .map((tag) => html`
          <div class='nav-bar-tag-and-paths ${tag.expanded ? 'collapsed' : 'expanded'}'>
            ${tag.name === 'General ⦂'
              ? ''
              : html`
              <div class="nav-bar-tag-wrapper">
              <div
                class='nav-bar-tag'
                id="link-${tag.elementId}"
                data-content-id='${tag.elementId}'
                data-first-path-id='${tag.firstPathId}'
                @click='${(e) => {
                  if (this.renderStyle === 'focused' && this.onNavTagClick === 'expand-collapse') {
                    onExpandCollapse.call(this, e);
                  } else if (this.onNavTagClick === 'expand-collapse') {
                    onExpandCollapse.call(this, e);
                    this.scrollToEventTarget(e, false);
                  }
                }}'
              >
                <div>${tag.name}</div>
              </div>
              <div class="nav-bar-tag-icon"
                @click='${(e) => {
                  if (this.onNavTagClick === 'expand-collapse') {
                    onExpandCollapse.call(this, e);
                  }
                }}'
              >
              </div>
                </div>
              `
            }
            ${(this.infoDescriptionHeadingsInNavBar === 'true')
              ? html`
                ${this.onNavTagClick === 'expand-collapse'
                  ? ''
                  : html`
                    <div class='tag-headers'>
                      ${tag.headers.map((header) => html`
                      <div
                        class='nav-bar-h${header.depth}'
                        id="link-${tag.elementId}--${new marked.Slugger().slug(header.text)}"
                        data-content-id='${tag.elementId}--${new marked.Slugger().slug(header.text)}'
                        @click='${(e) => this.scrollToEventTarget(e, false)}'
                      > ${header.text}</div>`)}
                    </div>`
                }`
              : ''
            }


            <div class='nav-bar-paths-under-tag'>
              <!-- Paths in each tag (endpoints) -->
              ${tag.paths.filter((v) => {
                if (this.matchPaths) {
                  return pathIsInSearch(this.matchPaths, v, this.matchType);
                }
                return true;
              }).map((p) => html`
              <a
                class='nav-bar-path
                ${this.usePathInNavBar === 'true' ? 'small-font' : ''}'
                data-content-id='${p.elementId}'
                id='link-${p.elementId}'
                href='/#${p.elementId}'
              >
                <span class="navbar-pths" style="${p.deprecated ? 'filter:opacity(0.5)' : ''}">

                  ${p.isWebhook ? html`<span class="navbar-pths-whook">WEBHOOK</span>` : ''}
                  ${this.usePathInNavBar === 'true'
                    ? html`<span class='mono-font'>${p.method.toUpperCase()} ${p.path}</span>`
                    : html`<span>${p.summary || p.shortSummary}</span>`
                  }
                  ${html`<span class="nav-method ${this.showMethodInNavBar} ${p.method}">
                      ${this.showMethodInNavBar === 'as-colored-block' ? p.method.toUpperCase() : p.method.toUpperCase()}
                    </span>`
                  }
                </span>
              </a>`)}
            </div>
          </div>
        `)
      }

      <!-- COMPONENTS -->
      ${this.resolvedSpec.components && this.showComponents === 'true' && this.renderStyle === 'focused'
        ? html`
          <div id='link-components' class='nav-bar-section components'>
            <div></div>
            <div class='nav-bar-section-title'>COMPONENTS</div>
          </div>
          ${this.resolvedSpec.components.map((component) => (component.subComponents.length
            ? html`
              <div class='nav-bar-tag'
                data-content-id='cmp--${component.name.toLowerCase()}'
                id='link-cmp--${component.name.toLowerCase()}'
                @click='${(e) => this.scrollToEventTarget(e, false)}'>
                ${component.name}
              </div>
              ${component.subComponents.filter((p) => p.expanded !== false).map((p) => html`
                <div class='nav-bar-path' data-content-id='cmp--${p.id}' id='link-cmp--${p.id}' @click='${(e) => this.scrollToEventTarget(e, false)}'>
                  <span> ${p.name} </span>
                </div>`)
              }`
            : ''))
          }`
        : ''
      }
      <div class="nav-bar-tag-and-paths">
        <a class="nav-bar-tag-wrapper all-classes" href="#overview">All classes and methods</a>
      </div>
      ${navbarAddTemplate.call(this)}
      <div class="nav-bar-info navbar-seealso">Related pages</div>
      <div class="overview-headers navbar-sls-block">
        <a class="nav-bar-h2" href="https://example.com">Example.com</a>
      </div>
    </nav>`
  }
</nav>
`;
}
/* eslint-enable indent */
