$(document).ready(function(){
  // Define map size on screen
  var width = 250;
  var height = 200;

  var svg = d3.select("#states-filtro")

  var g = svg.append("g");

  var tip = d3.tip()
               .attr('class', 'd3-tip')
               .offset([-5, 0])
               .html(function(d) {
                  return "<strong>" + d.id+ "</strong>";
               });

  g.call(tip);

  // Align center of Brazil to center of map
  var projection = d3.geo.mercator()
  .scale(width)
  .center([-65, -15])
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
      .on("mouseover", tip.show)
      .on("mouseout", function(d){
        d3.select(this)
          .style("stroke", "white");
      });
  };
})
