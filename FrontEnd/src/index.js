// Librarys 
import React from "react"
import ReactDOM from "react-dom/client"

// Imports 
import App from "./App"

// Import styles 
import "./styles/globals.css"

// Root element
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
