import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnIeHFjCv0rnBzbxpOYhwfgH5Da2HrEaE",
  authDomain: "thiwa-store.firebaseapp.com",
  projectId: "thiwa-store",
  storageBucket: "thiwa-store.firebasestorage.app",
  messagingSenderId: "318822431162",
  appId: "1:318822431162:web:0c809399f538f1a92dc583",
  measurementId: "G-SJT97PGCYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
