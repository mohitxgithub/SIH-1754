import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getAuth, 
  getReactNativePersistence 
} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDh0zUjkg6DGSOBAY7OZkreqdJEf0j0Jig",
  authDomain: "sih1754.firebaseapp.com",
  projectId: "sih1754",
  storageBucket: "sih1754.firebasestorage.app",
  messagingSenderId: "896660685745",
  appId: "1:896660685745:web:78678a05ad9009263af390",
  measurementId: "G-DSVR0QJJKH"
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Auth with persistent storage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Export other Firebase services
export const db = getFirestore(app);
export const analytics = getAnalytics(app);