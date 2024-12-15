import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDh0zUjkg6DGSOBAY7OZkreqdJEf0j0Jig",
  authDomain: "sih1754.firebaseapp.com",
  projectId: "sih1754",
  storageBucket: "sih1754.firebasestorage.app",
  messagingSenderId: "896660685745",
  appId: "1:896660685745:web:db02277ee9a8adb03af390",
  measurementId: "G-GRJ6XBH00R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { db, auth };