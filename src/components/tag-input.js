import { LitElement, html } from 'lit';
import TagInputStyles from '~/styles/tag-input-styles';

export default class TagInput extends LitElement {
  /* eslint-disable indent */
  render() {
    let tagItemTmpl = '';
    if (Array.isArray(this.value)) {
      tagItemTmpl = html`${this.value
        .filter((v) => v.trim() !== '')
        .map((v) => html`<span class='tag'>${v}</span>`)
      }`;
    }
    return html`
      <div class='tags' tabindex="0">
        ${tagItemTmpl}
        <input type="text" class='editor' @paste="${(e) => this.afterPaste(e)}" @keydown="${this.afterKeyDown}" @blur="${this.onBlur}" placeholder="${this.placeholder || ''}">
      </div>
    `;
  }
  /* eslint-enable indent */

  static get properties() {
    return {
      placeholder: { type: String },
      value: { type: Array, attribute: 'value' },
    };
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'value') {
      if (newVal && oldVal !== newVal) {
        this.value = newVal.split(',').filter((v) => v.trim() !== '');
      }
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  afterPaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    const pastedArray = pastedData ? pastedData.split(',').filter((v) => v.trim() !== '') : '';
    if (pastedArray) {
      if (Array.isArray(this.value)) {
        this.value = [...this.value, ...pastedArray];
      } else {
        this.value = pastedArray;
      }
    }
    e.preventDefault();
  }

  afterKeyDown(e) {
    if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      if (e.target.value) {
        if (Array.isArray(this.value)) {
          this.value = [...this.value, e.target.value];
        } else {
          this.value = [e.target.value];
        }
        e.target.value = '';
      }
    } else if (e.keyCode === 8) {
      if (e.target.value.length === 0) {
        if (Array.isArray(this.value) && this.value.length > 0) {
          this.value.splice(-1);
          this.value = [...this.value];
        }
      }
    }
  }

  onBlur(e) {
    if (e.target.value) {
      if (Array.isArray(this.value)) {
        this.value = [...this.value, e.target.value];
      } else {
        this.value = [e.target.value];
      }
      e.target.value = '';
    }
  }

  static get styles() {
    return [TagInputStyles];
  }
}
// Register the element with the browser
customElements.define('tag-input', TagInput);
