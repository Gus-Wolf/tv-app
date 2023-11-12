// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import "@lrnwebcomponents/video-player/video-player.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      channels: {type: Object},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
     
      }
      .grid-container{ 
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin: 16px;}
       .left-item{
        grid-column: 1;
        color:red;}
       .right-item{
        grid-column: 2;
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
    <div class="grid-container">
      <div class="grid-item">
        <div class="left-item">
          <video-player source="https://www.youtube.com/watch?v=LrS7dqokTLE" accent-color="orange" dark track="https://haxtheweb.org/files/HAXshort.vtt"></video-player>
        </div>  
        <tv-channel title="HAX: Wordpress Killer" presenter="Bryan Ollendyke">
          TV Metada placeholder
        </tv-channel>
      </div>
      <div class="right-item">
      <h2>${this.name}</h2>
      ${
        this.listings.map(
          (item) => html`
            <tv-channel
              title="${item.title}"
              presenter="${item.metadata.author}"
              @click="${this.itemClick}"
              class="listing"
            >
            </tv-channel>
          `
        )
      }

      </div>
    </div>
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
