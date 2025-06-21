"use client"

// Imports 
import Button from "../Button/Button"
import CartSheet from "../CartSheet/CartSheet"
import { useCart } from "../../Contexts/CartContext"
import FavoritesSheet from "../FavoritesSheet/FavoritesSheet"
import { products } from "../data/products"

// Librarys 
import { useContext, useState } from "react"
import { Heart, UserRound, Search, ShoppingBag } from 'lucide-react'

// Imports 
import { checkImage } from "../../Utils/utils"
import { AuthContext } from "../../Contexts/Contexts"

// Import styles 
import styles from "./Header.module.css"

// Component 
const Header = ({ imgProductDefault = '', imgDefault = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const { getTotalItems } = useCart()

  const { user } = useContext(AuthContext)
  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Vestidos", href: "/productos" },
    { name: "Blusas", href: "/productos" },
    { name: "Pantalones", href: "/productos" },
    { name: "Ofertas", href: "/productos" },
  ]

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
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className={styles.navLink}>
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

              <Button variant="ghost" size="icon">
                {checkImage(
                  user?.img,
                  `${user?.names} ${user?.lastNames}`,
                  imgProductDefault,
                  'imgPerfil'
                )}
                {/* Perfil */}
              </Button>

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
