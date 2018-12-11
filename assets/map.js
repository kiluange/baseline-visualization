$(document).ready(function(){
  // Define map size on screen
  var margin = {top: 10, left: 10, bottom: 10, right: 10};
  var width = 900;
  var height = 600;

  var svg = d3.select("#br-states");

  // Denominador da proporção
  var brasil = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "http://localhost:4000/estado",
        'dataType': "json",
        'success': function (data) {
          brasil = data;
        }
  });

  function calcular_dados(selected_var){
    var dataset = function(selected_var) {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "http://localhost:5000/tabela",
            'dataType': "json",
            'success': function (data) {
              json = data.filter(d=> d["variavel"]==selected_var);
            }
          });

          var varbynivel = d3.nest()
                             .key(function(d) { return d.nivel;})
                             .key(function(d) { return d.cod_munic_ibge_2_fam_eq;})
                             .rollup(function(v) {return d3.sum(v, function(d) {return d.n;});})
                             .entries(json);

          return varbynivel;
      };

    var dados = dataset(selected_var);
    var dropdown = d3.select("#arrastavel")
                     .html("<label>Selecione</label> <br>")
                     .append("select")
                     .attr("id", "id_select")

    dropdown.selectAll("options")
            .data(dados)
            .enter()
            .append("option")
            .attr("value", function(d){return d.key;})
            .text(function(d){return d.key;})

    return(dados);
  }

  function calcular_categoria(dados, brasil, categoria){
    dados = dados.filter(d => d.key == categoria)[0].values;

    mergedados = [], obj_c_processed = [];

    for (var i in brasil) {
      var obj = {key: brasil[i].key, denom: brasil[i].denom};

      for (var j in dados) {
          if (brasil[i].key == dados[j].key) {
              obj.values = dados[j].values;
              obj_c_processed[dados[j].key] = true;
          }
      }

      obj.values = obj.values || 'no';
      mergedados.push(obj);
    }

    dados = mergedados;

    mergedados = []
    for (var i in dados){
        var obj = {key: dados[i].key, denom: dados[i].denom, values:dados[i].values};
        obj.prop = obj.values/obj.denom;
        obj.prop = obj.prop.toFixed(4);
        mergedados.push(obj);
    }
    return(mergedados)
  }

  function fazer_mapa(dados){
    var g = svg.append("g");

    var tip = d3.tip()
                 .attr('class', 'd3-tip')
                 .offset([-5, 0])
                 .html(function(d) {
                    return "<strong> Estado:</strong> <span style='color:#c04316'>" + d.id +
                    "</span> </br> <strong> Proporção:</strong> <span style='color:#c04316'>" + (100*d.properties.values).toFixed(2) +
                    "</span> </br> <strong> Contagem:</strong> <span style='color:#c04316'>" + d.properties.cont +
                    "</span> </br> <strong> Total:</strong> <span style='color:#c04316'>" + d.properties.denom + "</span>" ;
                 })

    g.call(tip);


    var zoom = d3.behavior.zoom()
          .translate([0, 0])
          .scale(1)
          .scaleExtent([1, 8])
          .on("zoom", zoomed);

    svg.call(zoom) // delete this line to disable free zooming
        .call(zoom.event);

    // Align center of Brazil to center of map
    var projection = d3.geo.mercator()
    .scale(width)
    .center([-width/11, -14])
    .translate([width / 2, height / 2]);

    var path = d3.geo.path()
      .projection(projection);

    var lowColor = '#fee89c'
    var highColor = '#fe0000'
    var minVal = d3.min(dados, d => d.prop)
  	var maxVal = d3.max(dados, d => d.prop)
  	var ramp = d3.scale.linear().domain([minVal,maxVal]).range([lowColor,highColor])

    // add a legend
    var w = 120, h = 300;

    var key = g.append("g")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "legend");

    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", highColor)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lowColor)
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", w - 100)
      .attr("height", h)
      .style("stroke", "black")
      .style("stroke-width", 0.5)
      .style("opacity", 0.8)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)")
      .on("mouseover", function(){
        d3.select(this)
          .style("stroke-width", 0.8)
      })
      .on("mouseout", function(){
        d3.select(this)
          .style("stroke-width", 0.5)
      });

    var y = d3.scale.linear()
      .range([h, 0])
      .domain([minVal, maxVal]);

    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("right");

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(30,15)")
      .call(yAxis.ticks(6, "%"))

    key.attr("transform", "translate(15,2)")

    // Load data (asynchronously)
    d3_queue.queue()
      .defer(d3.json, "http://localhost:3000/br-states")
      .await(ready);

    function ready(error, shp) {
    if (error) throw error;

    // Extracting polygons and contours
    var states = topojson.feature(shp, shp.objects.estados).features;

    mergeEstados = [], obj_c_processed = [];

    for (var i in states) {
      var obj = {geometry: states[i].geometry, id: states[i].id, properties: states[i].properties};

      for (var j in dados) {
          if (states[i].id == dados[j].key) {
              obj.properties.values = dados[j].prop;
              obj.properties.cont = dados[j].values;
              obj.properties.denom = dados[j].denom;
              obj_c_processed[dados[j].key] = true;
          }
      }

      obj.properties.values = obj.properties.values || 'no';
      obj.properties.cont = obj.properties.cont || 'no';
      obj.properties.denom = obj.properties.denom || 'no';
      mergeEstados.push(obj);
    }

    // Desenhando estados
    g.append("g")
        .attr("id", "mapa-shape")
        .selectAll(".estado")
        .data(states)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path)
        .style("fill", d => ramp(d.properties.values))
        .style("opacity", 0.8)
        .style("stroke", "white ")
        .style("stroke-width", "1px")
        .on("mouseover", function(d){
          tip.show(d);
          d3.select(this)
            .style("opacity", 1);
         })
        .on("mouseout", function(d){
          tip.hide(d);
          d3.select(this)
            .style("opacity", 0.8);
        });
    }
  }

  // What to do when zooming
  function zoomed() {
  d3.select("#mapa-shape").style("stroke-width", 1.5 / d3.event.scale + "px");
  d3.select("#mapa-shape").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  d3.select(self.frameElement).style("height", height + "px");

  dados_var = calcular_dados("cod_material_domic_fam_eq");
  var categoria_sel = "Madeira";

  dados = calcular_categoria(dados_var, brasil, categoria_sel);
  fazer_mapa(dados);

})
