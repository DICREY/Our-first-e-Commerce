// Librarys 
import 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"

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

// Get Project Apps
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)
export const functions = getFunctions(app)

// Función para obtener datos de Analytics
export const getAnalyticsData = async (timeRange) => {
  try {
    // Opción 1: Usando Cloud Functions (recomendado para datos complejos)
    const getAnalyticsData = httpsCallable(functions, 'getAnalyticsData')
    const result = await getAnalyticsData({ timeRange })
    return result.data
    
    // Opción 2: Consultas directas (para datos simples)
    // return await fetchAnalyticsDirectly(timeRange)
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    throw error
  }
}

// Función para registrar eventos
export const logAnalyticsEvent = (eventName, eventParams) => {
  logEvent(analytics, eventName, eventParams)
}