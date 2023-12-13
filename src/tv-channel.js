// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
    this.image = '';
    this.description = "";
  }

  static get tag() {
    return 'tv-channel';
  }
  
  static get properties() {
    return {
      title: { type: String },
      video: {type: String},
      timecode: { type: Number },
      image: { type: String },
      presenter: { type: String },
      index: { type: Number },
      active: { type: Boolean , reflect: true},
      description: { type: String },
    };
  }

  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px;
        margin-top: 12px;
        border-radius: 8px;
        background-color: grey;
        transition: background-color 0.3s ease;
      }
      :host([active]){
        background-color: blue;
      }
      .wrapper {
        padding: 25px;
        color: white;
        background-size: cover;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper" style = "background-image:url(${this.image})">
        <h3>${this.title}</h3>
        <h3>${this.video}</h3>
        <h4>${this.presenter}</h4>
        <slot></slot>
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
