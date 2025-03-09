import styles from '../style.css?inline';

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
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$legend = this._shadow.querySelector("legend");
    this.$fieldset = this._shadow.querySelector("fieldset");
  }

  // Attributes need to be observed to be tied to the lifecycle change callback.
  static get observedAttributes() { return ['legend', 'data']; }

  // Attribute values are always strings, so we need to convert them in their getter/setters as appropriate.
  get data() { return JSON.parse(this.getAttribute('data')); }
  get legend() { return this.getAttribute('legend'); }

  set data(value) { this.setAttribute('data', value); }
  set legend(value) { this.setAttribute('legend', value); }

  // A web component implements the following lifecycle methods.
  attributeChangedCallback(name, oldVal, newVal) {
    // Attribute value changes can be tied to any type of functionality through the lifecycle methods.
    if (oldVal == newVal) return;
    switch (name) {
      case 'data':


        break;
      case 'legend':
        this.$legend.innerHTML = this.legend;
      default:
        break;
    }
  }
  connectedCallback() {
    // Triggered when the component is added to the DOM.
  }
  disconnectedCallback() {
    // Triggered when the component is removed from the DOM.
    // Ideal place for cleanup code.
    // Note that when destroying a component, it is good to also release any listeners.
  }
  adoptedCallback() {
    // Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
    // Note that adoption does not trigger the constructor again.
  }
}

window.customElements.define('radio-group', Component);