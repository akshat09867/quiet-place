import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKwS51f0yE488cTESXjcC8csjLnhnLBjY",
  authDomain: "jnu-quiet-finder.firebaseapp.com",
  projectId: "jnu-quiet-finder",
  storageBucket: "jnu-quiet-finder.firebasestorage.app",
  messagingSenderId: "531193272000",
  appId: "1:531193272000:web:bc077e2c08cbd0b6ceff25",
  measurementId: "G-1X541CLE0E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);