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
	  if (props.url && !props.url.match(/^http([s]?):\/\/.*/)) {
	    html += '<a href=\"http://' + props.url + '\" target=\"_window\">http://'+ props.url + '</a><br/>';
	  }
	  else {
	    html += '<a href=\"' + props.url + '\" target=\"_window\">'+ props.url + '</a><br/>';
	  }
	}
	if (props.ml) {
	  html += '<a href=\"mailto:' + props.ml + '\">Mailingliste</a><br/>';
	}
	if (props.phone) {
	  html += '<a href=\"tel:' + props.phone + '\"><img src=\"icons/phone/phone-48-black.png\" alt=\"' + props.phone + '\"/></a>';
	}
	if (props.email) {
	  html += '<a href=\"mailto:' + props.email + '\"><img src=\"icons/email/email-48-black.png\"/></a>';
	}
	if (props.facebook) {
	  html += '<a href=\"' + props.facebook + '\" target=\"_window\"><img src=\"icons/facebook/facebook-48-black.png\"/></a>';
	}
	if (props.twitter) {
	  if (props.twitter && !props.twitter.match(/^http([s]?):\/\/.*/)) {
	  	html += '<a href=\"https://twitter.com/' + props.twitter + '\" target=\"_window\"><img src=\"icons/twitter/twitter-48-black.png\" alt=\"@' + props.twitter + '\" title=\"@' + props.twitter + '\"/></a>';
	  }
	  else {
	  	html += '<a href=\"' + props.twitter + '\" target=\"_window\"><img src=\"icons/twitter/twitter-48-black.png\" /></a>';
	  }		
	}
	if (props.irc) {
	  html += '<a href=\"irc:' + props.irc + '\"><img src=\"icons/irc/irc-48-black.png\"/></a>';
	}
	if (props.jabber) {
	  html += '<a href=\"xmpp:' + props.jabber + '\"><img src=\"icons/jabber/jabber-48-black.png\"/></a>';
	}
	if (props.identica) {
	  html += '<a href=\"identica:' + props.identicy + '\"><img src=\"icons/identica/identica-48-black.png\"/></a>';
	}
	if (props.events) {
	  html += '<hline/><h3>Events</h3>';
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
	  opacity: 1,
	  color: '#009ee0',
	  fill: true,
	  fillColor: '#009ee0',
	  fillOpacity: 0.5
        })
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(options['getPopupHTML'](feature.properties));
      }
    }).addTo(widget.map);
  });

  return widget;
}
