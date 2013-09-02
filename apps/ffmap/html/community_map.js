var FFCommunityMapWidget = function(options, map_options, link) {
  var options = L.extend({
    divId: 'map',
      geoJSONUrl: 'http://weimarnetz.de/ffmap/ffMap.json',
      getPopupHTML: function (props) {
        var html = '';
        //        console.log(props)
        if (props.name) {
          if (props.url && !props.url.match(/^http([s]?):\/\/.*/)) {
            html += '<b><a href=\"http://' + props.url + '\" target=\"_window\">'+ props.name + '</a></b><br/>';
          }
          else {
            html += '<b><a href=\"' + props.url + '\" target=\"_window\">'+ props.name + '</a></b><br/>';
          }
        }
        if (props.metacommunity) {
          html += props.metacommunity + '</br>';
        }
        if (props.city){
          html += props.city + '<br/>';
        }
        if (props.nodes) {
          html += '<br/>Zug&auml;nge: ' +props.nodes + '<br/>';
        }
        if (props.phone) {
          //html += '<br/><a href=\"tel:' + props.phone + '\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_telefon.png\" width="30px" style="margin-right: 15px; vertical-align:middle;" /></a>' + props.phone + '<br/>' ;
          html += '<br/>&#9990; ' + props.phone + '<br/>';
        }
        html += '<br/>';
        if (props.email) {
          html += '<a href=\"mailto:' + props.email + '\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_email.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        if (props.facebook) {
          html += '<a href=\"' + props.facebook + '\" target=\"_window\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_facebook.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        if (props.twitter) {
          if (props.twitter && !props.twitter.match(/^http([s]?):\/\/.*/)) {
            html += '<a href=\"https://twitter.com/' + props.twitter + '\" target=\"_window\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_twitter.png\" width="30px" style="margin-right: 15px;" alt=\"@' + props.twitter + '\" title=\"@' + props.twitter + '\"/></a>';
          }
          else {
            html += '<a href=\"' + props.twitter + '\" target=\"_window\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_twitter.png\" width="30px" style="margin-right: 15px;"/></a>';
          }	
        }
        if (props.irc) {
          html += '<a href=\"irc:' + props.irc + '\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_irc.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        if (props.jabber) {
          html += '<a href=\"xmpp:' + props.jabber + '\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_jabber.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        if (props.identica) {
          html += '<a href=\"identica:' + props.identicy + '\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_identica.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        if (props.googleplus) {
          html += '<a href=\"' + props.googleplus + '\" target=\"_window\"><img src=\"http://weimarnetz.de/ffmap/icons/icon_googleplus.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        return html;
      },
      fitBounds: [[46.5, 4.0], [55.5, 15.9]],
      zoom: 5,
      center: [51.5, 10.5],
      tileUrl: 'https://ssl_tiles.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
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

  var clusters = L.markerClusterGroup({ spiderfyOnMaxZoom: false, showCoverageOnHover: false});
  widget.map.addLayer(clusters);

  $.getJSON(options['geoJSONUrl'], function(geojson) {
    var geoJsonLayer = L.geoJson(geojson, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(options['getPopupHTML'](feature.properties), { minWidth: 210 });
      },
      pointToLayer: function(feature, latlng) {
        var marker = L.circleMarker(latlng, {
          //title: feature.properties.name,
          //riseOnHover: true
          stroke: true,
          weight: 10,
          opacity: 0.3,
          color: '#009ee0',
          fill: true,
          fillColor: '#009ee0',
          fillOpacity: 0.7
        });
        return marker;
      }
    }).addTo(clusters);
    console.log(geoJsonLayer);
  });

  return widget;
}
