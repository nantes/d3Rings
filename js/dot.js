//import * as d3 from 'https://unpkg.com/d3?module'
//import * as d3 from "d3";
//var d3 = Object.assign({}, require("d3-selection"), require("d3-fetch"));

export default class Dot {
  constructor(props){
    this.key = props.key;
    this.ring = props.ring;
    this.draw()
  }

  draw () {
    this.element = d3
      .select('.dots')
      .append('span')
      .attr("class","dot")
      .attr("id", "dot"+this.key)
  }

  addListenerClick (document,dotsNumber,dots) {
    document.addEventListener('click', e => {
      e.preventDefault();
      for (let n = 0; n < dotsNumber; n++) {
        dots[n].removeClass();
      }
      const dotPosX = -350 * parseInt(e.srcElement.id.slice(3));
      e.srcElement.classList.add('selected');
      this.updateGraphicsPanel(dotPosX);
    });   
  }

  addClass (className) {
    this.element.attr("class", "dot "+ className)
  }

  removeClass () {
    this.element.attr("class", "dot")
  }

  updateGraphicsPanel (dotPosX) {
    const graphicsPanel = window.document.getElementById('rings-container');
    graphicsPanel.style.transform = 'translateX('+ dotPosX +'px)';
  }
} 