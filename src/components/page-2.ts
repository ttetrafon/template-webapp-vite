import { emitNavigationEvent, emitSubPageContainerEvent } from '../library/helper/dom.ts';
import styles from '../styles/style.css?inline';
import state from '../library/services/state.ts';
import { generalNames } from '../library/data/enums.ts';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${ styles }

  :host {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
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
<a href="/page-one" class="nav-link-1">Go to Page One</a>
<a href="/page-three" class="nav-link-3">Go to Page Three</a>

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
  private _shadow: ShadowRoot;
  private $navLink1: HTMLAnchorElement;
  private $navLink3: HTMLAnchorElement;
  private $tab1: HTMLButtonElement;
  private $tab2: HTMLButtonElement;
  private $tabContainer: HTMLElement;
  private $userRole: HTMLElement;
  private followLink1Bound!: (e: Event) => void;
  private followLink3Bound!: (e: Event) => void;
  private switchToTabBoundTabOne!: (e: Event) => void;
  private switchToTabBoundTabTwo!: (e: Event) => void;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$navLink1 = this._shadow.querySelector('.nav-link-1')!;
    this.$navLink3 = this._shadow.querySelector('.nav-link-3')!;
    this.$tab1 = this._shadow.getElementById("tab1") as HTMLButtonElement;
    this.$tab2 = this._shadow.getElementById("tab2") as HTMLButtonElement;
    this.$tabContainer = this._shadow.getElementById("tab-container")!;
    this.$userRole = this._shadow.getElementById("user-role-display")!;
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
    emitSubPageContainerEvent(this.$tabContainer, "/page-two");

    this.followLink1Bound = this.followLink.bind(this, '/page-one');
    this.followLink3Bound = this.followLink.bind(this, '/page-three');
    this.switchToTabBoundTabOne = this.switchToTab.bind(this, "/page-two/tab-one", this.$tabContainer);
    this.switchToTabBoundTabTwo = this.switchToTab.bind(this, "/page-two/tab-two", this.$tabContainer);

    this.$navLink1.addEventListener('click', this.followLink1Bound);
    this.$navLink3.addEventListener('click', this.followLink3Bound);
    this.$tab1.addEventListener('click', this.switchToTabBoundTabOne);
    this.$tab2.addEventListener('click', this.switchToTabBoundTabTwo);

    state.subscribeToObservable(generalNames.OBSERVABLE_USER.description!, "page-2", this.userUpdatedCallback.bind(this));
    state.getValueFromObservable(generalNames.OBSERVABLE_USER.description!, "role").then((role) => {
      this.$userRole.textContent = role as string;
    });
  }
  disconnectedCallback() {
    this.$navLink1.removeEventListener('click', this.followLink1Bound);
    this.$navLink3.removeEventListener('click', this.followLink3Bound);
    this.$tab1.removeEventListener('click', this.switchToTabBoundTabOne);
    this.$tab2.removeEventListener('click', this.switchToTabBoundTabTwo);
  }
  adoptedCallback() {
  }

  declareSubContainer() {
    return this.$tabContainer;
  }

  followLink(page: string, event: Event) {
    event.preventDefault();
    emitNavigationEvent(this.$navLink1, page);
  }

  switchToTab(path: string, container: HTMLElement, event: Event) {
    // console.log("---> switchToTab()", path, container, event);
    event.stopImmediatePropagation();
    emitNavigationEvent((event as MouseEvent).target as EventTarget, path, container);
  }

  async userUpdatedCallback(subscriber: string, property: string, newValue: unknown) {
    // console.log(`---> userUpdatedCallback(${subscriber}, ${property}, ${newValue})`);
    if (subscriber != "page-2") return;

    switch(property) {
      case "role":
        this.$userRole.textContent = newValue as string;
        break;
    }
  }
}

window.customElements.define('page-two', Component);
