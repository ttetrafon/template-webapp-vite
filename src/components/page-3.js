import { eventNames } from '../library/data/enums';
import { jsonRequest } from '../library/helper/requests';
import styles from '../styles/style.css?inline';

const _name = 'page-three';
const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: flex;
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
    min-width: 300px;
  }

  content-filters {
    margin-top: 20px;
  }
</style>

<h1>Page 3</h1>
<a href="/page-one" class="nav-link-1">Go to Page One</a>
<a href="/page-two" class="nav-link-2">Go to Page Two</a>

<hr/>

<content-filters
  label="Φίλτρα"
></content-filters>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$navLink1 = this._shadow.querySelector('.nav-link-1');
    this.$navLink2 = this._shadow.querySelector('.nav-link-2');

    this.$contentFilter = this._shadow.querySelector('content-filters');
    this.debugFilterEvents();
  }

  // Attributes need to be observed to be tied to the lifecycle change callback.
  static get observedAttributes() { return ['label', 'data']; }

  // Attribute values are always strings, so we need to convert them in their getter/setters as appropriate.
  get data() { return JSON.parse(this.getAttribute('data')); }
  get label() { return this.getAttribute('label'); }

  set data(value) { this.setAttribute('data', value); }
  set label(value) { this.setAttribute('label', value); }

  // A web component implements the following lifecycle methods.
  /**
   * Attribute value changes can be tied to any type of functionality through the lifecycle methods.
   * @param {String} name
   * @param {Object} oldVal
   * @param {Object} newVal
   * @returns
   */
  attributeChangedCallback(name, oldVal, newVal) {
    // console.log(`--> attributeChangedCallback(${name}, ${JSON.stringify(oldVal)}, ${JSON.stringify(newVal)})`);
    if (oldVal == newVal) return;
    switch (name) {
    }
  }
  /**
   * Triggered when the component is added to the DOM.
   */
  connectedCallback() {
    this.followLink1Bound = this.followLink.bind(this, '/page-one');
    this.followLink2Bound = this.followLink.bind(this, '/page-two');

    this.$navLink1.addEventListener('click', this.followLink1Bound);
    this.$navLink2.addEventListener('click', this.followLink2Bound);

    this.getFilterData();
  }
  /**
   * Triggered when the component is removed from the DOM.
   * - Ideal place for cleanup code.
   * - Note that when destroying a component, it is good to also release any listeners.
   */
  disconnectedCallback() {
    this.$navLink1.removeEventListener('click', this.followLink1Bound);
    this.$navLink2.removeEventListener('click', this.followLink2Bound);
  }
  /**
   * Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
   * Note that adoption does not trigger the constructor again.
   */
  adoptedCallback() {
  }

  /**
   *
   * @param {Event} event
   * @param {String} page
   */
  followLink(event, page) {
    event.preventDefault();
    event.stopImmediatePropagation();
    emitNavigationEvent(this.$navLink, page);
  }

  async getFilterData() {
    const filterData = await jsonRequest("./data/filters.json");
    this.$contentFilter.setAttribute("data", JSON.stringify(filterData));
  }

  async debugFilterEvents() {
    [
      eventNames.CONTENT_FILTER_CLEAR.description
    ].forEach(eventName => {
      this.$contentFilter.addEventListener(eventName, (event) => {
        console.log(`[DEBUG] Event captured on '${_name}' shadowRoot: Type: ${event.type}, Target:`, event.target);
      }, true);
    });
  }
}

window.customElements.define(_name, Component);