import { html } from 'lit';

/* eslint-disable indent */
export default function navbarAddTemplate() {
  return html`
  ${this.apiTagName === 'apps'
    ? html`
    `
    : html`
    `
  }`;
}
