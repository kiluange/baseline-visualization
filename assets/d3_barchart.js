  $(document).ready(function(){
  const svg = d3.select('#bar-plot');

  $("#univar-tab").on("click", function(){
    $("#univar").addClass("active");
    var bounds = svg.node().getBoundingClientRect();

    var svgWidth = bounds.width;
    var svgHeight = bounds.height;

    var margin = {top: 10, right: 40, bottom: 75, left: 200};
    var innerWidth = svgWidth - margin.left - margin.right;
    var innerHeight = svgHeight - margin.top - margin.bottom;

    var render = function(data, innerHeight, innerWidth){
     var xValue = d => d.values;
     var yValue = d => d.key;

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
        .call(xAxis.ticks(5, "s"))
      .append("text")
        .attr("class", "label")
        .style("font-size", 20)
        .attr("transform", "translate(" + innerWidth / 2 + "," + margin.bottom / 1.5 + ")")
        .style("text-anchor", "middle")
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
        .style("fill", "#f07f19")
        .on("mouseover", tip.show)
        .on("mouseout",  tip.hide);

        // Define responsive behavior
        function resize() {
          var bounds = svg.node().getBoundingClientRect();

          var svgWidth = bounds.width;
          var svgHeight = bounds.height;

          var innerWidth = svgWidth - margin.left - margin.right;
          var innerHeight = svgHeight - margin.top - margin.bottom;

          // Update the range of the scale with new width/height
          xScale.range([0, innerWidth]);
          yScale.rangeRoundBands([innerHeight, 0], .25);

          // Update the axis and text with the new scale
          svg.select(".x.axis")
            .call(xAxis)
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(xAxis.ticks(10, "s"))
            .select(".label")
            .attr("transform", "translate(" + innerWidth / 2 + "," + margin.bottom / 1.5 + ")");

          svg.select(".y.axis")
            .call(yAxis);

          // Update the tick marks
          xAxis.ticks(Math.max(innerWidth/75, 2), " $");

          // Force D3 to recalculate and update the line
          svg.selectAll(".bar")
            .attr("width", d => xScale(xValue(d)))
            .attr("y", d => yScale(yValue(d)))
            .attr("height", yScale.rangeBand());
        };

        d3.select(window).on('resize', resize);

        // Call the resize function
        resize();
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
    render(dados, innerHeight, innerWidth);

    $('#selectUni').on('change',function(){
        var selected_var = $('#selectUni option:selected').val();
        svg.selectAll("*").remove();
        dados = dataset(selected_var);
        render(dados, innerHeight, innerWidth);
      });

    $("#univar").removeClass("active");
  })
})
