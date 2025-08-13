import { html } from 'lit';
import logoTemplate from '~/templates/logo-template';

/* eslint-disable indent */
export default function headerTemplate() {
  return html`
  <header class="row main-header regular-font header-uppr-level" part="section-header">
    <div class="flex-align-cntr" >
      <slot name="logo" class="logo" part="section-logo">
        ${logoTemplate('blogo-style')}
      </slot>
      <div class="only-large-screen-flex header-title" part="label-header-title">${this.headingText}</div>
    </div>
    <div class="flex-align-cntr header-cntnr">
      ${(this.allowSpecUrlLoad === 'false')
        ? ''
        : html`
          <input id="spec-url"
            type="text"
            class="header-input mono-font fnt-size-small"
            part="textbox textbox-spec-url"
            placeholder="Spec URL"
            value="${this.specUrl || ''}"
            @change="${this.onSepcUrlChange}"
            spellcheck="false"
          >
          <div class="larrow-btn">&#x21a9;</div>
        `
      }
      ${(this.allowSpecFileLoad === 'false')
        ? ''
        : html`
          <input id="spec-file"
            part = "file-input"
            type="file"
            style="display:none"
            value="${this.specFile || ''}"
            @change="${this.onSepcFileChange}"
            spellcheck="false"
           >
          <button class="m-btn primary only-large-screen mrgn-lft-10" part="btn btn-fill" @click="${this.onFileLoadClick}"> LOCAL JSON FILE </button>
        `
      }
      <slot name="header"></slot>
      ${(this.allowSearch === 'false' || 'focused'.includes(this.renderStyle))
        ? ''
        : html`
          <input id="search" class="header-input mrgn-lft-10 mx-wdth-130" type="text" part="textbox textbox-header-filter" placeholder="Filter" @change="${this.onSearchChange}" spellcheck="false" >
          <div class="larrow-btn">&#x21a9;</div>
        `
      }

      ${(this.allowAdvancedSearch === 'false' || 'focused'.includes(this.renderStyle))
        ? ''
        : html`
          <button class="m-btn primary only-large-screen btn-prim-large" part="btn btn-fill btn-search" @click="${this.onShowSearchModalClicked}">
            Search
          </button>
        `
      }
    </div>
    </header>`;
  }
/* eslint-enable indent */
