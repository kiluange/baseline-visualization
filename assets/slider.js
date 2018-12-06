$(document).ready(function(){
  $("#slider-range" ).slider({
    range: true,
    min: 2001,
    max: 2015,
    values: [ 2001, 2015 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "₹" + ui.values[ 0 ] + " - ₹" + ui.values[ 1 ] );
    }
  });
  $( "#amount" ).val( "₹" + $( "#slider-range" ).slider( "values", 0 ) +
    " - ₹" + $( "#slider-range" ).slider( "values", 1 ) );
});
