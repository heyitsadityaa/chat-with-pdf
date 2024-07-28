import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3eYiW9WeUz-Fu2XySt7Jc3qNBzZ6yAyg",
  authDomain: "chat-with-pdf-e9da4.firebaseapp.com",
  projectId: "chat-with-pdf-e9da4",
  storageBucket: "chat-with-pdf-e9da4.appspot.com",
  messagingSenderId: "739213948917",
  appId: "1:739213948917:web:47d63f7055f7e01ffa92bc",
  measurementId: "G-JYFQ7G61GC",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
