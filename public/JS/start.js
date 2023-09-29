
function Currentlocation(){
    function success(pos) {
        const crd = pos.coords;
      
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);


      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
       navigator.geolocation.getCurrentPosition(success, error);
}
  

$(document).ready(function(){
    var autocomplete
    var id="inputtext"
    autocomplete=new google.maps.places.Autocomplete(document.getElementById(id),{
        types:['geocode'],
    })
})
