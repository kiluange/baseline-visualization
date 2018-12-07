$(document).ready(function(){
 var svgWidth = 600;
 var svgHeight = 300;

 var svg = d3.select('#pieChart')
      .append("svg:svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("class", "bar-chart")
      .attr("border", 2)


 var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

 var barPadding = 5;
 var border = 2;
 var barWidth = (svgWidth / dataset.length);
 var barChart = svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("y", function(d) {return svgHeight - d})
     .attr("height", function(d) {return d})
     .attr("width", barWidth - barPadding)
     .attr("transform", function(d, i){
      var translate = [barWidth*i,0];
      return "translate(" + translate + ")";
     })
     .attr({fill: "#f4be01"});

 d3.selectAll("rect")
  .on("mouseover", function(d){
   d3.select(this)
    .attr({fill: "#c04316"})
  })
  .on("mouseout", function(d){
   d3.select(this)
    .attr({fill: "#f4be01"})
   });
})
