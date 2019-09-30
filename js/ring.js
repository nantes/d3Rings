//import * as d3 from 'https://unpkg.com/d3?module'
//var d3 = Object.assign({}, require("d3-selection"), require("d3-fetch"));
//import * as d3 from 'd3';

export default class Ring {
  constructor(endpoint) {
    //console.log("d3 ", d3);
    this.endpoint = endpoint;
    this.maxWidth= 290;
    this.nextLine = 60;
    
    this.fetchData();
  }

  init() {
    this.element = d3
      .select('#rings-container')
      .append('li')
      .attr("class","ring-container")
      .append("div")
      .attr("id", this.dataset.title)
      .attr("class", "ring")
    
    this.width = parseInt(d3.select('#'+this.dataset.title).style('width'))
    this.height = 320 ;
    console.log("this height ", this.height)
    this.radius = this.width / 3.5;
    this.thickness = 10;
    this.margin = {
      top: (this.height - this.radius) / 2,
      right: (this.width - this.radius) / 2,
      bottom: (this.height - this.radius) / 2,
      left: (this.width - this.radius) / 2,
    };

    this.center = { x: this.width / 2, y: this.height / 2 + 15 };

    this.element.innerHTML = '';

    this.total = this.dataset.items.reduce((acc, currValue) => {
      return acc + currValue.value;
    }, 0);

    this.domain = this.dataset.items.map(d => d.name);
    this.draw();
  }

  draw() {
    //draw pie
    this.svgViewport = this.element
      .append('svg')
      .attr('width', this.width) 
      .attr('height', this.height + (parseInt((this.dataset.items.length-1)/2)*this.nextLine))
    const graph = this.svgViewport
      .append('g')
      .attr('transform', `translate(${this.center.x},${this.center.y})`);
    const ring = d3
      .pie()
      .sort(null)
      .value(d => d.value); 
    const arcPath = d3
      .arc()
      .outerRadius(this.radius) 
      .innerRadius(this.radius - this.thickness);
    const itemsColor = this.dataset.items.map( item => item.color);
    const itemsName = this.dataset.items.map (item => item.name)
    const color = d3.scaleOrdinal( itemsColor);
    color.domain = itemsName;
    const paths = graph.selectAll('path').data(ring(this.dataset.items));
    paths
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('d', arcPath) 
      .attr('stroke', '#fff')
      .attr('stroke-width', 1) 
      .attr('fill', d => color(d.data.name));

    this.drawTitles();
    this.drawItemsText()
  }

  drawTitles() {
    const circle = this.svgViewport
      .append('g')
      .attr('class', 'circle');

    /*circle
      .append('circle')
      .attr('transform', `translate(${this.center.x},${this.center.y})`)
      .attr('r', this.radius - this.thickness - 3)
      .attr('class', 'circle-center');*/

    //Title in Ring
    circle
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', this.center.x)
      .attr('y', this.center.y - 15)
      .attr('class', 'circle-label')
      .text(this.dataset.title.toUpperCase());
    
    // Total Value
    circle
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', this.center.x)
      .attr('y', this.center.y + 15)
      .attr('class', 'circle-value')
      .text(() => {
        let string = this.formatThousands(this.total, 'de');
        return this.dataset.title == 'Revenue' ? (string += '€') : string;
      });
  }

  drawItemsText() {
    const rectangle = this.svgViewport.append('g').attr('class', 'rect');
    rectangle
      .append('rect')
      .attr('x', 0)
      .attr('y', 260)
      .attr('width', '320')
      .attr('height', '120')
      .attr('fill', 'none')
      .attr('class', 'circle-title');
 

      for(let x=0 ; x<this.dataset.items.length ; x++){
      rectangle
      .append('text')
      .attr('text-anchor',(x % 2 === 0) ? 'start': 'end')
      .attr('x', (x % 2 === 0) ? 0 : this.maxWidth)
      .attr('y', (275 + (parseInt(x/2))*this.nextLine))
      .attr('class', 'details-label')
      .attr('fill', this.dataset.items[x].color)
      .text(this.capitalizeFirstLetter(this.dataset.items[x].name));

      rectangle
      .append('text')
      .attr('text-anchor', (x % 2 === 0) ? 'start' : 'end')
      .attr('x', (x % 2 === 0) ?   0 : 200 )
      .attr('y', 305 + (parseInt(x/2)*this.nextLine))
      .attr('class', 'details-percent')
      .text(this.percent(this.dataset.items[x].value).toFixed(0) + '%');

    rectangle
      .append('text')
      .attr('text-anchor',(x % 2 === 0) ? 'start' : 'end')
      .attr('x', (x % 2 === 0) ?   40 : this.maxWidth ) 
      .attr('y', 305 + (parseInt(x/2)*this.nextLine))
      .attr('class', 'details-value')
      .text(() => {
        let string = this.formatThousands(this.dataset.items[x].value);
        return this.dataset.title == 'Revenue' ? (string += '€') : string;
      });
    }
  }

  fetchData() {
    d3.json(this.endpoint)    
    .then(data => this.setData(data))
  }

  setData(data) {
    this.dataset = data;
    this.init();
  }

  getData() {
    return this.dataset;
  }

  redraw() {
    this.init();
  }

  percent(value) {
    if (typeof value == undefined) return;
    return (value / this.total) * 100;
  }

  formatThousands(value, lang) {
    if (typeof value == undefined) return;
    return value.toLocaleString(lang);
  }

  capitalizeFirstLetter(value) {
    if (typeof value == undefined) return;
    let firstLetter = value[0] || value.charAt(0);
    return firstLetter ? firstLetter.toUpperCase() + value.slice(1) : '';
  }
}

//for testing purpose
//module.exports = Ring;