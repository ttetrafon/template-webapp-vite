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
  private _shadow: ShadowRoot;
  private $img: HTMLImageElement;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$img = this._shadow.querySelector("img")!;
  }

  static get observedAttributes() { return ['label', 'image']; }

  get image() { return this.getAttribute('image'); }
  get label() { return this.getAttribute('label'); }

  set image(value: string | null) { this.setAttribute('image', value!); }
  set label(value: string | null) { this.setAttribute('label', value!); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal == newVal) return;
    switch (name) {
      case 'image':
        this.setImageSrc(`/decorations/${ this.image }.png`);
        break;
      case 'label':
        this.$img.setAttribute("alt", this.label!);
        break;
    }
  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }

  async setImageSrc(url: string) {
    // let asset = await import(url);
    this.$img.src = url;
  }
}

window.customElements.define('png-wrapper', Component);
