import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNx7IdtO5jKdhZDSlMbBIrooSiL6JLO54",
  authDomain: "schedule-barber-2e96a.firebaseapp.com",
  projectId: "schedule-barber-2e96a",
  storageBucket: "schedule-barber-2e96a.firebasestorage.app",
  messagingSenderId: "343316404257",
  appId: "1:343316404257:web:4899073c91acba028ceb60",
  measurementId: "G-5VH5CJD0S1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db} ;