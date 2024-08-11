import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let fetchedData = [];  // Store fetched data

// Date ranges for button functionality
const dateRanges = {
  "thisWeek": ["2015-2016"],
  "lastWeek": ["2014-2015"],
  "twoWeeksAgo": ["2013-2014"],
  "thisMonth": ["2012-2013"],
  "twoMonthsAgo": ["2011-2012"]
};

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
            // Process and filter fetched data
            fetchedData = querySnapshot.docs.map(doc => {
              const data = doc.data();
              let filteredData = { Category: data.Category };
              for (const dateRange of Object.values(dateRanges)) {
                dateRange.forEach(date => {
                  if (data.hasOwnProperty(date)) {
                    filteredData[date] = data[date];
                  }
                });
              }
              return filteredData;
            });
            console.log('Filtered Data fetched:', fetchedData);
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

  const totalDateButtons = {
    "thisWeek": document.getElementById("totalThisWeek"),
    "lastWeek": document.getElementById("totalLastWeek"),
    "twoWeeksAgo": document.getElementById("totalTwoWeeksAgo"),
    "thisMonth": document.getElementById("totalThisMonth"),
    "twoMonthsAgo": document.getElementById("totalTwoMonthsAgo")
  };

  for (const [key, button] of Object.entries(totalDateButtons)) {
    if (button) {
      button.addEventListener("click", () => displayTotalCrimes(key));
    } else {
      console.error(`Button for ${key} not found`);
    }
  }
});

// Function to display the category with the most crimes for the selected date range
function displayMostCrimes(dateRangeKey) {
  const dateRange = dateRanges[dateRangeKey];
  if (!dateRange || !Array.isArray(fetchedData) || fetchedData.length === 0) return;

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

// Function to calculate total crimes for the selected date range
function calculateTotalCrimesForDateRange(dateRangeKey) {
  const dateRange = dateRanges[dateRangeKey];
  if (!dateRange || !Array.isArray(fetchedData) || fetchedData.length === 0) return 0;

  let totalCrimes = 0;

  for (const data of fetchedData) {
    dateRange.forEach((date) => {
      totalCrimes += (data[date] || 0);
    });
  }

  return totalCrimes;
}

// Function to display total crimes for the selected date range
function displayTotalCrimes(dateRangeKey) {
  const totalCrimes = calculateTotalCrimesForDateRange(dateRangeKey);
  document.getElementById("totalCrimesNumber").innerText = totalCrimes;
}

// Populate crime categories
const categoryDropdown = document.getElementById("categoryDropdown");

try {
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

// Function to calculate total crimes for a specific category
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

  return totalCrime;
}


function calculateTotalCrimesForDateRangeRegardlessOfCategory(dateRangeKey) {
  const dateRange = dateRanges[dateRangeKey];
  if (!dateRange || !Array.isArray(fetchedData) || fetchedData.length === 0) return 0;

  let totalCrimes = 0;

  for (const data of fetchedData) {
    dateRange.forEach((date) => {
      totalCrimes += (data[date] || 0);
    });
  }

  return totalCrimes;
}

// Function to display total crimes regardless of category for the selected date range
function displayTotalCrimesRegardlessOfCategory(dateRangeKey) {
  const totalCrimes = calculateTotalCrimesForDateRangeRegardlessOfCategory(dateRangeKey);
  document.getElementById("firstCardTotal").innerText = totalCrimes;
}