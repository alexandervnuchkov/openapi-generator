import { html } from 'lit';

// Templates
import expandedEndpointTemplate from '~/templates/expanded-endpoint-template';
import focusedEndpointTemplate from '~/templates/focused-endpoint-template';
import overviewTemplate from '~/templates/overview-template';
import endpointTemplate from '~/templates/endpoint-template';
import serverTemplate from '~/templates/server-template';
import securitySchemeTemplate, { recoverPersistedApiKeys } from '~/templates/security-scheme-template';
import headerTemplate from '~/templates/header-template';
import navbarTemplate from '~/templates/navbar-template';
import advancedSearchTemplate from '~/templates/advance-search-template';
import SetTheme from '~/utils/theme';
import { isValidHexColor } from '~/utils/color-utils';

export default function mainBodyTemplate(isMini = false, showExpandCollapse = true, showTags = true, pathsExpanded = false) {
  if (!this.resolvedSpec) {
    return '';
  }
  if (this.persistAuth === 'true') {
    recoverPersistedApiKeys.call(this);
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

    <!-- Advanced Search -->
    ${this.allowAdvancedSearch === 'false' ? '' : advancedSearchTemplate.call(this)}

    <div id='the-main-body' class="body ${this.cssClasses} ${this.allowTry === 'true' ? 'allow-try' : 'allow-no-try'}" dir= ${this.pageDirection} >
      <!-- Side Nav -->
      ${((this.renderStyle === 'read' || this.renderStyle === 'focused')
          && this.showSideNav === 'true'
          && this.resolvedSpec
        ) ? navbarTemplate.call(this) : ''
      }

      <!-- Main Content -->
      <main class="main-content regular-font" part="section-main-content">
        <slot name="back-to-top"></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${this.loading === true
            ? html`<div class="loader"></div>`
            : html`
              ${this.loadFailed === true
                ? html`<div class="jsn-schm-fail"> Unable to load the Spec</div>`
                : html`
                  <div class="operations-root" @click="${(e) => { this.handleHref(e); }}">
                  ${this.renderStyle === 'focused'
                    ? html`${focusedEndpointTemplate.call(this)}`
                    : html`
                      ${this.showInfo === 'true' ? overviewTemplate.call(this) : ''}
                      ${serverTemplate.call(this)}
                      ${this.allowAuthentication === 'true' ? securitySchemeTemplate.call(this) : ''}
                      <div id="operations-top" class="observe-me">
                        <slot name="operations-top"><div class="reference-heading">Reference</div></slot>
                      </div>
                      ${this.renderStyle === 'read'
                        ? expandedEndpointTemplate.call(this)
                        : endpointTemplate.call(this, showExpandCollapse, showTags, pathsExpanded)
                      }
                    `
                  }
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
