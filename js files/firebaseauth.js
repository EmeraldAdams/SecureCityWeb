import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtz0k20sLykzseOObhJBHozbquQIjsZBc",
  authDomain: "city-38ea4.firebaseapp.com",
  projectId: "city-38ea4",
  storageBucket: "city-38ea4.appspot.com",
  messagingSenderId: "267431261000",
  appId: "1:267431261000:web:1f8a48659bbc25ade3b97d",
  measurementId: "G-MBFG6CEYW1"
};
function showMessage(message, divId){
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display="block";
  messageDiv.innerHTML=message;
  messageDiv.style.opacity=1;
  setTimeout(function(){
    messageDiv.style.opacity = 0;
  },5000);
}


const signup = document.getElementById('submitSignUp');
signup.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    
    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user = userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName: lastName
        };
        showMessage('Account Created Succrdfully', 'signUpMessage');
        const docRef= doc(db, "users", user.uid)
        setDoc(docRef, userData)
        .then(()=>{
          window.location.href = 'login.html';
        })
        .catch((error)=>{
          console.error("")
        });
    })
    .catch((error)=>{
      const errorCode = error.code;
      if(errorCode== 'auth/email-already-in-use'){
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      }
      else{
        showMessage('unable to create User', 'signUpMessage');
      }
    })
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential)=>{
    showMessage('login is successful', 'signInMessage');
    const user = userCredential.user;
    localStorage.setItem('loggedInUserId', user.uid);
    window.location.href = '/html files/homepage.html';
  })
  .catch((error)=>{
    const errorCode = error.code;
    if(errorCode === 'auth/invalid-credential'){
      showMessage('Incorrect Email or Password', 'signInMessage')
    }
    else{
      showMessage('Account does not Exist', 'signInMessage')
    }
  })
})

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let fetchedData = {};  // Store fetched data

// Date ranges for button functionality
const dateRanges = {
  "thisWeek": ["2015-2016"],
  "lastWeek": ["2014-2015"],
  "twoWeeksAgo": ["2013-2014"],
  "thisMonth": ["2012-2013"],
  "twoMonthsAgo": ["2011-2012"]
};

// Function to display the category with the most crimes for the selected date range
function displayMostCrimes(dateRangeKey) {
  const dateRange = dateRanges[dateRangeKey];
  if (!dateRange || !fetchedData) return;

  let maxCategory = "";
  let maxCrimes = 0;

  for (const data of fetchedData) {
    dateRange.forEach((date) => {
      if (data[date] > maxCrimes) {
        maxCrimes = data[date];
        maxCategory = data.Category;
      }
    });
  }

  document.getElementById("mostCrimeCategory").innerText = `Category: ${maxCategory}`;
  document.getElementById("numberOfCrimes").innerText = `Number of Crimes: ${maxCrimes}`;
}

// Event listener for the search button
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById("searchButton");
  const placeSearch = document.getElementById("placeSearch");

  if (searchButton && placeSearch) {
    searchButton.addEventListener('click', async () => {
      const placeName = placeSearch.value.trim();
      if (placeName) {
        try {
          const q = query(collection(db, "CrimeStatitics_read"), where("Station", "==", placeName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            fetchedData = querySnapshot.docs.map(doc => doc.data());
            console.log('Data fetched:', fetchedData);
          } else {
            console.log("No data found for this place");
          }
        } catch (error) {
          console.log("Error fetching data", error);
        }
      } else {
        console.log("Please enter place name");
      }
    });
  } else {
    console.error("Search button or place search input not found");
  }

  // Event listeners for date range buttons
  const dateButtons = {
    "thisWeek": document.getElementById("thisWeek"),
    "lastWeek": document.getElementById("lastWeek"),
    "twoWeeksAgo": document.getElementById("twoWeeksAgo"),
    "thisMonth": document.getElementById("thisMonth"),
    "twoMonthsAgo": document.getElementById("twoMonthsAgo")
  };

  for (const [key, button] of Object.entries(dateButtons)) {
    if (button) {
      button.addEventListener("click", () => displayMostCrimes(key));
    } else {
      console.error(`Button for ${key} not found`);
    }
  }
});

//Populate crime categories
const categoryDropdown = document.getElementById("categoryDropdown");

try{
  const q = query(collection(db, "CrimeStatitics_read"));
  const querySnapshot = await getDocs(q);

  // Create a Set to store unique crime categories
  const categoriesSet = new Set();

  // Iterate through documents to extract unique categories
  querySnapshot.forEach((doc) => {
      const data = doc.data();
      categoriesSet.add(data.Category);
  });

  // Convert Set to Array and create dropdown items
  // Convert Set to Array and create dropdown items
  const categoriesArray = Array.from(categoriesSet);
  categoriesArray.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;
    button.addEventListener('click', () => {
      const totalCrimes = calculateTotalCrimesForCategory(category);
      document.getElementById("Category").innerText = `Category: ${category}`;
      document.getElementById("TotalCrimes").innerText = `Number of Crimes: ${totalCrimes}`;
    });
    categoryDropdown.appendChild(button);
  });

} catch (error) {
  console.log("Error fetching categories:", error);
}

//categories
function calculateTotalCrimesForCategory(selectedCategory) {
  let totalCrimes = 0;

  for (const data of fetchedData) {
    if (data.Category === selectedCategory) {
      for (const dateRange of Object.values(dateRanges)) {
        dateRange.forEach((date) => {
          totalCrimes += (data[date] || 0);
        });
      }
    }
  }

  return totalCrimes;
}
