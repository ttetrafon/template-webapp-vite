import styles from '../styles/style.css?inline';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: block;
    height: 48px;
  }

  img {
    height: 100%;
    aspect-ratio: 1;
  }
</style>

<img />
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$img = this._shadow.querySelector("img");
  }

  // Attributes need to be observed to be tied to the lifecycle change callback.
  static get observedAttributes() { return ['label', 'image']; }

  // Attribute values are always strings, so we need to convert them in their getter/setters as appropriate.
  get image() { return this.getAttribute('image'); }
  get label() { return this.getAttribute('label'); }

  set image(value) { this.setAttribute('image', value); }
  set label(value) { this.setAttribute('label', value); }

  // A web component implements the following lifecycle methods.
  attributeChangedCallback(name, oldVal, newVal) {
    // Attribute value changes can be tied to any type of functionality through the lifecycle methods.
    if (oldVal == newVal) return;
    switch (name) {
      case 'image':
        this.setImageSrc(`/decorations/${ this.image }.png`);
        break;
      case 'label':
        this.$img.setAttribute("alt", this.label);
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

  async setImageSrc(url) {
    // let asset = await import(url);
    this.$img.src = url;
  }
}

window.customElements.define('png-wrapper', Component);