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
    this.activeIndex = 0;
    setInterval(()=>{
      const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime;
      if(this.activeIndex+1 > this.listings.length &&
        currentTime > this.listings[this.activeIndex+1].metadata.timecode){
          this.activeIndex++;
        }
    }, 1000);
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
      activeIndex: { type: Number }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: grid;
        margin-left: 0px;
        padding: 0px;
        overflow-x: hidden;
      }
      .grid-container{
        display: grid;
        grid-template-columns: 2fr 1fr;
      }
      .left-item{
        grid-column: 1;
        margin-top: 50px;
      }
      .right-item{
        grid-column: 2;
        width: 250px;
        margin-left: 110px;
        margin-top: 16px;
        height: 86vh;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
      .listing{
        margin: 10px;
      }
      .slideclicker {
        display: flex;
        flex-direction: row;
        text-align: center;
        gap: 22%;
        margin-bottom: 20px;
      }
      .prev-button {
        font-size: 20px;
        width: 200px;
        height: 50px;
      }
      .next-button {
        font-size: 20px;
        width: 200px;
        height: 50px;
      }

      .prev-button:hover,
      .next-button:hover{
        background-color: #0056b3;
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
          <div class = "description-box">
          ${this.listings.length > 0 ? this.listings[this.activeIndex].description : ''}
          </div>
       </div>
        <div class="right-item">
        <h2>${this.name}</h2>
        ${
         this.listings.map(
           (item, index) => html`
              <tv-channel 
              ?active="${index === this.activeIndex}"
               index="${index}"
               title="${item.title}"
                presenter="${item.metadata.author}"
                description = "${item.description}" 
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
         <button class="prev-button" @click="${this.prevSlide}">Previous Slide</button>
         <button class="next-button" @click="${this.nextSlide}">Next Slide</button>
       </div>
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    this.activeIndex=e.target.index;
    // this will give you the current time so that you can progress what's active based on it playing
this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime
// this forces the video to play
this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
// this forces the video to jump to this point in the video via SECONDS
this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode)
  }
  prevSlide() {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
  }

  nextSlide() {
    this.activeIndex = Math.min(this.listings.length - 1, this.activeIndex + 1); 
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    setInterval(() => {
      if(this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player')){
      const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').media.currentTime;
      var newIndex = 0;
      this.listings.map((item, index)=> {
        if(item.metadata.timecode < currentTime){
          newIndex = index;
        }
      });
      this.activeIndex = newIndex;
      }
    }, 1000);
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

      if(propName === "activeIndex" && this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player')){
        console.log(this.shadowRoot.querySelectorAll("tv-channel"));
        console.log(this.activeIndex)
      
        
        var activeChannel = this.shadowRoot.querySelector("tv-channel[index = '" + this.activeIndex + "' ] ");
        
        console.log(activeChannel);
        this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(activeChannel.timecode);
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