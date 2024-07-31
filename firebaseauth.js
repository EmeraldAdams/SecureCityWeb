// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
