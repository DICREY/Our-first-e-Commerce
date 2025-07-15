// Librarys 
import { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Imports 
import { CartProvider } from "./Contexts/CartContext";
import { LoginForm } from "./components/Forms/Login";
import { RegisterForm } from "./components/Forms/Register";
import { AuthProvider } from "./Contexts/Auth.context";
import { AuthContext } from "./Contexts/Contexts";
import Header from "./components/Header/Header";
import HomePage from "./components/Pages/HomePage/HomePage";
import ProductCatalog from "./components/ProductCatalog/ProductCatalog";
import ProductDetailPage from "./components/Pages/ProductDetail/ProductDetailPage";
import { Dashboard } from './components/Admin/Dashboard';

// Main Module 
const App = () => {
  // Dynamic vars
  const [product, setProduct] = useState();
  const [catPro, setCatPro] = useState();

  // Vars 
  const URL = 'http://localhost:3000/ecommerce';
  const imgProduct = require('./Imgs/ProductDefault.png');
  const imgUser = require('./Imgs/UserDefault.webp');

  // Layout Component
  const MainLayout = ({ children }) => {
    return (
      <div className="App">
        <Header URL={URL} imgDefault={imgUser} imgProductDefault={imgProduct} setCatPro={setCatPro} />
        <main>
          {children || <Outlet />}
        </main>
      </div>
    );
  };

  // Route Protectors
  const PrivateRoute = () => {
    const { user } = useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

  const AdminRoute = () => {
    const { admin } = useContext(AuthContext);
    return admin ? <Outlet /> : <Navigate to="/login" />;
  };

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
            </Route>

            {/* Auth Routes without Layout */}
            <Route path="/login" element={<LoginForm URL={URL} />} />
            <Route path="/signup" element={<RegisterForm URL={URL} />} />

            {/* Private User Routes with Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route 
                  path="/perfil" 
                  element={<div>Perfil de Usuario (en construcción)</div>} 
                />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route 
                path="/admin/home" 
                element={<Dashboard URL={URL} imgDefault={imgUser} />} 
              />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;