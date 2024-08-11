import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js"
import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyDtz0k20sLykzseOObhJBHozbquQIjsZBc",
    authDomain: "city-38ea4.firebaseapp.com",
    projectId: "city-38ea4",
    storageBucket: "city-38ea4.appspot.com",
    messagingSenderId: "267431261000",
    appId: "1:267431261000:web:1f8a48659bbc25ade3b97d",
    measurementId: "G-MBFG6CEYW1"
  };

  
  
//Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user)=>{
    if(user){
        console.log('user logged in: ', user)
    }
    else{
        console.log('user logged out')
    }
})

onAuthStateChanged(auth, (user)=>{
    console.log(user);
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
             if(docSnap.exists()){
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;
                
             }
             else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='/html files/profile.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })

  // Add event listeners for redirect buttons
document.querySelectorAll('.redirect-box').forEach((button, index) => {
    button.addEventListener('click', () => {
        switch (index) {
            case 0:
                window.location.href = '/html files/my-profile.html';
                break;
            case 1:
                window.location.href = '/html files/anonymous-tip.html';
                break;
            case 2:
                window.location.href = '/html files/my-routes.html';
                break;
            case 3:
                window.location.href = '/html files/share-app.html';
                break;
        }
    });
});

