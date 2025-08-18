// Librarys 
import 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"

// firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCStvcNp8HKgRPL1Ya_cgOb71I8G-fReHM",
  authDomain: "ecommercethefour.firebaseapp.com",
  databaseURL: "https://ecommercethefour-default-rtdb.firebaseio.com",
  projectId: "ecommercethefour",
  storageBucket: "ecommercethefour.firebasestorage.app",
  messagingSenderId: "480099049799",
  appId: "1:480099049799:web:2404084af7869a50762c62",
  measurementId: "G-M9E0NK1WK7"
}

// Inicializar project app
export const app = initializeApp(firebaseConfig)

// Get Project App
export const auth = getAuth(app)

// Get FireStore
export const db = getFirestore(app)

// Get Analytics
export const analytics = getAnalytics(app)