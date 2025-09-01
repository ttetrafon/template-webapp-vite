import { emitNavigationEvent, emitSubPageContainerEvent } from '../helper-library/dom.js';
import styles from '../styles/style.css?inline';
import state from '../services-library/state.js';
import { generalNames } from '../data-library/enums.js';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: block;
  }

  div {
    margin-top: 25px;
    gap: 10px;
  }
  section {
    margin-top: 10px;
  }
</style>

<h1>Page 2</h1>
<a href="/page-one" class="nav-link">Go to Page One</a>

<div class="flex-line">
  <button id="tab1">tab-1</button>
  <button id="tab2">tab-2</button>
</div>

<section id="tab-container"></section>

<hr>

<h2>State</h2>
<p>User role: <span id="user-role-display">?</span></p>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$navLink = this._shadow.querySelector('.nav-link');
    this.$tab1 = this._shadow.getElementById("tab1");
    this.$tab2 = this._shadow.getElementById("tab2");
    this.$tabContainer = this._shadow.getElementById("tab-container");

    this.$userRole = this._shadow.getElementById("user-role-display");
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
    emitSubPageContainerEvent(this.$tabContainer, "/page-two");

    this.followLinkBound = this.followLink.bind(this);
    this.switchToTabBoundTabOne = this.switchToTab.bind(this, "/page-two/tab-one", this.$tabContainer);
    this.switchToTabBoundTabTwo = this.switchToTab.bind(this, "/page-two/tab-two", this.$tabContainer);

    this.$navLink.addEventListener('click', this.followLinkBound);
    this.$tab1.addEventListener('click', this.switchToTabBoundTabOne);
    this.$tab2.addEventListener('click', this.switchToTabBoundTabTwo);

    state.subscribeToObservable(generalNames.OBSERVABLE_USER.description, "page-2", this.userUpdatedCallback.bind(this));
    state.getValueFromObservable(generalNames.OBSERVABLE_USER.description, "role").then((role) => {
      this.$userRole.textContent = role;
    });
  }
  disconnectedCallback() {
    // Triggered when the component is removed from the DOM.
    // Ideal place for cleanup code.
    // Note that when destroying a component, it is good to also release any listeners.
    this.$navLink.removeEventListener('click', this.followLinkBound);
    this.$tab1.removeEventListener('click', this.switchToTabBoundTabOne);
    this.$tab2.removeEventListener('click', this.switchToTabBoundTabTwo);
  }
  adoptedCallback() {
    // Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
    // Note that adoption does not trigger the constructor again.
  }

  declareSubContainer() {
    return this.$tabContainer;
  }

  /**
   *
   * @param {Event} event
   */
  followLink(event) {
    event.preventDefault();
    emitNavigationEvent(this.$navLink, '/page-one');
  }

  /**
   *
   * @param {Event} event
   */
  switchToTab(path, container, event) {
    // console.log("---> switchToTab()", path, container, event);
    event.stopImmediatePropagation();
    emitNavigationEvent(event.target, path, container);
  }

  async userUpdatedCallback(subscriber, property, newValue) {
    // console.log(`---> userUpdatedCallback(${subscriber}, ${property}, ${newValue})`);
    if (subscriber != "page-2") return;

    switch(property) {
      case "role":
        this.$userRole.textContent = newValue;
        break;
    }
  }
}

window.customElements.define('page-two', Component);