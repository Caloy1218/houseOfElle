import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzlxgx_9cfOOLDI0ctiQXnj5PuRg1CQrU",
    authDomain: "houseofelle-d757f.firebaseapp.com",
    projectId: "houseofelle-d757f",
    storageBucket: "houseofelle-d757f.appspot.com",
    messagingSenderId: "450628490691",
    appId: "1:450628490691:web:9c7b9d792c023ebc4ad976"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

document.addEventListener('DOMContentLoaded', (event) => {
    const saveBtn = document.getElementById('saveBtn');

    saveBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
        const formattedTime = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); // Get time in h:mm AM/PM format

        const dateTime = `${formattedDate} ${formattedTime}`;

        // Get the text content of the totalPrice and checkoutTotal table cells
        const totalPrice = document.getElementById('totalPrice').textContent;
        const checkoutTotal = document.getElementById('checkoutTotal').textContent;

        setDoc(doc(db, "sales", dateTime), {
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
});

