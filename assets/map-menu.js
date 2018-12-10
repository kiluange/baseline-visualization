$(document).ready(function(){
  // fazer grafico
  const svg = d3.select("#states-filtro");

      var width = 300;
      var height = 300;

      var g = svg.append("g");

      var tip = d3.tip()
                   .attr('class', 'd3-tip')
                   .offset([-5, 0])
                   .html(function(d) {
                      return "<strong>" + d.id+ "</strong>";
                   });

      g.call(tip);

      // Align center of Brazil to center of map
      var projection = d3.geo.mercator();
      projection.scale(width)
                .center([-width/5.2, -height/20])
                .translate([width / 2, height / 2]);

      var path = d3.geo.path()
        .projection(projection);

      // Load data (asynchronously)
      d3_queue.queue()
        .defer(d3.json, "http://localhost:3000/br-states")
        .await(ready);

      function ready(error, shp) {
      if (error) throw error;

      // Extracting polygons and contours
      var states = topojson.feature(shp, shp.objects.estados);

      var current_state = []

      // Desenhando estados
      g.selectAll(".estado")
          .data(states.features)
          .enter()
          .append("path")
          .attr("class", "state")
          .attr("d", path)
          .style("fill", "#f07f19")
          .style("stroke", "white")
          .style("stroke-width", "1px")
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .on("click", function(estado){
            d3.select(this)
              .style("fill", "black")
          });
      };
})

/* var plot = d3.select("#bar-plot");
var margin = {top: 10, right: 40, bottom: 75, left: 200};
var bounds = plot.node().getBoundingClientRect();

var svgWidth = bounds.width;
var svgHeight = bounds.height;

var innerWidth = svgWidth - margin.left - margin.right;
var innerHeight = svgHeight - margin.top - margin.bottom;

var dados_current = dataset_estado("cod_abaste_agua_domic_fam_eq", estado.id);

plot.datum(dados_current);

var xScale = d3.scale.linear()
                 .domain([0, d3.max(dados_current, function(d) {return d.values;})])
                 .range([0, innerWidth]);

var yScale = d3.scale.ordinal()
                 .domain(d3.map(dados_current, function(d){return d.key;}))
                 .rangeRoundBands([innerHeight, 0], .25);

var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

  /* Note that here we only have to select the elements - no more appending! */
/* plot.selectAll(".bar")
  .data(dados_current)
  .transition()
  .duration(750)
  .attr("width", function(d) {return xScale(d.values);})
  .attr("y", function(d) {yScale(d.key);})
  .attr("height", yScale.rangeBand());*/
