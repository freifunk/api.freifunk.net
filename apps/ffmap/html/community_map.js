var FFCommunityMapWidget = function(options, map_options) {
  var options = L.extend({
    divId: 'map',
    geoJSONUrl: 'http://127.0.0.1:8000/example.json',
    getPopupHTML: function (props) {
        var html = '';
        console.log(props)
        if (props.name) {
          html += '<h1>'+props.name+'</h1>';
        }
        return html;
    },
    fitBounds: [[46.5, 5.0], [55.5, 15.9]],
    tileUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    tileOptions: {
      key: 'e4e152a60cc5414eb81532de3d676261',
      styleId: 1796,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>'
      }
  }, options);
  
  var widget = {};
  widget.map = L.map(options['divId'], map_options);
  widget.tiles = L.tileLayer(options['tileUrl'], options['tileOptions']).addTo(widget.map);
  widget.map.fitBounds(options['fitBounds']);

  $.getJSON(options['geoJSONUrl'], function(geojson) {
    L.geoJson(geojson, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          title: feature.properties.name,
          riseOnHover: true
        })
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(options['getPopupHTML'](feature.properties));
      }
    }).addTo(widget.map);
  });

  return widget;
}
