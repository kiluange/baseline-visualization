google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawAxisTickColors);

function drawAxisTickColors() {
  function barchart(selected_var){
      var dataset = (function() {
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
          return json;
      })();

      var varbynivel = d3.nest()
        .key(function(d) { return d.nivel; })
        .rollup(function(v) {return d3.sum(v, function(d) {return d.n;});})
        .entries(dataset);

      var data = [
        ['Nivel' , 'count'],
      ];

      for(var i=0;i<varbynivel.length;i++){
        var row = [varbynivel[i].key , +varbynivel[i].values];
        data.push(row);
      };

      data = google.visualization.arrayToDataTable(data);

      var options = {
        title: 'Population of Largest U.S. Cities',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Total Population',
          minValue: 0,
          textStyle: {
            bold: true,
            fontSize: 12,
            color: '#4d4d4d'
          },
          titleTextStyle: {
            bold: true,
            fontSize: 18,
            color: '#4d4d4d'
          }
        },
        vAxis: {
          title: 'City',
          textStyle: {
            fontSize: 14,
            bold: true,
            color: '#848484'
          },
          titleTextStyle: {
            fontSize: 14,
            bold: true,
            color: '#848484'
          }
        }
      };
      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

    var selected_var = 'cod_abaste_agua_domic_fam_eq';
    barchart(selected_var);

    $(document).ready(function(){
      var selected_var = $('#selectUni option:selected').val();
      $('#selectUni').on('change',function(){
          var selected_var = $('#selectUni option:selected').val();
          barchart(selected_var);
        });
    });
  }
