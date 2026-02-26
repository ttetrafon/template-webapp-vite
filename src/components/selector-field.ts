import styles from '../styles/style.css?inline';
import { selectorData } from '../data/data.ts';
import { populateSelectorOptions } from '../library/helper/dom.ts';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${styles}

  :host {
    display: block;
    width: 100%;
  }

  label {
    align-self: flex-start;
  }

  select {
    margin-bottom: 10px;
    padding: 5px 10px;
  }
</style>

<div class="flex-column">
  <label></label>
  <select></select>
</div>
`;

class Component extends HTMLElement {
  private _shadow: ShadowRoot;
  private $label: HTMLLabelElement;
  private $selector: HTMLSelectElement;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$label = this._shadow.querySelector("label")!;
    this.$selector = this._shadow.querySelector("select")!;
  }

  static get observedAttributes() { return ['label', 'options']; }

  get label() { return this.getAttribute('label'); }
  get options() { return this.getAttribute('options'); }

  set label(value: string | null) { this.setAttribute('label', value!); }
  set options(value: string | null) { this.setAttribute('options', value!); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal == newVal) return;
    switch(name) {
      case 'label':
        this.$label.innerText = this.label!;
        break;
      case 'options':
        let options = (selectorData as Record<string, Array<Record<string, string>>>)[this.options!];
        if (!options) return;
        populateSelectorOptions(this.$selector, options, "value", "label");
        break;
      default:
        break;
    }
  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }

  getValue() {
    return this.$selector.value;
  }
}

window.customElements.define('selector-field', Component);
