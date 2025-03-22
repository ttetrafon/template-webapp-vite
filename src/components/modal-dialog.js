import { emitDialogCancelEvent, emitDialogConfirmEvent } from '../helper/dom';
import styles from '../style.css?inline';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: block;
  }
</style>

<p>...</p>
<div class="flex-line">
  <button id="ok">Ok</button>
  <button id="cancel">Cancel</button>
</div>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$okBtn = this._shadow.getElementById("ok");
    this.$cancelBtn = this._shadow.getElementById("cancel");
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
    this.$okBtn.addEventListener('click', this.confirmDialog.bind(this));
    this.$cancelBtn.addEventListener('click', this.cancelDialog.bind(this));
  }
  disconnectedCallback() {
    // Triggered when the component is removed from the DOM.
    // Ideal place for cleanup code.
    // Note that when destroying a component, it is good to also release any listeners.
    this.$okBtn.removeEventListener('click', this.confirmDialog);
    this.$cancelBtn.removeEventListener('click', this.cancelDialog);
  }
  adoptedCallback() {
    // Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
    // Note that adoption does not trigger the constructor again.
  }

  cancelDialog(event) {
    event.stopPropagation();
    console.log("... clicked cancel button!")
    emitDialogCancelEvent(this.$cancelBtn);
  }

  confirmDialog(event) {
    event.stopPropagation();
    console.log("... clicked ok button!")
    emitDialogConfirmEvent(this.$okBtn, {
      prop: 'this is something',
      value: 15
    });
  }
}

window.customElements.define('modal-dialog', Component);