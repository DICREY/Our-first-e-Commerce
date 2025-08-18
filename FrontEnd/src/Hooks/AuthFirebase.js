// Librarys 
import 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"

// firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCy-JZIwev-ss3dbRkyKTg90IeYMCCuzQ4",
  authDomain: "e-commerce-the-four.firebaseapp.com",
  projectId: "e-commerce-the-four",
  storageBucket: "e-commerce-the-four.firebasestorage.app",
  messagingSenderId: "1021124126793",
  appId: "1:1021124126793:web:aafb4f8dd08636e827b798",
  measurementId: "G-01R0TW1E8Q"
}

// Inicializar project app
export const app = initializeApp(firebaseConfig)

// Get Project App
export const auth = getAuth(app)

// Get FireStore
export const db = getFirestore(app)

// Get Analytics
export const analytics = getAnalytics(app)