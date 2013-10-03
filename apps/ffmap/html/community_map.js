var FFCommunityMapWidget = function(options, map_options, link) {
  var options = L.extend({
    divId: 'map',
      geoJSONUrl: 'http://weimarnetz.de/ffmap/ffMap.json',
      getPopupHTML: function (props) {
        //clean up values before rendering
        if (props.url && !props.url.match(/^http([s]?):\/\/.*/)) { 
          props.url = "http://" + props.url; 
        }
        if (props.email && !props.email.match(/^mailto:.*/)) {
          props.email = "mailto:" + props.email;
        }
        if (props.twitter && !props.twitter.match(/^http([s]?):\/\/.*/)) {
          props.twitter = "https://twitter.com/" + props.twitter;
        }
        if (props.irc && !props.irc.match(/^irc:.*/)) {
          props.irc = "irc:" + props.irc;
        }
        if (props.jabber && !props.jabber.match(/^jabber:.*/)) {
          props.jabber = "xmpp:" + props.jabber;
        }
        if (props.identica && !props.identica.match(/^identica:.*/)) {
          props.identica = "identica:" + props.identica;
        }
        
        props.contacts =  [];
        if (props.url) {
          props.contacts.push({
            type: 'www',
             url : props.url
          });
        }

        if (props.email) {
          props.contacts.push({
            type: 'email',
            url : props.email
          });
        }

        if (props.facebook) {
          props.contacts.push({
            type: 'facebook',
            url : props.facebook
          });
        }

        if (props.twitter) {
          props.contacts.push({
            type: 'twitter',
            url : props.twitter
          });
        }

        if (props.irc) {
          props.contacts.push({
            type: 'irc',
            url : props.irc
          });
        }

        if (props.jabber) {
          props.contacts.push({
            type: 'jabber',
            url : props.jabber
          });
        }

        if (props.identica) {
          props.contacts.push({
            type: 'identica',
            url : props.identicy
          });
        }

        if (props.googleplus) {
          props.contacts.push({
            type: 'googleplus',
            url : props.googleplus
          });
        }
        
        //render html and return
        return widget.communityTemplate(props);
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

  var clusters = L.markerClusterGroup({ spiderfyOnMaxZoom: false, showCoverageOnHover: false, maxClusterRadius: 40 });
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
  });

  $('#locationBtn').click(function() {
    /* disable the location button visually if 
     * location permission is not granted */
    widget.map.on('locationerror', function(e) {
      if (e.code == 1 /*PERMISSION_DENIED*/) {
        $('#locationBtn').addClass('disabled');
      }
    });
    /* try to read the user location and center map there */
    widget.map.locate({
      setView: true, 
      maxZoom: 8, 
      timeout: 30000
    });
  });
  
  //initialize underscore tamplating
  _.templateSettings.variable = "props";
  widget.communityTemplate = _.template(
    $( "script.template#community-popup" ).html()
  );
  
  return widget;
}
