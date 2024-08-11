// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js"
  import {getFirestore, setDoc, doc, getDocs,query, orderBy, startAfter, limit} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js"

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

  
  
//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db =getFirestore(app);
const auth = getAuth();

onAuthStateChanged(auth, (user)=>{
  console.log(user);
})

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
    console.log(userCredential.user);
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

