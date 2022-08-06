import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, DocumentData, getDoc, getDocs, getFirestore, limit, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import once from 'lodash/once'
import { IFireStoreUser, IPost } from "../types";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export async function getUserWithUsername(username: string) {
  const userQuery = query(collection(db, 'users'), where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(userQuery)

  if (querySnapshot.empty) {
    throw new Error(`No user found with username '${username}'`)
  }
  
  return querySnapshot;
}

export function serializePost(document: DocumentData): IPost {
  const data = document.data();
  return {
    ...data,
    createdAt: (data.createdAt as Timestamp).toMillis(),
    updatedAt: (data.updatedAt as Timestamp).toMillis(),
  }
}
