// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
var map, img_repair;
var markers = [];

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 10,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(25.0161618, 121.299573) // center
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);



    // Data for the markers consisting of a name, a LatLng and a zIndex for the
    // order in which these markers should display on top of each other.
    var stores = [
    ['store 1', 25.000931, 121.313221, 'store 1<br>test', 1],
    ['store 2', 25.039490, 121.282920, 'store 2<br>test', 2],
    ['store 3', 25.050344, 121.288070, 'store 3<br>test', 3],
    ['store 4', 24.953543, 121.204643, 'store 4<br>test', 4],
    ['store 5', 24.950709, 121.296996, 'store 5<br>test', 5]
    ];

    // Customized icon
    img_sales = {
        url: '../Content/images/iconMap-1.png',
        size: new google.maps.Size(32, 32), // This marker is 32 pixels wide by 32 pixels high.
        origin: new google.maps.Point(0, 0), // The origin for this image is (0, 0).
        anchor: new google.maps.Point(14, 34) // The anchor for this image is the base of the flagpole at (16, 16).
    };

    // multi positions
    for (var i = 0; i < gb_map_data.length; i++) {
        var store = gb_map_data[i];
        var marker = new google.maps.Marker({
            position: { lat: store.north, lng: store.east },
            map: map,
            icon: img_sales,
            title: store.title,
            info: store.title + '<br>' + store.memo,
            zIndex: store.index
        });

        // open different info window
        var infowindow = new google.maps.InfoWindow({
            content: "loading..."
        });
        marker.addListener('click', function () {
            infowindow.setContent(this.info);
            infowindow.open(map, this);
        });
        markers.push(marker);
    }
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('±zªº¦ì¸m');
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
function setNewMapMarker(type) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    for (var i = 0; i < gb_map_data.length; i++) {

        var store = gb_map_data[i];

        var marker = new google.maps.Marker({
            position: { lat: store.north, lng: store.east },
            map: map,
            icon: img_sales,
            title: store.title,
            info: store.title + '<br>' + store.memo,
            zIndex: store.index
        });
        // open different info window
        var infowindow = new google.maps.InfoWindow({
            content: "loading..."
        });
        marker.addListener('click', function () {
            infowindow.setContent(this.info);
            infowindow.open(map, this);
        });
        markers.push(marker);
    }
}