


// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDEL_dCRKATV7s4BNU08NOsd4XCs42Unmg",
  authDomain: "neural-resq.firebaseapp.com",
  projectId: "neural-resq",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "1:XXXXXXX:web:XXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);