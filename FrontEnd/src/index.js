// Librarys 
import React from "react"
import ReactDOM from "react-dom/client"

// Imports 
import { useDarkMode } from "./Hooks/Theme"
import App from "./App"

// Import styles 
import "./styles/globals.css"

// Implement theme 
const ThemeWrapper = () => {
  useDarkMode()

  return <App />
}

// Root element
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ThemeWrapper />
  </React.StrictMode>,
)
