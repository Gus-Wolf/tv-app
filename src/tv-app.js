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
      channels: { type: Object },
      active: { type: String },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: grid;
        margin: 16px;
        padding: 16px;
        overflow-x: hidden;
      }
      .grid-container{
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .left-item{
        grid-column: 1;
        margin-top: 50px;
      }
      .right-item{
        grid-column: 2;
        width: 200px;
        margin-left: 110px;
        margin-top: 15px;
        height: 72.5vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .listing{
        margin: 10px;
      }
      .slideclicker {
        display: flex;
        flex-direction: row;
        text-align: center;
        gap: 375px;
        margin-bottom: 20px;
      }
      .previous-slide {
        font-size: 20px;
        width: 200px;
        height: 50px;
      }
      .next-slide {
        font-size: 20px;
        width: 200px;
        height: 50px;
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
          <video-player source="https://www.youtube.com/watch?v=blfaXtOmxTI&t=166s" accent-color="orange" dark track="https://haxtheweb.org/files/HAXshort.vtt"></video-player> 
        </div>  
        <tv-channel title="NCAA LAX goals" presenter="">
          These are the top 10 goals in NCAA LAX history
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
              timecode = "${item.metadata.timecode}"
              image = "${item.metadata.image}"
            >
            </tv-channel>
          `
        )
      
      }
      </div>
        <!-- dialog -->
        <sl-dialog label="Dialog" class="dialog">
          Section 
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
        </sl-dialog>
    </div>
    <div class="slideclicker">
      <button class = "previous-slide"> Previous Slide</button>
      <button class = "next-slide"> Next Slide</button>
    </div>

    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    // this will give you the current time so that you can progress what's active based on it playing
this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime
// this forces the video to play
this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
// this forces the video to jump to this point in the video via SECONDS
this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode)
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