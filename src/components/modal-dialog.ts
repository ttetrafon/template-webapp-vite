import { emitDialogCancelEvent, emitDialogConfirmEvent } from '../library/helper/dom.ts';
import styles from '../styles/style.css?inline';

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
  private _shadow: ShadowRoot;
  private confirmDialogBound: (e: Event) => void;
  private cancelDialogBound: (e: Event) => void;
  private $okBtn: HTMLButtonElement;
  private $cancelBtn: HTMLButtonElement;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.confirmDialogBound = this.confirmDialog.bind(this);
    this.cancelDialogBound = this.cancelDialog.bind(this);

    this.$okBtn = this._shadow.getElementById("ok") as HTMLButtonElement;
    this.$cancelBtn = this._shadow.getElementById("cancel") as HTMLButtonElement;
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
    this.$okBtn.addEventListener('click', this.confirmDialogBound);
    this.$cancelBtn.addEventListener('click', this.cancelDialogBound);
  }
  disconnectedCallback() {
    this.$okBtn.removeEventListener('click', this.confirmDialogBound);
    this.$cancelBtn.removeEventListener('click', this.cancelDialogBound);
  }
  adoptedCallback() {
  }

  cancelDialog(event: Event) {
    event.stopImmediatePropagation();
    console.log("... clicked cancel button!")
    emitDialogCancelEvent(this.$cancelBtn);
  }

  confirmDialog(event: Event) {
    event.stopImmediatePropagation();
    console.log("... clicked ok button!")
    emitDialogConfirmEvent(this.$okBtn, {
      prop: 'this is something',
      value: 15
    });
  }
}

window.customElements.define('modal-dialog', Component);
