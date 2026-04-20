// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClxuyYpHl48vH0HjRyxeT613pPVtZm9nw",
  authDomain: "split-smart-ecbaa.firebaseapp.com",
  projectId: "split-smart-ecbaa",
  storageBucket: "split-smart-ecbaa.firebasestorage.app",
  messagingSenderId: "900067087112",
  appId: "1:900067087112:web:9fd4311e8d4b8a4202d2bd",
  measurementId: "G-DEZW8R0X30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, db, auth, googleProvider };