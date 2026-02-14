// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNoXc8do-ZU0zp6TJLh4v1_7n-fIPncDQ",
  authDomain: "dating-app-88227.firebaseapp.com",
  projectId: "dating-app-88227",
  storageBucket: "dating-app-88227.firebasestorage.app",
  messagingSenderId: "888894269085",
  appId: "1:888894269085:web:6c52550b413392b961d674",
  measurementId: "G-PFHTV5XPX3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);