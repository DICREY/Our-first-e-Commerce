// Librarys 
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Imports 
import { CartProvider } from "./Contexts/CartContext"
import Header from "./components/Header/Header"
import HomePage from "./components/Pages/HomePage/HomePage"
import ProductCatalog from "./components/ProductCatalog/ProductCatalog"
import ProductDetailPage from "./components/Pages/ProductDetail/ProductDetailPage";
import { LoginForm } from "./components/Forms/Login"
import { RegisterForm } from "./components/Forms/Register"
import { AuthProvider } from "./Contexts/Auth.context"

// Import styles 
import "./styles/globals.css"

// Main Module 
const App = () => {
  // Dynamic vars
  const [ product, setProduct ] = useState()

  // Vars 
  const URL = 'http://localhost:3000/ecommerce'
  const imgProduct = require('./Imgs/ProductDefault.png')

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header imgProductDefault={imgProduct} />
            <main>
              <Routes>
                <Route path="/" element={<HomePage URL={URL} imgProduct={imgProduct} setProduct={setProduct} />} />
                <Route path="/login" element={<LoginForm URL={URL} />} />
                <Route path="/signup" element={<RegisterForm URL={URL} />} />
                <Route path="/productos" element={<ProductCatalog  />} />
                <Route path="/producto" element={<ProductDetailPage img={imgProduct} product={product} />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
