let map;
        let markers = [];

        function initMap() {
          console.log('initMap function is called');
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: -34.397, lng: 18.644 },
                zoom: 16,
                mapTypeId: "roadmap"
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        map.setCenter(userLocation);
                        new google.maps.Marker({
                            position: userLocation,
                            map: map,
                            title: "You are here",
                        });
                    },
                    () => {
                        handleLocationError(true, map.getCenter());
                    }
                );
            } else {
                handleLocationError(false, map.getCenter());
            }

        }


                map.fitBounds(bounds);
          
        

        function handleLocationError(browserHasGeolocation, pos) {
            const infoWindow = new google.maps.InfoWindow({
                position: pos,
            });

            infoWindow.setContent(
                browserHasGeolocation
                    ? "Error: The Geolocation service failed."
                    : "Error: Your browser doesn't support geolocation."
            );
            infoWindow.open(map);
        }

       

        
        function toggleDropdown(dropdownId) {
          document.getElementById(dropdownId).classList.toggle("show");
      }
      
      // Close the dropdown menu if the user clicks outside of it
      window.onclick = function(event) {
          if (!event.target.matches('.dropdown-btn')) {
              var dropdowns = document.getElementsByClassName("dropdown-content");
              for (var i = 0; i < dropdowns.length; i++) {
                  var openDropdown = dropdowns[i];
                  if (openDropdown.classList.contains('show')) {
                      openDropdown.classList.remove('show');
                  }
              }
          }
      }
      function openNav() {
        document.getElementById("mySideNav").style.width = "250px";
        document.getElementById("map").style.marginLeft = "250px";
        
    }
      
      /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
      function closeNav() {
        document.getElementById("mySideNav").style.width = "0";
        document.getElementById("map").style.marginLeft = "0";
        
      
      }
      window.initMap = initMap;

      var list_view = document.querySelector(".list-view");