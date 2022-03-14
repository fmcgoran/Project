function initMap(){
    //Map options
    var options = {
        zoom: 6,
        center:{lat:53.1424,lng:-7.6921}
    }
    //New map
    var map = new google.maps.Map(document.getElementById('map'), options);

    // Listen for click on map
    google.maps.event.addListener(map, 'click', function(event){
        //Add marker
        addMarker({coords:event.latLng});
    });




    /*
    //Add marker
    var marker = new google.maps.Marker({
        position:{lat:54.5973,lng:-5.9301},
        map:map,
        //custom marker
        icon:'file:///Users/fionamcgoran/Desktop/pet-store.svg' 
    });

    var infoWindow = new google.maps.InfoWindow({
        content:'<h1>Belfast</h1>'
    });

    marker.addListener('click', function(){
        infoWindow.open(map, marker);
    });
    */

    //Array of markers
    var markers = [
        {
            coords:{lat:54.5973,lng:-5.9301},
            iconImage: 'file:///Users/fionamcgoran/Desktop/pet-store.svg',
            content:'<h1>Belfast</h1>'
        },
        {
            coords:{lat:53.3498,lng:-6.2603},
            content:'<h1>Dublin</h1>'
        },
        {
            coords:{lat:51.8985,lng:-8.4756},
            content:'<h1>Cork</h1>'
        }
    ];

    //Loop through markers
    for(var i = 0;i < markers.length;i++){
        //Add marker
        addMarker(markers[i]);

    }


   
    //Add Marker Function
    function addMarker(properties){
        var marker = new google.maps.Marker({
        position:properties.coords,
        map:map,
        //custom marker
        //icon:properties.iconImage
    });

    //Check for custom icon
    if(properties.iconImage){
        //Set icon image
        marker.setIcon(properties.iconImage);

    }

    //Check for content
    if(properties.content){
        var infoWindow = new google.maps.InfoWindow({
        content:properties.content
        });

        marker.addListener('click', function(){
            infoWindow.open(map, marker);
    });
    }

    }
}