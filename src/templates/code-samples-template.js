import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import Prism from 'prismjs';
import { copyToClipboard } from '~/utils/common-utils';

/* eslint-disable indent */
export default function codeSamplesTemplate(xCodeSamples) {
  return html`
  <section class="table-title lng-sample-title">Language</div>
  <div class="tab-panel col lng-sample-tabs"
    @click="${
      (e) => {
        if (!e.target.classList.contains('tab-btn')) { return; }
        const clickedTab = e.target.dataset.tab;

        const tabButtons = [...e.currentTarget.querySelectorAll('.tab-btn')];
        const tabContents = [...e.currentTarget.querySelectorAll('.tab-content')];
        tabButtons.forEach((tabBtnEl) => tabBtnEl.classList[tabBtnEl.dataset.tab === clickedTab ? 'add' : 'remove']('active'));
        tabContents.forEach((tabBodyEl) => { tabBodyEl.style.display = (tabBodyEl.dataset.tab === clickedTab ? 'block' : 'none'); });
      }
    }">
    <div class="tab-buttons row lng-sample-row">
      ${xCodeSamples.map((v, i) => html`<button class="tab-btn lang-button ${v.lang} ${i === 0 ? 'active' : ''}" data-tab = '${v.lang}${i}'> ${v.label || v.lang} </button>`)}
    </div>
    ${xCodeSamples.map((v, i) => html`
      <div class="tab-content m-markdown" style="display:${i === 0 ? 'block' : 'none'}" data-tab='${v.lang}${i}'>
        <button class="toolbar-btn copy-button" @click='${(e) => { copyToClipboard(v.source, e); }}'> Copy </button>
        <pre><code class="language ${v.lang}">${Prism.languages[v.lang?.toLowerCase()] ? unsafeHTML(Prism.highlight(v.source, Prism.languages[v.lang?.toLowerCase()], v.lang?.toLowerCase())) : v.source}</code></pre>
        <div class="cs-description">${unsafeHTML(marked(v.description || ''))}</div>
      </div>`)
    }
  </section>`;
}
/* eslint-enable indent */
