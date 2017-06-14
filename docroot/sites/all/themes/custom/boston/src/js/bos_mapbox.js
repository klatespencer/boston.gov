/**
 * @file
 * Map Functionality.
 *
 * Provides map functionality for the site.
 */

(function ($) {
  Drupal.behaviors.exampleModule = {
    attach: function (context, settings) {

      var esriUrl = Drupal.settings.esri;
      var mapType = Drupal.settings.type;
      var basemapUrl = Drupal.settings.basemap;

      var map = L.map('map', {zoomControl: false}).setView([42.357004, -71.062309], 14);
      //add zoom control to bottom right
      L.control.zoom({
        position:'bottomright'
      }).addTo(map);

      // find user location
      map.locate({setView: true, maxZoom: 18});
      function onLocationFound(e) {
        var radius = e.accuracy / 2;
        var user_loc = L.marker(e.latlng).addTo(map).bindPopup('<p class="title">You are here.</p>').openPopup();
        var radius_circle = L.circle(e.latlng, radius, {color:'#091F2F',opacity:1,fillOpacity:0.2}).addTo(map);
      }
      map.on('locationfound', onLocationFound);
      // add mapbox basemap
      L.tileLayer(basemapUrl).addTo(map);
      // add food trucks layer
      var food_trucks = L.esri.Cluster.featureLayer({
        url: esriUrl,
      }).addTo(map);
      // Create popups for pin markers
      food_trucks.bindPopup(function (layer) {
        return L.Util.template('<a class="title" href={Link} target="_blank"><b>{Truck}</b></a><p class="times">{Time}: {Hours}<br>Day: {Day}<br><br>{Title}</p><p class="content">{Loc}<br><br>Managed by: {Management}</p>', layer.feature.properties);
      });

    }
  };
}(jQuery));
