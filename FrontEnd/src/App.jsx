// Librarys 
import { useContext, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"

// Imports 
import { CartProvider } from "./Contexts/CartContext"
import { LoginForm } from "./components/Forms/Login"
import { RegisterForm } from "./components/Forms/Register"
import { AuthProvider } from "./Contexts/Auth.context"
import { AuthContext } from "./Contexts/Contexts"
import Header from "./components/Header/Header"
import HomePage from "./components/Pages/HomePage/HomePage"
import ProductCatalog from "./components/ProductCatalog/ProductCatalog"
import ProductDetailPage from "./components/Pages/ProductDetail/ProductDetailPage";
import { Dashboard } from './components/Admin/Dashboard'

// Main Module 
const App = () => {
  // Dynamic vars
  const [ product, setProduct ] = useState()
  const [ catPro, setCatPro ] = useState()

  // Vars 
  const URL = 'http://localhost:3000/ecommerce'
  const imgProduct = require('./Imgs/ProductDefault.png')
  const imgUser = require('./Imgs/UserDefault.webp')

  const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext)
    return (
      <>
        {user? children: <Navigate to='/login' />}
        <Outlet />
      </>
    )
  }
  
  const AdminRoute = ({ children }) => {
    const { admin } = useContext(AuthContext)
    return (
      <>
        {admin? children: <Navigate to='/login' />}
        <Outlet />
      </>
    )
  }

  const PublicRoute = ({ children }) => {
    return (
      <div className="App">
          <Header URL={URL} imgDefault={imgUser} imgProductDefault={imgProduct} setCatPro={setCatPro} />
          <main>
            {children}
          </main>
          <Outlet />
      </div>
    )
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <PublicRoute children={
                <HomePage URL={URL} imgProduct={imgProduct} setProduct={setProduct} />
            } />} />
            <Route path="/login" element={<LoginForm URL={URL} />} />
            <Route path="/signup" element={<RegisterForm URL={URL} />} />
            <Route path="/productos" element={
              <PublicRoute children={<ProductCatalog 
                URL={URL} 
                imgDefault={imgProduct} 
                setProduct={setProduct} 
              />} />} />
            <Route path="/productos/lenceria" element={
              <PublicRoute children={
                <ProductCatalog 
                  URL={URL} 
                  imgDefault={imgProduct} 
                  setProduct={setProduct} 
                  preSelectedCat='Lencería'
                />
              } />} />
            <Route path="/producto" element={
              <PublicRoute  children={
                <ProductDetailPage 
                  URL={URL} 
                  img={imgProduct} 
                  product={product} 
                />
              }/>} />

            {/* Admin routes  */}
            <Route path="/admin/home" element={
              <AdminRoute children={
                <Dashboard URL={URL} imgDefault={imgUser} />
              } />
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
