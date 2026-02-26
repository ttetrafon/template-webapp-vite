import styles from '../styles/style.css?inline';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: block;
  }

  section {
    padding: 25px 10px 10px 10px;
    border: var(--border-dark);
    border-radius: 10px;
  }
</style>

<section>
  <radio-group id="theme"></radio-group>
</section>
`;

class Component extends HTMLElement {
  private _shadow: ShadowRoot;
  private $theme: HTMLElement;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$theme = this._shadow.getElementById("theme")!;
  }

  static get observedAttributes() { return ['label', 'data']; }

  get data() { return JSON.parse(this.getAttribute('data')!); }
  get label() { return this.getAttribute('label'); }

  set data(value: unknown) { this.setAttribute('data', value as string); }
  set label(value: string | null) { this.setAttribute('label', value!); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal == newVal) return;
    switch (name) {
      default:
        break;
    }
  }
  connectedCallback() {
    this.$theme.setAttribute("data", JSON.stringify([
      {
        label: "Light",
        id: "light",
        group: "app-theme"
      },
      {
        label: "Dark",
        id: "dark",
        group: "app-theme"
      },
      {
        label: "Auto",
        id: "auto",
        group: "app-theme",
        checked: true
      }
    ]));
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }
}

window.customElements.define('settings-general-panel', Component);
