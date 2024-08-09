
let map;
let markers = [];
let heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 18.644 },
    zoom: 16,
    mapTypeId: "roadmap"
  });
  window.dispatchEvent(new Event('mapInitialized'));

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

  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  // Define the heatmap data points
  const heatmapData = [
    new google.maps.LatLng(-33.9258, 18.4232), // Cape Town
    new google.maps.LatLng(-34.4181, 19.2345), // Hermanus
    new google.maps.LatLng(-32.6645, 18.4890), // Langebaan
    // Add more points as needed
  ];

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    radius: 30, // Adjust radius to make heatmap points larger
    opacity: 0.6, // Adjust opacity as needed
  });
}

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

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("map").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("map").style.marginLeft = "0px";
}

window.initMap = initMap;

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