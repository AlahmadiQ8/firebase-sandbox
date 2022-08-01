import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import once from 'lodash/once'

const firebaseConfig = {
  apiKey: "AIzaSyCcBRoRuIjAT7HLHNTsg0I5ZXQla1fwwAw",
  authDomain: "sandbox-f187e.firebaseapp.com",
  projectId: "sandbox-f187e",
  storageBucket: "sandbox-f187e.appspot.com",
  messagingSenderId: "272029041658",
  appId: "1:272029041658:web:c1b3e7066f3a6301931a43",
  measurementId: "G-HCYNCSK2ZG"
};

const app = once(initializeApp)(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
