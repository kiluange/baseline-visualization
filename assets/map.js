$(document).ready(function(){
  // Define map size on screen
  var margin = {top: 10, left: 10, bottom: 10, right: 10};
  var width = 1000;
  var height = 600;

  var svg = d3.select("#br-states")

  var g = svg.append("g");

  var zoom = d3.behavior.zoom()
  .translate([0, 0])
  .scale(1)
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

  svg.call(zoom) // delete this line to disable free zooming
  .call(zoom.event);

  // Align center of Brazil to center of map
  var projection = d3.geo.mercator()
  .scale(650)
  .center([-52, -15])
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

  // Desenhando estados
  g.selectAll(".estado")
      .data(states.features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .style("fill", "#c04316")
      .style("stroke", "white")
      .style("stroke-width", "1px")
      .on("mouseover", function(d){
        d3.select(this)
          .style("fill", "#f4be01");
      })
      .on("mouseout", function(d){
        d3.select(this)
          .style("fill", "#c04316")
      });
  }

  // What to do when zooming
  function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  d3.select(self.frameElement).style("height", height + "px");


})
