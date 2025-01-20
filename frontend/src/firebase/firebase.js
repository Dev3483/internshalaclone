// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfHp3_6i_He0VzJmAoq91DbVQoLh5by9M",
  authDomain: "internshaladev.firebaseapp.com",
  projectId: "internshaladev",
  storageBucket: "internshaladev.appspot.com", // ✅ Corrected storage bucket URL
  messagingSenderId: "658309989550",
  appId: "1:658309989550:web:5b1b6b6fc568163ff7193f",
  measurementId: "G-S6Q0BZWB6Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Track Login Function


export { auth, db, storage, provider };
