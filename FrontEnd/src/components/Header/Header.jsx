"use client"

import { useState } from "react"
import { useCart } from "../../Contexts/CartContext"
import Button from "../Button/Button"
import CartSheet from "../CartSheet/CartSheet"
import FavoritesSheet from "../FavoritesSheet/FavoritesSheet"
import { products } from "../data/products"
import styles from "./Header.module.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const { getTotalItems } = useCart()

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
                🔍
              </Button>

              {/* FAVORITES BUTTON */}
              <Button variant="ghost" size="icon" onClick={() => setIsFavoritesOpen(true)}>
                ❤️
              </Button>

              <Button variant="ghost" size="icon">
                👤
              </Button>

              {/* Cart */}
              <div className={styles.cartButton}>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                  🛍️
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

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesSheet products={products} isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
      {/* <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigation={navigation} /> */}
    </>
  )
}

export default Header
