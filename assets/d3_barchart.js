  $(document).ready(function(){
    const svg = d3.select('#bar-plot');
    $("#univar-tab").on("click", function(){
      $("#univar").addClass("active");

      var color = "#f07f19";
      var opacity = 0.7;
      // Setando parâmetros de dimensão do svg
      function basicParameters(){
        var bounds = svg.node().getBoundingClientRect();

        var svgWidth = bounds.width;
        var svgHeight = bounds.height;

        var margin = {top: 10, right: 40, bottom: 75, left: 200};
        var innerWidth = svgWidth - margin.left - margin.right;
        var innerHeight = svgHeight - margin.top - margin.bottom;
        return {width: innerWidth, height:innerHeight, top: 10, right: 20, bottom: 75, left: 200}
      }

      // Fazendo grafico pro Br todo
      function barplot(data){
       parameters = basicParameters();
       var xValue = d => d.values;
       var yValue = d => d.key;

       var xScale = d3.scale.linear()
                        .domain([0, d3.max(data, xValue)])
                        .range([0, parameters.width]);

       var yScale = d3.scale.ordinal()
                        .domain(data.map(yValue))
                        .rangeRoundBands([parameters.height, 0], .25);

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
                       return "<strong>" + yValue(d) + ":</strong> <span style='color:" + color + "'>" + xValue(d) + "</span>";
                    })

       var g = svg.append("g")
                    .attr("transform", "translate(" + parameters.left + "," + parameters.top + ")");

       g.call(tip);

         g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + parameters.height + ")")
          .call(xAxis.ticks(5, "s"))
        .append("text")
          .attr("class", "label")
          .style("font-size", 20)
          .attr("transform", "translate(" + parameters.width / 2 + "," + parameters.bottom / 1.5 + ")")
          .style("text-anchor", "middle")
          .text("Frequência");

         var axisy = g.append("g")
          .attr("class", "y axis")
          .call(yAxis)

        var n = data.length;

        g.append("g")
          .selectAll("rect")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("width", d => xScale(xValue(d)))
          .attr("y", d => yScale(yValue(d)))
          .attr("height", parameters.height/n - 25)
          .style("fill", color)
          .style("opacity", opacity)
          .on("mouseover", function(d){
            tip.show(d);
            d3.select(this)
              .style("opacity", 1);
           })
          .on("mouseout", function(d){
            tip.hide(d);
            d3.select(this)
              .style("opacity", opacity);
          });

          // Define responsive behavior
          function resize() {
            var parameters = basicParameters();

            // Update the range of the scale with new width/height
            xScale.range([0, parameters.width]);
            yScale.rangeRoundBands([parameters.height, 0], .25);

            // Update the axis and text with the new scale
            svg.select(".x.axis")
              .call(xAxis)
              .attr("transform", "translate(0," + parameters.height + ")")
              .call(xAxis.ticks(10, "s"))
              .select(".label")
              .attr("transform", "translate(" + parameters.width / 2 + "," + parameters.bottom / 1.5 + ")");

            svg.select(".y.axis")
              .call(yAxis);

            // Update the tick marks
            xAxis.ticks(Math.max(parameters.width/75, 2), " $");

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

      function map_menu(){
        const map_svg = d3.select("#states-filtro");

        var width = 300;
        var height = 300;

        var g = map_svg.append("g");

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

          // Desenhando estados
          g.selectAll(".estado")
           .data(states.features)
           .enter()
           .append("path")
           .attr("class", "state")
           .attr("d", path)
           .style("fill", color)
           .style("opacity", opacity)
           .style("stroke", "white")
           .style("stroke-width", "1px")
           .on("mouseover", function(d){
             tip.show(d);
             d3.select(this)
               .style("opacity", 1);
            })
           .on("mouseout", function(d){
             tip.hide(d);
             d3.select(this)
               .style("opacity", opacity);
           });
          // .on("click", up);
        };
      }

      // Criar base de dados BR selecionando variavel
      function dataset(selected_var) {
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
              .key(d => d.nivel)
              .key(d => d.cod_munic_ibge_2_fam_eq)
              .rollup(function(v) {return d3.sum(v, d => d.n);})
              .entries(json);

        return varbynivel;
      };

      // Somar os count para obter valores de todo o brasil
      function reduzir_dados(data) {
        var combined = data.map(function (elem){
                          var total = elem.values.reduce(function(total, current) {
                            return total + current.values;
                          }, 0);
                          return {key: elem.key, values: total};
                      });
        return combined;
      }

      // Obter valores para o estado corrente
      function dataset_estado(dados_gerais, estado) {
        var filtered = dados_gerais.map(function (elem){
                          var total = elem.values.filter(d => d["key"] == estado)
                          return {key: elem.key, values: total};
        });

        filtered = reduzir_dados(filtered);
        return filtered;
      }

      // Update barplot
      function up(d){
        dados_current = dataset_estado(dados_gerais, d.id);

        var xScale = d3.scale.linear()
                         .domain([0, d3.max(dados_current, function(d) {return d.values;})])
                         .range([0, parameters.width]);

        var yScale = d3.scale.ordinal()
                         .domain(d3.map(dados_current, function(d){return d.key;}))
                         .rangeRoundBands([parameters.height, 0], .25);

        var plot = svg

        var n = dados_current.length

        plot.selectAll("rect")
            .data(dados_current)
            .transition()
            .duration(750)
            .attr("width", function(d) {return xScale(d.values);})
            .attr("y", function(d, i) {return yScale(i);})
            .attr("height", parameters.height/n - 30);

        plot.selectAll(".x.axis") // target the text element(s) which has a yAxis class defined
      			.data(dados_current)
      			.transition()
      			.duration(750)
      		   .attr("text-anchor", "middle")
      		   .attr("x", function(d) {
      		   		return xScale(d.values);
      		   })
      		   .attr("y", function(d, i) {
      		   		return yScale(d.measure) + 14;
      		   });
      }

      parameters = basicParameters();
      var selected_var = $('#selectUni option:selected').val();
      var dados_gerais = dataset(selected_var);
      var dados = reduzir_dados(dados_gerais);
      map_menu();
      barplot(dados);

      $('#selectUni').on('change',function(){
          var selected_var = $('#selectUni option:selected').val();

          svg.selectAll("*").remove();

          dados_gerais = dataset(selected_var);
          dados = reduzir_dados(dados_gerais);
          barplot(dados);
        });

      $("#univar").removeClass("active");
  })
})
