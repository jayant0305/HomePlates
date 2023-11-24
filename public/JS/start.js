
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
  

// $(document).ready(function(){
//     var autocomplete
//     var id="inputtext"
//     autocomplete=new google.maps.places.Autocomplete(document.getElementById(id),{
//         types:['geocode'],
//     })
// })

document.addEventListener("DOMContentLoaded", function () {
  let dynTextArray = [
    "Flavors of Home, Delivered to Your Door.",
    "Homemade Happiness in Every Meal.",
    "Cooked with Care, Served with Love.",
    "Bringing Families Together", "One Meal at a Time.",
    "From Our Home to Yours", "A Taste of Tradition.",
    "Home Cooked Perfection.",
    "Nourishing Souls", "One Home Cooked Dish at a Time."
  ];

  let currentIndex = 0;

  function displayNextTagline() {
    const item = dynTextArray[currentIndex];
    console.log(item);

    const element = document.getElementById("dyntext");
    if (element) {
      element.innerHTML = item;
      element.style.animation = "bottomToTop 1s ease-in-out";
      
      // Remove the animation after it completes
      element.addEventListener("animationend", function () {
        element.style.animation = "none";
      }, { once: true });
    }

    currentIndex = (currentIndex + 1) % dynTextArray.length;
  }

  // Initial call
  displayNextTagline();

  // Set interval to repeat the task every 3000 milliseconds (3 seconds)
  setInterval(displayNextTagline, 3000);
});
