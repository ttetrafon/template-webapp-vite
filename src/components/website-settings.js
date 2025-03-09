import styles from '../style.css?inline';
import { eventNames } from '../data/enums';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${styles}

  :host {
    display: block;
    height: 35px;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 99;
  }

  div {
    height: 100%;
    gap: 5px;
  }

  .settings-panel {
    position: absolute;
    top: 50px;
    right: 5px;
  }
</style>

<div class="flex-line">
  <button-text-image
    label="Settings"
    image="settings"
    hide-text="true"
    event-name="BUTTON_SETTINGS"
  ></button-text-image>
  <button-text-image
    label="Accessibility"
    image="settings_accessibility"
    hide-text="true"
    event-name="BUTTON_ACCESSIBILITY"
  ></button-text-image>
</div>

<settings-general-panel class="settings-panel"></settings-general-panel>
<settings-accessibility-panel class="settings-panel hidden"></settings-accessibility-panel>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.SETTINGS_GENERAL_PANEL = "settings-general-panel";
    this.SETTINGS_ACCESSIBILITY_PANEL = "settings-accessibility-panel";

    this.$panels = {};
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
    switch(name) {
      default:
        break;
    }
  }
  connectedCallback() {
    // Triggered when the component is added to the DOM.
    this.$panels[this.SETTINGS_GENERAL_PANEL] = this._shadow.querySelector(this.SETTINGS_GENERAL_PANEL);
    this.$panels[this.SETTINGS_ACCESSIBILITY_PANEL] = this._shadow.querySelector(this.SETTINGS_ACCESSIBILITY_PANEL);

    document.addEventListener(eventNames.BUTTON_SETTINGS.description, this.settingButtonClicked.bind(this, this.SETTINGS_GENERAL_PANEL));
    document.addEventListener(eventNames.BUTTON_ACCESSIBILITY.description, this.settingButtonClicked.bind(this, this.SETTINGS_ACCESSIBILITY_PANEL));
  }
  disconnectedCallback() {
    // Triggered when the component is removed from the DOM.
    // Ideal place for cleanup code.
    // Note that when destroying a component, it is good to also release any listeners.
    document.removeEventListener(eventNames.BUTTON_SETTINGS.description, this.settingButtonClicked);
    document.removeEventListener(eventNames.BUTTON_ACCESSIBILITY.description, this.settingButtonClicked);
  }
  adoptedCallback() {
    // Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
    // Note that adoption does not trigger the constructor again.
  }

  /**
   * @param {Event} event
   */
  settingButtonClicked(panel, event) {
    event.stopPropagation();
    if (!this.$panels[panel].classList.contains("hidden")) {
      this.$panels[panel].classList.toggle("hidden", true);
    }
    else {
      this.$panels[this.SETTINGS_ACCESSIBILITY_PANEL].classList.toggle("hidden", panel != this.SETTINGS_ACCESSIBILITY_PANEL);
      this.$panels[this.SETTINGS_GENERAL_PANEL].classList.toggle("hidden", panel != this.SETTINGS_GENERAL_PANEL);
    }
  }
};

window.customElements.define('website-settings', Component);