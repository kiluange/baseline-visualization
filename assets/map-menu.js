$(document).ready(function(){
  // Define map size on screen
  var width = 230;
  var height = 200;

  var svg = d3.select("#br-states2")

  var g = svg.append("g");

  // Align center of Brazil to center of map
  var projection = d3.geo.mercator()
  .scale(width)
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
      .attr("d", path);
  }
})
