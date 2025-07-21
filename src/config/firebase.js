// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEL_dCRKATV7s4BNU08NOsd4XCs42Unmg",
  authDomain: "neural-resq.firebaseapp.com",
  projectId: "neural-resq",
  storageBucket: "neural-resq.firebasestorage.app",
  messagingSenderId: "494522831637",
  appId: "1:494522831637:web:6be37af8ebb71e30ca8f1c",
  measurementId: "G-HTZX445XPZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


