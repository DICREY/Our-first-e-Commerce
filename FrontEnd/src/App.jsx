// Librarys 
import { useContext, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"

// Imports 
import { CartProvider } from "./Contexts/CartContext"
import { AuthProvider } from "./Contexts/Auth.context"
import { AuthContext } from "./Contexts/Contexts"
import { ProductList } from "./Pages/Dashboard/Products/Products"
import { OrdersList } from "./Pages/Dashboard/Orders/Orders"
import { Customers } from "./Pages/Dashboard/Customers/Clients"
import { NavAdmin } from "./components/Headers/NavAdmin/NavAdmin"
import { ProductEdit } from "./components/Products/ProductEdit"
import { LoginForm } from "./Pages/MainForms/Login/Login"
import { RegisterForm } from "./Pages/MainForms/Register/Register"
import { ProductDetailAdmin } from "./Pages/Details/ProductDetail/ProductDetail"
import { ProductRegister } from "./Pages/Forms/ProductForm/ProductRegister"
import { OrderDetail } from "./Pages/Details/OrderDetail/OrdersDetails"
import { CustomerDetail } from "./Pages/Details/CustomerDetail/CustomersDetails"
import { CustomerRegister } from "./Pages/Forms/CustomerForm/CustomerRegister"
import { AdminProfile } from "./Pages/Details/Profile/AdminProfile"
import { OrderRegister } from "./Pages/Forms/OrderForm/OrderRegister"
import { Dashboard } from "./Pages/Dashboard/Dashboard/Dashboard"
import { OfferManager } from "./Pages/Dashboard/Offers/Offers"
import { PasswordReset } from "./Pages/MainForms/PasswordReset/PasswordReset"
import { HomePage } from "./Pages/HomePage/HomePage"
import Header from "./components/Headers/Header"
import ProductCatalog from "./components/Products/ProductCatalog"
import ProductDetailPage from "./Pages/ProductDetail/ProductDetailPage"
import { EmailChange } from "./Pages/MainForms/GmailReset/EmailChange"
import { ValidateData } from "./Pages/MainForms/ValidateUserData/ValidateUserData"

// Main Module 
const App = () => {
  // Dynamic vars
  const [product, setProduct] = useState()
  const [catPro, setCatPro] = useState()
  const [gmailUserData, setGmailUserData] = useState({})
  const [filterFetch, setFilterFetch] = useState(null)
  
  // Vars 
  const URL = process.env.REACT_APP_URL
  const imgProduct = require('./Imgs/ProductDefault.png')
  const imgUser = require('./Imgs/UserDefault.webp')
  let didFetch = false

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

  const HandleFirebase = () => {
    const params = new URLSearchParams(window.location.search)
    const apiKey = params.get('apiKey')
    const em = params.get('em')
    const oobCode = params.get('oobCode')
    const resetpassword = params.get('resetpassword')
    const emailChange = params.get('emailChange')

    return resetpassword?
      <Navigate to={`/forgot-password?apiKey=${apiKey}&em=${em}&oobCode=${oobCode}`} />
      : emailChange ?
      <Navigate to={`/email-change?apiKey=${apiKey}&em=${em}&oobCode=${oobCode}`} />
      :<Navigate to="/login" />
  }

  // const loop = (list = [], doc = '') => {
  //   if (didFetch) return
  //   list.forEach(item => {
  //     PostDataNoSQL(doc, item)
  //   })
  //   didFetch = true
  // }

  // useEffect(() => {
  //   GetDataNoSQL('roles')
  //   loop(categorias, 'categorias')
  // },[])

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
              {/* Auth Routes without Layout */}
              <Route path="/handle-firebase" element={<HandleFirebase />} />
              <Route path="/login" element={<LoginForm URL={URL} gmailUserData={setGmailUserData} />} />
              <Route path="/forgot-password" element={<PasswordReset URL={URL} />} />
              <Route path="/email-reset" element={<EmailChange URL={URL} />} />
              <Route path="/signup" element={<RegisterForm URL={URL} />} />
              <Route path="/validate-data" element={<ValidateData URL={URL} gmailUserData={gmailUserData} />} />
            </Route>


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