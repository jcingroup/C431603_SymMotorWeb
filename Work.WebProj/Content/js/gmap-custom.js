// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
var map, img_sales, img_self;
var markers = [];

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var latlng = new google.maps.LatLng(25.0161618, 121.299573);
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 10,

        // The latitude and longitude to center the map (always required)
        //center: new google.maps.LatLng(25.0161618, 121.299573) // center
        center: latlng // center
        //24.442775	118.4146849

    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);

    // Customized icon
    img_sales = {
        url: '../Content/images/iconMap-1.png',
        size: new google.maps.Size(32, 32), // This marker is 32 pixels wide by 32 pixels high.
        origin: new google.maps.Point(0, 0), // The origin for this image is (0, 0).
        anchor: new google.maps.Point(14, 34) // The anchor for this image is the base of the flagpole at (16, 16).
    };
    img_self = {
        url: '../Content/images/iconCheck.gif',
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
        var infowindow_first = new google.maps.InfoWindow({
            content: "loading..."
        });
        marker.addListener('click', function () {
            infowindow_first.setContent(this.info);
            infowindow_first.open(map, this);
        });
        markers.push(marker);
    }
     //Try HTML5 geolocation.
    if (navigator.geolocation) {
        var geolocation = window.navigator.geolocation;
        geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var marker_self = new google.maps.Marker({
                position: initialLocation,
                map: map,
                icon: img_self,
                title: 'you current position'
            });
            var infoWindow = new google.maps.InfoWindow({
                content: "loading..."
            });
            marker_self.addListener('click', function () {
                infoWindow.setContent(this.title);
                infoWindow.open(map, this);
            });
            map.setCenter(initialLocation);
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
        var infowindow_loop = new google.maps.InfoWindow({
            content: "loading..."
        });
        marker.addListener('click', function () {
            infowindow_loop.setContent(this.info);
            infowindow_loop.open(map, this);
        });
        markers.push(marker);
    }
}