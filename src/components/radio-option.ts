import styles from '../styles/style.css?inline';

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
  private _shadow: ShadowRoot;
  private $radio: HTMLInputElement;
  private $label: HTMLLabelElement;
  private $text: HTMLSpanElement;
  private $image: HTMLElement;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$radio = this._shadow.querySelector("input")!;
    this.$label = this._shadow.querySelector("label")!;
    this.$text = this._shadow.querySelector("span")!;
    this.$image = this._shadow.querySelector("svg-wrapper")!;
  }

  static get observedAttributes() { return ['id', 'label', 'checked', 'group', 'image']; }

  get checked() { return Boolean(this.getAttribute('checked')); }
  get group() { return this.getAttribute('group'); }
  get id() { return this.getAttribute('id'); }
  get image() { return this.getAttribute('image'); }
  get label() { return this.getAttribute('label'); }

  set checked(value: boolean) { this.setAttribute('checked', String(value)); }
  set group(value: string | null) { this.setAttribute('group', value!); }
  set id(value: string) { this.setAttribute('id', value); }
  set image(value: string | null) { this.setAttribute('image', value!); }
  set label(value: string | null) { this.setAttribute('label', value!); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal == newVal) return;
    switch (name) {
      case 'checked':
        this.$radio.checked = this.checked;
        break;
      case 'group':
        this.$radio.setAttribute("name", this.group!);
        break;
      case 'id':
        this.$radio.setAttribute("id", this.id!);
        this.$label.setAttribute("for", this.id!);
        this.$radio.value = this.id!;
        break;
      case 'label':
        this.$text.innerText = this.label!;
        break;
      default:
        break;
    }
  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }
}

window.customElements.define('radio-option', Component);
