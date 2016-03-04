        // When the window has finished loading create our google map below
        google.maps.event.addDomListener(window, 'load', init);

        function init() {
            // Basic options for a simple Google Map
            // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
            var mapOptions = {
                // How zoomed in you want the map to start at (always required)
                zoom: 10,

                // The latitude and longitude to center the map (always required)
                center: new google.maps.LatLng(25.0161618,121.299573) // center
            };

            // Get the HTML DOM element that will contain your map
            // We are using a div with id="map" seen below in the <body>
            var mapElement = document.getElementById('map');

            // Create the Google Map using our element and options defined above
            var map = new google.maps.Map(mapElement, mapOptions);



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
            // var image = {
            //     url: 'car189.png',
            //     size: new google.maps.Size(32, 32), // This marker is 32 pixels wide by 32 pixels high.
            //     origin: new google.maps.Point(0, 0), // The origin for this image is (0, 0).
            //     anchor: new google.maps.Point(16, 16) // The anchor for this image is the base of the flagpole at (16, 16).
            // };

            // multi positions
            for (var i = 0; i < stores.length; i++) {
                var store = stores[i];
                var marker = new google.maps.Marker({
                    position: {lat: store[1], lng: store[2]},
                    map: map,
                    // icon: image,
                    title: store[0],
                    info: store[3],
                    zIndex: store[4]
                });

                // open different info window
                var infowindow = new google.maps.InfoWindow({
                    content: "loading..."
                });
                marker.addListener('click', function() {
                    infowindow.setContent(this.info);
                    infowindow.open(map, this);
                });
            }
        }