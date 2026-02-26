import styles from '../styles/style.css?inline';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: block;
  }

  fieldset {
    padding: 10px;
  }
</style>

<fieldset>
  <legend>Theme</legend>

</fieldset>
`;

class Component extends HTMLElement {
  private _shadow: ShadowRoot;
  private $legend: HTMLLegendElement;
  private $fieldset: HTMLFieldSetElement;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$legend = this._shadow.querySelector("legend")!;
    this.$fieldset = this._shadow.querySelector("fieldset")!;
  }

  static get observedAttributes() { return ['legend', 'data']; }

  get data() { return JSON.parse(this.getAttribute('data')!); }
  get legend() { return this.getAttribute('legend'); }

  set data(value: unknown) { this.setAttribute('data', value as string); }
  set legend(value: string | null) { this.setAttribute('legend', value!); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal == newVal) return;
    switch (name) {
      case 'data':
        break;
      case 'legend':
        this.$legend.innerHTML = this.legend!;
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
}

window.customElements.define('radio-group', Component);
