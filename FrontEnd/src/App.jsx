import { CartProvider } from "./Contexts/CartContext"
import Header from "./components/Header/Header"
import HomePage from "./components/Pages/HomePage/HomePage"
import ProductCatalog from "./components/ProductCatalog/ProductCatalog"
import ProductDetailPage from "./components/Pages/ProductDetail/ProductDetailPage";
import "./styles/globals.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductCatalog />} />
              <Route path="/producto/:id" element={<ProductDetailPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
