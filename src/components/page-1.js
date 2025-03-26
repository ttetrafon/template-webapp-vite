import { emitDialogEvent, emitNavigationEvent } from '../helper/dom.js';
import styles from '../style.css?inline';
import state from '../services/state.js';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  hr {
    width: 100%;
    margin: 15px 0;
  }

  svg-wrapper {
    margin-top: 20px;
    width: 5em;
  }
</style>

<h1>Page 1</h1>
<a href="/page-two" class="nav-link">Go to Page Two</a>

<hr>

<svg-wrapper
  image="home"
></svg-wrapper>

<hr>

<button id="open-modal">Open Modal!</button>

<hr>

<png-wrapper
  label="Aeroplane"
  image="Airplane_1"
></png-wrapper>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$navLink = this._shadow.querySelector(".nav-link");
    this.$modalBtn = this._shadow.getElementById("open-modal");
  }

  // Attributes need to be observed to be tied to the lifecycle change callback.
  static get observedAttributes() { return ['label', 'data']; }

  // Attribute values are always strings, so we need to convert them in their getter/setters as appropriate.
  get data() { return JSON.parse(this.getAttribute('data')); }
  get label() { return this.getAttribute('label'); }

  set data(value) { this.setAttribute('data', value); }
  set label(value) { this.setAttribute('label', value); }

  // A web component implements the following lifecycle methods.
  attributeChangedCallback(name, oldVal, newVal) {
    // Attribute value changes can be tied to any type of functionality through the lifecycle methods.
    if (oldVal == newVal) return;
    switch (name) {
      default:
        break;
    }
  }
  connectedCallback() {
    // Triggered when the component is added to the DOM.
    this.$navLink.addEventListener('click', this.followLink.bind(this));
    this.$modalBtn.addEventListener('click', this.openModal.bind(this));
  }
  disconnectedCallback() {
    // Triggered when the component is removed from the DOM.
    // Ideal place for cleanup code.
    // Note that when destroying a component, it is good to also release any listeners.
    this.$navLink.removeEventListener('click', this.followLink);
    this.$modalBtn.removeEventListener('click', this.openModal);
  }
  adoptedCallback() {
    // Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
    // Note that adoption does not trigger the constructor again.
  }

  /**
   *
   * @param {Event} event
   */
  followLink(event) {
    event.preventDefault();
    emitNavigationEvent(this.$navLink, '/page-two');
  }

  /**
   *
   * @param {Event} event
   */
  async openModal(event) {
    event.stopImmediatePropagation();
    console.log("clicked to open modal!");
    emitDialogEvent(this.$modalBtn, 'modal-dialog', this.modalConfirmCallback, this.modalCancelCallback);
  }
  async modalCancelCallback() {
    console.log("---> modalCancelCallback()");
  }
  async modalConfirmCallback(data) {
    console.log("---> modalConfirmCallback()", data);
  }
}

window.customElements.define('page-one', Component);