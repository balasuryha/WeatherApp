// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA533lzLvywJOG1dnzzocWbYUEuSa-PvFs",
  authDomain: "weatherapp-40d69.firebaseapp.com",
  projectId: "weatherapp-40d69",
  storageBucket: "weatherapp-40d69.firebasestorage.app",
  messagingSenderId: "616794090463",
  appId: "1:616794090463:web:91526941d1a819c38cb26a",
  measurementId: "G-VBCBC8K5MQ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize messaging instance
const messaging = getMessaging(app);

// ✅ Export required functions/instances
export { messaging, getToken, onMessage };