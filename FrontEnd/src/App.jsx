// Librarys 
import { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Imports 
import { CartProvider } from "./Contexts/CartContext"
import { AuthProvider } from "./Contexts/Auth.context"
import { AuthContext } from "./Contexts/Contexts"
import { Dashboard } from './components/Admin/Dashboard'
import { ProductList } from "./components/Admin/Products"
import { OrdersList } from "./components/Admin/Orders"
import { Customers } from "./components/Admin/Clients"
import { OfferManager } from "./components/Admin/Offers";
import { NavAdmin } from "./components/Headers/Navs/NavAdmin"
import { useDarkMode } from "./Hooks/Theme";
import { ProductEdit } from "./components/Products/ProductEdit";
import Header from "./components/Headers/Header"
import HomePage from "./components/Pages/HomePage/HomePage"
import ProductCatalog from "./components/Products/ProductCatalog"
import ProductDetailPage from "./components/Pages/ProductDetail/ProductDetailPage"
import { LoginForm } from "./components/Pages/MainForms/Login";
import { RegisterForm } from "./components/Pages/MainForms/Register";
import { ProductDetailAdmin } from "./components/Pages/Details/ProductDetail";
import { ProductRegister } from "./components/Pages/Forms/ProductRegister";
import { OrderDetail } from "./components/Pages/Details/OrdersDetails";
import { CustomerDetail } from "./components/Pages/Details/CustomersDetails";
import { CustomerRegister } from "./components/Pages/Forms/CustomerRegister";
import { AdminProfile } from "./components/Pages/Details/AdminProfile";
import { OrderRegister } from "./components/Pages/Forms/OrderRegister";

// Main Module 
const App = () => {
  // Dynamic vars
  const [product, setProduct] = useState()
  const [catPro, setCatPro] = useState()
  const [filterFetch, setFilterFetch] = useState(null)

  // Vars 
  const URL = 'http://localhost:3000/ecommerce'
  const imgProduct = require('./Imgs/ProductDefault.png')
  const imgUser = require('./Imgs/UserDefault.webp')

  // Layout Component
  const MainLayout = ({ children }) => {
    return (
      <div className="App">
        <Header URL={URL} imgDefault={imgUser} imgProductDefault={imgProduct} setCatPro={setCatPro} />
        <main>
          {children || <Outlet />}
        </main>
      </div>
    )
  }

  // Route Protectors
  const PrivateRoute = () => {
    const { user } = useContext(AuthContext)
    return user ? <Outlet /> : <Navigate to="/login" />
  }

  const AdminRoute = () => {
    const { admin } = useContext(AuthContext)
    return admin? (
      <main className='mainContainerAdmin'>
        <NavAdmin setFilterFetch={setFilterFetch} />
        <Outlet />
      </main>
    ):<Navigate to="/login" />
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes with Layout */}
            <Route element={<MainLayout />}>
              <Route 
                path="/" 
                element={<HomePage URL={URL} imgProduct={imgProduct} setProduct={setProduct} />} 
              />
              <Route 
                path="/profile"
                element={
                  <ProductCatalog
                    URL={URL}
                    imgDefault={imgProduct}
                    setProduct={setProduct}
                  />
                } 
              />
              <Route 
                path="/productos/all"
                element={
                  <ProductCatalog
                    URL={URL}
                    imgDefault={imgProduct}
                    setProduct={setProduct}
                  />
                } 
              />
              <Route 
                path="/productos/ropa-deportiva-mujer" 
                element={
                  <ProductCatalog 
                    URL={URL} 
                    imgDefault={imgProduct} 
                    setProduct={setProduct} 
                    preSelectedCat='Lencería'
                  />
                } 
              />
              <Route 
                path="/productos/lenceria" 
                element={
                  <ProductCatalog 
                    URL={URL} 
                    imgDefault={imgProduct} 
                    setProduct={setProduct} 
                    preSelectedCat='Lencería'
                  />
                } 
              />
              <Route 
                path="/productos/ropa-de-mujer" 
                element={
                  <ProductCatalog 
                    URL={URL} 
                    imgDefault={imgProduct} 
                    setProduct={setProduct} 
                    preSelectedCat='Ropa de Mujer'
                  />
                } 
              />
              <Route 
                path="/product/:productId" 
                element={
                  <ProductDetailPage 
                    URL={URL} 
                    img={imgProduct} 
                    product={product}
                    setPro={setProduct}
                  />
                } 
              />
            </Route>

            {/* Auth Routes without Layout */}
            <Route path="/login" element={<LoginForm URL={URL} />} />
            <Route path="/signup" element={<RegisterForm URL={URL} />} />

            {/* Private User Routes with Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route 
                  path="/user/profile"
                  element={<AdminProfile URL={URL} imgDefault={imgUser} />} 
                />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route 
                path="/admin/home" 
                element={<Dashboard URL={URL} imgDefault={imgUser} />} 
              />
              <Route 
                path="/admin/offers"
                element={<OfferManager URL={URL} imgDefault={imgUser} />} 
              />
              <Route 
                path="/admin/products" 
                element={<ProductList URL={URL} imgDefault={imgProduct} filterFetch={filterFetch} />} 
              />
              <Route 
                path="/admin/products/details" 
                element={<ProductDetailAdmin URL={URL} imgDefault={imgProduct} />} 
              />
              <Route 
                path="/admin/products/edit"
                element={<ProductEdit URL={URL} imgDefault={imgProduct} />}
              />
              <Route 
                path="/admin/products/register"
                element={<ProductRegister URL={URL} imgDefault={imgProduct} />} 
              />
              <Route 
                path="/admin/orders" 
                element={<OrdersList URL={URL} imgDefault={imgProduct} />} 
              />
              <Route 
                path="/admin/orders/details"
                element={<OrderDetail URL={URL} imgDefault={imgProduct} />} 
              />
              <Route 
                path="/admin/orders/register"
                element={<OrderRegister URL={URL}  />} 
              />
              <Route 
                path="/admin/customers" 
                element={<Customers URL={URL} imgDefault={imgUser} />}
              />
              <Route 
                path="/admin/customers/details" 
                element={<CustomerDetail URL={URL} imgDefault={imgUser} />}
              />
              <Route 
                path="/admin/customers/register"
                element={<CustomerRegister URL={URL} imgDefault={imgUser} />}
              />
              <Route 
                path="/admin/perfil"
                element={<AdminProfile URL={URL} imgDefault={imgUser} />} 
              />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App