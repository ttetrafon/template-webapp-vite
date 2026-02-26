import styles from '../styles/style.css?inline';
import { eventNames } from '../library/data/enums.ts';

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
  private _shadow: ShadowRoot;
  private SETTINGS_GENERAL_PANEL = "settings-general-panel";
  private SETTINGS_ACCESSIBILITY_PANEL = "settings-accessibility-panel";
  private settingButtonClickedBoundSettingsGeneralPanel: (e: Event) => void;
  private settingButtonClickedBoundSettingsAccessibilityPanel: (e: Event) => void;
  private $panels: Record<string, HTMLElement> = {};

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.settingButtonClickedBoundSettingsGeneralPanel = this.settingButtonClicked.bind(this, this.SETTINGS_GENERAL_PANEL);
    this.settingButtonClickedBoundSettingsAccessibilityPanel = this.settingButtonClicked.bind(this, this.SETTINGS_ACCESSIBILITY_PANEL);
  }

  static get observedAttributes() { return ['label', 'data']; }

  get data() { return JSON.parse(this.getAttribute('data')!); }
  get label() { return this.getAttribute('label'); }

  set data(value: unknown) { this.setAttribute('data', value as string); }
  set label(value: string | null) { this.setAttribute('label', value!); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal == newVal) return;
    switch(name) {
      default:
        break;
    }
  }
  connectedCallback() {
    this.$panels[this.SETTINGS_GENERAL_PANEL] = this._shadow.querySelector(this.SETTINGS_GENERAL_PANEL)!;
    this.$panels[this.SETTINGS_ACCESSIBILITY_PANEL] = this._shadow.querySelector(this.SETTINGS_ACCESSIBILITY_PANEL)!;

    document.addEventListener(eventNames.BUTTON_SETTINGS.description!, this.settingButtonClickedBoundSettingsGeneralPanel);
    document.addEventListener(eventNames.BUTTON_ACCESSIBILITY.description!, this.settingButtonClickedBoundSettingsAccessibilityPanel);
  }
  disconnectedCallback() {
    document.removeEventListener(eventNames.BUTTON_SETTINGS.description!, this.settingButtonClickedBoundSettingsGeneralPanel);
    document.removeEventListener(eventNames.BUTTON_ACCESSIBILITY.description!, this.settingButtonClickedBoundSettingsAccessibilityPanel);
  }
  adoptedCallback() {
  }

  settingButtonClicked(panel: string, event: Event) {
    event.stopImmediatePropagation();
    if (!this.$panels[panel].classList.contains("hidden")) {
      this.$panels[panel].classList.toggle("hidden", true);
    }
    else {
      this.$panels[this.SETTINGS_ACCESSIBILITY_PANEL].classList.toggle("hidden", panel != this.SETTINGS_ACCESSIBILITY_PANEL);
      this.$panels[this.SETTINGS_GENERAL_PANEL].classList.toggle("hidden", panel != this.SETTINGS_GENERAL_PANEL);
    }
  }
}

window.customElements.define('website-settings', Component);
