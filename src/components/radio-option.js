import styles from '../style.css?inline';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: block;
  }

  div {
    gap: 10px;
  }
</style>

<div class="flex-line">
  <input type="radio"/>
  <label class="flex-line">
    <svg-wrapper class="hidden"></svg-wrapper>
    <span></span>
  </label>
</div>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$radio = this._shadow.querySelector("input");
    this.$label = this._shadow.querySelector("label");
    this.$text = this._shadow.querySelector("span");
    this.$image = this._shadow.querySelector("svg-wrapper");
  }

  // Attributes need to be observed to be tied to the lifecycle change callback.
  static get observedAttributes() { return ['id', 'label', 'checked', 'group', 'image']; }

  // Attribute values are always strings, so we need to convert them in their getter/setters as appropriate.
  get checked() { return Boolean(this.getAttribute('checked')); }
  get group() { return this.getAttribute('group'); }
  get id() { return this.getAttribute('id'); }
  get image() { return this.getAttribute('image'); }
  get label() { return this.getAttribute('label'); }

  set checked(value) { this.setAttribute('checked', value); }
  set group(value) { this.setAttribute('group', value); }
  set id(value) { this.setAttribute('id', value); }
  set image(value) { this.setAttribute('image', value); }
  set label(value) { this.setAttribute('label', value); }

  // A web component implements the following lifecycle methods.
  attributeChangedCallback(name, oldVal, newVal) {
    // Attribute value changes can be tied to any type of functionality through the lifecycle methods.
    if (oldVal == newVal) return;
    switch (name) {
      case 'checked':
        this.$radio.checked = this.checked;
        break;
      case 'group':
        this.$radio.setAttribute("name", this.group);
        break;
      case 'id':
        this.$radio.setAttribute("id", this.id);
        this.$label.setAttribute("for", this.id);
        this.$radio.value = this.id;
        break;
      case 'label':
        this.$text.innerText = this.label;
        break;
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

window.customElements.define('radio-option', Component);