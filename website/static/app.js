// set map options

var mylatlng = {lat: 53.1424, lng: -7.6921}; //ireland lat and lng
var mapOptions = {
    center: mylatlng,
    zoom: 7,
  //mapTypeId: google.maps.mapTypeId.ROADMAP
};


//create map

var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions)

//create a directions service object to use the route method and get a result for our requests

var directionsService = new google.maps.DirectionsService();

//create a directionsRenderer object which we will use to display the route

var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the directionsRenderer to the map

directionsDisplay.setMap(map);

// function 

function calcRoute() {
    //create a request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, // can change this to WALKING OR BICYLING OR TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL

    }

    //Pass the request to the route method
    directionsService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK){
            
            //get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'> From: " + document.getElementById("from").value + ".<br/>To: " + document.getElementById("to").value + ".<br /> Driving Distance <i class='fas fa-road'></i>:" + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " +result.routes[0].legs[0].duration.text + ". </div>";


            //display the route
            directionsDisplay.setDirections(result);

        } else{
            //delete the route from map
            directionsDisplay.setDirections({routes: []});

            ///center map in ireland
            map.setCenter(mylatlng);

            //error handling message 
            output.innerHTML = "<div class= 'alert-danger'><i class='fas fa-exclamation-circle'></i> Could not generate a route for this driving distance. </div>";
        }
    } );
}

// create autocomplete objects for all inputs

var options = {
    types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options)

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options)

 //Get location form
 var locationForm = document.getElementById('location-form');

 //Listen for submit
 locationForm.addEventListener('submit', geocode);



 function geocode(e){
     //Prevent actual submit
     e.preventDefault();

     var location = document.getElementById('location-input').value;
     axios.get('https://maps.googleapis.com/maps/api/geocode/json?',{
         params:{
             address:location,
             key:'AIzaSyDDRuqBMBxyV4Lh1gf-fTB063fhMlXi7NE'

         }
     })
     .then(function(response){
         //log full response
         console.log(response);

         //Formatted address
         var formattedAddress =(response.data.results[0].formatted_address);
         var formattedAddressOutput = `
             <ul class="list-group">
                 <li class="list-group-item">${formattedAddress}</li>
             </ul>   
         
         `;


         //Address Components
         var addressComponents = response.data.results[0].address_components;

         var addressComponentsOutput = '<ul class="list-group">';
         for(var i = 0;i < addressComponents.length;i++){
             addressComponentsOutput += `
             <li class="list-group-item"><strong>${addressComponents[i].types[0]
             }</strong>: ${addressComponents[i].long_name}</li>
             `;
         }
         addressComponentsOutput += '</ul>';

         //Formatted geometry
         var lat = response.data.results[0].geometry.location.lat;
         var lng = response.data.results[0].geometry.location.lng;
         var geometryOutput = `
             <ul class="list-group">
                 <li class="list-group-item"><strong>Latitude</strong>:
                     ${lat}</li>
                 <li class="list-group-item"><strong>Longitude</strong>:
                     ${lng}</li>
             </ul>   
         
         `;



         //Output to app 
         document.getElementById('formatted-address').innerHTML = formattedAddressOutput;
         document.getElementById('address-components').innerHTML = addressComponentsOutput;
         document.getElementById('geometry').innerHTML = geometryOutput;
         

     })
     .catch(function(error){
         console.log(error);

     });

 }