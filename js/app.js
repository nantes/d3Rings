import Ring from './ring.js';
import Dot from './dot.js'

export default class App {
  constructor(props){
    this.database = props;
    this.init()
  }

  init() {
    this.rings = this.database.map( ring => {
      return new Ring(ring);
    })

    this.dots = []
    this.rings.forEach( (ring,key) => {
        this.dots.push(new Dot({ring: ring, key: key}))
      this.dots[key].removeClass()
      this.dots[key].addListenerClick(document.getElementById('dot'+key),this.rings.length,this.dots )
      })  
    this.dots[0].addClass('selected');
  }


    /*d3.select(window).on('resize', () => {
    rings.forEach( ring => {
      ring.redraw()
    })
  });*/

  /*function addListenerMultiEvents(el, ev, fn) {
    ev.split(' ').forEach(function(e) {
      return el.addEventListener(e, fn, false);
    });
  }*/
}