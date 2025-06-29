// Librarys 
import { useContext, useEffect, useRef, useState } from "react"
import { Heart, Search, ShoppingBag } from 'lucide-react'

// Imports 
import { CheckImage, errorStatusHandler } from "../../Utils/utils"
import { AuthContext } from "../../Contexts/Contexts"
import { useCart } from "../../Contexts/CartContext"
import { products } from "../data/products"
import CartSheet from "../CartSheet/CartSheet"
import Button from "../Button/Button"
import FavoritesSheet from "../FavoritesSheet/FavoritesSheet"

// Import styles 
import styles from "./Header.module.css"
import { GetData } from "../../Utils/Requests"

// Component 
const Header = ({ URL = '', imgProductDefault = '', imgDefault = '', setCatPro = null }) => {
  // Dynamic Vars 
  const [ isMenuOpen, setIsMenuOpen] = useState(false)
  const [ isCartOpen, setIsCartOpen] = useState(false)
  const [ isFavoritesOpen, setIsFavoritesOpen ] = useState(false)
  const [ isProfileMenuOpen, setIsProfileMenuOpen ] = useState(false)
  const [ prductCat, setProductCat ] = useState(null)
  const profileMenuRef = useRef()
  const [ navigation, setNavigation] = useState()
  
  // Vars 
  const { getTotalItems } = useCart()
  const { user, logout } = useContext(AuthContext)

  const getProductCategories = async () => {
    try {
      const product = await GetData(`${URL}/products/categories`)
      if (product) {
        setProductCat(product)
        const catPro = [{ name: "Inicio", href: "/" }]
        product?.map(cat => (
          catPro.push({ name: cat.nom_cat_pro, href: `/productos/${cat.slug?.toLowerCase()}` })
        ))
        setNavigation(catPro)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      console.log(message)
    }
  }

  const handleLogout = () => {
    logout(URL)
  };

  useEffect(() => {
    getProductCategories()
  },[])

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.nav}>
            {/* Logo */}
            <a href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <span>F</span>
              </div>
              <span className={styles.logoText}>FashionHub</span>
            </a>

            {/* Desktop Navigation */}
            <nav className={styles.navigation}>
              {navigation?.map(item => (
                <a key={item.name} 
                  className={styles.navLink} 
                  onClick={() => setCatPro(item.name)}
                  href={item.href}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className={styles.actions}>
              <Button variant="ghost" size="icon" className="hidden">
                <Search />
                {/* Buscar */}
              </Button>

              {/* FAVORITES BUTTON */}
              <Button variant="ghost" size="icon" onClick={() => setIsFavoritesOpen(true)}>
                <Heart />
                {/* Favoritos */}
              </Button>

              <aside style={{ position: "relative" }} ref={profileMenuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <CheckImage
                    src={user?.img}
                    alt={`${user?.names || ""} ${user?.lastNames || ""}`}
                    imgDefault={imgProductDefault}
                    className='imgPerfil'
                  />
                  {/* Perfil */}
                </Button>
                {isProfileMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      marginTop: 8,
                      background: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: '.5rem',
                      boxShadow: "0 .2rem 1rem rgba(0,0,0,0.08)",
                      zIndex: 100,
                      minWidth: 160,
                      padding: '.5rem',
                    }}
                  >
                    {user == null ? (
                      <>
                        <a href="/login" className={styles.menuOption}>Iniciar sesión</a>
                        <a href="/signup" className={styles.menuOption}>Registrarse</a>
                      </>
                    ) : (
                      <>
                        <a href="/profile" className={styles.menuOption}>Perfil</a>
                        <button
                          onClick={handleLogout}
                          className={styles.menuOption}
                          style={{ border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
                        >
                          Cerrar sesión
                        </button>
                      </>
                    )}
                  </div>
                )}
              </aside>
              {/* <Button variant="ghost" size="icon">
              {console.log(user)}
                <CheckImage
                  src={user?.img}
                  alt={`${user?.names} ${user?.lastNames}`}
                  imgDefault={imgProductDefault}
                  className='imgPerfil'
                />
              </Button> */}

              {/* Cart */}
              <div className={styles.cartButton}>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                  <ShoppingBag />
                  {/* Carrito */}
                  {getTotalItems() > 0 && <span className={styles.cartBadge}>{getTotalItems()}</span>}
                </Button>
              </div>

              {/* Mobile Menu */}
              <div className={styles.mobileMenu}>
                <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(true)}>
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartSheet imgProductDefault={imgProductDefault} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesSheet products={products} isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
      {/* <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigation={navigation} /> */}
    </>
  )
}

export default Header
