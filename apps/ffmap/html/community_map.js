var FFCommunityMapWidget = function(options, map_options) {
  var options = L.extend({
    divId: 'map',
    geoJSONUrl: 'http://weimarnetz.de/ffmap/ffMap.json',
    getPopupHTML: function (props) {
        var html = '';
        console.log(props)
        if (props.name) {
          html += '<h3>'+props.name+'</h3>';
        }
	if (props.metacommunity) {
	  html += 'Organisation: ' + props.metacommunity + '<br/>';
	}
	if (props.city){
	  html += props.city + '</br><br/>';
	}
	if (props.nodes) {
	  html += 'Nodes: ' +props.nodes + '<br/>';
	}
	if (props.url) {
	  html += '<a href=\"' + props.url + '\" target=\"_window\">'+ props.url + '</a><br/>';
	}
	if (props.ml) {
	  html += '<a href=\"mailto:' + props.ml + '\">Mailingliste</a><br/>';
	}
	if (props.facebook) {
	  html += '<a href=\"' + props.facebook + '\" target=\"_window\"><img src=\"icons/facebook/facebook-48-black.png\"/></a>';
	}
	if (props.twitter) {
	  html += '<a href=\"' + props.twitter + '\" target=\"_window\"><img src=\"icons/twitter/twitter-48-black.png\"/></a>';
	}
	if (props.email) {
	  html += '<a href=\"mailto:' + props.email + '\"><img src=\"icons/email/email-48-black.png\"/></a>';
	}
        return html;
    },
    fitBounds: [[46.5, 4.0], [55.5, 15.9]],
    zoom: 5,
    center: [51.5, 10.5],
    tileUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    tileOptions: {
      key: '3249f584dd674d399238a99850abcbae',
      styleId: 102828,
      zoom: 1,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>'
      }
  }, options);
  
  var widget = {};
  widget.map = L.map(options['divId'], map_options);
  widget.tiles = L.tileLayer(options['tileUrl'], options['tileOptions']).addTo(widget.map);
  //widget.map.fitBounds(options['fitBounds']);
  widget.map.setView(options['center'],options['zoom']);

  $.getJSON(options['geoJSONUrl'], function(geojson) {
    L.geoJson(geojson, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          //title: feature.properties.name,
          //riseOnHover: true
	  stroke: true,
	  color: '#dc0067',
	  fill: true,
	  fillColor: '#ffb400',
	  fillOpacity: 0.8
        })
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(options['getPopupHTML'](feature.properties));
      }
    }).addTo(widget.map);
  });

  return widget;
}
