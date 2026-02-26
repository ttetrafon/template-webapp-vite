import { eventNames } from '../library/data/enums.ts';
import { jsonRequest } from '../library/helper/requests.ts';
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
  private _shadow: ShadowRoot;
  private $navLink1: HTMLAnchorElement;
  private $navLink2: HTMLAnchorElement;
  private $contentFilter: HTMLElement;
  private followLink1Bound!: (e: Event) => void;
  private followLink2Bound!: (e: Event) => void;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$navLink1 = this._shadow.querySelector('.nav-link-1')!;
    this.$navLink2 = this._shadow.querySelector('.nav-link-2')!;
    this.$contentFilter = this._shadow.querySelector('content-filters')!;
    this.debugFilterEvents();
  }

  static get observedAttributes() { return ['label', 'data']; }

  get data() { return JSON.parse(this.getAttribute('data')!); }
  get label() { return this.getAttribute('label'); }

  set data(value: unknown) { this.setAttribute('data', value as string); }
  set label(value: string | null) { this.setAttribute('label', value!); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal == newVal) return;
    switch (name) {
    }
  }
  connectedCallback() {
    this.followLink1Bound = this.followLink.bind(this, '/page-one');
    this.followLink2Bound = this.followLink.bind(this, '/page-two');

    this.$navLink1.addEventListener('click', this.followLink1Bound);
    this.$navLink2.addEventListener('click', this.followLink2Bound);

    this.getFilterData();
  }
  disconnectedCallback() {
    this.$navLink1.removeEventListener('click', this.followLink1Bound);
    this.$navLink2.removeEventListener('click', this.followLink2Bound);
  }
  adoptedCallback() {
  }

  followLink(page: string, event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    // emitNavigationEvent(this.$navLink1, page);
  }

  async getFilterData() {
    const filterData = await jsonRequest("./data/filters.json");
    this.$contentFilter.setAttribute("data", JSON.stringify(filterData));
  }

  async debugFilterEvents() {
    [
      eventNames.CONTENT_FILTER_CLEAR.description!
    ].forEach(eventName => {
      this.$contentFilter.addEventListener(eventName, (event) => {
        console.log(`[DEBUG] Event captured on '${_name}' shadowRoot: Type: ${event.type}, Target:`, event.target);
      }, true);
    });
  }
}

window.customElements.define(_name, Component);
