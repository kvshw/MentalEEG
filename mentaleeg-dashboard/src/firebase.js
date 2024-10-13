// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtJPbbmCoyG_yKacJky0EBIEN1GMwq4OM",
  authDomain: "mentaleeg-dbec7.firebaseapp.com",
  projectId: "mentaleeg-dbec7",
  storageBucket: "mentaleeg-dbec7.appspot.com",
  messagingSenderId: "871381100815",
  appId: "1:871381100815:web:fd94de945d00aa254f367a",
  measurementId: "G-5N8KYX6S4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);