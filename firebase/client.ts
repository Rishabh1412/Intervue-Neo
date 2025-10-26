// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGmp29DpRQA9CPY3ayV4ecM5iEQ8iACOM",
  authDomain: "intervue-neo.firebaseapp.com",
  projectId: "intervue-neo",
  storageBucket: "intervue-neo.firebasestorage.app",
  messagingSenderId: "875009293041",
  appId: "1:875009293041:web:9c734710bbb306f9e2c750",
  measurementId: "G-BN3XHG64RH"
};
// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);