// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; 
import {getFirestore,setDoc,doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; 

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzlxgx_9cfOOLDI0ctiQXnj5PuRg1CQrU",
    authDomain: "houseofelle-d757f.firebaseapp.com",
    projectId: "houseofelle-d757f",
    storageBucket: "houseofelle-d757f.appspot.com",
    messagingSenderId: "450628490691",
    appId: "1:450628490691:web:9c7b9d792c023ebc4ad976"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


document.getElementById('signUp').addEventListener('click', function() {
    var firstname = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var password = document.getElementById('password').value;

    const auth = getAuth();
    const db = getFirestore();
    // Add your sign-up logic here
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const userData = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            address: address
        }
        // Display success message
        alert('Account Created Successfully');
        const docRef = doc(db, "Users", user.uid);
        return setDoc(docRef, userData);
    })
    .then(() => {
        window.location.href = 'SignupForm.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage); // Display error message if sign-up fails
    });
});
const logIn = document.getElementById('logIn');
logIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const auth = getAuth();
    signInWithEmailAndPassword(auth,email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        alert('Login Successful');
        localStorage.setItem('loginUserId', user.uid);
        window.location.href = 'index.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage); // Display error message if sign-up fails
    });
});

const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const totalPrice = document.getElementById('totalPrice').value;
    const checkoutTotal = document.getElementById('checkoutTotal').value;
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

    setDoc(doc(db, "sales", today), {
        totalPrice: totalPrice,
        checkoutTotal: checkoutTotal
    })
    .then(() => {
        alert('Data saved successfully');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage); // Display error message if write fails
    });
});