$(document).ready(function(){
 const svg = d3.select('#bar-plot');

 var svgWidth = 900;
 var svgHeight = 550;

 var render = data =>{
   var xValue = d => d.values;
   var yValue = d => d.key;
   var margin = {top: 50, right: 0, bottom: 20, left: 180};
   var innerWidth = svgWidth - margin.left - margin.right;
   var innerHeight = svgHeight - margin.top - margin.bottom;

   var xScale = d3.scale.linear()
                    .domain([0, d3.max(data, xValue)])
                    .range([0, innerWidth]);

   var yScale = d3.scale.ordinal()
                    .domain(data.map(yValue))
                    .rangeRoundBands([innerHeight, 0], .25);

   var xAxis = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom");


   var yAxis = d3.svg.axis()
                   .scale(yScale)
                   .orient("left");

   var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-5, 0])
                .html(function(d) {
                   return "<strong>" + yValue(d) + ":</strong> <span style='color:#c04316'>" + xValue(d) + "</span>";
                })

   var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   g.call(tip);

     g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + innerHeight + ")")
      .call(xAxis.ticks(10, "s"))
      .append("text")
      .attr("x", innerHeight - 50)
      .attr("y", 50)
      .style("text-anchor", "end")
      .text("Frequência");

     g.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    g.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", d => xScale(xValue(d)))
      .attr("y", d => yScale(yValue(d)))
      .attr("height", yScale.rangeBand())
      .style("fill", "#c04316")
      .on("mouseover", tip.show)
      .on("mouseout",  tip.hide);
    }

  var dataset = function(selected_var) {
      var json = null;
      $.ajax({
          'async': false,
          'global': false,
          'url': "http://localhost:5000/tabela",
          'dataType': "json",
          'success': function (data) {
            json = data.filter(d=>d["variavel"]==selected_var);
            }
          });

      var varbynivel = d3.nest()
            .key(function(d) { return d.nivel; })
            .rollup(function(v) {return d3.sum(v, function(d) {return d.n;});})
            .entries(json);

      return varbynivel;
    };

  var selected_var = $('#selectUni option:selected').val();
  var dados = dataset(selected_var);
  render(dados);

  $('#selectUni').on('change',function(){
      var selected_var = $('#selectUni option:selected').val();
      svg.selectAll("*").remove();
      dados = dataset(selected_var);
      render(dados);
    });
})
