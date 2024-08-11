
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDtz0k20sLykzseOObhJBHozbquQIjsZBc",
    authDomain: "city-38ea4.firebaseapp.com",
    projectId: "city-38ea4",
    storageBucket: "city-38ea4.appspot.com",
    messagingSenderId: "267431261000",
    appId: "1:267431261000:web:1f8a48659bbc25ade3b97d",
    measurementId: "G-MBFG6CEYW1"
  };

// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("contactForm");

document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var location = getElementVal("location");
  var email = getElementVal("email");
  var crimeTitle = getElementVal("title");
  var crimeType = getElementVal("type");
  var crimeDes = getElementVal("description");
  var crimeImg = getElementVal("image");
  
  saveMessages(location, email, title, type, description, image);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("contactForm").reset();
}

const saveMessages = (location, email, title, type, description, image) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    location: location,
    email: email,
    crimeTitle: title,
    crimeType: type,
    crimeDes: description,
    crimeImg: image
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  