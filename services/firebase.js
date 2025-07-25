import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmA7hM8CCPWSOyaiVAhl7V7D2Clj0rtds",
  authDomain: "neural-resq-e475c.firebaseapp.com",
  projectId: "neural-resq-e475c",
  storageBucket: "neural-resq-e475c.firebasestorage.app",
  messagingSenderId: "749067865643",
  appId: "1:749067865643:web:08484b67c9868ac048646e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseConfig
};
