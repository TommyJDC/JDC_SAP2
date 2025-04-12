import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Optional: if you need analytics

const firebaseConfig = {
  apiKey: "AIzaSyADAy8ySvJsUP5diMyR9eIUgtPFimpydcA",
  authDomain: "sap-jdc.firebaseapp.com",
  databaseURL: "https://sap-jdc-default-rtdb.europe-west1.firebasedatabase.app", // Note: This is RTDB URL, Firestore uses projectId
  projectId: "sap-jdc",
  storageBucket: "sap-jdc.appspot.com", // Corrected storage bucket format
  messagingSenderId: "1079234336489",
  appId: "1:1079234336489:web:2428621b62a393068ec278",
  measurementId: "G-PRWSK0TEFZ" // Optional: if you need analytics
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // Optional

export { app, auth, db };
