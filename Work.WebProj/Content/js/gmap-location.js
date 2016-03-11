// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
var map;
var markers = [];
var img_sales, img_repair, img_self;
function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var latlng = new google.maps.LatLng(25.0161618, 121.299573);
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 10,

        // The latitude and longitude to center the map (always required)
        center: latlng // center
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);

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

    // Customized icon
    img_sales = {
        url: 'Content/images/iconMap-1.png',
        size: new google.maps.Size(32, 32), // This marker is 32 pixels wide by 32 pixels high.
        origin: new google.maps.Point(0, 0), // The origin for this image is (0, 0).
        anchor: new google.maps.Point(14, 34) // The anchor for this image is the base of the flagpole at (16, 16).
    };
    img_repair = {
        url: 'Content/images/iconMap-2.png',
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
        var img;
        if (gb_type == 1) { img = img_sales; } else { img = img_repair; }

        var marker = new google.maps.Marker({
            position: { lat: store.north, lng: store.east },
            map: map,
            icon: img,
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

function setNewMapMarker(type) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    var img;
    if (type == 1) { img = img_sales; } else { img = img_repair; }
    for (var i = 0; i < gb_map_data.length; i++) {

        var store = gb_map_data[i];

        var marker = new google.maps.Marker({
            position: { lat: store.north, lng: store.east },
            map: map,
            icon: img,
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