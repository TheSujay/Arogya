// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWVkyiKPvKVdHb0_WCzK9k6mP1ZNjKQwg",
  authDomain: "arogya-4-all.firebaseapp.com",
  projectId: "arogya-4-all",
  storageBucket: "arogya-4-all.firebasestorage.app",
  messagingSenderId: "1057859474412",
  appId: "1:1057859474412:web:44b1645da6037ce013e6c9",
  measurementId: "G-167K8FBTVM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 👇 This makes account list show in popup
provider.setCustomParameters({
  prompt: "select_account",
});

export { auth, provider, signInWithPopup };
