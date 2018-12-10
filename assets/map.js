$(document).ready(function(){
  // Define map size on screen
  var margin = {top: 10, left: 10, bottom: 10, right: 10};
  var width = 900;
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
  .scale(width)
  .center([-width/11, -14])
  .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

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

  var dados = dataset("cod_abaste_agua_domic_fam_eq");
  dados = dados.filter(d => d.key == "Outro")[0].values;

  var lowColor = '#fee89c'
  var highColor = '#fe0000'
  var minVal = d3.min(dados, d => d.values)
	var maxVal = d3.max(dados, d => d.values)
	var ramp = d3.scale.linear().domain([minVal,maxVal]).range([lowColor,highColor])

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
            obj.properties.values = dados[j].values;
            obj_c_processed[dados[j].key] = true;
        }
    }

    obj.properties.values = obj.properties.values || 'no';
    mergeEstados.push(obj);
  }

  console.log(states);
  /* var finalJson = {};
  _.each(_.keys(states,dados), function(key) {
  }); */

  // Desenhando estados
  g.selectAll(".estado")
      .data(states)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .style("fill", d => ramp(d.properties.values))
      .style("opacity", 0.8)
      .style("stroke", "black ")
      .style("stroke-width", "1px")
      .on("mouseover", function(d){
        d3.select(this)
          .style("opacity", 1);
      })
      .on("mouseout", function(d){
        d3.select(this)
          .style("opacity", 0.8)
      });
  }

  // What to do when zooming
  function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  d3.select(self.frameElement).style("height", height + "px");


})
