mapboxgl.accessToken = 'pk.eyJ1IjoiYmVud2hpdGUyMiIsImEiOiJja2RqdDI3MHQwNGZoMnF0Mjl6N3ppbTk3In0.MhU0qnJIkeRb5RAcRUZmBg';

// {"lng":174.76277944521075,"lat":-36.82616121382325}
var map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/benwhite22/ckdjulw5q0j8b1iqum7rznz7m', 
  center: [174.76, -36.88], 
  zoom: 12,
  maxZoom: 14,
  minZoom: 12
});

map.flyTo({
  center: [174.76, -36.88],
  speed: 0.2,
  zoom: 13
});

var el = document.createElement('div');
    el.className = 'marker';

var kl = document.createElement('div');
    kl.className = 'choice_marker';

var marker = new mapboxgl.Marker(el);
var choice_marker = new mapboxgl.Marker(kl);

map.on('mousemove', function(e) {
  /*document.getElementById('info').innerHTML = `${JSON.stringify(e.point)} <br /> ${JSON.stringify(e.lngLat.wrap())}`;*/

  var co_ords = e.lngLat.wrap();
  var lat_lang = [co_ords.lng, co_ords.lat];

  marker.remove();
  marker.setLngLat(lat_lang).addTo(map);
});

map.on('click', function(e) {
  var co_ords = e.lngLat.wrap();
  var lat_lang = [co_ords.lng, co_ords.lat];

  switch (event.which) {
    case 1:
      choice_marker.remove();
      choice_marker.setLngLat(lat_lang).addTo(map);

      $("#content").css('display', 'flex');

      $("#content").css('transform', 'translateY(0px)');
      $("#map").css('width', '100%');

      map.flyTo({
        center: lat_lang
      });

      setTimeout(map.resize(), 550);

      break;
    case 2:
      choice_marker.remove();
      choice_marker.setLngLat(lat_lang).addTo(map);
      break;
    case 3:
      choice_marker.remove();
      break;
    default:
      alert('Nothing');
  }
});

map.on('load', (event) => {
  map.resize();
});

map.on('render', function() {
    const scale = Math.pow(2, map.getZoom());

    $('.choice_marker').css("height" , `${scale * 0.01}px`);
    $('.choice_marker').css("width" , `${scale * 0.01}px`);

    $('.marker').css("height" , `${scale * 0.003}px`);
    $('.marker').css("width" , `${scale * 0.003}px`);
    // set css size based on scale
});
  // var information = [
  //   5.0, // Beds
  //   180, // Land Area
  //   140, // Living Area
  //   1, // Grade
  //   1, // Garage
  //   174.873123, // Longitude
  //   -36.874691 // Lattitude
  // ];

$(window).resize(function(){map.resize()});

let listPrediction = (data) => {
  console.log("Prediction made:", data);
  $("#estimated_value").text(`${' $ '}${numberWithCommas(Math.round(data))}`);
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function() {  
  $("h2").on('click', function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });
});

function getInformation() {
  var information = [
    parseInt($("#bedrooms > div > h2.active").text()), // Beds
    parseInt($("#land_area > div > input")[0].value), // Land Area
    parseInt($("#living_area > div > input")[0].value), // Living Area
    (parseInt($("#grade > div > h2.active").text()) == 1) ? 2 : 1, // Grade
    ($("#garage > div > h2.active").text() == 'Yes') ? 2 : 1, // Garage
    choice_marker._lngLat.lng, // Longitude
    choice_marker._lngLat.lat // Lattitude
  ];

  predict(information);
}

const predict = (information) => {
  let req = $.ajax({
      type: "POST",
      url: '127.0.0.1:3000',
      data: JSON.stringify({ info: information }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){listPrediction(data)},
      failure: function(errMsg) {
          alert(errMsg);
      }
  });
};