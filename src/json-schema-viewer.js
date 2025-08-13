import { LitElement } from 'lit';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-csharp';

// Styles
import FontStyles from '~/styles/font-styles';
import InputStyles from '~/styles/input-styles';
import FlexStyles from '~/styles/flex-styles';
import TableStyles from '~/styles/table-styles';
import PrismStyles from '~/styles/prism-styles';
import TabStyles from '~/styles/tab-styles';
import NavStyles from '~/styles/nav-styles';
import InfoStyles from '~/styles/info-styles';
import JsonSchemaStyles from '~/styles/json-schema-styles';

import EndpointStyles from '~/styles/endpoint-styles';
import ProcessSpec from '~/utils/spec-parser';
import jsonSchemaViewerTemplate from '~/templates/json-schema-viewer-template';

export default class JsonSchemaViewer extends LitElement {
  constructor() {
    super();
    this.isMini = false;
    this.updateRoute = 'false';
    this.renderStyle = 'focused';
    this.showHeader = 'true';
    this.allowAdvancedSearch = 'false';
    this.selectedExampleForEachSchema = {};
  }

  static get properties() {
    return {
      // Spec
      specUrl: { type: String, attribute: 'spec-url' },

      // Schema Styles
      schemaStyle: { type: String, attribute: 'schema-style' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },

      // Hide/show Sections
      showHeader: { type: String, attribute: 'show-header' },
      showSideNav: { type: String, attribute: 'show-side-nav' },
      showInfo: { type: String, attribute: 'show-info' },

      // Allow or restrict features
      allowSpecUrlLoad: { type: String, attribute: 'allow-spec-url-load' },
      allowSpecFileLoad: { type: String, attribute: 'allow-spec-file-load' },
      allowSpecFileDownload: { type: String, attribute: 'allow-spec-file-download' },
      allowSearch: { type: String, attribute: 'allow-search' },

      // Main Colors and Font
      theme: { type: String },
      bgColor: { type: String, attribute: 'bg-color' },
      textColor: { type: String, attribute: 'text-color' },
      primaryColor: { type: String, attribute: 'primary-color' },
      fontSize: { type: String, attribute: 'font-size' },
      regularFont: { type: String, attribute: 'regular-font' },
      monoFont: { type: String, attribute: 'mono-font' },
      loadFonts: { type: String, attribute: 'load-fonts' },

      // Internal Properties
      loading: { type: Boolean }, // indicates spec is being loaded
    };
  }

  static get styles() {
    return [
      FontStyles,
      InputStyles,
      FlexStyles,
      TableStyles,
      EndpointStyles,
      PrismStyles,
      TabStyles,
      NavStyles,
      InfoStyles,
      JsonSchemaStyles,
    ];
  }

  // Startup
  connectedCallback() {
    super.connectedCallback();
    const parent = this.parentElement;
    if (parent) {
      if (parent.offsetWidth === 0 && parent.style.width === '') {
        parent.style.width = '100vw';
      }
      if (parent.offsetHeight === 0 && parent.style.height === '') {
        parent.style.height = '100vh';
      }
      if (parent.tagName === 'BODY') {
        if (!parent.style.marginTop) { parent.style.marginTop = '0'; }
        if (!parent.style.marginRight) { parent.style.marginRight = '0'; }
        if (!parent.style.marginBottom) { parent.style.marginBottom = '0'; }
        if (!parent.style.marginLeft) { parent.style.marginLeft = '0'; }
      }
    }

    if (this.loadFonts !== 'false') {
      const fontDescriptor = {
        family: 'SuisseIntl',
        style: 'normal',
        weight: '300',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      };
      const fontWeight300 = new FontFace(
        'SuisseIntl',
        "url(https://tlkfrontprod.azureedge.net/portal-production/builds/landings/4eadd408a945fa40066bb4a744b855e375f9a1d9/requesters/static/SuisseIntl-Regular-WebS-7328f724fa58bdc7a3a70bb9430e77f0.woff2) format('woff2')",
        fontDescriptor,
      );
      fontDescriptor.weight = '600';
      const fontWeight600 = new FontFace(
        'SuisseIntl',
        "url(https://tlkfrontprod.azureedge.net/portal-production/builds/docs/7c073df18fdcae0274d90295ba9f2955b204b174/docs/requesters/static/SuisseIntl-Bold-WebS-dfd6f9413a58d64a185465235aaf7c8b.woff2) format('woff2')",
        fontDescriptor,
      );
      fontWeight300.load().then((font) => { document.fonts.add(font); });
      fontWeight600.load().then((font) => { document.fonts.add(font); });
    }

    this.renderStyle = 'focused';
    this.pathsExpanded = this.pathsExpanded === 'true';

    if (!this.showInfo || !'true, false,'.includes(`${this.showInfo},`)) { this.showInfo = 'true'; }
    if (!this.showSideNav || !'true false'.includes(this.showSideNav)) { this.showSideNav = 'true'; }
    if (!this.showHeader || !'true, false,'.includes(`${this.showHeader},`)) { this.showHeader = 'true'; }

    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) { this.schemaStyle = 'tree'; }
    if (!this.theme || !'light, dark,'.includes(`${this.theme},`)) {
      this.theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    if (!this.allowSearch || !'true, false,'.includes(`${this.allowSearch},`)) { this.allowSearch = 'true'; }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.fontSize || !'default, large, largest,'.includes(`${this.fontSize},`)) { this.fontSize = 'default'; }
    if (!this.matchType || !'includes regex'.includes(this.matchType)) { this.matchType = 'includes'; }
    if (!this.allowSchemaDescriptionExpandToggle || !'true, false,'.includes(`${this.allowSchemaDescriptionExpandToggle},`)) { this.allowSchemaDescriptionExpandToggle = 'true'; }

    marked.setOptions({
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    });
  }

  render() {
    return jsonSchemaViewerTemplate.call(this, true, false, false, this.pathsExpanded);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'spec-url') {
      if (oldVal !== newVal) {
        // put it at the end of event-loop to load all the attributes
        window.setTimeout(async () => {
          await this.loadSpec(newVal);
        }, 0);
      }
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  onSepcUrlChange() {
    this.setAttribute('spec-url', this.shadowRoot.getElementById('spec-url').value);
  }

  onSearchChange(e) {
    // Todo: Filter Search
    this.matchPaths = e.target.value;
  }

  // Public Method
  async loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }
    try {
      this.resolvedSpec = {
        specLoadError: false,
        isSpecLoading: true,
        tags: [],
      };
      this.loading = true;
      this.loadFailed = false;
      this.requestUpdate();
      const spec = await ProcessSpec.call(
        this,
        specUrl,
        this.generateMissingTags === 'true',
        this.sortTags === 'true',
        this.getAttribute('sort-endpoints-by'),
      );
      this.loading = false;
      this.afterSpecParsedAndValidated(spec);
    } catch (err) {
      this.loading = false;
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${err.message}`); // eslint-disable-line no-console
    }
  }

  async afterSpecParsedAndValidated(spec) {
    this.resolvedSpec = spec;
    const specLoadedEvent = new CustomEvent('spec-loaded', { detail: spec });
    this.dispatchEvent(specLoadedEvent);
  }

  // Called by anchor tags created using markdown
  handleHref(e) {
    if (e.target.tagName.toLowerCase() === 'a') {
      if (e.target.getAttribute('href').startsWith('#')) {
        const gotoEl = this.shadowRoot.getElementById(e.target.getAttribute('href').replace('#', ''));
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }
  }

  // Example Dropdown @change Handler
  onSelectExample(e) {
    const exampleContainerEl = e.target.closest('.json-schema-example-panel');
    const exampleEls = [...exampleContainerEl.querySelectorAll('.example')];
    exampleEls.forEach((v) => {
      v.style.display = v.dataset.example === e.target.value ? 'flex' : 'none';
    });
  }

  async scrollToEventTarget(event) {
    const navEl = event.currentTarget;
    if (!navEl.dataset.contentId) {
      return;
    }
    const contentEl = this.shadowRoot.getElementById(navEl.dataset.contentId);
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
}
customElements.define('json-schema-viewer', JsonSchemaViewer);
